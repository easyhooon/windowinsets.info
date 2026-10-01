import type { FormFactor } from "../data/types";

let pending: Promise<typeof import("./FoldRenderer3D")> | undefined;

/** One request for the three.js chunk, shared by React.lazy and link prefetch; a failure allows a retry. */
export function loadFoldRenderer() {
  return pending ??= import("./FoldRenderer3D").catch(error => { pending = undefined; throw error; });
}

/** Starts the 3D chunk download when a foldable link shows intent, unless the user asked to save data. */
export function prefetchFoldRenderer(formFactor: FormFactor) {
  if (!formFactor.startsWith("foldable")) return;
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
  loadFoldRenderer().catch(() => {});
}
