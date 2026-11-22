import { useState } from "react";

// Visualisasi konsep Python. Semua nilai dihitung dengan aturan Python yang sama.

export function Panel({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" data-testid="viz">
      <div className="mb-3 text-sm font-semibold">{title}</div>
      {children}
      {note && <p className="mt-3 text-xs text-slate-500">{note}</p>}
    </div>
  );
}

const STEPS_VAR = [
  { code: "x = 5", vars: { x: "5" } as Record<string, string>, note: "Python membuat nilai 5 lalu menempelkan label x padanya." },
  { code: "y = x", vars: { x: "5", y: "5" }, note: "y menunjuk nilai yang sama dengan x saat itu (5)." },
  { code: "x = 10", vars: { x: "10", y: "5" }, note: "x dipindah ke nilai baru 10. y TIDAK ikut berubah — tetap 5." },
  { code: 'nama = "Budi"', vars: { x: "10", y: "5", nama: '"Budi"' }, note: "Variabel bisa menyimpan tipe apa pun, misalnya string." },
  { code: "x = x + 1", vars: { x: "11", y: "5", nama: '"Budi"' }, note: "Sisi kanan dihitung dulu (10 + 1 = 11), baru hasilnya disimpan ke x." },
];

export function VariableBoxes() {
  const [i, setI] = useState(0);
  const st = STEPS_VAR[i];
  return (
    <Panel title="Variabel = label yang menunjuk ke sebuah nilai" note="Tekan Langkah berikutnya untuk menjalankan baris kode satu per satu.">
      <div className="grid gap-4 md:grid-cols-2">
        <pre className="rounded-lg bg-slate-900 p-3 font-mono text-sm text-slate-200">
          {STEPS_VAR.map((s, k) => (
            <div key={k} className={k === i ? "rounded bg-brand-600/40 text-white" : k < i ? "text-slate-500 dark:text-slate-400" : "text-slate-600"}>
              {k === i ? "➜ " : "  "}
              {s.code}
            </div>
          ))}
        </pre>
        <div className="flex flex-wrap content-start gap-3">
          {Object.entries(st.vars).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              <span className="rounded-md bg-brand-700 px-2 py-1 font-mono text-sm text-white">{k}</span>
              <span className="text-slate-500 dark:text-slate-400">→</span>
              <span className="rounded-md border-2 border-slate-300 px-3 py-1 font-mono text-sm dark:border-slate-600">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm">{st.note}</p>
      <div className="mt-2 flex gap-2">
        <button type="button" className="btn-outline" disabled={i === 0} onClick={() => setI(i - 1)}>← Sebelumnya</button>
        <button type="button" className="btn-primary" disabled={i === STEPS_VAR.length - 1} onClick={() => setI(i + 1)}>Langkah berikutnya →</button>
        <button type="button" className="btn-ghost" onClick={() => setI(0)}>Ulang</button>
      </div>
    </Panel>
  );
}

/** Indeks slice ala Python (mendukung indeks negatif & step). */
export function pySlice<T>(arr: T[], start: number | null, stop: number | null, step: number): number[] {
  const n = arr.length;
  const norm = (v: number | null, def: number, lo: number, hi: number) => {
    if (v === null) return def;
    let x = v < 0 ? v + n : v;
    if (x < lo) x = lo;
    if (x > hi) x = hi;
    return x;
  };
  const out: number[] = [];
  if (step > 0) {
    const a = norm(start, 0, 0, n);
    const b = norm(stop, n, 0, n);
    for (let k = a; k < b; k += step) out.push(k);
  } else {
    const a = norm(start, n - 1, -1, n - 1);
    const b = norm(stop, -1, -1, n - 1);
    for (let k = a; k > b; k += step) out.push(k);
  }
  return out;
}

export function ListIndexViz() {
  const data = ["Andi", "Budi", "Citra", "Dewi", "Eko", "Fajar"];
  const [start, setStart] = useState<number | null>(1);
  const [stop, setStop] = useState<number | null>(4);
  const [step, setStep] = useState(1);
  const sel = pySlice(data, start, stop, step);
  const fmt = (v: number | null) => (v === null ? "" : String(v));
  const expr = `nama[${fmt(start)}:${fmt(stop)}${step !== 1 ? `:${step}` : ""}]`;
  const Sel = ({ label, value, set, allowNone = true }: { label: string; value: number | null; set: (v: number | null) => void; allowNone?: boolean }) => (
    <label className="text-sm">
      {label}
      <select className="input ml-2 w-24 py-1" value={value === null ? "none" : String(value)} onChange={(e) => set(e.target.value === "none" ? null : Number(e.target.value))}>
        {allowNone && <option value="none">(kosong)</option>}
        {Array.from({ length: 15 }, (_, k) => k - 7).map((v) => <option key={v} value={v}>{v}</option>)}
      </select>
    </label>
  );
  return (
    <Panel title="Indexing & slicing list" note="Indeks positif dihitung dari kiri mulai 0; indeks negatif dari kanan mulai -1. Slicing [start:stop] mengambil start sampai SEBELUM stop.">
      <div className="flex flex-wrap gap-1.5">
        {data.map((d, k) => (
          <div key={k} className={`w-20 rounded-lg border-2 p-1.5 text-center transition ${sel.includes(k) ? "border-brand-500 bg-brand-50 dark:bg-brand-900/40" : "border-slate-200 dark:border-slate-700"}`}>
            <div className="font-mono text-sm">"{d}"</div>
            <div className="text-[11px] text-slate-500">[{k}] · [{k - data.length}]</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <Sel label="start" value={start} set={setStart} />
        <Sel label="stop" value={stop} set={setStop} />
        <label className="text-sm">step
          <select className="input ml-2 w-20 py-1" value={step} onChange={(e) => setStep(Number(e.target.value))}>
            {[-2, -1, 1, 2, 3].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </label>
      </div>
      <pre className="mt-3 rounded bg-slate-900 p-2 font-mono text-sm text-slate-100">{`>>> ${expr}\n[${sel.map((k) => `'${data[k]}'`).join(", ")}]`}</pre>
    </Panel>
  );
}

export function LoopTrace() {
  const nilai = [80, 90, 75, 95];
  const [i, setI] = useState(-1);
  const total = nilai.slice(0, i + 1).reduce((a, b) => a + b, 0);
  return (
    <Panel title="Menelusuri for loop langkah demi langkah" note="Setiap iterasi, variabel n berisi satu elemen list, lalu blok yang menjorok dijalankan.">
      <pre className="rounded-lg bg-slate-900 p-3 font-mono text-sm text-slate-200">{`nilai = [80, 90, 75, 95]\ntotal = 0\nfor n in nilai:\n    total = total + n\nprint(total)`}</pre>
      <div className="mt-3 overflow-x-auto">
        <table className="text-sm">
          <thead><tr className="text-left text-xs uppercase text-slate-500"><th className="pr-4">Iterasi</th><th className="pr-4">n</th><th className="pr-4">total sebelum</th><th>total sesudah</th></tr></thead>
          <tbody>
            {nilai.map((v, k) => (
              <tr key={k} className={k === i ? "bg-brand-50 font-semibold dark:bg-brand-900/40" : k > i ? "text-slate-500 dark:text-slate-600" : ""}>
                <td className="pr-4">{k + 1}</td><td className="pr-4 font-mono">{v}</td><td className="pr-4 font-mono">{nilai.slice(0, k).reduce((a, b) => a + b, 0)}</td><td className="font-mono">{nilai.slice(0, k + 1).reduce((a, b) => a + b, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-sm">{i < 0 ? "Loop belum dimulai. total = 0" : i < nilai.length - 1 ? `Iterasi ke-${i + 1}: n = ${nilai[i]}, total = ${total}` : `Loop selesai. print(total) menampilkan ${total}`}</div>
      <div className="mt-2 flex gap-2">
        <button type="button" className="btn-primary" disabled={i >= nilai.length - 1} onClick={() => setI(i + 1)}>Iterasi berikutnya →</button>
        <button type="button" className="btn-ghost" onClick={() => setI(-1)}>Ulang</button>
      </div>
    </Panel>
  );
}

export function TruthTable() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const T = (v: boolean) => <span className={`font-mono font-semibold ${v ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{v ? "True" : "False"}</span>;
  return (
    <Panel title="Operator logika and, or, not" note="and: True hanya jika keduanya True. or: True jika minimal satu True. not: membalik nilai.">
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-outline font-mono" onClick={() => setA(!a)}>a = {a ? "True" : "False"}</button>
        <button type="button" className="btn-outline font-mono" onClick={() => setB(!b)}>b = {b ? "True" : "False"}</button>
      </div>
      <div className="mt-3 grid gap-2 font-mono text-sm sm:grid-cols-2">
        <div>a and b → {T(a && b)}</div>
        <div>a or b → {T(a || b)}</div>
        <div>not a → {T(!a)}</div>
        <div>not (a and b) → {T(!(a && b))}</div>
      </div>
    </Panel>
  );
}
