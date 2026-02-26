module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");

  const raw = process.env.FIREBASE_CONFIG;

  if (!raw) {
    res.status(200).send(
      "window.FIREBASE_CONFIG = null; window.FIREBASE_CONFIG_ERROR = 'Missing FIREBASE_CONFIG env var on Vercel.';"
    );
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    const safeJson = JSON.stringify(parsed);
    res.status(200).send(
      `window.FIREBASE_CONFIG = ${safeJson}; window.FIREBASE_CONFIG_ERROR = '';`
    );
  } catch (err) {
    const msg = err && err.message ? err.message : "Invalid FIREBASE_CONFIG JSON.";
    const safeMsg = JSON.stringify(msg);
    res.status(200).send(
      `window.FIREBASE_CONFIG = null; window.FIREBASE_CONFIG_ERROR = ${safeMsg};`
    );
  }
};
