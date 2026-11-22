import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { bracketMatching, defaultHighlightStyle, foldGutter, indentOnInput, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers, placeholder as cmPlaceholder } from "@codemirror/view";
import { useEffect, useRef } from "react";
import { useTheme } from "../engine/theme";

export interface CodeEditorProps {
  value: string;
  onChange?: (v: string) => void;
  onRun?: () => void;
  minHeight?: number;
  maxHeight?: number;
  readOnly?: boolean;
  placeholder?: string;
  ariaLabel?: string;
}

const lightTheme = EditorView.theme({
  "&": { backgroundColor: "#ffffff", color: "#0f172a" },
  ".cm-gutters": { backgroundColor: "#f8fafc", color: "#94a3b8", borderRight: "1px solid #e2e8f0" },
  ".cm-activeLine": { backgroundColor: "#f0fdf4" },
  ".cm-activeLineGutter": { backgroundColor: "#dcfce7", color: "#047857" },
});

export function CodeEditor({ value, onChange, onRun, minHeight = 140, maxHeight = 520, readOnly = false, placeholder, ariaLabel = "Editor kode Python" }: CodeEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const themeComp = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  onChangeRef.current = onChange;
  onRunRef.current = onRun;
  const dark = useTheme();

  useEffect(() => {
    if (!host.current) return;
    const runKey = keymap.of([
      { key: "Mod-Enter", run: () => (onRunRef.current?.(), true) },
      { key: "Shift-Enter", run: () => (onRunRef.current?.(), true) },
    ]);
    const state = EditorState.create({
      doc: value,
      extensions: [
        runKey,
        lineNumbers(),
        highlightActiveLineGutter(),
        foldGutter(),
        history(),
        drawSelection(),
        indentOnInput(),
        indentUnit.of("    "),
        EditorState.tabSize.of(4),
        bracketMatching(),
        highlightActiveLine(),
        python(),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        EditorView.lineWrapping,
        EditorState.readOnly.of(readOnly),
        EditorView.contentAttributes.of({ "aria-label": ariaLabel, spellcheck: "false", autocapitalize: "off", autocorrect: "off" }),
        placeholder ? cmPlaceholder(placeholder) : [],
        themeComp.current.of(dark ? oneDark : [lightTheme, syntaxHighlighting(defaultHighlightStyle)]),
        EditorView.theme({
          "&": { fontSize: "14px" },
          ".cm-scroller": { fontFamily: "'JetBrains Mono', ui-monospace, monospace", minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px`, overflow: "auto", lineHeight: "1.6" },
          ".cm-content": { padding: "10px 0" },
          "&.cm-focused": { outline: "none" },
        }),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) onChangeRef.current?.(u.state.doc.toString());
        }),
      ],
    });
    const v = new EditorView({ state, parent: host.current });
    view.current = v;
    return () => {
      v.destroy();
      view.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sinkronisasi nilai dari luar (Reset, Show Solution, dll.)
  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
    }
  }, [value]);

  useEffect(() => {
    view.current?.dispatch({ effects: themeComp.current.reconfigure(dark ? oneDark : [lightTheme, syntaxHighlighting(defaultHighlightStyle)]) });
  }, [dark]);

  return <div ref={host} className="overflow-hidden rounded-b-lg border-t border-slate-200 dark:border-slate-700" data-testid="code-editor" />;
}
