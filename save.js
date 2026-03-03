function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function pick() {
  for (const value of arguments) {
    if (typeof value === "string" && value.trim() !== "") return value;
  }
  return "";
}

function getFirebaseConfig() {
  const raw = process.env.FIREBASE_CONFIG;
  if (raw) return JSON.parse(raw);
  return {
    apiKey: pick(
      process.env.FIREBASE_API_KEY,
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      process.env.VITE_FIREBASE_API_KEY
    ),
    authDomain: pick(
      process.env.FIREBASE_AUTH_DOMAIN,
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      process.env.VITE_FIREBASE_AUTH_DOMAIN
    ),
    projectId: pick(
      process.env.FIREBASE_PROJECT_ID,
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      process.env.VITE_FIREBASE_PROJECT_ID
    ),
    storageBucket: pick(
      process.env.FIREBASE_STORAGE_BUCKET,
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      process.env.VITE_FIREBASE_STORAGE_BUCKET
    ),
    messagingSenderId: pick(
      process.env.FIREBASE_MESSAGING_SENDER_ID,
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      process.env.VITE_FIREBASE_MESSAGING_SENDER_ID
    ),
    appId: pick(
      process.env.FIREBASE_APP_ID,
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      process.env.VITE_FIREBASE_APP_ID
    ),
    measurementId: pick(
      process.env.FIREBASE_MEASUREMENT_ID,
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      process.env.VITE_FIREBASE_MEASUREMENT_ID
    )
  };
}

function encodeFirestoreValue(value) {
  if (value === undefined || value === null) return { nullValue: null };
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((item) => encodeFirestoreValue(item))
      }
    };
  }
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return { nullValue: null };
    if (Number.isInteger(value)) return { integerValue: String(value) };
    return { doubleValue: value };
  }
  if (typeof value === "object") {
    const fields = {};
    Object.entries(value).forEach(([key, entry]) => {
      fields[key] = encodeFirestoreValue(entry);
    });
    return { mapValue: { fields } };
  }
  return { nullValue: null };
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const cfg = getFirebaseConfig();
    const projectId = cfg?.projectId;
    if (!projectId) {
      res.status(500).json({ ok: false, error: "Missing FIREBASE projectId" });
      return;
    }

    const body = await readJson(req);
    const uid = String(body?.uid || "").trim();
    if (!uid) {
      res.status(400).json({ ok: false, error: "uid is required" });
      return;
    }

    const authHeader = req.headers.authorization || "";
    if (!authHeader) {
      res.status(401).json({ ok: false, error: "Missing Authorization header" });
      return;
    }

    const username = String(body?.username || "").trim();
    const normalized = username.toLowerCase();
    const gameState = body?.gameState && typeof body.gameState === "object" ? body.gameState : {};
    const balance = Number(body?.balance || 0);
    const nowIso = new Date().toISOString();

    const patchBody = {
      fields: {
        email: encodeFirestoreValue(String(body?.email || "")),
        username: encodeFirestoreValue(username),
        usernameLower: encodeFirestoreValue(normalized),
        displayName: encodeFirestoreValue(username),
        updatedAt: { timestampValue: nowIso },
        lastActiveAt: { timestampValue: nowIso },
        balance: encodeFirestoreValue(Number.isFinite(balance) ? balance : 0),
        gameState: encodeFirestoreValue(gameState)
      }
    };

    const params = new URLSearchParams();
    [
      "email",
      "username",
      "usernameLower",
      "displayName",
      "updatedAt",
      "lastActiveAt",
      "balance",
      "gameState"
    ].forEach((fieldPath) => params.append("updateMask.fieldPaths", fieldPath));

    const resp = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${encodeURIComponent(uid)}?${params.toString()}`,
      {
        method: "PATCH",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(patchBody)
      }
    );

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      res.status(resp.status).json({
        ok: false,
        error: data?.error?.message || `Firestore save failed (${resp.status})`,
        code: data?.error?.status || `firestore-save-${resp.status}`
      });
      return;
    }

    res.status(200).json({ ok: true, document: data });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err && err.message ? err.message : "Unexpected save error"
    });
  }
};
