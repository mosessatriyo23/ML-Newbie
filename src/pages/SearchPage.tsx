import { Lock, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { mdToText } from "../components/Exercise";
import { LESSONS } from "../content";
import { CHEATSHEETS } from "../content/cheatsheets";
import { ALL_LESSON_META, getModule } from "../curriculum/curriculum";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const results = useMemo(() => {
    if (!query) return { lessons: [], cheats: [] };
    const terms = query.split(/\s+/);
    const lessons = ALL_LESSON_META.map((m) => {
      const l = LESSONS[m.id];
      const hay = [m.title, l ? [l.objectives.join(" "), mdToText(l.definition), l.cheatsheet.map((c) => c.syntax + " " + c.desc).join(" "), l.examples.map((e) => e.code).join(" ")].join(" ") : ""].join(" ").toLowerCase();
      const titleHit = terms.every((t) => m.title.toLowerCase().includes(t));
      const hit = terms.every((t) => hay.includes(t));
      return { m, l, score: titleHit ? 2 : hit ? 1 : 0 };
    })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || (b.l ? 1 : 0) - (a.l ? 1 : 0));
    const cheats = CHEATSHEETS.flatMap((c) => c.items.map((it) => ({ c, it }))).filter(({ it }) => terms.every((t) => [it.name, it.syntax, it.use].join(" ").toLowerCase().includes(t)));
    return { lessons, cheats };
  }, [query]);
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-3xl font-bold">Search</h1>
      <form className="relative mt-4" onSubmit={(e) => { e.preventDefault(); setParams({ q }); }} role="search">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari materi, sintaks, atau konsep…" autoFocus aria-label="Kata kunci" />
      </form>
      {query && (
        <>
          <h2 className="mt-6 font-semibold">Materi ({results.lessons.length})</h2>
          <ul className="mt-2 space-y-2">
            {results.lessons.map(({ m, l }) => (
              <li key={m.id} className="card p-3">
                <Link to={`/learn/${m.id}`} className="font-semibold text-brand-700 hover:underline dark:text-brand-400">{m.title}</Link>
                {!l && <span className="ml-2 badge badge-slate"><Lock size={10} /> belum tersedia</span>}
                <div className="text-xs text-slate-500">Module {getModule(m.moduleId)?.number} — {getModule(m.moduleId)?.title}</div>
                {l && <div className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{mdToText(l.definition).replace(/[*`]/g, "").slice(0, 180)}…</div>}
              </li>
            ))}
          </ul>
          <h2 className="mt-6 font-semibold">Cheat sheet ({results.cheats.length})</h2>
          <ul className="mt-2 space-y-2">
            {results.cheats.slice(0, 30).map(({ c, it }) => (
              <li key={c.id + it.name} className="card p-3 text-sm">
                <div className="font-semibold">{it.name} <span className="text-xs font-normal text-slate-500">· {c.title}</span></div>
                <pre className="mt-1 overflow-x-auto font-mono text-xs text-pink-700 dark:text-pink-300">{it.syntax}</pre>
                <div className="text-slate-500">{it.use}</div>
              </li>
            ))}
          </ul>
          {results.lessons.length + results.cheats.length === 0 && <p className="mt-4 text-slate-500">Tidak ada hasil untuk "{query}".</p>}
        </>
      )}
    </div>
  );
}
