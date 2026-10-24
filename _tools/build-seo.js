/* Génère les pages produits statiques (fr/en/ar), le sitemap et les liens du pied de page.
   À relancer après chaque modification des produits :  node _tools/build-seo.js
   (dossier _tools non publié par GitHub Pages) */
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, ".."), SITE = "https://formosaespresso.com";
const LANGS = ["fr", "en", "ar"];
const DIR = { fr: "produits", en: "en", ar: "ar" };
const UI = {
  fr: { home: "Accueil", range: "La gamme", others: "Autres modèles", all: "Voir toute la gamme", specs: "Caractéristiques", wa: "WhatsApp", yt: "Voir la vidéo", photo: "Photo" , lang: "Langue", contact: "Contact" },
  en: { home: "Home", range: "The range", others: "Other models", all: "See the full range", specs: "Specifications", wa: "WhatsApp", yt: "Watch the video", photo: "Photo", lang: "Language", contact: "Contact" },
  ar: { home: "الرئيسية", range: "التشكيلة", others: "طرازات أخرى", all: "عرض التشكيلة كاملة", specs: "المواصفات", wa: "واتساب", yt: "مشاهدة الفيديو", photo: "صورة", lang: "اللغة", contact: "اتصل بنا" }
};
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const home = l => "../" + (l === "fr" ? "" : "?lang=" + l);
const purl = (l, id) => `${SITE}/${DIR[l]}/${id}.html`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.route(/^https?:/, r => r.abort());
  await p.goto("file://" + ROOT + "/index.html");
  const data = {};
  for (const l of LANGS) {
    data[l] = await p.evaluate(l => {
      setLang(l, false);
      return {
        cfg: CONFIG,
        s: { price: t("sh.price"), quote: t("sh.quote"), note: t("range.note"), from: t("from"), legal1: t("ft.legal1"), legal2: t("ft.legal2"), title: t("metaTitle") },
        products: PRODUCTS.map(p => ({
          id: p.id, name: pname(p), short: short(p), type: t("type." + p.cat), kicker: T(p.kicker), tagline: T(p.tagline), desc: T(p.desc),
          range: range(p), low: p.price[0], high: p.price[1], from: money(p.price[0]),
          imgs: p.gallery ? p.gallery : [p.img.toLowerCase(), p.img.toLowerCase() + "-scene"],
          specs: p.specs.map(([k, v]) => [SPEC_LABELS[lang][k] || k, T(v)]),
          wa: t("msg.waQuote", { n: pname(p), p: range(p) }),
          video: (VIDEOS.find(v => v.product === p.id) || {}).id || null
        }))
      };
    }, l);
  }
  await b.close();

  const urls = [];
  for (const l of LANGS) {
    const D = data[l], u = UI[l], dir = path.join(ROOT, DIR[l]);
    fs.mkdirSync(dir, { recursive: true });
    for (const pr of D.products) {
      const alts = LANGS.map(x => `<link rel="alternate" hreflang="${x}" href="${purl(x, pr.id)}">`).join("\n") + `\n<link rel="alternate" hreflang="x-default" href="${purl("fr", pr.id)}">`;
      const title = `${pr.name} · ${pr.type} | Formosa Espresso`;
      const desc = `${pr.type} ${pr.name} : ${pr.tagline} ${pr.desc}`.replace(/\s+/g, " ").slice(0, 158);
      const ld = { "@context": "https://schema.org", "@graph": [
        { "@type": "Product", name: pr.name, sku: pr.id.toUpperCase(), brand: { "@type": "Brand", name: "Gemilai" }, category: pr.type,
          description: pr.desc, image: pr.imgs.map(i => `${SITE}/img/${i}.jpg`), url: purl(l, pr.id),
          offers: { "@type": "AggregateOffer", priceCurrency: "TND", lowPrice: pr.low, highPrice: pr.high, offerCount: 1,
            seller: { "@type": "Organization", name: "Formosa Espresso", url: SITE + "/" } } },
        { "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: u.home, item: SITE + "/" + (l === "fr" ? "" : "?lang=" + l) },
          { "@type": "ListItem", position: 2, name: u.range, item: SITE + "/" + (l === "fr" ? "" : "?lang=" + l) + "#gamme" },
          { "@type": "ListItem", position: 3, name: pr.name, item: purl(l, pr.id) } ] } ] };
      const others = D.products.filter(o => o.id !== pr.id);
      const html = `<!doctype html>
<html lang="${l}" dir="${l === "ar" ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://gc.zgo.at; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://i.ytimg.com https://formosaespresso.goatcounter.com; connect-src https://formsubmit.co https://formosaespresso.goatcounter.com; frame-src https://www.youtube-nocookie.com; form-action 'self' https://formsubmit.co; base-uri 'self'; object-src 'none'; upgrade-insecure-requests">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${purl(l, pr.id)}">
${alts}
<meta property="og:type" content="product">
<meta property="og:site_name" content="Formosa Espresso">
<meta property="og:url" content="${purl(l, pr.id)}">
<meta property="og:title" content="${esc(pr.name + " · " + pr.tagline)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/img/${pr.imgs[0]}.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#161616">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600${l === "ar" ? "&family=IBM+Plex+Sans+Arabic:wght@400;500;600" : ""}&display=swap">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>
:root{--ground:#fff;--panel:#F4F4F1;--ink:#161616;--muted:#666662;--line:#E3E3DE;--accent:#7A2E1F;--wa:#1F7A45;--font:"Instrument Sans",${l === "ar" ? '"IBM Plex Sans Arabic",' : ""}"Segoe UI",system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root{--ground:#111110;--panel:#1B1B19;--ink:#EDEDE8;--muted:#A3A39C;--line:#2C2C29;--accent:#D9826B}}
*{box-sizing:border-box}body{margin:0;background:var(--ground);color:var(--ink);font-family:var(--font);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit}img{max-width:100%;display:block}
.wrap{max-width:1180px;margin:0 auto;padding-inline:clamp(16px,4vw,40px)}
header{border-bottom:1px solid var(--line)}header .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:68px}
.logo{font-size:1.3rem;text-decoration:none;letter-spacing:-.02em}.logo b{font-weight:600}
.langs{display:flex;gap:4px}.langs a{padding:8px 10px;font-size:.85rem;text-decoration:none;border:1px solid var(--line);min-width:44px;text-align:center}.langs a[aria-current]{background:var(--ink);color:var(--ground);border-color:var(--ink)}
.crumbs{font-size:.85rem;color:var(--muted);margin:20px 0}.crumbs a{text-decoration:none}.crumbs a:hover{text-decoration:underline}
.pd{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:clamp(24px,5vw,64px);align-items:start;padding-bottom:56px}
@media (max-width:820px){.pd{grid-template-columns:1fr}}
.main{background:#F7F9F8;aspect-ratio:1;display:grid;place-items:center;overflow:hidden}.main img{width:100%;height:100%;object-fit:cover}
.thumbs{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}.thumbs button{padding:0;border:2px solid transparent;background:#F7F9F8;width:72px;height:72px;cursor:pointer}.thumbs button[aria-pressed=true]{border-color:var(--ink)}.thumbs img{width:100%;height:100%;object-fit:cover}
.label{font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
h1{font-size:clamp(2.2rem,5vw,3.6rem);line-height:1.05;letter-spacing:-.02em;font-weight:500;margin:8px 0 6px}
.tag{font-size:1.15rem;margin:0 0 14px}.desc{color:var(--muted);margin:0 0 22px}
.pr{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:16px 0;margin-bottom:18px}.pr small{display:block;color:var(--muted);font-size:.8rem}.pr b{font-size:1.6rem;font-weight:500}
.note{font-size:.8rem;color:var(--muted);margin:8px 0 0}
.ctas{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:28px}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;background:var(--ink);color:var(--ground);text-decoration:none;font-weight:600}.btn.wa{background:var(--wa);color:#fff}.btn.ghost{background:none;color:var(--ink);border:1px solid var(--ink)}
h2{font-size:1.3rem;font-weight:500;margin:0 0 10px}
table{width:100%;border-collapse:collapse;font-size:.95rem}th,td{text-align:start;padding:10px 0;border-bottom:1px solid var(--line);vertical-align:top}th{font-weight:500;color:var(--muted);width:42%;padding-inline-end:12px}
.others{background:var(--panel);padding:48px 0}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:16px;margin-top:18px}
.grid a{text-decoration:none;background:var(--ground);display:block}.grid img{aspect-ratio:1;object-fit:cover;width:100%;background:#F7F9F8}.grid span{display:block;padding:10px 12px 12px;font-weight:500}.grid small{display:block;color:var(--muted);font-weight:400}
.all{display:inline-block;margin-top:22px}
footer{background:#161616;color:#c9c9c2;font-size:.85rem;padding:28px 0}footer .wrap{display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:space-between}
bdi{unicode-bidi:isolate}
</style>
</head>
<body>
<header><div class="wrap"><a class="logo" href="${home(l)}" dir="ltr"><b>formosa</b> espresso</a>
<nav class="langs" aria-label="${u.lang}">${LANGS.map(x => `<a href="../${DIR[x]}/${pr.id}.html" hreflang="${x}" lang="${x}"${x === l ? ' aria-current="page"' : ""}>${{ fr: "FR", en: "EN", ar: "عربي" }[x]}</a>`).join("")}</nav></div></header>
<main class="wrap">
<nav class="crumbs" aria-label="breadcrumb"><a href="${home(l)}">${u.home}</a> / <a href="${home(l)}#gamme">${u.range}</a> / <span aria-current="page">${esc(pr.name)}</span></nav>
<div class="pd">
  <div>
    <div class="main"><img id="main" src="../img/${pr.imgs[0]}.jpg" alt="${esc(pr.name)}" width="800" height="800"></div>
    <div class="thumbs">${pr.imgs.map((im, i) => `<button type="button" data-src="../img/${im}.jpg" aria-pressed="${!i}" aria-label="${u.photo} ${i + 1}"><img src="../img/${im}.jpg" alt="" loading="lazy"></button>`).join("")}</div>
  </div>
  <div>
    <span class="label">${esc(pr.type)} · ${esc(pr.kicker)}</span>
    <h1>${esc(pr.name)}</h1>
    <p class="tag">${esc(pr.tagline)}</p>
    <p class="desc">${esc(pr.desc)}</p>
    <div class="pr"><small>${esc(D.s.price)}</small><b>${esc(pr.range)}</b><p class="note">${esc(D.s.note)}</p></div>
    <div class="ctas"><a class="btn" href="${home(l)}${l === "fr" ? "?" : "&"}devis=${pr.id}#contact">${esc(D.s.quote)}</a><a class="btn wa" href="https://wa.me/${D.cfg.whatsapp}?text=${encodeURIComponent(pr.wa)}" target="_blank" rel="noopener">${u.wa}</a>${pr.video ? `<a class="btn ghost" href="https://www.youtube.com/watch?v=${pr.video}" target="_blank" rel="noopener">▶ ${u.yt}</a>` : ""}</div>
    <h2>${u.specs}</h2>
    <table><tbody>${pr.specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody></table>
  </div>
</div>
</main>
<section class="others"><div class="wrap"><h2>${u.others}</h2>
<div class="grid">${others.map(o => `<a href="${o.id}.html"><img src="../img/${o.imgs[0]}.jpg" alt="" loading="lazy"><span>${esc(o.short)}<small>${esc(D.s.from)} ${esc(o.from)}</small></span></a>`).join("")}</div>
<a class="all" href="${home(l)}#gamme">${u.all} →</a></div></section>
<footer><div class="wrap"><span>${esc(D.s.legal1)}</span><span><bdi dir="ltr">${esc(D.cfg.email)}</bdi> · <bdi dir="ltr">${esc(D.cfg.phone)}</bdi></span><span>${esc(D.s.legal2)}</span></div></footer>
<script>document.querySelectorAll(".thumbs button").forEach(b=>b.addEventListener("click",()=>{document.getElementById("main").src=b.dataset.src;document.querySelectorAll(".thumbs button").forEach(x=>x.setAttribute("aria-pressed",x===b));}));</script>
<script data-goatcounter="https://formosaespresso.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
</body>
</html>
`;
      fs.writeFileSync(path.join(dir, pr.id + ".html"), html);
    }
  }

  /* sitemap */
  const today = new Date().toISOString().slice(0, 10);
  const homeUrl = l => SITE + "/" + (l === "fr" ? "" : "?lang=" + l);
  const entry = (loc, alts) => `  <url><loc>${loc.replace(/&/g, "&amp;")}</loc><lastmod>${today}</lastmod>\n${alts.map(([h, u]) => `    <xhtml:link rel="alternate" hreflang="${h}" href="${u.replace(/&/g, "&amp;")}"/>`).join("\n")}\n  </url>`;
  const homeAlts = [...LANGS.map(l => [l, homeUrl(l)]), ["x-default", homeUrl("fr")]];
  const items = LANGS.map(l => entry(homeUrl(l), homeAlts));
  for (const pr of data.fr.products) {
    const alts = [...LANGS.map(l => [l, purl(l, pr.id)]), ["x-default", purl("fr", pr.id)]];
    for (const l of LANGS) items.push(entry(purl(l, pr.id), alts));
  }
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${items.join("\n")}\n</urlset>\n`);

  /* liens statiques du pied de page (lisibles sans JavaScript) */
  const idx = path.join(ROOT, "index.html");
  let s = fs.readFileSync(idx, "utf8");
  const foot = data.fr.products.map(pr => `<li><a href="produits/${pr.id}.html" data-open="${pr.id}">${esc(pr.short)}</a></li>`).join("");
  s = s.replace(/<ul id="footList">[\s\S]*?<\/ul>/, `<ul id="footList">${foot}</ul>`);
  fs.writeFileSync(idx, s);
  console.log(`OK: ${LANGS.length * data.fr.products.length} pages produits, ${items.length} URLs dans le sitemap`);
})();
