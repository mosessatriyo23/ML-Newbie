import { Award, BookMarked, BookOpen, CalendarCheck, Flame, GraduationCap, History, PlayCircle, Target, TrendingDown, TrendingUp, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { lessonTitle } from "../components/Exercise";
import { LESSONS } from "../content";
import { SKILL_LABEL } from "../curriculum/curriculum";
import { overview, recommendedNext, skillMastery, topicStatus, weekActivity } from "../engine/analytics";
import { dailyChallenge } from "../engine/daily";
import { todayStr, useStore } from "../engine/store";

function Stat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="stat">
      <div className="flex items-center gap-2 text-slate-400">{icon}<span className="stat-label">{label}</span></div>
      <div className="stat-value">{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const s = useStore((x) => x);
  const o = overview(s);
  const week = weekActivity(s);
  const maxMin = Math.max(s.prefs.dailyTargetMin, ...week.map((d) => d.minutes), 1);
  const today = week[week.length - 1];
  const mastery = skillMastery(s);
  const topics = topicStatus(s);
  const next = recommendedNext(s);
  const daily = dailyChallenge(s, todayStr());
  const dailyDone = s.daily[todayStr()]?.solved;
  const cont = s.lastLesson && LESSONS[s.lastLesson] ? s.lastLesson : next;
  const isNew = Object.keys(s.visited).length === 0;
  const hour = new Date().getHours();
  const greet = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 19 ? "Selamat sore" : "Selamat malam";
  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6" data-testid="dashboard">
      <section className="card overflow-hidden">
        <div className="flex flex-col gap-4 bg-gradient-to-br from-brand-600 to-emerald-800 p-6 text-white md:flex-row md:items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{greet}{s.prefs.userName ? `, ${s.prefs.userName}` : ""}! 👋</h1>
            <p className="mt-1 text-emerald-50">
              {isNew ? "Selamat datang di ML Academy. Mulai dari tes diagnostik untuk mengetahui titik awal belajarmu, atau langsung mulai Module 01." : "Lanjutkan perjalananmu menjadi Machine Learning Engineer. Konsisten sedikit setiap hari lebih baik daripada banyak sekali-sekali."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {cont && (
              <Link to={`/learn/${cont}`} className="btn bg-white text-brand-800 hover:bg-emerald-50" data-testid="continue-learning">
                <PlayCircle size={16} /> {isNew ? "Mulai Belajar" : "Continue Learning"}: {lessonTitle(cont)}
              </Link>
            )}
            {!s.diagnostic && (
              <Link to="/assessments/diagnostic" className="btn border border-white/50 text-white hover:bg-white/10">
                <GraduationCap size={16} /> Tes Diagnostik
              </Link>
            )}
          </div>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-3">
          <div>
            <div className="flex justify-between text-sm"><span className="font-medium">Overall learning progress</span><b>{pct(o.completedLessons, o.totalLessons)}%</b></div>
            <div className="progress mt-1.5"><div style={{ width: `${pct(o.completedLessons, o.totalLessons)}%` }} /></div>
            <div className="mt-1 text-xs text-slate-500">{o.completedLessons} dari {o.totalLessons} subbab kurikulum selesai · {o.availableLessons} subbab sudah tersedia</div>
          </div>
          <div>
            <div className="flex justify-between text-sm"><span className="font-medium">Target belajar hari ini</span><b>{today.minutes}/{s.prefs.dailyTargetMin} menit</b></div>
            <div className="progress mt-1.5"><div style={{ width: `${Math.min(100, pct(today.minutes, s.prefs.dailyTargetMin))}%` }} /></div>
            <div className="mt-1 text-xs text-slate-500">Waktu dihitung saat halaman aktif. Ubah target di <Link to="/settings" className="underline">Settings</Link>.</div>
          </div>
          <div>
            <div className="flex justify-between text-sm"><span className="font-medium">Recommended next lesson</span></div>
            {next ? <Link to={`/learn/${next}`} className="mt-1 block font-semibold text-brand-700 hover:underline dark:text-brand-400">{lessonTitle(next)} →</Link> : <div className="mt-1 text-sm text-slate-500">Semua materi yang tersedia sudah selesai. Kerjakan ujian modul!</div>}
            {s.diagnostic && <div className="mt-1 text-xs text-slate-500">Hasil diagnostik: {s.diagnostic.recommendation}</div>}
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Stat icon={<BookOpen size={16} />} label="Lessons" value={`${o.completedLessons}`} sub={`selesai dari ${o.availableLessons} tersedia`} />
        <Stat icon={<Award size={16} />} label="Modules" value={`${o.completedModules}/${o.totalModules}`} sub="modul tuntas" />
        <Stat icon={<Zap size={16} />} label="Exercises" value={`${o.exercisesSolved}`} sub={`latihan kode terselesaikan dari ${o.totalExercises}`} />
        <Stat icon={<Target size={16} />} label="Quiz accuracy" value={o.quizAccuracy === null ? "—" : `${o.quizAccuracy}%`} sub={o.quizTotal ? `${o.quizTotal} jawaban` : "belum ada kuis"} />
        <Stat icon={<Trophy size={16} />} label="Exam avg" value={o.examAvg === null ? "—" : `${o.examAvg}%`} sub={`${s.exams.length} ujian`} />
        <Stat icon={<Flame size={16} />} label="Streak" value={`${o.streak} hari`} sub="belajar berturut-turut" />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <h2 className="font-semibold">Weekly learning activity</h2>
          <div className="mt-4 flex h-40 gap-2" role="img" aria-label="Grafik menit belajar 7 hari terakhir">
            {week.map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[11px] text-slate-500">{d.minutes}m</span>
                <div className="relative flex w-full flex-1 items-end">
                  <div className="absolute inset-x-0 border-t border-dashed border-amber-400" style={{ bottom: `${(s.prefs.dailyTargetMin / maxMin) * 100}%` }} />
                  <div className={`w-full rounded-t ${d.date === today.date ? "bg-brand-500" : "bg-brand-300 dark:bg-brand-700"}`} style={{ height: `${Math.max(2, (d.minutes / maxMin) * 100)}%` }} title={`${d.minutes} menit, ${d.actions} aktivitas`} />
                </div>
                <span className="text-xs text-slate-500">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-500">Garis putus-putus = target harian ({s.prefs.dailyTargetMin} menit).</div>
        </section>

        <section className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><CalendarCheck size={17} /> Daily challenge</h2>
          {daily ? (
            <>
              <div className="mt-2 text-sm font-medium">{daily.title}</div>
              <div className="text-xs text-slate-500">dari: {lessonTitle(daily.lessonId)}</div>
              <div className="mt-3">{dailyDone ? <span className="badge badge-brand">✓ Selesai hari ini</span> : <span className="badge badge-amber">Belum dikerjakan</span>}</div>
              <Link to="/practice/daily" className="btn-primary mt-3">{dailyDone ? "Lihat" : "Kerjakan sekarang"}</Link>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-500">Mulai satu lesson untuk membuka daily challenge.</p>
          )}
        </section>
      </div>

      <section className="card mt-6 p-5">
        <h2 className="font-semibold">Skill mastery</h2>
        <p className="text-xs text-slate-500">Penguasaan = jumlah latihan/kuis yang jawaban terakhirnya benar ÷ seluruh latihan/kuis tersedia pada bidang itu. Akurasi = jawaban benar ÷ seluruh percobaan. Tidak ada skor yang dibuat acak.</p>
        <div className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
          {mastery.map((m) => (
            <div key={m.skill} data-testid={`mastery-${m.skill}`}>
              <div className="flex justify-between text-sm">
                <span className="font-medium">{SKILL_LABEL[m.skill]}</span>
                <span className="text-slate-500">
                  {m.percent === null ? "Materi belum tersedia" : m.attempted === 0 ? "Belum ada data" : `${m.percent}% · akurasi ${m.accuracy}% · ${m.mastered}/${m.available} item`}
                </span>
              </div>
              <div className="progress mt-1"><div style={{ width: `${m.percent ?? 0}%` }} /></div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><TrendingDown size={17} className="text-red-500" /> Weak topics</h2>
          {topics.weak.length === 0 ? <p className="mt-2 text-sm text-slate-500">Belum ada topik lemah terdeteksi (butuh minimal 3 percobaan per topik).</p> : (
            <ul className="mt-2 space-y-1 text-sm">
              {topics.weak.map((w) => <li key={w.lessonId}><Link className="font-medium text-brand-700 hover:underline dark:text-brand-400" to={`/learn/${w.lessonId}`}>{lessonTitle(w.lessonId)}</Link> <span className="text-xs text-slate-500">— {w.reason}</span></li>)}
            </ul>
          )}
          {Object.values(s.errors).some((e) => e.status === "open") && <Link to="/practice/errors" className="btn-outline mt-3">Retry Mistakes</Link>}
        </section>
        <section className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><TrendingUp size={17} className="text-brand-600" /> Mastered topics</h2>
          {topics.mastered.length === 0 ? <p className="mt-2 text-sm text-slate-500">Topik dianggap dikuasai bila lesson selesai dan ≥80% latihan/kuisnya terakhir dijawab benar.</p> : (
            <ul className="mt-2 space-y-1 text-sm">{topics.mastered.map((id) => <li key={id}>✓ {lessonTitle(id)}</li>)}</ul>
          )}
        </section>
        <section className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><BookMarked size={17} /> Bookmarked lessons</h2>
          {s.bookmarks.length === 0 ? <p className="mt-2 text-sm text-slate-500">Belum ada bookmark. Tekan tombol Bookmark di halaman materi.</p> : (
            <ul className="mt-2 space-y-1 text-sm">{s.bookmarks.map((id) => <li key={id}><Link className="text-brand-700 hover:underline dark:text-brand-400" to={`/learn/${id}`}>{lessonTitle(id)}</Link></li>)}</ul>
          )}
        </section>
      </div>

      <section className="card mt-6 p-5">
        <h2 className="flex items-center gap-2 font-semibold"><History size={17} /> Recent learning history</h2>
        {s.history.length === 0 ? <p className="mt-2 text-sm text-slate-500">Belum ada aktivitas. Riwayat akan muncul saat kamu membuka materi, menjawab kuis, atau mengerjakan latihan.</p> : (
          <ul className="mt-2 divide-y divide-slate-100 text-sm dark:divide-slate-800">
            {s.history.slice(0, 10).map((h, i) => (
              <li key={i} className="flex flex-wrap items-center gap-2 py-1.5">
                <span className="badge badge-slate">{h.type}</span>
                <span className="flex-1 truncate">{h.title}</span>
                {h.detail && <span className={`text-xs ${h.detail === "Salah" ? "text-red-500" : "text-slate-500"}`}>{h.detail}</span>}
                <span className="text-xs text-slate-400">{new Date(h.at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
