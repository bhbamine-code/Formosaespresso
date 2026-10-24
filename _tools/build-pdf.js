/* Fiches techniques PDF (fr/en/ar) à partir des pages produits.  node _tools/build-pdf.js */
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, ".."), F = path.join(__dirname, "fonts");
const DIR = { fr: "produits", en: "en", ar: "ar" };
const css = [["Instrument Sans", "instrument-sans-latin", [400, 500, 600]], ["IBM Plex Sans Arabic", "ibm-plex-sans-arabic-arabic", [400, 500, 600]]]
  .flatMap(([fam, base, ws]) => ws.map(w => `@font-face{font-family:"${fam}";font-weight:${w};font-style:normal;src:url("file://${F}/${base}-${w}-normal.woff2") format("woff2")}`)).join("\n");
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ bypassCSP: true, colorScheme: "light" });
  let n = 0;
  for (const l of Object.keys(DIR)) {
    const out = path.join(ROOT, "fiches", l); fs.mkdirSync(out, { recursive: true });
    for (const f of fs.readdirSync(path.join(ROOT, DIR[l])).filter(x => /^(g|crm)[0-9a-z]+\.html$/.test(x))) {
      const p = await ctx.newPage();
      await p.route(/fonts\.googleapis\.com/, r => r.fulfill({ status: 200, contentType: "text/css", body: css }));
      await p.route(/^https?:\/\/(?!fonts\.googleapis)/, r => r.abort());
      await p.goto("file://" + path.join(ROOT, DIR[l], f), { waitUntil: "load" });
      await p.evaluate(() => document.fonts.ready);
      await p.emulateMedia({ media: "print" });
      await p.pdf({ path: path.join(out, f.replace(".html", ".pdf")), format: "A4", printBackground: true, preferCSSPageSize: true });
      await p.close(); n++;
    }
  }
  await b.close();
  console.log(`OK: ${n} fiches PDF`);
})();
