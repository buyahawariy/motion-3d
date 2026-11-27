// api/tts.js - Vercel Function. Key Gemini hanya ada di server (env GEMINI_API_KEY); hanya user login dengan Pro aktif.
const SB_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const ANON = process.env.SUPABASE_ANON_KEY || "";
const KEY = process.env.GEMINI_API_KEY || "";
const MODEL = process.env.TTS_MODEL || "gemini-2.5-flash-preview-tts";
const DAY = 864e5;
const VOICES = ["Zephyr", "Puck", "Charon", "Kore", "Fenrir", "Leda", "Orus", "Aoede", "Callirrhoe", "Autonoe", "Enceladus", "Iapetus", "Umbriel", "Algieba", "Despina", "Erinome", "Algenib", "Rasalgethi", "Laomedeia", "Achernar", "Alnilam", "Schedar", "Gacrux", "Pulcherrima", "Achird", "Zubenelgenubi", "Vindemiatrix", "Sadachbia", "Sadaltager", "Sulafat"];

function active(u) {
  const am = u.app_metadata || {};
  if (am.plan !== "pro") return false;
  const t = am.pro_until && new Date(am.pro_until).getTime();
  return !(t && t + DAY < Date.now());
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Metode tidak diizinkan." });
    if (!KEY || !SB_URL || !ANON) return res.status(500).json({ error: "Environment variable server belum lengkap." });
    const a = req.headers.authorization || "", t = a.startsWith("Bearer ") ? a.slice(7) : "";
    const ur = t && await fetch(SB_URL + "/auth/v1/user", { headers: { apikey: ANON, Authorization: "Bearer " + t } });
    if (!ur || !ur.ok) return res.status(401).json({ error: "Silakan masuk dulu." });
    const u = await ur.json();
    if (!u.email_confirmed_at) return res.status(403).json({ error: "Email belum diverifikasi." });
    if (!active(u)) return res.status(403).json({ error: "Fitur ini khusus pengguna Pro." });
    const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const text = String(b.text || "").trim().slice(0, 1500), style = String(b.style || "").trim().slice(0, 80);
    const voice = VOICES.includes(b.voice) ? b.voice : "Orus";
    if (!text) return res.status(400).json({ error: "Naskah kosong." });
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent", {
      method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: style ? "Bacakan dalam bahasa Indonesia dengan gaya " + style + ": " + text : text }] }],
        generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } }
      })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(502).json({ error: (j.error && j.error.message) || "Layanan suara sedang bermasalah." });
    const p = ((((j.candidates || [])[0] || {}).content || {}).parts || []).find(x => x.inlineData);
    if (!p) return res.status(502).json({ error: "Respons tidak berisi audio. Coba ubah teks." });
    return res.status(200).json({ audio: p.inlineData.data });
  } catch (e) { return res.status(500).json({ error: "Kesalahan server." }); }
};
