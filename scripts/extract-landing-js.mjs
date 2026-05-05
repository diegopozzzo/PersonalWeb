import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagePath = path.join(__dirname, "..", "src", "app", "page.tsx");
const s = fs.readFileSync(pagePath, "utf8");
const marker = "const LANDING_JS = `";
const idx = s.indexOf(marker);
if (idx === -1) {
  console.warn(
    "extract-landing-js: page.tsx no longer embeds `LANDING_JS`; keeping scripts/_extracted_landing_inner.txt unchanged. Regenerate composer input from Git history or paste the runtime into that file manually."
  );
  process.exit(0);
}
let i = idx + marker.length;
let exportIdx = s.indexOf("\nexport default function Page()", i);
if (exportIdx === -1) exportIdx = s.indexOf("\r\nexport default function Page()", i);
if (exportIdx === -1) throw new Error("export default not found");
const backtickClose = s.lastIndexOf("`", exportIdx - 1);
if (backtickClose <= i) throw new Error("closing backtick not found");
const inner = s.slice(i, backtickClose);
fs.writeFileSync(path.join(__dirname, "_extracted_landing_inner.txt"), inner);
console.log("wrote _extracted_landing_inner.txt bytes", inner.length);
