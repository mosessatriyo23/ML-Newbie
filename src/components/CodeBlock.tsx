import { classHighlighter, highlightCode } from "@lezer/highlight";
import { parser as pythonParser } from "@lezer/python";
import { Check, Copy, Play } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

export function highlightPython(code: string): ReactNode[] {
  const out: ReactNode[][] = [[]];
  let k = 0;
  const tree = pythonParser.parse(code);
  highlightCode(
    code,
    tree,
    classHighlighter,
    (text, classes) => {
      out[out.length - 1].push(
        classes ? (
          <span key={k++} className={classes}>
            {text}
          </span>
        ) : (
          text
        ),
      );
    },
    () => out.push([]),
  );
  return out.map((line, i) => (
    <span key={`l${i}`} className="code-line">
      {line.length ? line : " "}
    </span>
  ));
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyButton({ text, label = "Copy", className = "btn-ghost-sm" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }
      }}
      aria-label="Salin kode"
    >
      {done ? <Check size={14} /> : <Copy size={14} />}
      <span>{done ? "Tersalin" : label}</span>
    </button>
  );
}

export function CodeBlock({
  code,
  lang = "python",
  title,
  onTry,
  lineNumbers = true,
}: {
  code: string;
  lang?: string;
  title?: string;
  onTry?: () => void;
  lineNumbers?: boolean;
}) {
  const isPy = lang === "python" || lang === "py";
  const content = useMemo(
    () =>
      isPy
        ? highlightPython(code)
        : code.split("\n").map((l, i) => (
            <span key={i} className="code-line">
              {l || " "}
            </span>
          )),
    [code, isPy],
  );
  return (
    <div className="code-block group my-3">
      <div className="code-block-bar">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{title ?? (isPy ? "Python" : lang === "text" ? "Output" : lang)}</span>
        <div className="flex items-center gap-1">
          {onTry && (
            <button type="button" className="btn-ghost-sm text-brand-300 hover:text-brand-200" onClick={onTry}>
              <Play size={13} /> <span>Coba di Editor</span>
            </button>
          )}
          <CopyButton text={code} />
        </div>
      </div>
      <pre className={`code-pre ${lineNumbers && isPy ? "with-ln" : ""}`}>
        <code>{content}</code>
      </pre>
    </div>
  );
}
