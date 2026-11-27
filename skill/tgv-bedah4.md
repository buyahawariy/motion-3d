---
name: "tgv-bedah4"
description: "TGV-BEDAH4. Video edukasi 9:16 gaya BLUEPRINT TEARDOWN: latar biru-navy bergrid, garis neon isometrik yang tergambar sendiri, benda MELEDAK jadi bagian-bagian berlabel (exploded view), lalu dirakit lagi. Fokus pada ALASAN DESAIN ('kenapa dibuat begini'), bukan sekadar fun fact. Musik lo-fi minor + SFX tick/servo/snap sintetis. Alur 3 tahap: 5 pertanyaan desain, naskah VO 1 paragraf, render MP4 dari rekaman suara."
---

# TGV-BEDAH4 (Blueprint Teardown)

Video pendek **1080x1920, 30 fps, `.mp4`**. Ini varian lain dari `tgv-bedah3d`, dengan konsep, gaya visual, struktur shot, dan suara yang sengaja dibuat berbeda.

## Beda dengan tgv-bedah3d

| Aspek | bedah3d | **bedah4** |
|---|---|---|
| Konsep | Fun fact cara kerja benda sehari-hari | **Alasan desain**: kenapa benda dibuat dengan bentuk/bagian begitu |
| Latar | Siang cerah, set dunia nyata | **Navy blueprint + grid**, tanpa set dunia nyata |
| Gambar | Flat 3D semu berwarna, outline gelap | **Garis neon isometrik** (cyan + 1 aksen oranye), tergambar progresif |
| Teknik bedah | Zoom-in + jendela X-Ray | **Exploded view**: benda meledak jadi bagian, tiap bagian dilabeli, lalu dirakit lagi |
| Shot | 7 shot | **6 babak** (bagian 3) |
| Teks UI | Kartu terang, DejaVuSans | **HUD gelap, font mono**, strip spesifikasi, subtitle mengetik |
| Info angka | Info card kiri atas | **Garis dimensi + strip spesifikasi bawah** |
| Penutup | Kartu ringkasan 4 poin + CTA | **Spec sheet** + pertanyaan pilihan A/B untuk komentar |
| Suara | Musik mayor ceria ~96 bpm | **Lo-fi minor ~84 bpm**, SFX tick, servo, snap |

## Kapan dipakai

- Pengguna minta ide konten "kenapa benda ini didesain begini".
- Pengguna memilih nomor ide dan minta naskah VO.
- Pengguna mengunggah rekaman (`.mp3`, `.wav`, `.m4a`) untuk dirender.
- Jika naskah + rekaman sudah ada, langsung ke Tahap 3.

## Alur 3 tahap

Berhenti dan tunggu pengguna di akhir Tahap 1 dan 2.

### Tahap 1: 5 pertanyaan desain
1. Tulis 5 ide berbentuk **"Kenapa [benda] dibuat [begitu]?"** atau **"Apa jadinya kalau [bagian] dihilangkan?"**. Contoh: "Kenapa tutup botol punya 'gerigi' di pinggirnya?", "Kenapa ujung kabel charger dibuat melengkung?".
2. Tiap ide diakhiri satu baris rencana: **bagian apa yang akan meledak** dan **satu keputusan desain yang akan terungkap**.
3. Berhenti. Tunggu pengguna memilih satu nomor.

### Tahap 2: Naskah VO
1. Bahasa Indonesia santai, bercerita, mudah dipahami awam.
2. **Satu paragraf utuh**, tanpa poin, nomor, timestamp, atau instruksi visual.
3. Kerangka isi: **(a)** pertanyaan pembuka, **(b)** "ternyata ada 3 bagian rahasia" (sebut 2-3 bagian), **(c)** alasan tiap bagian ada, **(d)** satu kalimat "kalau bagian itu hilang, yang terjadi adalah...", **(e)** pertanyaan A/B untuk komentar.
4. Panjang sekitar **30-50 detik** baca.
5. Berhenti. Minta pengguna merekam dan mengunggah audio.

### Tahap 3: Render
Alat: `opencv-python`, `Pillow`, `numpy`, `scipy`, `ffmpeg`.
1. Pastikan rekaman memang untuk naskah ini.
2. Isi **lembar rencana babak** (bagian 3).
3. Bangun audio (bagian 5), render frame, buat **grid pratinjau**, lolos checklist (bagian 4).
4. Render penuh (bagian 7), kirim dengan `present_files`.

---

## 1. Aturan visual

- **Latar:** navy `RGB(12,24,38)` dengan grid halus tiap 60 px dan garis mayor tiap 300 px `RGB(30,52,78)`. Grid bergeser sangat pelan mengikuti gerak kamera (parallax).
- **Palet terbatas:** garis utama cyan `RGB(90,220,255)`, teks putih `RGB(235,245,255)`, **satu** aksen oranye `RGB(255,140,40)` untuk bagian yang sedang dibahas. Tidak ada warna lain.
- **Proyeksi:** isometrik 30 derajat. Benda digambar dari kotak, silinder (elips), dan garis, bukan render realistis.
- **Tergambar sendiri:** setiap garis muncul progresif (*draw-on*), bukan langsung tampil. Benda baru dianggap "selesai" saat semua garis tergambar.
- **Fill:** hanya tint transparan sangat tipis (alpha ~12%) agar bagian terasa solid. Tidak ada gradien, kilau, atau bayangan.
- **Tanpa logo atau badge saluran.**
- Ini ilustrasi bergaya, bukan 3D sungguhan. Jangan menjanjikan "3D asli".

## 2. Aturan gerak: "Meledak, Tunjuk, Alirkan, Rakit"

Setiap babak harus punya aksi sebab-akibat (bukan hanya kamera bergeser).

1. **Draw-on:** garis menggambar benda dalam 1-1,5 detik, diiringi SFX tick pelan.
2. **Explode:** tiap bagian bergeser sepanjang sumbu perakitannya (ease-out + overshoot kecil), diiringi SFX snap/servo. Garis putus-putus tipis menunjukkan jalur perakitan.
3. **Spotlight:** bagian yang disebut narasi jadi **oranye**, bagian lain meredup ke alpha 35%. Label bernomor muncul (lingkaran nomor, garis penunjuk tumbuh, baru teks).
4. **Flow:** titik cahaya bergerak sepanjang jalur (gaya, udara, arus, cairan, tekanan) sesuai urutan kerja.
5. **Reassemble:** bagian kembali ke tempat dengan snap, lalu momen hasil terlihat.
6. **Dimensi:** garis dimensi dengan angka asli muncul di bagian yang disebut (diameter, tebal, sudut, jumlah gigi). Jangan mengarang angka. Jika ragu, pakai label kualitatif.

## 3. Struktur 6 babak

| # | Babak | Isi |
|---|---|---|
| 1 | **Hook** | Draw-on benda utuh di tengah, judul pertanyaan di HUD, pembuka penasaran |
| 2 | **Explode** | Benda meledak jadi 3-4 bagian. Semua bagian bernomor 01-04 |
| 3 | **Part A** | Spotlight bagian pertama + dimensi + alasan desainnya (flow bila relevan) |
| 4 | **Part B** | Spotlight bagian kedua (dan C bila ada), pola sama dengan Part A |
| 5 | **What-if** | Bagian itu dihapus/rusak, tunjukkan akibatnya (bocor, selip, panas, macet) dengan warna merah `RGB(255,80,80)` hanya di babak ini |
| 6 | **Reassemble + Spec Sheet** | Rakit ulang, hasil terlihat, spec sheet ringkas, pertanyaan A/B |

**Lembar rencana babak** (isi sebelum coding):

`babak | kalimat | bagian yang di-spotlight | aksi (explode/flow/snap) | angka dimensi | SFX`

Babak yang kolom *aksi*-nya hanya "kamera geser" harus diperbaiki.

## 4. Checklist pratinjau

Grid 6-8 frame, periksa dengan `view`. Semua harus "ya":
1. Hanya navy + cyan + putih + satu aksen oranye (merah hanya di babak 5)?
2. Garis tampak tergambar, bukan tempelan penuh?
3. Setiap bagian punya nomor dan label, tidak ada label bertumpuk?
4. Bagian yang dibahas oranye, yang lain redup?
5. Ada garis dimensi berangka di babak 3 dan 4?
6. Babak 5 menunjukkan akibat yang jelas?
7. Teks tidak terpotong, dan benda tetap di zona aman `y = 330 .. 1350`?

## 5. Audio (`build_audio.py`)

Mix: **VO 100%, SFX ~25%, musik ~15%** dengan ducking 60%, lalu loudnorm -16 LUFS. Jangan menaikkan musik kecuali diminta.

```python
import subprocess
import numpy as np
import scipy.io.wavfile as wav
import scipy.signal as signal

subprocess.run(["ffmpeg", "-y", "-i", mp3_path, "-ac", "1", "-ar", "44100", "vo.wav"], check=True)
sr, vo_raw = wav.read("vo.wav")
vo = vo_raw.astype(np.float32) / 32768.0
n_samples = len(vo)
dur = n_samples / sr
sfx = np.zeros_like(vo)

def add_seg(start_s, arr):
    s0 = int(start_s * sr)
    e0 = min(n_samples, s0 + len(arr))
    if e0 > s0:
        sfx[s0:e0] += arr[:e0 - s0]

def make_tick(f0=2400, vol=0.10):            # draw-on / angka berjalan
    n = int(0.03 * sr); tl = np.arange(n) / sr
    return np.sin(2 * np.pi * f0 * tl) * np.exp(-tl * 160) * vol

def make_snap(vol=0.16):                      # bagian terpasang / terlepas
    n = int(0.12 * sr); tl = np.arange(n) / sr
    noise = np.random.randn(n) * np.exp(-tl * 50)
    b, a = signal.butter(2, 1800 / (sr / 2), btype="high")
    thump = np.sin(2 * np.pi * 140 * tl) * np.exp(-tl * 40)
    return (0.5 * signal.lfilter(b, a, noise) + 0.7 * thump) * vol

def make_servo(dur_s=0.5, f0=220, f1=520, vol=0.09):   # explode / geser mekanis
    n = int(dur_s * sr); tl = np.arange(n) / sr
    ph = 2 * np.pi * np.cumsum(np.linspace(f0, f1, n)) / sr
    saw = signal.sawtooth(ph) * 0.5
    env = np.sin(np.pi * tl / dur_s) ** 0.7
    return saw * env * vol

def make_alarm(vol=0.10):                     # babak what-if
    n = int(0.35 * sr); tl = np.arange(n) / sr
    return np.sign(np.sin(2 * np.pi * 330 * tl)) * np.exp(-tl * 6) * vol

# Musik lo-fi: A minor (Am - F - C - G), ~84 bpm, pad + bass + chord stab + hat tipis
def make_music(dur_s, bpm=84, seed=11):
    rng = np.random.default_rng(seed)
    n = int(dur_s * sr); out = np.zeros(n, np.float32)
    beat = 60 / bpm; bar = beat * 4
    prog = [(220.00, [0, 3, 7]), (174.61, [0, 4, 7]), (261.63, [0, 4, 7]), (196.00, [0, 4, 7])]
    st = lambda f, s: f * 2 ** (s / 12)
    def note(start, length, f, vol, kind):
        s0 = int(start * sr); s1 = min(n, s0 + int(length * sr))
        if s1 <= s0: return
        tl = np.arange(s1 - s0) / sr
        if kind == "pad":
            w = sum(np.sin(2 * np.pi * f * d * tl) for d in (0.996, 1.0, 1.004)) / 3
            w *= np.minimum(1, tl / 0.8) * np.minimum(1, (length - tl) / 0.8)
        elif kind == "stab":
            w = (np.sin(2 * np.pi * f * tl) + 0.4 * np.sin(2 * np.pi * f * 2 * tl)) * np.exp(-tl * 9)
        else:
            w = np.sin(2 * np.pi * f * tl) * np.exp(-tl * 3.0)
        out[s0:s1] += (w * vol).astype(np.float32)
    k, tb = 0, 0.0
    while tb < dur_s:
        root, tri = prog[k % 4]
        for s in tri: note(tb, bar, st(root, s), 0.05, "pad")
        note(tb, beat * 1.5, root / 2, 0.15, "bass")
        note(tb + beat * 2.5, beat * 1.5, root / 2, 0.12, "bass")
        for off in (1.0, 3.0):
            for s in tri: note(tb + off * beat, beat * 0.5, st(root, s), 0.035, "stab")
        for i in range(8):
            s0 = int((tb + i * beat / 2) * sr); L = int(0.04 * sr)
            if s0 + L < n:
                out[s0:s0 + L] += (rng.standard_normal(L) * np.exp(-np.arange(L) / sr * 90) * 0.015).astype(np.float32)
        tb += bar; k += 1
    fi, fo = int(0.8 * sr), int(2.0 * sr)
    out[:fi] *= np.linspace(0, 1, fi); out[-fo:] *= np.linspace(1, 0, fo)
    return out / (np.abs(out).max() + 1e-9)

music = make_music(dur)[:n_samples]
env = np.convolve(np.abs(vo), np.ones(2205) / 2205, "same")
env = np.clip(env / (np.percentile(env[env > 0], 90) + 1e-9), 0, 1)
env = np.convolve(env, np.ones(8820) / 8820, "same")
music *= (1 - 0.60 * env)

# Taruh SFX sesuai lembar rencana, contoh:
# add_seg(t_draw, make_tick()); add_seg(t_explode, make_servo()); add_seg(t_part, make_snap())

mixed = vo + sfx * 1.6 + music * 0.15   # SFX dibuat vol 0.09-0.16, x1.6 ≈ 15-25% level VO
peak = np.max(np.abs(mixed))
if peak > 0.96: mixed *= 0.96 / peak
wav.write("mixed_raw.wav", sr, (mixed * 32767).astype(np.int16))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "mixed_raw.wav",
                "-af", "loudnorm=I=-16:TP=-1.5:LRA=9", "-ar", "44100", "mixed.wav"], check=True)

fps = 30
n_frames = int(np.ceil(dur * fps)); flen = int(sr / fps)
rms_30 = np.array([np.sqrt(np.mean(vo[i*flen:min(n_samples, (i+1)*flen)] ** 2)) for i in range(n_frames)], dtype=np.float32)
np.save("rms.npy", rms_30)
```

## 6. Template UI & gambar (`render_video.py`)

Salin dan pakai apa adanya agar tampilan konsisten antar episode.

| Elemen | Posisi |
|---|---|
| HUD header (tag + judul + penanda babak) | atas, `y = 70 .. 250` |
| Area gambar benda | `y = 330 .. 1350`, pusat `(540, 840)` |
| Strip spesifikasi | `cy = 1450` |
| Subtitle mengetik | `cy = 1600` |
| Penanda progres 6 babak | `y = 1860` |

```python
import math, cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
MONO_B = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
MONO_R = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

# Palet (BGR untuk cv2)
NAVY   = (38, 24, 12)
GRID   = (78, 52, 30)
CYAN   = (255, 220, 90)
WHITE  = (255, 245, 235)
ORANGE = (40, 140, 255)
RED    = (80, 80, 255)

def clamp(v, lo, hi): return max(lo, min(hi, v))
def ease_out(t): t = clamp(t, 0, 1); return 1 - (1 - t) ** 3
def ease_back(t):
    t = clamp(t, 0, 1); c = 1.2
    return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2
def smoothstep(a, b, t):
    if t <= a: return 0.0
    if t >= b: return 1.0
    x = (t - a) / (b - a); return x * x * (3 - 2 * x)

_FONTS = {}
def font(path, size):
    k = (path, int(size))
    if k not in _FONTS: _FONTS[k] = ImageFont.truetype(path, int(size))
    return _FONTS[k]

def blend_bgra(canvas, sprite, cx, cy, alpha_mul=1.0):
    if alpha_mul <= 0.01: return
    sh, sw = sprite.shape[:2]
    x0, y0 = int(cx - sw // 2), int(cy - sh // 2)
    cx0, cy0, cx1, cy1 = max(0, x0), max(0, y0), min(W, x0 + sw), min(H, y0 + sh)
    if cx1 <= cx0 or cy1 <= cy0: return
    sub = sprite[cy0 - y0:cy1 - y0, cx0 - x0:cx1 - x0]
    a = (sub[:, :, 3:4].astype(np.float32) / 255.0) * alpha_mul
    roi = canvas[cy0:cy1, cx0:cx1]
    roi[:] = (sub[:, :, :3] * a + roi.astype(np.float32) * (1 - a)).astype(np.uint8)

_TXT = {}
def text_sprite(text, size, color_bgr, bold=True):
    key = (text, size, color_bgr, bold)
    if key not in _TXT:
        f = font(MONO_B if bold else MONO_R, size)
        tmp = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
        w = int(tmp.textlength(text, font=f)) + 8
        img = Image.new("RGBA", (w, size + 14), (0, 0, 0, 0))
        ImageDraw.Draw(img).text((4, 2), text, font=f, fill=(color_bgr[2], color_bgr[1], color_bgr[0], 255))
        _TXT[key] = cv2.cvtColor(np.array(img), cv2.COLOR_RGBA2BGRA)
    return _TXT[key]

# --- Latar blueprint dengan parallax ---
def draw_blueprint_bg(canvas, cam_x=0.0, cam_y=0.0):
    canvas[:] = NAVY
    for step, th in ((60, 1), (300, 2)):
        ox, oy = int(-cam_x * 0.3) % step, int(-cam_y * 0.3) % step
        for x in range(-step + ox, W + step, step):
            cv2.line(canvas, (x, 0), (x, H), GRID, th)
        for y in range(-step + oy, H + step, step):
            cv2.line(canvas, (0, y), (W, y), GRID, th)

# --- Proyeksi isometrik ---
def iso(x, y, z, ox=540, oy=840, s=1.0):
    return (ox + (x - y) * 0.866 * s, oy + (x + y) * 0.5 * s - z * s)

# --- Garis tergambar progresif (p: 0..1) ---
def draw_on(canvas, pts, p, color=CYAN, th=3, dashed=False):
    pts = [np.array(q, np.float32) for q in pts]
    seg = [float(np.linalg.norm(pts[i + 1] - pts[i])) for i in range(len(pts) - 1)]
    total = sum(seg) + 1e-9
    limit = clamp(p, 0, 1) * total
    done = 0.0
    for i, L in enumerate(seg):
        if done >= limit: break
        f = clamp((limit - done) / (L + 1e-9), 0, 1)
        a, b = pts[i], pts[i] + (pts[i + 1] - pts[i]) * f
        if dashed:
            n = max(1, int(np.linalg.norm(b - a) // 14))
            for j in range(n):
                if j % 2 == 0:
                    u0, u1 = j / n, (j + 1) / n
                    cv2.line(canvas, tuple((a + (b - a) * u0).astype(int)), tuple((a + (b - a) * u1).astype(int)), color, th, cv2.LINE_AA)
        else:
            cv2.line(canvas, tuple(a.astype(int)), tuple(b.astype(int)), color, th, cv2.LINE_AA)
        done += L

def mix_color(c, k):  # k=1 penuh, k<1 meredup ke navy
    return tuple(int(NAVY[i] + (c[i] - NAVY[i]) * k) for i in range(3))

# --- Kotak isometrik (x,y,z = ukuran; (px,py,pz) = posisi sudut) ---
def draw_iso_box(canvas, pos, size, p=1.0, color=CYAN, tint=0.12, th=3, ox=540, oy=840, s=1.0):
    px, py, pz = pos; sx, sy, sz = size
    P = lambda dx, dy, dz: iso(px + dx, py + dy, pz + dz, ox, oy, s)
    top = [P(0, 0, sz), P(sx, 0, sz), P(sx, sy, sz), P(0, sy, sz)]
    right = [P(sx, 0, 0), P(sx, sy, 0), P(sx, sy, sz), P(sx, 0, sz)]
    left = [P(0, sy, 0), P(sx, sy, 0), P(sx, sy, sz), P(0, sy, sz)]
    if p >= 1.0 and tint > 0:
        ov = canvas.copy()
        for face in (top, right, left):
            cv2.fillPoly(ov, [np.array(face, np.int32)], color)
        cv2.addWeighted(ov, tint, canvas, 1 - tint, 0, canvas)
    edges = [
        [top[0], top[1], top[2], top[3], top[0]],
        [right[0], right[1], right[2]], [left[0], left[1]],
        [P(0, 0, 0), P(0, 0, sz)],
        [P(0, sy, 0), P(0, sy, sz)], [P(sx, 0, 0), P(sx, 0, sz)],
        [P(sx, 0, 0), P(sx, sy, 0)],
    ]
    for e in edges: draw_on(canvas, e, p, color, th)

# --- Silinder isometrik (sumbu z) ---
def draw_iso_cylinder(canvas, center, r, h, p=1.0, color=CYAN, th=3, ox=540, oy=840, s=1.0):
    cx, cy, cz = center
    bx, by = iso(cx, cy, cz, ox, oy, s); tx, ty = iso(cx, cy, cz + h, ox, oy, s)
    rx, ry = int(r * 1.732 * s), int(r * s)
    sweep = int(360 * clamp(p, 0, 1))
    if sweep > 0:
        cv2.ellipse(canvas, (int(bx), int(by)), (rx, ry), 0, 0, sweep, color, th, cv2.LINE_AA)
        cv2.ellipse(canvas, (int(tx), int(ty)), (rx, ry), 0, 0, sweep, color, th, cv2.LINE_AA)
    draw_on(canvas, [(bx - rx, by), (tx - rx, ty)], p, color, th)
    draw_on(canvas, [(bx + rx, by), (tx + rx, ty)], p, color, th)

# --- Offset explode sepanjang arah perakitan (dir = vektor layar, t = 0..1) ---
def explode_offset(direction, distance, t):
    k = ease_back(t)
    return (direction[0] * distance * k, direction[1] * distance * k)

# --- Label bernomor: lingkaran nomor + garis penunjuk tumbuh + teks ---
def draw_part_label(canvas, target, anchor, num, text, p=1.0, active=True):
    col = ORANGE if active else mix_color(CYAN, 0.45)
    tx, ty = int(target[0]), int(target[1]); ax, ay = int(anchor[0]), int(anchor[1])
    draw_on(canvas, [(tx, ty), (ax, ay)], smoothstep(0, 0.6, p), col, 2)
    cv2.circle(canvas, (tx, ty), 6, col, -1, cv2.LINE_AA)
    if p > 0.5:
        a = clamp((p - 0.5) * 2, 0, 1)
        cv2.circle(canvas, (ax, ay), 26, NAVY, -1, cv2.LINE_AA)
        cv2.circle(canvas, (ax, ay), 26, col, 3, cv2.LINE_AA)
        blend_bgra(canvas, text_sprite(f"{num:02d}", 24, col), ax, ay, a)
        blend_bgra(canvas, text_sprite(text, 26, WHITE if active else mix_color(WHITE, 0.5)), ax + 34 + len(text) * 8, ay, a)

# --- Garis dimensi dengan angka ---
def draw_dimension(canvas, p1, p2, label, p=1.0, color=WHITE):
    a, b = np.array(p1, np.float32), np.array(p2, np.float32)
    d = b - a; L = float(np.linalg.norm(d)) + 1e-9; n = np.array([-d[1], d[0]]) / L * 18
    draw_on(canvas, [a, b], p, color, 2)
    for q in (a, b):
        cv2.line(canvas, tuple((q - n).astype(int)), tuple((q + n).astype(int)), color, 2, cv2.LINE_AA)
    if p > 0.8:
        m = (a + b) / 2 + n * 2.2
        blend_bgra(canvas, text_sprite(label, 26, ORANGE), int(m[0]), int(m[1]), clamp((p - 0.8) * 5, 0, 1))

# --- Titik cahaya mengalir sepanjang jalur ---
def flow_dots(canvas, pts, t, n=5, color=ORANGE, speed=0.6):
    pts = [np.array(q, np.float32) for q in pts]
    seg = [float(np.linalg.norm(pts[i + 1] - pts[i])) for i in range(len(pts) - 1)]
    total = sum(seg) + 1e-9
    for k in range(n):
        u = ((t * speed + k / n) % 1.0) * total
        acc = 0.0
        for i, L in enumerate(seg):
            if acc + L >= u:
                q = pts[i] + (pts[i + 1] - pts[i]) * ((u - acc) / (L + 1e-9))
                cv2.circle(canvas, tuple(q.astype(int)), 9, color, -1, cv2.LINE_AA)
                cv2.circle(canvas, tuple(q.astype(int)), 15, color, 2, cv2.LINE_AA)
                break
            acc += L

# --- HUD header: tag kiri, judul, penanda babak ---
def draw_hud_header(canvas, tag, title, scene_idx, scene_total=6):
    cv2.rectangle(canvas, (40, 70), (1040, 250), mix_color(CYAN, 0.18), -1)
    cv2.rectangle(canvas, (40, 70), (1040, 250), CYAN, 2)
    cv2.rectangle(canvas, (40, 70), (260, 118), ORANGE, -1)
    blend_bgra(canvas, text_sprite(tag, 24, NAVY), 150, 94)
    sz = 40
    while sz > 26 and len(title) * sz * 0.62 > 960: sz -= 2
    blend_bgra(canvas, text_sprite(title, sz, WHITE), 60 + int(len(title) * sz * 0.31), 188)
    blend_bgra(canvas, text_sprite(f"{scene_idx}/{scene_total}", 24, CYAN), 985, 94)

# --- Strip spesifikasi bawah: [(label, nilai), ...] maks 3 item ---
def draw_spec_strip(canvas, items, cy=1450):
    n = max(1, len(items)); cw = 1000 // n
    for i, (lab, val) in enumerate(items):
        x0 = 40 + i * cw
        cv2.rectangle(canvas, (x0 + 4, cy - 50), (x0 + cw - 4, cy + 50), mix_color(CYAN, 0.15), -1)
        cv2.rectangle(canvas, (x0 + 4, cy - 50), (x0 + cw - 4, cy + 50), mix_color(CYAN, 0.6), 2)
        blend_bgra(canvas, text_sprite(lab.upper(), 20, mix_color(WHITE, 0.6), False), x0 + cw // 2, cy - 22)
        blend_bgra(canvas, text_sprite(val, 32, ORANGE), x0 + cw // 2, cy + 14)

# --- Subtitle mengetik; words = [(teks, is_highlight)], t_in = detik sejak kalimat mulai ---
_CPS = 32  # karakter per detik
def draw_typewriter_caption(canvas, words, t_in, cy=1600):
    full = " ".join(w for w, _ in words)
    shown = int(clamp(t_in * _CPS, 0, len(full)))
    f = font(MONO_B, 36); cw = int(ImageDraw.Draw(Image.new("RGBA", (10, 10))).textlength("M", font=f))
    total_w = min(1000, len(full) * cw + 60)
    x = 540 - total_w // 2 + 30
    cv2.rectangle(canvas, (540 - total_w // 2, cy - 48), (540 + total_w // 2, cy + 48), (24, 16, 8), -1)
    cv2.rectangle(canvas, (540 - total_w // 2, cy - 48), (540 + total_w // 2, cy + 48), mix_color(CYAN, 0.5), 2)
    pos = 0
    for txt, hl in words:
        for ch in txt + " ":
            if pos >= shown: break
            if ch != " ":
                if hl: cv2.rectangle(canvas, (x - 2, cy - 22), (x + cw, cy + 24), ORANGE, -1)
                blend_bgra(canvas, text_sprite(ch, 36, NAVY if hl else WHITE), x + cw // 2, cy)
            x += cw; pos += 1
    if int(t_in * 3) % 2 == 0 and shown < len(full):  # kursor berkedip
        cv2.rectangle(canvas, (x, cy - 20), (x + 8, cy + 22), ORANGE, -1)

# --- Penanda progres 6 babak ---
def draw_progress(canvas, scene_idx, scene_total=6, y=1860):
    for i in range(scene_total):
        x = 540 + (i - (scene_total - 1) / 2) * 70
        cv2.rectangle(canvas, (int(x - 26), y - 5), (int(x + 26), y + 5),
                      ORANGE if i + 1 == scene_idx else (CYAN if i + 1 < scene_idx else GRID), -1)

# --- Spec sheet penutup: rows = [(nomor, nama bagian, fungsi singkat)] maks 4, pertanyaan A/B ---
def draw_spec_sheet(canvas, title, rows, question, cy=1000):
    x0, x1, y0 = 70, 1010, cy - 380
    cv2.rectangle(canvas, (x0, y0), (x1, y0 + 760), (24, 16, 8), -1)
    cv2.rectangle(canvas, (x0, y0), (x1, y0 + 760), CYAN, 3)
    cv2.rectangle(canvas, (x0, y0), (x1, y0 + 70), ORANGE, -1)
    blend_bgra(canvas, text_sprite(title, 30, NAVY), 540, y0 + 35)
    for i, (num, name, fn) in enumerate(rows[:4]):
        ry = y0 + 100 + i * 120
        cv2.rectangle(canvas, (x0 + 20, ry), (x1 - 20, ry + 100), mix_color(CYAN, 0.15), -1)
        cv2.circle(canvas, (x0 + 70, ry + 50), 28, ORANGE, 3, cv2.LINE_AA)
        blend_bgra(canvas, text_sprite(f"{num:02d}", 24, ORANGE), x0 + 70, ry + 50)
        blend_bgra(canvas, text_sprite(name, 30, WHITE), x0 + 120 + len(name) * 9, ry + 30)
        blend_bgra(canvas, text_sprite(fn, 22, mix_color(WHITE, 0.65), False), x0 + 120 + len(fn) * 6, ry + 72)
    cv2.rectangle(canvas, (x0 + 20, y0 + 600), (x1 - 20, y0 + 740), ORANGE, 3)
    blend_bgra(canvas, text_sprite(question, 28, ORANGE), 540, y0 + 670)
```

> Catatan: tiap frame dibangun dengan urutan `draw_blueprint_bg` → gambar benda (draw_on / explode) → label & dimensi → `draw_hud_header` → `draw_spec_strip` → `draw_typewriter_caption` → `draw_progress`. Jangan menggambar elemen HUD di bawah benda.

## 7. Encode MP4

```python
cmd = ["ffmpeg", "-y", "-f", "rawvideo", "-vcodec", "rawvideo", "-s", f"{W}x{H}",
       "-pix_fmt", "bgr24", "-r", str(FPS), "-i", "-", "-i", "mixed.wav",
       "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
       "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", out_mp4_path]
```

Simpan di `/mnt/user-data/outputs/`, lalu `present_files`.

## Jebakan umum

- Jangan melompati tahap atau menulis naskah sebelum pengguna memilih nomor ide.
- Benda langsung muncul penuh tanpa draw-on, sehingga terasa seperti gambar tempelan.
- Terlalu banyak warna. Tetap pada navy, cyan, putih, satu aksen oranye (merah hanya di babak what-if).
- Label saling tumpuk saat explode. Atur arah ledakan agar bagian menyebar, dan geser anchor label ke sisi kiri/kanan.
- Bagian lebih dari 4. Batasi 3-4 bagian agar nomor terbaca di layar HP.
- Angka dimensi dikarang. Pakai angka nyata atau label kualitatif.
- Tidak ada babak what-if, padahal inilah inti "alasan desain".
- Musik menutupi suara. Pertahankan ~15% dengan ducking.
- Jangan menjanjikan "3D asli" di copywriting.
