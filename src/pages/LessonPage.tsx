import { AlertTriangle, ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, CheckCircle2, Clock, ExternalLink, Lightbulb, Lock, Target } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { TryIt } from "../components/CodeRunner";
import { ExerciseView, LEVEL_INFO } from "../components/Exercise";
import { Markdown } from "../components/Markdown";
import { LessonQuiz } from "../components/Quiz";
import { LESSONS, isAvailable, neighbors } from "../content";
import { MODULE_REFERENCES } from "../content/moduleRefs";
import { DIFFICULTY_LABEL, getLessonMeta, getModule } from "../curriculum/curriculum";
import { setLessonComplete, toggleBookmark, useStore, visitLesson } from "../engine/store";
import type { Lesson, LearningLevel, Reference } from "../types";
import { VISUALS } from "../viz";

export function LevelTag({ level }: { level: LearningLevel }) {
  return (
    <span className={`badge ${LEVEL_INFO[level].color}`} title={LEVEL_INFO[level].desc}>
      Level {level} · {LEVEL_INFO[level].name}
    </span>
  );
}

function Section({ id, n, title, level, children }: { id: string; n: number; title: string; level?: LearningLevel; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20" data-section>
      <h2 className="section-title">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800">{n}</span>
        <span className="flex-1">{title}</span>
        {level && <LevelTag level={level} />}
      </h2>
      {children}
    </section>
  );
}

export function ReferenceList({ refs }: { refs: Reference[] }) {
  return (
    <ul className="space-y-2" data-testid="references">
      {refs.map((r, i) => (
        <li key={i} className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center dark:border-slate-800">
          <div className="flex-1 text-sm">
            <div className="font-semibold text-slate-800 dark:text-slate-100">{r.source}</div>
            <div>{r.title}</div>
            <div className="break-all text-xs text-slate-500">{r.url}</div>
            {r.note && <div className="text-xs text-slate-500">{r.note}</div>}
          </div>
          <a href={r.url} target="_blank" rel="noreferrer" className="btn-outline shrink-0">
            Read Documentation <ExternalLink size={13} />
          </a>
        </li>
      ))}
    </ul>
  );
}

const TOC: [string, string][] = [
  ["objectives", "Learning objectives"],
  ["definition", "Pengertian"],
  ["why", "Mengapa penting?"],
  ["when", "Kapan digunakan?"],
  ["analogy", "Analogi"],
  ["syntax", "Sintaks dasar"],
  ["examples", "Contoh kode bertahap"],
  ["params", "Fungsi & parameter"],
  ["io", "Input & output"],
  ["visual", "Visualisasi"],
  ["tryit", "Try It Yourself"],
  ["mistakes", "Kesalahan pemula"],
  ["best", "Best practices"],
  ["exercises", "Latihan coding"],
  ["quiz", "Kuis pemahaman"],
  ["challenge", "Mini challenge"],
  ["summary", "Ringkasan"],
  ["cheatsheet", "Cheat sheet"],
  ["references", "Referensi resmi"],
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

function LessonContent({ lesson }: { lesson: Lesson }) {
  const meta = getLessonMeta(lesson.id)!;
  const mod = getModule(meta.moduleId)!;
  const s = useStore((x) => x);
  const { prev, next } = neighbors(lesson.id);
  const [external, setExternal] = useState<{ code: string; nonce: number } | undefined>();
  const completed = !!s.completedLessons[lesson.id];
  const bookmarked = s.bookmarks.includes(lesson.id);
  const Visual = lesson.visual ? VISUALS[lesson.visual] : undefined;
  const tocIds = useMemo(() => TOC.filter(([id]) => (id === "params" ? !!lesson.params : id === "io" ? !!lesson.io : id === "visual" ? !!Visual : true)), [lesson, Visual]);
  const active = useActiveSection(useMemo(() => tocIds.map(([id]) => id), [tocIds]));
  useEffect(() => visitLesson(lesson.id, lesson.title), [lesson.id, lesson.title]);

  const exIds = [...lesson.exercises.map((e) => e.id), lesson.challenge.id];
  const solvedCount = exIds.filter((id) => s.solved[id]).length;
  const quizBest = Math.max(0, ...(s.quizResults[lesson.id] ?? []).map((r) => r.score));
  const sectionNo = (id: string) => tocIds.findIndex(([x]) => x === id) + 1;
  const tryAt = (code: string) => {
    setExternal({ code, nonce: Date.now() });
    document.getElementById("tryit")?.scrollIntoView({ behavior: "smooth" });
  };

  const byLevel = ([3, 4, 5] as LearningLevel[]).map((lv) => ({ lv, items: lesson.exercises.filter((e) => e.level === lv) }));

  return (
    <div className="flex gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <article className="min-w-0 max-w-3xl flex-1" data-testid="lesson-article">
        <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link to="/learn" className="hover:underline">Learn</Link> <span>/</span>
          <Link to={`/learn#${mod.id}`} className="hover:underline">Module {mod.number} — {mod.title}</Link> <span>/</span>
          <span className="text-slate-700 dark:text-slate-300">{lesson.title}</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="badge badge-brand">{DIFFICULTY_LABEL[meta.difficulty]}</span>
          <span className="flex items-center gap-1 text-slate-500"><Clock size={14} /> ±{lesson.minutes} menit</span>
          <button type="button" className="btn-ghost" onClick={() => toggleBookmark(lesson.id)} data-testid="bookmark-btn">
            {bookmarked ? <BookmarkCheck size={15} className="text-brand-600" /> : <Bookmark size={15} />} {bookmarked ? "Tersimpan" : "Bookmark"}
          </button>
          <button type="button" className={completed ? "btn-outline" : "btn-primary"} onClick={() => setLessonComplete(lesson.id, lesson.title, !completed)} data-testid="complete-btn">
            <CheckCircle2 size={15} /> {completed ? "Selesai ✓ (batalkan)" : "Mark as Complete"}
          </button>
        </div>
        {lesson.prerequisites && lesson.prerequisites.length > 0 && (
          <div className="mt-3 text-sm text-slate-500">
            Prasyarat:{" "}
            {lesson.prerequisites.map((p, i) => (
              <span key={p}>
                {i > 0 && ", "}
                <Link to={`/learn/${p}`} className="underline">{getLessonMeta(p)?.title ?? p}</Link>
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100">
          <b>Alur belajar 5 level:</b> Level 1 <i>Understand</i> (bagian 1–6) → Level 2 <i>Follow</i> (contoh & editor) → Level 3 <i>Complete</i> → Level 4 <i>Build</i> → Level 5 <i>Apply</i>. Bantuan berkurang di setiap level.
        </div>

        <Section id="objectives" n={sectionNo("objectives")} title="Learning objectives">
          <ul className="space-y-2">
            {lesson.objectives.map((o, i) => (
              <li key={i} className="flex gap-2">
                <Target size={16} className="mt-1 shrink-0 text-brand-600" /> <Markdown md={o} className="inline" />
              </li>
            ))}
          </ul>
        </Section>
        <Section id="definition" n={sectionNo("definition")} title="Pengertian" level={1}>
          <Markdown md={lesson.definition} />
        </Section>
        <Section id="why" n={sectionNo("why")} title="Mengapa materi ini penting?" level={1}>
          <Markdown md={lesson.why} />
        </Section>
        <Section id="when" n={sectionNo("when")} title="Kapan digunakan?" level={1}>
          <Markdown md={lesson.when} />
        </Section>
        <Section id="analogy" n={sectionNo("analogy")} title="Analogi kehidupan sehari-hari" level={1}>
          <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-1 dark:bg-amber-950/30">
            <Markdown md={lesson.analogy} />
          </div>
        </Section>
        <Section id="syntax" n={sectionNo("syntax")} title="Sintaks dasar" level={1}>
          <CodeBlock code={lesson.syntax.code} title="Pola sintaks" />
          {lesson.syntax.note && <Markdown md={lesson.syntax.note} className="text-sm" />}
          {lesson.anatomy && (
            <>
              <h3 className="mb-2 mt-4 font-semibold">Kamus sintaks — arti setiap bagian</h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm">
                  <tbody>
                    {lesson.anatomy.map(([tok, mean], i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                        <td className="whitespace-nowrap px-3 py-2 align-top"><code className="inline-code">{tok}</code></td>
                        <td className="px-3 py-2"><Markdown md={mean} className="inline" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Section>

        <Section id="examples" n={sectionNo("examples")} title="Contoh kode bertahap & penjelasan baris demi baris" level={2}>
          <div className="space-y-8">
            {lesson.examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800" data-testid="example">
                <h3 className="font-semibold">{ex.title}</h3>
                {ex.change && (
                  <div className="mt-2 flex gap-2 rounded-md bg-violet-50 p-2 text-sm text-violet-900 dark:bg-violet-950/30 dark:text-violet-100">
                    <ArrowRight size={15} className="mt-0.5 shrink-0" /> <span><b>Apa yang berubah:</b> <Markdown md={ex.change} className="inline" /></span>
                  </div>
                )}
                <Markdown md={ex.intro} />
                <CodeBlock code={ex.code} onTry={() => tryAt(ex.code)} />
                {ex.output !== undefined && <CodeBlock code={ex.output || "(tidak ada output)"} lang="text" title="Output" lineNumbers={false} />}
                {ex.expectError && <div className="text-sm text-red-600 dark:text-red-400">Contoh ini sengaja menghasilkan <code className="inline-code">{ex.expectError}</code>.</div>}
                {ex.figure && <div className="text-sm text-slate-500">Contoh ini menghasilkan grafik — tekan <b>Coba di Editor</b> lalu Run untuk melihatnya.</div>}
                <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800/60">
                      <tr><th className="px-3 py-2">Kode</th><th className="px-3 py-2">Penjelasan</th></tr>
                    </thead>
                    <tbody>
                      {ex.explain.map(([c, e], j) => (
                        <tr key={j} className="border-t border-slate-100 dark:border-slate-800">
                          <td className="px-3 py-2 align-top"><code className="whitespace-pre font-mono text-[12.5px] text-pink-700 dark:text-pink-300">{c}</code></td>
                          <td className="px-3 py-2"><Markdown md={e} className="inline" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {lesson.params && (
          <Section id="params" n={sectionNo("params")} title="Penjelasan fungsi & parameter penting" level={2}>
            {lesson.params.map((g, i) => (
              <div key={i} className="mb-4">
                <h3 className="mb-2 font-semibold">{g.title}</h3>
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800/60">
                      <tr><th className="px-3 py-2">Parameter</th><th className="px-3 py-2">Tipe</th><th className="px-3 py-2">Default</th><th className="px-3 py-2">Kegunaan</th></tr>
                    </thead>
                    <tbody>
                      {g.items.map((p) => (
                        <tr key={p.name} className="border-t border-slate-100 dark:border-slate-800">
                          <td className="px-3 py-2 align-top"><code className="inline-code">{p.name}</code></td>
                          <td className="px-3 py-2 align-top text-xs">{p.type ?? "—"}</td>
                          <td className="px-3 py-2 align-top font-mono text-xs">{p.default ?? "—"}</td>
                          <td className="px-3 py-2"><Markdown md={p.desc} className="inline" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </Section>
        )}

        {lesson.io && (
          <Section id="io" n={sectionNo("io")} title="Contoh input dan output" level={2}>
            <div className="grid gap-3 md:grid-cols-2">
              <div><div className="text-xs font-semibold uppercase text-slate-500">Input (kode)</div><CodeBlock code={lesson.io.input} /></div>
              <div><div className="text-xs font-semibold uppercase text-slate-500">Output</div><CodeBlock code={lesson.io.output} lang="text" title="Output" lineNumbers={false} /></div>
            </div>
            {lesson.io.note && <Markdown md={lesson.io.note} className="text-sm" />}
          </Section>
        )}

        {Visual && (
          <Section id="visual" n={sectionNo("visual")} title="Visualisasi interaktif" level={2}>
            <Visual />
          </Section>
        )}

        <Section id="tryit" n={sectionNo("tryit")} title="Interactive Code Editor — Try It Yourself" level={2}>
          <p className="text-sm text-slate-500">Python sungguhan berjalan di browser (Pyodide). Ubah kode, tekan <b>Run</b> atau <kbd>Ctrl</kbd>+<kbd>Enter</kbd>. Klik <b>Coba di Editor</b> pada contoh di atas untuk memuat contoh ke sini. Kode tersimpan otomatis.</p>
          <TryIt initialCode={lesson.tryIt} storageKey={`try:${lesson.id}`} filename={`${lesson.id}.py`} external={external} />
        </Section>

        <Section id="mistakes" n={sectionNo("mistakes")} title="Kesalahan yang sering dilakukan pemula">
          <div className="space-y-4">
            {lesson.mistakes.map((m, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <h3 className="flex items-center gap-2 font-semibold"><AlertTriangle size={16} className="text-amber-500" /> {m.title}</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="mt-2 text-xs font-semibold uppercase text-red-600">✗ Salah{m.error ? ` → ${m.error}` : ""}</div>
                    <CodeBlock code={m.wrong} />
                  </div>
                  <div>
                    <div className="mt-2 text-xs font-semibold uppercase text-emerald-600">✓ Benar</div>
                    <CodeBlock code={m.fix} />
                  </div>
                </div>
                <Markdown md={m.explain} className="text-sm" />
              </div>
            ))}
          </div>
        </Section>

        <Section id="best" n={sectionNo("best")} title="Best practices">
          <ul className="space-y-2">
            {lesson.bestPractices.map((b, i) => (
              <li key={i} className="flex gap-2"><Lightbulb size={16} className="mt-1 shrink-0 text-brand-600" /> <Markdown md={b} className="inline" /></li>
            ))}
          </ul>
        </Section>

        <Section id="exercises" n={sectionNo("exercises")} title="Latihan coding">
          <p className="text-sm text-slate-500">Jawaban dinilai dengan <b>menjalankan kode dan test case</b> — solusi alternatif yang benar tetap diterima. Hint dibuka bertahap; solusi terbuka setelah 3 hint atau 2 kali mencoba.</p>
          {byLevel.map(({ lv, items }) =>
            items.length ? (
              <div key={lv} className="mt-5">
                <h3 className="mb-2 flex items-center gap-2 font-semibold"><LevelTag level={lv} /> {LEVEL_INFO[lv].desc}</h3>
                <div className="space-y-4">
                  {items.map((e) => <ExerciseView key={e.id} ex={e} lessonId={lesson.id} />)}
                </div>
              </div>
            ) : null,
          )}
        </Section>

        <Section id="quiz" n={sectionNo("quiz")} title="Kuis pemahaman">
          <LessonQuiz lessonId={lesson.id} title={lesson.title} questions={lesson.quiz} />
        </Section>

        <Section id="challenge" n={sectionNo("challenge")} title="Mini challenge" level={5}>
          <ExerciseView ex={lesson.challenge} lessonId={lesson.id} itemKind="challenge" />
        </Section>

        <Section id="summary" n={sectionNo("summary")} title="Ringkasan materi">
          <ul className="space-y-1.5 rounded-xl bg-brand-50 p-4 dark:bg-brand-950/30">
            {lesson.summary.map((x, i) => (
              <li key={i} className="flex gap-2"><CheckCircle2 size={16} className="mt-1 shrink-0 text-brand-600" /> <Markdown md={x} className="inline" /></li>
            ))}
          </ul>
        </Section>

        <Section id="cheatsheet" n={sectionNo("cheatsheet")} title="Cheat sheet sintaks">
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <tbody>
                {lesson.cheatsheet.map((c, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-3 py-2 align-top"><pre className="whitespace-pre font-mono text-[12.5px] text-pink-700 dark:text-pink-300">{c.syntax}</pre></td>
                    <td className="px-3 py-2">{c.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="references" n={sectionNo("references")} title="Referensi resmi">
          <p className="mb-3 text-sm text-slate-500">Materi disusun ulang dalam bahasa Indonesia berdasarkan sumber berikut. Buka sumber asli untuk pendalaman.</p>
          <ReferenceList refs={lesson.references} />
        </Section>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          {prev ? (
            <Link to={`/learn/${prev.id}`} className="btn-outline"><ArrowLeft size={15} /> {prev.title}</Link>
          ) : <span />}
          <button type="button" className={completed ? "btn-outline" : "btn-primary"} onClick={() => setLessonComplete(lesson.id, lesson.title, !completed)}>
            <CheckCircle2 size={15} /> {completed ? "Selesai ✓" : "Mark as Complete"}
          </button>
          {next ? (
            <Link to={`/learn/${next.id}`} className="btn-outline" data-testid="next-lesson">{next.title} {!isAvailable(next.id) && <Lock size={12} />} <ArrowRight size={15} /></Link>
          ) : <span />}
        </div>
      </article>

      <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-60 shrink-0 overflow-y-auto text-sm xl:block" aria-label="Daftar isi">
        <div className="card p-3">
          <div className="text-xs font-semibold uppercase text-slate-400">Lesson progress</div>
          <div className="mt-2 flex items-center justify-between text-xs"><span>Latihan & challenge</span><b>{solvedCount}/{exIds.length}</b></div>
          <div className="progress mt-1"><div style={{ width: `${(solvedCount / exIds.length) * 100}%` }} /></div>
          <div className="mt-2 flex items-center justify-between text-xs"><span>Skor kuis terbaik</span><b>{s.quizResults[lesson.id]?.length ? `${quizBest}/5` : "—"}</b></div>
          <div className="mt-2 flex items-center justify-between text-xs"><span>Estimasi waktu</span><b>±{lesson.minutes} mnt</b></div>
          <div className="mt-2 flex items-center justify-between text-xs"><span>Status</span><b>{completed ? "Selesai" : "Belum selesai"}</b></div>
        </div>
        <div className="mt-3 card p-3">
          <div className="mb-1 text-xs font-semibold uppercase text-slate-400">Table of contents</div>
          <ul className="space-y-0.5">
            {tocIds.map(([id, label], i) => (
              <li key={id}>
                <a href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }} className={`block rounded px-2 py-0.5 text-[13px] ${active === id ? "bg-brand-50 font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}>
                  {i + 1}. {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-3 card p-3">
          <div className="mb-1 text-xs font-semibold uppercase text-slate-400">Quick reference</div>
          {lesson.cheatsheet.slice(0, 4).map((c, i) => (
            <div key={i} className="mb-1.5"><pre className="whitespace-pre-wrap font-mono text-[11.5px] text-pink-700 dark:text-pink-300">{c.syntax}</pre><div className="text-[11.5px] text-slate-500">{c.desc}</div></div>
          ))}
        </div>
        <div className="mt-3 card p-3">
          <div className="mb-1 text-xs font-semibold uppercase text-slate-400">Related lessons</div>
          {[prev, next].filter(Boolean).map((l) => (
            <Link key={l!.id} to={`/learn/${l!.id}`} className="block py-0.5 text-[13px] text-brand-700 hover:underline dark:text-brand-400">{l!.title}{!isAvailable(l!.id) && " (belum tersedia)"}</Link>
          ))}
        </div>
      </aside>
    </div>
  );
}

function PlannedLesson({ id }: { id: string }) {
  const meta = getLessonMeta(id);
  if (!meta) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Materi tidak ditemukan</h1>
        <Link to="/learn" className="btn-primary mt-4">Kembali ke kurikulum</Link>
      </div>
    );
  }
  const mod = getModule(meta.moduleId)!;
  const { prev, next } = neighbors(id);
  const refs = MODULE_REFERENCES[mod.id] ?? [];
  return (
    <div className="max-w-3xl px-4 py-8 sm:px-8" data-testid="planned-lesson">
      <nav className="mb-3 text-xs text-slate-500"><Link to="/learn" className="hover:underline">Learn</Link> / Module {mod.number} — {mod.title}</nav>
      <h1 className="text-3xl font-bold">{meta.title}</h1>
      <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
        <div className="flex items-center gap-2 font-semibold"><Lock size={16} /> Materi ini belum tersedia</div>
        <p className="mt-1 text-sm">
          Subbab ini dijadwalkan pada <b>Fase {mod.phase}</b> pengembangan. Sesuai standar ML Academy, sebuah subbab baru ditandai tersedia setelah memiliki penjelasan mendalam, 3–5 contoh kode yang telah diuji, 5 latihan coding, 5 soal kuis, mini challenge, ringkasan, dan referensi. Kami tidak menampilkan materi setengah jadi.
        </p>
      </div>
      <h2 className="mt-6 text-lg font-semibold">Tentang modul ini</h2>
      <p className="mt-1">{mod.description}</p>
      <p className="mt-2 text-sm text-slate-500">Tingkat: {DIFFICULTY_LABEL[meta.difficulty]}</p>
      {refs.length > 0 && (
        <>
          <h2 className="mb-2 mt-6 text-lg font-semibold">Sementara itu, pelajari dari sumber resmi</h2>
          <ReferenceList refs={refs} />
        </>
      )}
      <div className="mt-8 flex justify-between gap-2">
        {prev ? <Link to={`/learn/${prev.id}`} className="btn-outline"><ArrowLeft size={15} /> {prev.title}</Link> : <span />}
        {next ? <Link to={`/learn/${next.id}`} className="btn-outline">{next.title} <ArrowRight size={15} /></Link> : <span />}
      </div>
    </div>
  );
}

export default function LessonPage() {
  const { lessonId = "" } = useParams();
  const lesson = LESSONS[lessonId];
  return lesson ? <LessonContent key={lesson.id} lesson={lesson} /> : <PlannedLesson id={lessonId} />;
}
