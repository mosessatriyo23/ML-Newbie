import { BrainCircuit, ChevronDown, ChevronRight, CircleCheck, Circle, CircleDashed, Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, Sun, X, Workflow, Settings } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { isAvailable, moduleAvailability } from "../content";
import { DIFFICULTY_LABEL, MODULES } from "../curriculum/curriculum";
import { addStudySeconds, setPrefs, useStore } from "../engine/store";
import { toggleTheme, useTheme } from "../engine/theme";

const NAV = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/learn", label: "Learn" },
  { to: "/workflow", label: "Workflow" },
  { to: "/practice", label: "Practice" },
  { to: "/playground", label: "Playground" },
  { to: "/projects", label: "Projects" },
  { to: "/assessments", label: "Assessments" },
  { to: "/cheatsheets", label: "Cheat Sheets" },
  { to: "/visual-lab", label: "Visual Lab" },
];

function useStudyTimer() {
  const loc = useLocation();
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible" && document.hasFocus()) addStudySeconds(30);
    }, 30000);
    return () => clearInterval(id);
  }, [loc.pathname]);
}

function SearchBox({ onDone }: { onDone?: () => void }) {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    nav(`/search?q=${encodeURIComponent(q.trim())}`);
    setQ("");
    onDone?.();
  };
  return (
    <form onSubmit={submit} role="search" className="relative">
      <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari materi, fungsi…" className="input h-9 w-full py-1 pl-8 lg:w-52" aria-label="Cari" data-testid="search-input" />
    </form>
  );
}

function TopNav({ onMenu }: { onMenu: () => void }) {
  const dark = useTheme();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-2 px-3 sm:px-4">
        <button type="button" className="icon-btn lg:hidden" onClick={onMenu} aria-label="Buka daftar materi">
          <PanelLeftOpen size={18} />
        </button>
        <Link to="/" className="flex shrink-0 items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
            <BrainCircuit size={18} />
          </span>
          <span className="hidden sm:inline">ML Academy</span>
        </Link>
        <nav className="ml-3 hidden items-center gap-0.5 xl:flex" aria-label="Navigasi utama">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="hidden md:block">
            <SearchBox />
          </div>
          <Link to="/search" className="icon-btn md:hidden" aria-label="Cari">
            <Search size={18} />
          </Link>
          <button type="button" className="icon-btn" onClick={toggleTheme} aria-label={dark ? "Mode terang" : "Mode gelap"} data-testid="theme-toggle">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/settings" className="icon-btn" aria-label="Settings">
            <Settings size={18} />
          </Link>
          <button type="button" className="icon-btn xl:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu navigasi" data-testid="nav-menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="grid grid-cols-2 gap-1 border-t border-slate-200 p-3 sm:grid-cols-3 xl:hidden dark:border-slate-800" aria-label="Navigasi utama (mobile)">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export function CurriculumSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const s = useStore((x) => x);
  const loc = useLocation();
  const currentId = loc.pathname.startsWith("/learn/") ? decodeURIComponent(loc.pathname.slice(7)) : "";
  const currentModule = MODULES.find((m) => m.lessons.some((l) => l.id === currentId))?.id;
  const [openMods, setOpenMods] = useState<Record<string, boolean>>(() => ({ [currentModule ?? "m01"]: true }));
  useEffect(() => {
    if (currentModule) setOpenMods((o) => ({ ...o, [currentModule]: true }));
  }, [currentModule]);
  const diff = s.prefs.difficulty;
  return (
    <nav className="space-y-1 p-3 text-sm" aria-label="Daftar modul">
      <Link to="/workflow" onClick={onNavigate} className={`mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 font-medium ${loc.pathname === "/workflow" ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
        <Workflow size={15} /> Machine Learning Workflow
      </Link>
      <div className="mb-2 flex items-center justify-between px-2 text-xs text-slate-500">
        <span>Mode: <b className="text-slate-700 dark:text-slate-200">{DIFFICULTY_LABEL[diff]}</b></span>
        <Link to="/settings" onClick={onNavigate} className="underline">ubah</Link>
      </div>
      {MODULES.map((m) => {
        const av = moduleAvailability(m);
        const done = m.lessons.filter((l) => s.completedLessons[l.id]).length;
        const open = openMods[m.id];
        return (
          <div key={m.id}>
            <button type="button" onClick={() => setOpenMods((o) => ({ ...o, [m.id]: !o[m.id] }))} className="flex w-full items-start gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800" aria-expanded={!!open}>
              {open ? <ChevronDown size={15} className="mt-0.5 shrink-0" /> : <ChevronRight size={15} className="mt-0.5 shrink-0" />}
              <span className="flex-1">
                <span className="block font-semibold text-slate-800 dark:text-slate-100">
                  <span className="text-slate-500 dark:text-slate-400">{m.number}</span> {m.title}
                </span>
                <span className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                  {av.avail === 0 ? (
                    <span className="badge badge-slate">materi sedang ditulis</span>
                  ) : (
                    <>
                      <span className="progress h-1.5 w-16"><div style={{ width: `${(done / m.lessons.length) * 100}%` }} /></span>
                      <span>{done}/{m.lessons.length} selesai</span>
                      {!av.complete && <span className="badge badge-amber">{av.avail}/{av.total} sudah ditulis</span>}
                    </>
                  )}
                </span>
              </span>
            </button>
            {open && (
              <ul className="mb-2 ml-4 border-l border-slate-200 pl-2 dark:border-slate-800">
                {m.lessons.map((l) => {
                  const avail = isAvailable(l.id);
                  const completed = !!s.completedLessons[l.id];
                  const active = currentId === l.id;
                  return (
                    <li key={l.id}>
                      <Link
                        to={`/learn/${l.id}`}
                        onClick={onNavigate}
                        className={`flex items-center gap-2 rounded-md px-2 py-1 ${active ? "bg-brand-700 font-medium text-white" : avail ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60"}`}
                        aria-current={active ? "page" : undefined}
                      >
                        {completed ? <CircleCheck size={14} className={active ? "text-white" : "text-brand-500"} /> : avail ? <Circle size={14} className="text-slate-500" /> : <CircleDashed size={14} className="text-slate-400" aria-label="sedang ditulis" />}
                        <span className="flex-1 truncate">{l.title}</span>
                        {l.difficulty !== "beginner" && <span className={`text-[10px] font-semibold uppercase ${active ? "text-white/90" : "text-violet-500"}`}>{l.difficulty === "intermediate" ? "INT" : "ADV"}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  useStudyTimer();
  const loc = useLocation();
  const collapsed = useStore((s) => s.prefs.sidebarCollapsed);
  const [drawer, setDrawer] = useState(false);
  const withSidebar = loc.pathname.startsWith("/learn") || loc.pathname === "/workflow";
  useEffect(() => {
    setDrawer(false);
    window.scrollTo({ top: 0 });
  }, [loc.pathname]);
  return (
    <div className="min-h-screen">
      <TopNav onMenu={() => setDrawer(true)} />
      <div className="mx-auto flex max-w-[1600px]">
        {withSidebar && !collapsed && (
          <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-950" data-testid="sidebar">
            <div className="flex items-center justify-between px-4 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Kurikulum
              <button type="button" className="icon-btn" onClick={() => setPrefs({ sidebarCollapsed: true })} aria-label="Sembunyikan sidebar">
                <PanelLeftClose size={16} />
              </button>
            </div>
            <CurriculumSidebar />
          </aside>
        )}
        {withSidebar && collapsed && (
          <button type="button" className="sticky top-16 ml-2 mt-2 hidden h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 lg:flex dark:border-slate-700 dark:bg-slate-900" onClick={() => setPrefs({ sidebarCollapsed: false })} aria-label="Tampilkan sidebar">
            <PanelLeftOpen size={16} />
          </button>
        )}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Daftar materi">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white shadow-xl dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <span className="font-semibold">Kurikulum</span>
              <button type="button" className="icon-btn" onClick={() => setDrawer(false)} aria-label="Tutup">
                <X size={18} />
              </button>
            </div>
            <div className="p-3 md:hidden">
              <SearchBox onDone={() => setDrawer(false)} />
            </div>
            <CurriculumSidebar onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}
      <footer className="mt-16 border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800">
        ML Academy — Learn, Code, and Master Machine Learning · Progres tersimpan di browser ini (localStorage) · Python berjalan di browser via Pyodide
      </footer>
    </div>
  );
}
