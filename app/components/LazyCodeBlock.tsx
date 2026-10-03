import { lazy, Suspense } from "react";

// highlight.js loads only once a snippet is shown; until then the plain code stands in.
const HighlightedCodeBlock = lazy(() => import("./CodeBlock").then(module => ({ default: module.CodeBlock })));
export function CodeBlock(props: { children: string; title: string }) {
  return <Suspense fallback={<div className="code-block"><div className="code-block-toolbar"><span>Kotlin</span></div><pre><code className="hljs">{props.children}</code></pre></div>}>
    <HighlightedCodeBlock {...props} />
  </Suspense>;
}
