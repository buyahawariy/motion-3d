// api/admin.js - Vercel Serverless Function (Node 18+)
// Hanya bisa dipakai oleh akun admin (email = ADMIN_EMAIL). Kunci rahasia TIDAK pernah dikirim ke browser.
const SB_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const ANON = process.env.SUPABASE_ANON_KEY || "";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const ADMIN = (process.env.ADMIN_EMAIL || "").toLowerCase();
const TRIAL_DAYS = Number(process.env.TRIAL_DAYS || 2);
const QUOTA = Number(process.env.PROMO_QUOTA || 25);
const PRICE_NORMAL = Number(process.env.PRICE_NORMAL || 49000);
const PRICE_PROMO = Number(process.env.PRICE_PROMO || 25000);
const PRICE_PROMO_OLD = 20000; // promo gelombang pertama (promo: "early")
const AFF_PERCENT = Number(process.env.AFF_PERCENT || 40);
const DAY = 864e5;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const sh = (extra) => {
  const h = Object.assign({ apikey: SERVICE, "Content-Type": "application/json" }, extra || {});
  if (SERVICE.startsWith("eyJ")) h.Authorization = "Bearer " + SERVICE; // kunci lama (JWT); kunci sb_secret_ cukup lewat apikey
  return h;
};

async function who(req) {
  const a = req.headers.authorization || "";
  const t = a.startsWith("Bearer ") ? a.slice(7) : "";
  if (!t) return null;
  const r = await fetch(SB_URL + "/auth/v1/user", { headers: { apikey: ANON, Authorization: "Bearer " + t } });
  if (!r.ok) return null;
  const u = await r.json();
  if (!u || !u.email || !u.email_confirmed_at) return null;
  return u.email.toLowerCase() === ADMIN ? u : null;
}

function planOf(u) {
  const am = u.app_metadata || {};
  if (am.plan === "pro") {
    const until = am.pro_until ? new Date(am.pro_until).getTime() : null;
    if (until && until + DAY < Date.now()) return "expired";
    return "pro";
  }
  return "free";
}

async function listUsers() {
  let all = [];
  for (let p = 1; p <= 20; p++) {
    const r = await fetch(SB_URL + "/auth/v1/admin/users?page=" + p + "&per_page=1000", { headers: sh() });
    if (!r.ok) throw new Error("Gagal membaca pengguna (" + r.status + "). Cek SUPABASE_SERVICE_ROLE_KEY.");
    const j = await r.json();
    const rows = j.users || [];
    all = all.concat(rows);
    if (rows.length < 1000) break;
  }
  return all;
}

async function rest(path, opt) {
  const r = await fetch(SB_URL + "/rest/v1/" + path, Object.assign({ headers: sh() }, opt || {}));
  return r;
}

async function setPlan(id, meta) {
  const r = await fetch(SB_URL + "/auth/v1/admin/users/" + id, {
    method: "PUT", headers: sh(), body: JSON.stringify({ app_metadata: meta })
  });
  if (!r.ok) throw new Error("Gagal mengubah paket (" + r.status + ").");
}

async function markRequests(filter, status) {
  const r = await rest("pro_requests?" + filter, {
    method: "PATCH", headers: sh({ Prefer: "return=minimal" }),
    body: JSON.stringify({ status, handled_at: new Date().toISOString() })
  });
  if (!r.ok) throw new Error("Gagal memperbarui pengajuan (" + r.status + ").");
}


// ---------- AFFILIATE ----------
// Dipanggil setelah Pro disetujui. Jika pembeli mendaftar lewat link affiliate (user_metadata.ref),
// catat komisi AFF_PERCENT% dari harga yang dibayar. buyer_id unik, jadi tidak pernah dobel.
async function createCommission(uid, priceArg) {
  // Mengembalikan teks hasil: "" = bukan pembelian lewat affiliate, selain itu keterangan untuk admin.
  try {
    const r = await fetch(SB_URL + "/auth/v1/admin/users/" + uid, { headers: sh() });
    if (!r.ok) return "gagal membaca data pembeli (" + r.status + ")";
    const u = await r.json();
    const ref = String((u.user_metadata || {}).ref || "").toUpperCase();
    if (!ref) return "";
    if (!/^[A-Z0-9]{3,20}$/.test(ref)) return "kode referral tidak valid";
    const ar = await rest("affiliates?select=id,user_id,code&status=eq.approved&code=eq." + ref + "&limit=1");
    if (!ar.ok) return "gagal membaca tabel affiliates (" + ar.status + ")";
    const a = (await ar.json())[0];
    if (!a) return "kode " + ref + " belum disetujui / tidak ditemukan";
    const price = priceArg || PRICE_NORMAL, amount = Math.round(price * AFF_PERCENT / 100);
    const w = await rest("aff_commissions?on_conflict=buyer_id", {
      method: "POST", headers: sh({ Prefer: "resolution=ignore-duplicates,return=representation" }),
      body: JSON.stringify({ affiliate_id: a.id, code: ref, buyer_id: uid, buyer_email: u.email, price, amount })
    });
    if (!w.ok) return "gagal menyimpan komisi (" + w.status + "), cek izin tabel aff_commissions";
    const rows = await w.json();
    return rows.length ? "komisi Rp" + amount.toLocaleString("id-ID") + " dicatat untuk " + ref : "sudah tercatat";
  } catch (e) { return "error: " + (e.message || e); }
}

function makeCode(email) {
  let base = String(email || "").split("@")[0].replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 6);
  if (base.length < 3) base = "AYAT";
  return base + String(Math.floor(Math.random() * 90) + 10);
}

async function affOverview() {
  const [users, af, cm, ck] = await Promise.all([
    listUsers(),
    rest("affiliates?select=*&order=created_at.desc&limit=500"),
    rest("aff_commissions?select=*&order=created_at.desc&limit=2000"),
    rest("aff_clicks?select=code&limit=100000")
  ]);
  const affs = af.ok ? await af.json() : [];
  const coms = cm.ok ? await cm.json() : [];
  const clicks = ck.ok ? await ck.json() : [];
  const count = (arr, f) => arr.reduce((m, x) => { const k = f(x); if (k) m[k] = (m[k] || 0) + 1; return m; }, {});
  const clickBy = count(clicks, x => x.code);
  const signBy = count(users, u => String((u.user_metadata || {}).ref || "").toUpperCase());
  const emailOf = {};
  affs.forEach(a => { emailOf[a.id] = a.email; });
  const affiliates = affs.map(a => {
    const mine = coms.filter(c => c.affiliate_id === a.id);
    const sum = f => mine.filter(f).reduce((t, c) => t + c.amount, 0);
    return {
      id: a.id, email: a.email, wa: a.wa, payout: a.payout, code: a.code, status: a.status, created_at: a.created_at,
      clicks: a.code ? (clickBy[a.code] || 0) : 0, signups: a.code ? (signBy[a.code] || 0) : 0,
      purchases: mine.length, earned: sum(() => true), unpaid: sum(c => c.status === "unpaid"), paid: sum(c => c.status === "paid")
    };
  });
  const commissions = coms.map(c => Object.assign({}, c, { affiliate_email: emailOf[c.affiliate_id] || "-" }));
  return { affiliates, commissions };
}

module.exports = async (req, res) => {
  const out = (code, obj) => res.status(code).json(obj);
  try {
    if (req.method !== "POST") return out(405, { error: "Metode tidak diizinkan." });
    if (!SERVICE) return out(500, { error: "SUPABASE_SERVICE_ROLE_KEY belum diisi di Environment Variables Vercel." });
    const admin = await who(req);
    if (!admin) return out(403, { error: "Khusus admin." });
    const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const uid = b.user_id, rid = b.request_id;

    if (b.action === "whoami") return out(200, { ok: true });
    if (b.action === "create_member") {
      const email = String(b.email || "").trim().toLowerCase(), pw = String(b.password || "");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return out(400, { error: "Email tidak valid." });
      if (pw.length < 8) return out(400, { error: "Kata sandi minimal 8 karakter." });
      const ref = String(b.ref || "").trim().toUpperCase();
      if (ref && !/^[A-Z0-9]{3,20}$/.test(ref)) return out(400, { error: "Kode referral tidak valid." });
      if (b.promo) {
        const sold = (await listUsers()).filter(u => (u.app_metadata || {}).promo === "early2" && planOf(u) === "pro").length;
        if (sold >= QUOTA) return out(409, { error: "Slot promo sudah habis. Hilangkan centang promo." });
      }
      const r = await fetch(SB_URL + "/auth/v1/admin/users", { method: "POST", headers: sh(), body: JSON.stringify({
        email, password: pw, email_confirm: true,
        app_metadata: { plan: "pro", pro_until: null, promo: b.promo ? "early2" : null }, user_metadata: ref ? { ref } : {} }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) return out(r.status === 422 ? 409 : 500, { error: r.status === 422 ? "Email sudah terdaftar." : "Gagal membuat akun (" + r.status + ")." });
      const km = await createCommission(j.id, b.promo ? PRICE_PROMO : PRICE_NORMAL);
      return out(200, { ok: true, id: j.id, komisi: km });
    }
    if (b.action === "overview") {
      const users = await listUsers();
      const rr = await rest("pro_requests?select=id,user_id,email,status,created_at&order=created_at.desc&limit=300");
      const requests = rr.ok ? await rr.json() : [];
      let vs = {};
      try { const v = await rest("rpc/visit_stats", { method: "POST", body: "{}" }); if (v.ok) vs = await v.json(); } catch (e) {}
      const rows = users.map(u => ({
        id: u.id, email: u.email, created_at: u.created_at, last_sign_in_at: u.last_sign_in_at, plan: planOf(u),
        promo: (u.app_metadata || {}).promo === "early2" && planOf(u) === "pro"
      })).sort((a, c) => new Date(c.created_at) - new Date(a.created_at));
      const cnt = k => rows.filter(u => u.plan === k).length;
      const stats = {
        views: vs.views == null ? null : vs.views, unique: vs.unique == null ? null : vs.unique, today: vs.today == null ? null : vs.today,
        users: rows.length, new7: rows.filter(u => Date.now() - new Date(u.created_at) < 7 * DAY).length,
        pro: cnt("pro"), trial: cnt("trial"), expired: cnt("expired"),
        pending: requests.filter(r => r.status === "pending").length,
        promo: rows.filter(u => u.promo).length, quota: QUOTA
      };
      return out(200, { stats, users: rows, requests });
    }

    if (b.action === "approve" || b.action === "grant") {
      if (!UUID.test(uid || "")) return out(400, { error: "user_id tidak valid." });
      if (b.promo) {
        const sold = (await listUsers()).filter(u => (u.app_metadata || {}).promo === "early2" && planOf(u) === "pro").length;
        if (sold >= QUOTA) return out(409, { error: "Slot promo sudah habis. Hilangkan centang promo lalu coba lagi." });
      }
      await setPlan(uid, { plan: "pro", pro_until: null, promo: b.promo ? "early2" : null });
      await markRequests("user_id=eq." + uid + "&status=eq.pending", "approved");
      const km = await createCommission(uid, b.promo ? PRICE_PROMO : PRICE_NORMAL);
      return out(200, { ok: true, komisi: km });
    }
    if (b.action === "revoke") {
      if (!UUID.test(uid || "")) return out(400, { error: "user_id tidak valid." });
      await setPlan(uid, { plan: "free", pro_until: null, promo: null });
      return out(200, { ok: true });
    }
    if (b.action === "reject") {
      if (!UUID.test(rid || "")) return out(400, { error: "request_id tidak valid." });
      await markRequests("id=eq." + rid, "rejected");
      return out(200, { ok: true });
    }
    if (b.action === "aff_sync") {
      // Catat komisi untuk semua pembeli Pro yang daftar lewat affiliate tapi komisinya belum tercatat.
      const users = await listUsers(); let baru = 0; const lewat = [];
      for (const u of users) {
        if (planOf(u) !== "pro" || !(u.user_metadata || {}).ref) continue;
        const pm = (u.app_metadata || {}).promo;
        const m = await createCommission(u.id, pm === "early2" ? PRICE_PROMO : pm === "early" ? PRICE_PROMO_OLD : PRICE_NORMAL);
        if (m.startsWith("komisi")) baru++; else if (m && m !== "sudah tercatat") lewat.push(u.email + ": " + m);
      }
      return out(200, { ok: true, komisi: "komisi baru dicatat: " + baru + (lewat.length ? ". Dilewati: " + lewat.join("; ") : "") });
    }
    if (b.action === "aff_overview") return out(200, await affOverview());
    if (b.action === "aff_approve" || b.action === "aff_reject" || b.action === "aff_pay") {
      const aid = b.aff_id;
      if (!UUID.test(aid || "")) return out(400, { error: "affiliate id tidak valid." });
      if (b.action === "aff_pay") {
        const r = await rest("aff_commissions?affiliate_id=eq." + aid + "&status=eq.unpaid", {
          method: "PATCH", headers: sh({ Prefer: "return=minimal" }),
          body: JSON.stringify({ status: "paid", paid_at: new Date().toISOString() })
        });
        if (!r.ok) throw new Error("Gagal menandai komisi dibayar (" + r.status + ").");
        return out(200, { ok: true });
      }
      const gr = await rest("affiliates?select=id,email,code&id=eq." + aid + "&limit=1");
      const row = gr.ok ? (await gr.json())[0] : null;
      if (!row) return out(404, { error: "Affiliate tidak ditemukan." });
      if (b.action === "aff_reject") {
        await rest("affiliates?id=eq." + aid, { method: "PATCH", headers: sh({ Prefer: "return=minimal" }), body: JSON.stringify({ status: "rejected", handled_at: new Date().toISOString() }) });
        return out(200, { ok: true });
      }
      for (let i = 0; i < 8; i++) {
        const code = row.code || makeCode(row.email);
        const r = await rest("affiliates?id=eq." + aid, {
          method: "PATCH", headers: sh({ Prefer: "return=minimal" }),
          body: JSON.stringify({ status: "approved", code, handled_at: new Date().toISOString() })
        });
        if (r.ok) return out(200, { ok: true, code });
        if (r.status !== 409 || row.code) throw new Error("Gagal menyetujui affiliate (" + r.status + ").");
      }
      throw new Error("Gagal membuat kode unik, coba lagi.");
    }
    return out(400, { error: "Aksi tidak dikenal." });
  } catch (e) {
    return out(500, { error: e.message || "Kesalahan server." });
  }
};
