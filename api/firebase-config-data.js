module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");

  const raw = process.env.FIREBASE_CONFIG;

  if (!raw) {
    res.status(200).json({
      ok: false,
      error: "Missing FIREBASE_CONFIG env var on Vercel.",
      config: null
    });
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    res.status(200).json({ ok: true, error: "", config: parsed });
  } catch (err) {
    res.status(200).json({
      ok: false,
      error: err && err.message ? err.message : "Invalid FIREBASE_CONFIG JSON.",
      config: null
    });
  }
};
