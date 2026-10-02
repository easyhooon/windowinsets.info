import { devices, SITE_URL } from "../data/devices";
import { createLlmsTxt } from "../data/llmsTxt";

export function loader() {
  return new Response(createLlmsTxt(devices, SITE_URL), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
