import { Download, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { downloadText } from "../components/CodeRunner";
import { DIFFICULTY_LABEL } from "../curriculum/curriculum";
import { exportProgress, importProgress, resetProgress, setPrefs, todayStr, useStore } from "../engine/store";
import { setTheme } from "../engine/theme";
import type { Difficulty } from "../types";

export default function SettingsPage() {
  const s = useStore((x) => x);
  const [msg, setMsg] = useState("");
  const [intervals, setIntervals] = useState(s.prefs.srsIntervals.join(", "));
  const file = useRef<HTMLInputElement>(null);
  return (
    <div className="mx-auto max-w-3xl px-4 py-6" data-testid="settings">
      <h1 className="text-3xl font-bold">Settings</h1>
      {msg && <div className="mt-3 rounded-md border border-sky-200 bg-sky-50 p-2 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100">{msg}</div>}
      <section className="card mt-4 space-y-4 p-5">
        <h2 className="font-semibold">Preferensi belajar</h2>
        <label className="block text-sm">Nama panggilan (untuk sapaan di dashboard)
          <input className="input mt-1" value={s.prefs.userName} onChange={(e) => setPrefs({ userName: e.target.value })} placeholder="opsional" />
        </label>
        <div className="text-sm">
          Tingkat kesulitan
          <div className="mt-1 grid gap-2 sm:grid-cols-3">
            {(["beginner", "intermediate", "advanced"] as Difficulty[]).map((d) => (
              <button key={d} type="button" className={`choice flex-col ${s.prefs.difficulty === d ? "choice-selected" : ""}`} onClick={() => setPrefs({ difficulty: d })}>
                <b>{DIFFICULTY_LABEL[d]}</b>
                <span className="text-xs text-slate-500">{d === "beginner" ? "Default. Materi lanjutan ditampilkan redup dengan label prasyarat." : d === "intermediate" ? "Menampilkan materi Intermediate secara normal." : "Semua materi, termasuk Advanced."}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="text-sm">
          Tema
          <div className="mt-1 flex gap-2">
            {(["light", "dark", "system"] as const).map((t) => (
              <button key={t} type="button" className={`btn-outline ${s.prefs.theme === t ? "border-brand-500 text-brand-700 dark:text-brand-300" : ""}`} onClick={() => setTheme(t)}>{t === "light" ? "Light" : t === "dark" ? "Dark" : "Ikuti sistem"}</button>
            ))}
          </div>
        </div>
        <label className="block text-sm">Target belajar harian (menit)
          <input type="number" min={5} max={480} className="input mt-1 w-32" value={s.prefs.dailyTargetMin} onChange={(e) => setPrefs({ dailyTargetMin: Math.max(5, Math.min(480, Number(e.target.value) || 30)) })} />
        </label>
        <label className="block text-sm">Batas waktu eksekusi kode (detik) — kode dihentikan otomatis bila melebihi batas
          <input type="number" min={5} max={600} className="input mt-1 w-32" value={s.prefs.execTimeoutSec} onChange={(e) => setPrefs({ execTimeoutSec: Math.max(5, Math.min(600, Number(e.target.value) || 30)) })} />
        </label>
        <div className="text-sm">
          Interval spaced repetition (hari, dipisah koma)
          <div className="mt-1 flex gap-2">
            <input className="input w-60" value={intervals} onChange={(e) => setIntervals(e.target.value)} />
            <button type="button" className="btn-primary" onClick={() => {
              const arr = intervals.split(",").map((x) => parseInt(x.trim(), 10)).filter((x) => x > 0 && x < 3650);
              if (arr.length < 2) { setMsg("Masukkan minimal 2 interval, misalnya: 1, 3, 7, 14, 30"); return; }
              setPrefs({ srsIntervals: arr.sort((a, b) => a - b) });
              setMsg(`✓ Interval disimpan: ${arr.join(", ")} hari`);
            }}>Simpan</button>
          </div>
        </div>
      </section>
      <section className="card mt-4 space-y-3 p-5">
        <h2 className="font-semibold">Data progres</h2>
        <p className="text-sm text-slate-500">Progres disimpan di browser ini (localStorage) tanpa akun. Ekspor secara berkala sebagai cadangan atau untuk pindah perangkat.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-outline" onClick={() => { downloadText(`ml-academy-progress-${todayStr()}.json`, exportProgress(), "application/json"); setMsg("✓ Progres diekspor."); }} data-testid="export-btn"><Download size={14} /> Export Learning Progress</button>
          <input ref={file} type="file" accept="application/json,.json" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const r = importProgress(await f.text()); setMsg(r.ok ? `✓ ${r.message}` : `✗ ${r.message}`); e.target.value = ""; }} data-testid="import-input" />
          <button type="button" className="btn-outline" onClick={() => file.current?.click()}><Upload size={14} /> Import Learning Progress</button>
          <button type="button" className="btn-danger" onClick={() => { if (confirm("Hapus SEMUA progres belajar (lesson selesai, kuis, ujian, flashcard, error notebook, kode tersimpan)? Tindakan ini tidak bisa dibatalkan. Pertimbangkan Export terlebih dahulu.")) { resetProgress(); setMsg("Progres telah di-reset."); } }} data-testid="reset-btn"><Trash2 size={14} /> Reset Progress</button>
        </div>
        <div className="text-xs text-slate-500">Ringkasan data: {Object.keys(s.completedLessons).length} lesson selesai · {Object.keys(s.attempts).length} item dijawab · {s.exams.length} ujian · {Object.keys(s.cards).length} flashcard · {Object.keys(s.errors).length} catatan kesalahan · {Object.keys(s.code).length} kode tersimpan.</div>
      </section>
    </div>
  );
}
