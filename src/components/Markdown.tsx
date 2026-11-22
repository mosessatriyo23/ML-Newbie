import { Fragment, type ReactNode } from "react";
import type { Md } from "../types";
import { CodeBlock } from "./CodeBlock";

// Renderer Markdown kecil (paragraf, list, kode inline, blok kode, tebal, miring, link).
// Konten berasal dari file materi kita sendiri, jadi tidak ada HTML mentah yang dirender.

function inline(text: string, keyBase = ""): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const k = `${keyBase}-${i++}`;
    if (tok.startsWith("`")) out.push(<code key={k} className="inline-code">{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("**")) out.push(<strong key={k} className="font-semibold text-slate-900 dark:text-slate-50">{inline(tok.slice(2, -2), k)}</strong>);
    else if (tok.startsWith("[")) {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!;
      const href = mm[2];
      const ext = /^https?:/.test(href);
      out.push(
        <a key={k} href={href} className="text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-600 dark:text-brand-400" {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}>
          {mm[1]}
        </a>,
      );
    } else out.push(<em key={k}>{inline(tok.slice(1, -1), k)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Inline({ text }: { text: string }) {
  return <>{inline(text)}</>;
}

function block(src: string, key: string): ReactNode {
  const fence = /^```(\w*)\n([\s\S]*?)\n?```$/.exec(src.trim());
  if (fence) return <CodeBlock key={key} code={fence[2]} lang={fence[1] || "text"} />;
  const lines = src.split("\n");
  if (lines.every((l) => /^\s*- /.test(l))) {
    return (
      <ul key={key} className="my-3 list-disc space-y-1.5 pl-6 marker:text-brand-500">
        {lines.map((l, i) => (
          <li key={i}>{inline(l.replace(/^\s*- /, ""), `${key}-${i}`)}</li>
        ))}
      </ul>
    );
  }
  if (lines.every((l) => /^\s*\d+\. /.test(l))) {
    return (
      <ol key={key} className="my-3 list-decimal space-y-1.5 pl-6 marker:font-semibold marker:text-brand-600">
        {lines.map((l, i) => (
          <li key={i}>{inline(l.replace(/^\s*\d+\. /, ""), `${key}-${i}`)}</li>
        ))}
      </ol>
    );
  }
  return (
    <p key={key} className="my-3 leading-relaxed">
      {lines.map((l, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {inline(l, `${key}-${i}`)}
        </Fragment>
      ))}
    </p>
  );
}

export function Markdown({ md, className = "" }: { md: Md | undefined; className?: string }) {
  if (!md) return null;
  const parts = Array.isArray(md) ? md : [md];
  const blocks: string[] = [];
  for (const p of parts) {
    // pisahkan berdasarkan baris kosong, tetapi jangan memecah blok kode ```
    let cur: string[] = [];
    let inFence = false;
    const flush = () => {
      if (cur.length) blocks.push(cur.join("\n"));
      cur = [];
    };
    for (const line of p.split("\n")) {
      if (line.trim().startsWith("```")) {
        if (!inFence) {
          flush();
          inFence = true;
          cur.push(line);
        } else {
          cur.push(line);
          inFence = false;
          flush();
        }
        continue;
      }
      if (!inFence && line.trim() === "") flush();
      else cur.push(line);
    }
    flush();
  }
  return <div className={`prose-ml ${className}`}>{blocks.map((b, i) => block(b, `b${i}`))}</div>;
}
