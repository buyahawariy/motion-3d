// api/promo.js - Vercel Serverless Function (publik, hanya mengembalikan jumlah slot promo)
const SB_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const QUOTA = Number(process.env.PROMO_QUOTA || 25);

module.exports = async (req, res) => {
  try {
    if (!SERVICE) return res.status(200).json({ quota: 0, sold: 0, left: 0 });
    const h = { apikey: SERVICE };
    if (SERVICE.startsWith("eyJ")) h.Authorization = "Bearer " + SERVICE;
    let sold = 0;
    for (let p = 1; p <= 20; p++) {
      const r = await fetch(SB_URL + "/auth/v1/admin/users?page=" + p + "&per_page=1000", { headers: h });
      if (!r.ok) throw new Error("gagal");
      const rows = (await r.json()).users || [];
      sold += rows.filter(u => (u.app_metadata || {}).plan === "pro" && (u.app_metadata || {}).promo === "early2").length;
      if (rows.length < 1000) break;
    }
    res.setHeader("Cache-Control", "s-maxage=20, stale-while-revalidate=60");
    return res.status(200).json({ quota: QUOTA, sold, left: Math.max(0, QUOTA - sold) });
  } catch (e) {
    return res.status(200).json({ quota: 0, sold: 0, left: 0 });
  }
};
