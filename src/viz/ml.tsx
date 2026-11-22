import { useMemo, useState, type ReactNode } from "react";
import { seededRandom } from "../engine/grading";
import { Panel } from "./python";

// Visualisasi konsep Machine Learning. Semua angka dihitung langsung di browser dari data yang ditampilkan.

type Scale = (v: number) => number;
interface PlotCtx { x: Scale; y: Scale; w: number; h: number; inv: (px: number, py: number) => [number, number] }

function Plot({ xd, yd, h = 260, children, onClick, xLabel, yLabel }: { xd: [number, number]; yd: [number, number]; h?: number; children: (c: PlotCtx) => ReactNode; onClick?: (x: number, y: number) => void; xLabel?: string; yLabel?: string }) {
  const w = 520;
  const m = { l: 36, r: 10, t: 10, b: 28 };
  const x: Scale = (v) => m.l + ((v - xd[0]) / (xd[1] - xd[0])) * (w - m.l - m.r);
  const y: Scale = (v) => h - m.b - ((v - yd[0]) / (yd[1] - yd[0])) * (h - m.t - m.b);
  const inv = (px: number, py: number): [number, number] => [xd[0] + ((px - m.l) / (w - m.l - m.r)) * (xd[1] - xd[0]), yd[0] + ((h - m.b - py) / (h - m.t - m.b)) * (yd[1] - yd[0])];
  const ticks = (d: [number, number]) => Array.from({ length: 5 }, (_, i) => d[0] + ((d[1] - d[0]) * i) / 4);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full max-w-[640px] select-none text-slate-500 dark:text-slate-400"
      role="img"
      onClick={(e) => {
        if (!onClick) return;
        const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
        const [vx, vy] = inv(((e.clientX - r.left) / r.width) * w, ((e.clientY - r.top) / r.height) * h);
        onClick(vx, vy);
      }}
      style={{ cursor: onClick ? "crosshair" : undefined }}
    >
      <rect x={m.l} y={m.t} width={w - m.l - m.r} height={h - m.t - m.b} className="fill-slate-50 dark:fill-slate-800/40" />
      {ticks(xd).map((t) => (
        <g key={`x${t}`}>
          <line x1={x(t)} x2={x(t)} y1={m.t} y2={h - m.b} className="stroke-slate-200 dark:stroke-slate-700" />
          <text x={x(t)} y={h - m.b + 14} textAnchor="middle" fontSize="10" fill="currentColor">{+t.toFixed(2)}</text>
        </g>
      ))}
      {ticks(yd).map((t) => (
        <g key={`y${t}`}>
          <line x1={m.l} x2={w - m.r} y1={y(t)} y2={y(t)} className="stroke-slate-200 dark:stroke-slate-700" />
          <text x={m.l - 4} y={y(t) + 3} textAnchor="end" fontSize="10" fill="currentColor">{+t.toFixed(2)}</text>
        </g>
      ))}
      {xLabel && <text x={w - m.r} y={h - 2} textAnchor="end" fontSize="10" fill="currentColor">{xLabel}</text>}
      {yLabel && <text x={m.l + 2} y={m.t + 10} fontSize="10" fill="currentColor">{yLabel}</text>}
      {children({ x, y, w, h, inv })}
    </svg>
  );
}

function normal(rand: () => number) {
  const u = Math.max(1e-12, rand());
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const Slider = ({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; fmt?: (v: number) => string }) => (
  <label className="flex items-center gap-2 text-sm">
    <span className="w-36 shrink-0">{label}: <b className="font-mono">{fmt ? fmt(value) : value}</b></span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 accent-emerald-600" />
  </label>
);

// ---------------- 1. Mean vs median ----------------
export function MeanMedianViz() {
  const [out, setOut] = useState(7);
  const vals = [2, 3, 3, 4, 5, 6, out];
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const sorted = [...vals].sort((a, b) => a - b);
  const median = sorted[3];
  return (
    <Panel title="Perubahan mean vs median saat ada outlier" note="Mean menjumlahkan semua nilai sehingga tertarik oleh outlier; median hanya melihat nilai tengah setelah diurutkan.">
      <Slider label="Nilai terakhir" value={out} min={7} max={100} step={1} onChange={setOut} />
      <Plot xd={[0, 100]} yd={[0, 1]} h={120}>
        {({ x, y }) => (
          <>
            {vals.map((v, i) => <circle key={i} cx={x(v)} cy={y(0.35 + (sorted.indexOf(v) % 2) * 0.12)} r={6} className={i === 6 ? "fill-amber-500" : "fill-slate-500"} />)}
            <line x1={x(mean)} x2={x(mean)} y1={y(0)} y2={y(1)} className="stroke-red-500" strokeWidth={2} />
            <text x={x(mean) + 4} y={y(0.9)} fontSize="11" className="fill-red-500">mean {mean.toFixed(2)}</text>
            <line x1={x(median)} x2={x(median)} y1={y(0)} y2={y(1)} className="stroke-sky-500" strokeWidth={2} strokeDasharray="4 3" />
            <text x={x(median) + 4} y={y(0.75)} fontSize="11" className="fill-sky-500">median {median}</text>
          </>
        )}
      </Plot>
      <div className="font-mono text-sm">data = [{vals.join(", ")}] → mean = {mean.toFixed(2)}, median = {median}</div>
    </Panel>
  );
}

// ---------------- 2. Normal distribution ----------------
export function NormalViz() {
  const [mu, setMu] = useState(0);
  const [sd, setSd] = useState(1);
  const pdf = (v: number) => Math.exp(-0.5 * ((v - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
  const xs = Array.from({ length: 201 }, (_, i) => -8 + (16 * i) / 200);
  const ymax = Math.max(0.45, pdf(mu) * 1.1);
  return (
    <Panel title="Normal distribution (distribusi normal)" note="Aturan 68–95–99,7: sekitar 68,27% data berada dalam ±1σ dari mean, 95,45% dalam ±2σ, dan 99,73% dalam ±3σ.">
      <Slider label="mean (μ)" value={mu} min={-3} max={3} step={0.1} onChange={setMu} fmt={(v) => v.toFixed(1)} />
      <Slider label="std (σ)" value={sd} min={0.4} max={3} step={0.1} onChange={setSd} fmt={(v) => v.toFixed(1)} />
      <Plot xd={[-8, 8]} yd={[0, ymax]} xLabel="x" yLabel="density">
        {({ x, y }) => {
          const area = (k: number) => xs.filter((v) => Math.abs(v - mu) <= k * sd);
          const poly = (pts: number[]) => (pts.length ? `M${x(pts[0])},${y(0)} ` + pts.map((v) => `L${x(v)},${y(pdf(v))}`).join(" ") + ` L${x(pts[pts.length - 1])},${y(0)} Z` : "");
          return (
            <>
              <path d={poly(area(2))} className="fill-emerald-200/60 dark:fill-emerald-900/50" />
              <path d={poly(area(1))} className="fill-emerald-400/60 dark:fill-emerald-600/60" />
              <path d={"M" + xs.map((v) => `${x(v)},${y(pdf(v))}`).join(" L")} fill="none" className="stroke-emerald-700 dark:stroke-emerald-300" strokeWidth={2} />
              <line x1={x(mu)} x2={x(mu)} y1={y(0)} y2={y(pdf(mu))} className="stroke-red-500" strokeDasharray="3 3" />
            </>
          );
        }}
      </Plot>
      <div className="text-sm">Area gelap = μ ± 1σ = [{(mu - sd).toFixed(1)}, {(mu + sd).toFixed(1)}] (≈68%), area terang = μ ± 2σ (≈95%).</div>
    </Panel>
  );
}

// ---------------- 3. Standardization ----------------
export function StandardizationViz() {
  const data = [152, 160, 165, 168, 170, 172, 175, 180, 188];
  const [on, setOn] = useState(false);
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const std = Math.sqrt(data.reduce((a, b) => a + (b - mean) ** 2, 0) / data.length);
  const z = data.map((v) => (v - mean) / std);
  const shown = on ? z : data;
  const d: [number, number] = on ? [-3, 3] : [140, 200];
  return (
    <Panel title="Perubahan distribusi setelah standardization (z-score)" note="StandardScaler memakai z = (x − mean) / std dengan std populasi (ddof=0). Bentuk sebaran tidak berubah — hanya posisi (mean jadi 0) dan skala (std jadi 1).">
      <button type="button" className="btn-primary" onClick={() => setOn(!on)}>{on ? "Tampilkan data asli (cm)" : "Terapkan standardization"}</button>
      <Plot xd={d} yd={[0, 1]} h={110}>
        {({ x, y }) => (
          <>
            {shown.map((v, i) => <circle key={i} cx={x(v)} cy={y(0.5)} r={6} className="fill-violet-500/80" />)}
            <line x1={x(on ? 0 : mean)} x2={x(on ? 0 : mean)} y1={y(0)} y2={y(1)} className="stroke-red-500" strokeDasharray="3 3" />
          </>
        )}
      </Plot>
      <div className="font-mono text-xs">{on ? `z = [${z.map((v) => v.toFixed(2)).join(", ")}]  → mean = ${(z.reduce((a, b) => a + b, 0) / z.length).toFixed(2)}, std = 1.00` : `tinggi = [${data.join(", ")}]  → mean = ${mean.toFixed(2)}, std = ${std.toFixed(2)}`}</div>
    </Panel>
  );
}

// ---------------- 4. Train-test split ----------------
export function SplitViz() {
  const n = 20;
  const labels = Array.from({ length: n }, (_, i) => (i < 14 ? 0 : 1));
  const [ts, setTs] = useState(0.25);
  const [rs, setRs] = useState(42);
  const [strat, setStrat] = useState(false);
  const test = useMemo(() => {
    const rand = seededRandom(rs + 1);
    const nTest = Math.ceil(ts * n);
    const shuf = (arr: number[]) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    if (!strat) return new Set(shuf(Array.from({ length: n }, (_, i) => i)).slice(0, nTest));
    const c1 = labels.map((l, i) => (l === 1 ? i : -1)).filter((i) => i >= 0);
    const c0 = labels.map((l, i) => (l === 0 ? i : -1)).filter((i) => i >= 0);
    const t1 = Math.round((nTest * c1.length) / n);
    return new Set([...shuf(c1).slice(0, t1), ...shuf(c0).slice(0, nTest - t1)]);
  }, [ts, rs, strat]); // eslint-disable-line react-hooks/exhaustive-deps
  const pos = (set: "train" | "test") => labels.filter((l, i) => l === 1 && (set === "test" ? test.has(i) : !test.has(i))).length;
  const cnt = (set: "train" | "test") => labels.filter((_, i) => (set === "test" ? test.has(i) : !test.has(i))).length;
  return (
    <Panel title="Train-test split" note="Jumlah data test = ceil(test_size × n), sama seperti train_test_split. random_state yang sama selalu memberi pembagian yang sama. Stratify menjaga proporsi kelas di train dan test (ilustrasi; algoritma internal scikit-learn sedikit berbeda).">
      <Slider label="test_size" value={ts} min={0.1} max={0.5} step={0.05} onChange={setTs} fmt={(v) => v.toFixed(2)} />
      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
        <label>random_state <input type="number" className="input ml-1 inline w-20 py-1" value={rs} onChange={(e) => setRs(Number(e.target.value) || 0)} /></label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={strat} onChange={(e) => setStrat(e.target.checked)} /> stratify=y</label>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {labels.map((l, i) => (
          <div key={i} className={`flex h-9 w-9 items-center justify-center rounded text-xs font-bold ${test.has(i) ? "ring-2 ring-amber-500" : ""} ${l ? "bg-rose-500 text-white" : "bg-sky-500 text-white"}`} title={`sampel ${i}, kelas ${l}`}>{test.has(i) ? "T" : i}</div>
        ))}
      </div>
      <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
        <div>Train: {cnt("train")} sampel, kelas 1 = {pos("train")} ({((pos("train") / Math.max(1, cnt("train"))) * 100).toFixed(0)}%)</div>
        <div>Test (kotak T): {cnt("test")} sampel, kelas 1 = {pos("test")} ({((pos("test") / Math.max(1, cnt("test"))) * 100).toFixed(0)}%)</div>
      </div>
      <div className="mt-1 text-xs text-slate-500">Proporsi kelas 1 di seluruh data: 30%. Biru = kelas 0, merah = kelas 1.</div>
    </Panel>
  );
}

// ---------------- 5. Linear regression + gradient descent ----------------
export function GradientDescentViz() {
  const pts = useMemo(() => {
    const r = seededRandom(7);
    return Array.from({ length: 20 }, (_, i) => {
      const xv = (i / 19) * 5;
      return [xv, 2 * xv + 1 + normal(r) * 0.8] as [number, number];
    });
  }, []);
  const [lr, setLr] = useState(0.02);
  const [st, setSt] = useState({ w: 0, b: 0, hist: [] as number[] });
  const mse = (w: number, b: number) => pts.reduce((s, [xv, yv]) => s + (w * xv + b - yv) ** 2, 0) / pts.length;
  const step = (k: number) =>
    setSt((s) => {
      let { w, b } = s;
      const hist = [...s.hist];
      for (let i = 0; i < k; i++) {
        let dw = 0;
        let db = 0;
        for (const [xv, yv] of pts) {
          const e = w * xv + b - yv;
          dw += (2 / pts.length) * e * xv;
          db += (2 / pts.length) * e;
        }
        w -= lr * dw;
        b -= lr * db;
        hist.push(mse(w, b));
        if (!isFinite(w)) break;
      }
      return { w, b, hist: hist.slice(-200) };
    });
  const cur = mse(st.w, st.b);
  const diverge = st.hist.length > 2 && st.hist[st.hist.length - 1] > st.hist[st.hist.length - 2];
  return (
    <Panel title="Linear regression dengan gradient descent" note="Setiap langkah: hitung gradien MSE terhadap w dan b, lalu geser parameter berlawanan arah gradien sebesar learning rate × gradien. Learning rate terlalu besar membuat loss membesar (divergen).">
      <Slider label="learning rate" value={lr} min={0.005} max={0.12} step={0.005} onChange={setLr} fmt={(v) => v.toFixed(3)} />
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={() => step(1)}>1 langkah</button>
        <button type="button" className="btn-outline" onClick={() => step(25)}>25 langkah</button>
        <button type="button" className="btn-ghost" onClick={() => setSt({ w: 0, b: 0, hist: [] })}>Reset</button>
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        <Plot xd={[0, 5]} yd={[-2, 14]} xLabel="x" yLabel="y">
          {({ x, y }) => (
            <>
              {pts.map(([a, b], i) => <circle key={i} cx={x(a)} cy={y(b)} r={4} className="fill-sky-500" />)}
              {isFinite(st.w) && <line x1={x(0)} y1={y(st.b)} x2={x(5)} y2={y(st.w * 5 + st.b)} className="stroke-red-500" strokeWidth={2} />}
            </>
          )}
        </Plot>
        <Plot xd={[0, Math.max(10, st.hist.length)]} yd={[0, Math.max(1, ...st.hist.slice(0, 1), mse(0, 0))]} xLabel="langkah" yLabel="MSE">
          {({ x, y }) => <path d={st.hist.length ? "M" + st.hist.map((v, i) => `${x(i + 1)},${y(Math.min(v, mse(0, 0)))}`).join(" L") : ""} fill="none" className="stroke-violet-500" strokeWidth={2} />}
        </Plot>
      </div>
      <div className="font-mono text-sm">ŷ = {isFinite(st.w) ? st.w.toFixed(3) : "∞"}·x + {isFinite(st.b) ? st.b.toFixed(3) : "∞"} · MSE = {isFinite(cur) ? cur.toFixed(4) : "∞"} · langkah = {st.hist.length}</div>
      {diverge && <div className="text-sm font-semibold text-red-600">⚠ Loss naik — learning rate terlalu besar.</div>}
    </Panel>
  );
}

// ---------------- 6. KNN ----------------
export function KnnViz() {
  const pts = useMemo(() => {
    const r = seededRandom(3);
    const a = Array.from({ length: 25 }, () => [3 + normal(r) * 1.2, 3 + normal(r) * 1.2, 0] as [number, number, number]);
    const b = Array.from({ length: 25 }, () => [6.5 + normal(r) * 1.2, 6 + normal(r) * 1.2, 1] as [number, number, number]);
    return [...a, ...b];
  }, []);
  const [k, setK] = useState(5);
  const [q, setQ] = useState<[number, number]>([5, 4.5]);
  const predict = (px: number, py: number) => {
    const d = pts.map((p) => ({ p, d: Math.hypot(p[0] - px, p[1] - py) })).sort((m, n) => m.d - n.d).slice(0, k);
    const ones = d.filter((x) => x.p[2] === 1).length;
    return { nn: d, cls: ones * 2 > k ? 1 : 0, ones };
  };
  const res = predict(q[0], q[1]);
  const grid = useMemo(() => {
    const cells: { x: number; y: number; c: number }[] = [];
    for (let i = 0; i < 25; i++) for (let j = 0; j < 25; j++) {
      const px = (i + 0.5) * 0.4;
      const py = (j + 0.5) * 0.4;
      cells.push({ x: px, y: py, c: predict(px, py).cls });
    }
    return cells;
  }, [k]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Panel title="K-Nearest Neighbors — ubah K dan klik plot" note="Jarak dihitung dengan Euclidean distance. Prediksi = kelas mayoritas dari K tetangga terdekat. K kecil → batas keputusan berliku (rawan overfitting); K besar → lebih halus. Warna latar = prediksi di setiap titik.">
      <Slider label="K (n_neighbors)" value={k} min={1} max={15} step={2} onChange={setK} />
      <Plot xd={[0, 10]} yd={[0, 10]} onClick={(a, b) => setQ([a, b])}>
        {({ x, y }) => (
          <>
            {grid.map((g, i) => <rect key={i} x={x(g.x - 0.2)} y={y(g.y + 0.2)} width={x(0.4) - x(0)} height={y(0) - y(0.4)} className={g.c ? "fill-rose-200/50 dark:fill-rose-900/30" : "fill-sky-200/50 dark:fill-sky-900/30"} />)}
            {res.nn.map((n, i) => <line key={i} x1={x(q[0])} y1={y(q[1])} x2={x(n.p[0])} y2={y(n.p[1])} className="stroke-slate-500" strokeDasharray="2 2" />)}
            {pts.map((p, i) => <circle key={i} cx={x(p[0])} cy={y(p[1])} r={4.5} className={p[2] ? "fill-rose-500" : "fill-sky-500"} stroke={res.nn.some((n) => n.p === p) ? "black" : "none"} strokeWidth={1.5} />)}
            <rect x={x(q[0]) - 6} y={y(q[1]) - 6} width={12} height={12} className={res.cls ? "fill-rose-600" : "fill-sky-600"} stroke="black" strokeWidth={2} />
          </>
        )}
      </Plot>
      <div className="text-sm">Titik baru ({q[0].toFixed(2)}, {q[1].toFixed(2)}): {res.ones} tetangga merah, {k - res.ones} biru → prediksi <b>{res.cls ? "kelas merah (1)" : "kelas biru (0)"}</b></div>
    </Panel>
  );
}

// ---------------- 7. K-Means ----------------
export function KMeansViz() {
  const pts = useMemo(() => {
    const r = seededRandom(11);
    const cs = [[2.5, 2.5], [7, 3], [5, 7.5]];
    return cs.flatMap(([cx, cy]) => Array.from({ length: 22 }, () => [cx + normal(r) * 0.9, cy + normal(r) * 0.9] as [number, number]));
  }, []);
  const [k, setK] = useState(3);
  const [seed, setSeed] = useState(1);
  const init = (kk: number, s: number) => {
    const r = seededRandom(s * 97 + kk);
    return Array.from({ length: kk }, () => pts[Math.floor(r() * pts.length)]).map((p) => [...p] as [number, number]);
  };
  const [st, setSt] = useState(() => ({ cents: init(3, 1), assign: [] as number[], phase: "assign" as "assign" | "update", iter: 0 }));
  const reset = (kk = k, s = seed) => setSt({ cents: init(kk, s), assign: [], phase: "assign", iter: 0 });
  const step = () =>
    setSt((s) => {
      if (s.phase === "assign") {
        const assign = pts.map((p) => {
          let best = 0;
          let bd = Infinity;
          s.cents.forEach((c, j) => {
            const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2;
            if (d < bd) { bd = d; best = j; }
          });
          return best;
        });
        return { ...s, assign, phase: "update" };
      }
      const cents = s.cents.map((c, j) => {
        const mine = pts.filter((_, i) => s.assign[i] === j);
        return mine.length ? ([mine.reduce((a, p) => a + p[0], 0) / mine.length, mine.reduce((a, p) => a + p[1], 0) / mine.length] as [number, number]) : c;
      });
      return { ...s, cents, phase: "assign", iter: s.iter + 1 };
    });
  const colors = ["fill-sky-500", "fill-rose-500", "fill-amber-500", "fill-violet-500", "fill-emerald-500", "fill-slate-500"];
  const inertia = st.assign.length ? pts.reduce((a, p, i) => a + (p[0] - st.cents[st.assign[i]][0]) ** 2 + (p[1] - st.cents[st.assign[i]][1]) ** 2, 0) : null;
  return (
    <Panel title="K-Means clustering langkah demi langkah" note="Langkah 1 (assign): setiap titik masuk ke centroid terdekat. Langkah 2 (update): centroid dipindah ke rata-rata anggotanya. Ulangi sampai centroid tidak berpindah. Inertia = jumlah kuadrat jarak titik ke centroid-nya.">
      <Slider label="K (n_clusters)" value={k} min={2} max={6} step={1} onChange={(v) => { setK(v); reset(v); }} />
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={step}>{st.phase === "assign" ? "Assign titik" : "Update centroid"}</button>
        <button type="button" className="btn-ghost" onClick={() => { const s2 = seed + 1; setSeed(s2); reset(k, s2); }}>Inisialisasi acak baru</button>
      </div>
      <Plot xd={[0, 10]} yd={[0, 10]}>
        {({ x, y }) => (
          <>
            {pts.map((p, i) => <circle key={i} cx={x(p[0])} cy={y(p[1])} r={4} className={st.assign.length ? colors[st.assign[i]] : "fill-slate-400"} opacity={0.85} />)}
            {st.cents.map((c, j) => <g key={j}><circle cx={x(c[0])} cy={y(c[1])} r={9} className={colors[j]} stroke="black" strokeWidth={2} /><text x={x(c[0])} y={y(c[1]) + 4} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">{j}</text></g>)}
          </>
        )}
      </Plot>
      <div className="text-sm">Iterasi: {st.iter} · Inertia: {inertia === null ? "—" : inertia.toFixed(2)}</div>
    </Panel>
  );
}

// ---------------- 8. Threshold, confusion matrix, ROC ----------------
export function ThresholdViz() {
  const data = useMemo(() => {
    const r = seededRandom(21);
    const clip = (v: number) => Math.min(0.99, Math.max(0.01, v));
    return [...Array.from({ length: 40 }, () => ({ y: 1, s: clip(0.66 + normal(r) * 0.16) })), ...Array.from({ length: 60 }, () => ({ y: 0, s: clip(0.36 + normal(r) * 0.16) }))];
  }, []);
  const [t, setT] = useState(0.5);
  const cm = (th: number) => {
    let tp = 0, fp = 0, tn = 0, fn = 0;
    for (const d of data) {
      const p = d.s >= th ? 1 : 0;
      if (p && d.y) tp++; else if (p && !d.y) fp++; else if (!p && !d.y) tn++; else fn++;
    }
    return { tp, fp, tn, fn };
  };
  const c = cm(t);
  const prec = c.tp + c.fp ? c.tp / (c.tp + c.fp) : 0;
  const rec = c.tp / (c.tp + c.fn);
  const spec = c.tn / (c.tn + c.fp);
  const f1 = prec + rec ? (2 * prec * rec) / (prec + rec) : 0;
  const acc = (c.tp + c.tn) / data.length;
  const roc = useMemo(() => {
    const ths = [1.01, ...[...new Set(data.map((d) => d.s))].sort((a, b) => b - a), 0];
    return ths.map((th) => { const m = cm(th); return [m.fp / (m.fp + m.tn), m.tp / (m.tp + m.fn)] as [number, number]; });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const auc = roc.reduce((a, p, i) => (i ? a + (p[0] - roc[i - 1][0]) * (p[1] + roc[i - 1][1]) / 2 : 0), 0);
  const Cell = ({ label, v, good }: { label: string; v: number; good: boolean }) => <div className={`rounded p-2 text-center ${good ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-red-100 dark:bg-red-900/40"}`}><div className="text-xs">{label}</div><div className="text-xl font-bold">{v}</div></div>;
  return (
    <Panel title="Classification threshold, confusion matrix & ROC curve" note="Model memberi probabilitas kelas positif. Prediksi positif jika probabilitas ≥ threshold. Menurunkan threshold menaikkan recall tetapi biasanya menurunkan precision. ROC curve merangkum semua threshold; AUC dihitung dengan aturan trapesium.">
      <Slider label="threshold" value={t} min={0.05} max={0.95} step={0.01} onChange={setT} fmt={(v) => v.toFixed(2)} />
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 text-xs text-slate-500">Baris = aktual, kolom = prediksi (40 positif, 60 negatif)</div>
          <div className="grid grid-cols-2 gap-1.5">
            <Cell label="TN (aktual 0, pred 0)" v={c.tn} good /><Cell label="FP (aktual 0, pred 1)" v={c.fp} good={false} />
            <Cell label="FN (aktual 1, pred 0)" v={c.fn} good={false} /><Cell label="TP (aktual 1, pred 1)" v={c.tp} good />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 font-mono text-sm">
            <span>accuracy = {acc.toFixed(3)}</span><span>precision = {prec.toFixed(3)}</span>
            <span>recall = {rec.toFixed(3)}</span><span>specificity = {spec.toFixed(3)}</span>
            <span>F1 = {f1.toFixed(3)}</span><span>AUC = {auc.toFixed(3)}</span>
          </div>
        </div>
        <Plot xd={[0, 1]} yd={[0, 1]} xLabel="False Positive Rate" yLabel="True Positive Rate">
          {({ x, y }) => (
            <>
              <line x1={x(0)} y1={y(0)} x2={x(1)} y2={y(1)} className="stroke-slate-400" strokeDasharray="4 4" />
              <path d={"M" + roc.map(([a, b]) => `${x(a)},${y(b)}`).join(" L")} fill="none" className="stroke-violet-600" strokeWidth={2} />
              <circle cx={x(1 - spec)} cy={y(rec)} r={6} className="fill-red-500" />
            </>
          )}
        </Plot>
      </div>
    </Panel>
  );
}

// ---------------- 9. Underfitting vs overfitting ----------------
function polyfit(xs: number[], ys: number[], deg: number): number[] {
  const n = deg + 1;
  const A = Array.from({ length: n }, () => new Array(n + 1).fill(0));
  for (let i = 0; i < xs.length; i++) {
    const pw = Array.from({ length: 2 * n }, (_, k) => xs[i] ** k);
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) A[r][c] += pw[r + c];
      A[r][n] += pw[r] * ys[i];
    }
  }
  for (let r = 0; r < n; r++) A[r][r] += 1e-9;
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    [A[c], A[piv]] = [A[piv], A[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k];
    }
  }
  return A.map((row, i) => row[n] / A[i][i]);
}

export function OverfitViz() {
  const { train, test } = useMemo(() => {
    const r = seededRandom(5);
    const f = (v: number) => Math.sin(Math.PI * v);
    const mk = (m: number) => Array.from({ length: m }, () => { const v = r() * 2 - 1; return [v, f(v) + normal(r) * 0.25] as [number, number]; });
    return { train: mk(14), test: mk(30) };
  }, []);
  const [deg, setDeg] = useState(1);
  const coef = polyfit(train.map((p) => p[0]), train.map((p) => p[1]), deg);
  const pred = (v: number) => coef.reduce((a, c, k) => a + c * v ** k, 0);
  const mse = (pts: [number, number][]) => pts.reduce((a, [u, w]) => a + (pred(u) - w) ** 2, 0) / pts.length;
  const xs = Array.from({ length: 200 }, (_, i) => -1 + (2 * i) / 199);
  const label = deg <= 1 ? "Underfitting: model terlalu sederhana — error train DAN test tinggi." : deg <= 5 ? "Fit yang baik: error test rendah, model menangkap pola tanpa menghafal noise." : "Overfitting: error train sangat kecil tetapi error test naik — model menghafal noise.";
  return (
    <Panel title="Underfitting vs overfitting (polynomial regression)" note="Titik biru = training data, titik oranye = test data dari pola yang sama (sinus + noise). Model dilatih HANYA pada data biru.">
      <Slider label="degree polinomial" value={deg} min={1} max={12} step={1} onChange={setDeg} />
      <Plot xd={[-1, 1]} yd={[-2, 2]}>
        {({ x, y }) => (
          <>
            {test.map(([a, b], i) => <circle key={`t${i}`} cx={x(a)} cy={y(b)} r={3.5} className="fill-amber-500" opacity={0.7} />)}
            {train.map(([a, b], i) => <circle key={i} cx={x(a)} cy={y(b)} r={4.5} className="fill-sky-600" />)}
            <path d={"M" + xs.map((v) => `${x(v)},${y(Math.max(-2.2, Math.min(2.2, pred(v))))}`).join(" L")} fill="none" className="stroke-red-500" strokeWidth={2} />
          </>
        )}
      </Plot>
      <div className="font-mono text-sm">train MSE = {mse(train).toFixed(4)} · test MSE = {mse(test).toFixed(4)}</div>
      <div className="text-sm font-medium">{label}</div>
    </Panel>
  );
}
