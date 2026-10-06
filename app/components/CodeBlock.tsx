import { useEffect, useMemo, useState } from "react";
import hljs from "highlight.js/lib/core";
import type { HLJSApi, Language } from "highlight.js";
import kotlin from "highlight.js/lib/languages/kotlin";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml";

// The stock Kotlin grammar only colors keywords, strings, comments and numbers,
// leaving Compose calls and named arguments plain. Add IDE-like modes for them.
function kotlinWithCalls(api: HLJSApi): Language {
  const language = kotlin(api);
  const keywords = String((language.keywords as Record<string, unknown>).keyword ?? "")
    .split(/\s+/).filter(Boolean).join("|");
  language.contains = [
    ...(language.contains ?? []),
    { scope: "attr", match: /(?<=(?:^|[(,])\s*)[a-z][A-Za-z0-9_]*(?=\s*=(?!=))/ },
    { scope: "title.function", match: new RegExp(`\\b(?!(?:${keywords})\\b)[A-Za-z_][A-Za-z0-9_]*(?=\\s*[({])`) },
    { scope: "title.class", match: /\b[A-Z][A-Za-z0-9_]*\b/ },
  ];
  return language;
}

hljs.registerLanguage("kotlin", kotlinWithCalls);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("xml", xml);

export type CodeLanguage = "kotlin" | "bash" | "xml";
export const LANGUAGE_LABELS: Record<CodeLanguage, string> = { kotlin: "Kotlin", bash: "Shell", xml: "HTML" };

export function CodeBlock({ children, title, language = "kotlin" }: { children: string; title: string; language?: CodeLanguage }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const highlighted = useMemo(
    () => hljs.highlight(children, { language }).value,
    [children, language],
  );

  useEffect(() => {
    if (status !== "copied") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(children);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="code-block">
      <div className="code-block-toolbar">
        <span>{LANGUAGE_LABELS[language]}</span>
        <button type="button" onClick={copy} aria-label={`Copy ${title} code`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            {status === "copied" ? <path d="m5 12 4 4L19 6" /> : <>
              <rect x="8" y="8" width="12" height="12" rx="2" />
              <path d="M16 8V4H4v12h4" />
            </>}
          </svg>
          {status === "copied" ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre tabIndex={0} aria-label={`${title} — ${LANGUAGE_LABELS[language]} code`}>
        <code className={`hljs language-${language}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
      <p role="status" className={status === "error" ? "code-block-error" : "sr-only"}>
        {status === "copied" ? "Code copied to clipboard." : status === "error" ? "Could not copy. Select the code and copy it manually." : ""}
      </p>
    </div>
  );
}
