import { useState } from "react";
import { VISUALS, VISUAL_LAB } from "../viz";

export default function VisualLabPage() {
  const [sel, setSel] = useState(VISUAL_LAB[0].key);
  const V = VISUALS[sel];
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6" data-testid="visual-lab">
      <h1 className="text-3xl font-bold">Visual Lab</h1>
      <p className="mt-1 text-slate-500">Visualisasi interaktif konsep statistika dan Machine Learning. Ubah parameter dan lihat hasilnya berubah langsung — semua angka dihitung di browser dari data yang ditampilkan. Visualisasi ini juga akan disematkan di subbab terkait saat modulnya tersedia.</p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <ul className="flex gap-1 overflow-x-auto lg:flex-col">
          {VISUAL_LAB.map((v) => (
            <li key={v.key}>
              <button type="button" onClick={() => setSel(v.key)} className={`w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm ${sel === v.key ? "bg-brand-700 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                <div className="font-medium">{v.title}</div>
                <div className={`text-xs ${sel === v.key ? "text-white/90" : "text-slate-500"}`}>{v.module}</div>
              </button>
            </li>
          ))}
        </ul>
        <div key={sel}>{V && <V />}</div>
      </div>
    </div>
  );
}
