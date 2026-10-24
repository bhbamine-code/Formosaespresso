/* Génère « À propos » et les articles « Conseils » (fr/en/ar) à partir de _tools/pages-content.js.
   À relancer après modification du contenu :  node _tools/build-pages.js && node _tools/build-seo.js */
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, ".."), SITE = "https://formosaespresso.com";
const PAGES = require("./pages-content.js");
const LANGS = ["fr", "en", "ar"];
const PDIR = { fr: "produits", en: "en", ar: "ar" };
const TODAY = new Date().toISOString().slice(0, 10);
const UI = {
  fr: { home: "Accueil", tips: "Conseils", about: "À propos", read: "À lire aussi", cta: "Un projet de café ?", ctaP: "Dites-nous votre volume et votre budget : nous vous proposons la machine adaptée, avec un prix ferme.", guide: "Trouver ma machine", quote: "Demander un devis", model: "Modèle", type: "Type", price: "Prix indicatif TTC", lang: "Langue", updated: "Mis à jour le" },
  en: { home: "Home", tips: "Guides", about: "About us", read: "Read next", cta: "Planning a café?", ctaP: "Tell us your volume and budget: we suggest the right machine, with a firm price.", guide: "Find my machine", quote: "Request a quote", model: "Model", type: "Type", price: "Indicative price incl. VAT", lang: "Language", updated: "Updated on" },
  ar: { home: "الرئيسية", tips: "نصائح", about: "من نحن", read: "اقرأ أيضًا", cta: "لديك مشروع مقهى؟", ctaP: "أخبرنا بعدد الفناجين وميزانيتك: نقترح عليك الآلة المناسبة بسعر نهائي.", guide: "اعثر على آلتي", quote: "اطلب عرض سعر", model: "الطراز", type: "النوع", price: "السعر التقديري بكل الأداءات", lang: "اللغة", updated: "آخر تحديث" }
};
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const rel = (from, to) => { const r = path.posix.relative(path.posix.dirname(from), to); return r || path.posix.basename(to); };
const homeHref = (from, l, hash) => { const up = rel(from, "index.html").replace(/index\.html$/, ""); return (up || "./") + (l === "fr" ? "" : "?lang=" + l) + (hash || ""); };
const HASH = { home: "#comparer", guide: "#guide", packs: "#packs", calc: "#rentabilite", sav: "#sav", contact: "#contact", academy: "#apprendre" };
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' https://gc.zgo.at; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://amineformosa.goatcounter.com; connect-src https://amineformosa.goatcounter.com; base-uri 'self'; object-src 'none'; upgrade-insecure-requests";

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.route(/^https?:/, r => r.abort());
  await p.goto("file://" + ROOT + "/index.html");
  const data = {};
  for (const l of LANGS) data[l] = await p.evaluate(l => { setLang(l, false); return { cfg: CONFIG, legal1: t("ft.legal1"), products: PRODUCTS.map(p => ({ id: p.id, name: pname(p), type: t("type." + p.cat), kicker: T(p.kicker), range: range(p) })) }; }, l);
  await b.close();

  for (const l of LANGS) {
    const u = UI[l], D = data[l];
    for (const pg of PAGES) {
      const cur = pg.path[l], A = rel(cur, "img/logo/mark-bold.svg").replace(/img\/logo\/mark-bold\.svg$/, "");
      const link = (txt, target) => {
        let href;
        if (HASH[target]) href = homeHref(cur, l, HASH[target]);
        else { const tp = PAGES.find(x => x.key === target); href = tp ? rel(cur, tp.path[l]) : "#"; }
        return `<a href="${esc(href)}">${esc(txt)}</a>`;
      };
      const inline = s => esc(s).replace(/\[([^\]]+)\]\(([a-z0-9]+)\)/g, (m, txt, tg) => link(txt.replace(/&amp;/g, "&").replace(/&quot;/g, '"'), tg));
      const priceTable = `<div class="tbl"><table><thead><tr><th>${u.model}</th><th>${u.type}</th><th>${u.price}</th></tr></thead><tbody>${D.products.map(pr => `<tr><td><a href="${esc(rel(cur, PDIR[l] + "/" + pr.id + ".html"))}">${esc(pr.name)}</a></td><td>${esc(pr.type)} · ${esc(pr.kicker)}</td><td class="num">${esc(pr.range)}</td></tr>`).join("")}</tbody></table></div>`;
      let html = "", list = [];
      const flush = () => { if (list.length) { html += `<ul>${list.map(x => `<li>${inline(x)}</li>`).join("")}</ul>`; list = []; } };
      for (const blk of pg.body[l]) {
        if (blk.startsWith("- ")) { list.push(blk.slice(2)); continue; }
        flush();
        if (blk.startsWith("## ")) html += `<h2>${esc(blk.slice(3))}</h2>`;
        else if (blk === "[[prices]]") html += priceTable;
        else html += `<p>${inline(blk)}</p>`;
      }
      flush();
      const title = pg.title[l], url = `${SITE}/${cur}`;
      const crumbs = [[u.home, homeHref(cur, l), SITE + "/" + (l === "fr" ? "" : "?lang=" + l)]];
      if (pg.type === "article") crumbs.push([u.tips, null, null]);
      crumbs.push([title, null, url]);
      const ld = { "@context": "https://schema.org", "@graph": [
        pg.type === "article"
          ? { "@type": "Article", headline: title, description: pg.desc[l], inLanguage: l, datePublished: "2026-10-24", dateModified: TODAY, mainEntityOfPage: url, image: `${SITE}/img/share.jpg`,
              author: { "@type": "Organization", name: "Formosa Espresso", url: SITE + "/" }, publisher: { "@type": "Organization", name: "Formosa Espresso", logo: { "@type": "ImageObject", url: `${SITE}/img/logo/logo-512.png` } } }
          : { "@type": "AboutPage", name: title, description: pg.desc[l], inLanguage: l, url, about: { "@type": "Organization", name: "Formosa Espresso", url: SITE + "/", logo: `${SITE}/img/logo/logo-512.png`, email: D.cfg.email } },
        { "@type": "BreadcrumbList", itemListElement: crumbs.filter(c => c[2]).map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], item: c[2] })) } ] };
      const others = PAGES.filter(x => x.key !== pg.key);
      const alts = LANGS.map(x => `<link rel="alternate" hreflang="${x}" href="${SITE}/${pg.path[x]}">`).join("\n") + `\n<link rel="alternate" hreflang="x-default" href="${SITE}/${pg.path.fr}">`;
      const out = `<!doctype html>
<html lang="${l}" dir="${l === "ar" ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} | Formosa Espresso</title>
<meta name="description" content="${esc(pg.desc[l])}">
<link rel="canonical" href="${url}">
${alts}
<meta property="og:type" content="${pg.type === "article" ? "article" : "website"}">
<meta property="og:site_name" content="Formosa Espresso">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(pg.desc[l])}">
<meta property="og:image" content="${SITE}/img/share.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#161616">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600${l === "ar" ? "&family=IBM+Plex+Sans+Arabic:wght@400;500;600" : ""}&display=swap">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>
:root{--ground:#fff;--panel:#F4F4F1;--ink:#161616;--muted:#5f5f5b;--line:#E3E3DE;--accent:#7A2E1F;--wa:#1F7A45;--font:"Instrument Sans",${l === "ar" ? '"IBM Plex Sans Arabic",' : ""}"Segoe UI",system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root{--ground:#111110;--panel:#1B1B19;--ink:#EDEDE8;--muted:#A3A39C;--line:#2C2C29;--accent:#D9826B}}
*{box-sizing:border-box}body{margin:0;background:var(--ground);color:var(--ink);font-family:var(--font);line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:inherit}img{max-width:100%;display:block}
.wrap{max-width:1180px;margin:0 auto;padding-inline:clamp(16px,4vw,40px)}
header{border-bottom:1px solid var(--line)}header .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:68px}
.logo{font-size:1.3rem;text-decoration:none;letter-spacing:-.02em;display:inline-flex;align-items:center;gap:10px}.logo b{font-weight:600}.logo img{height:38px;width:auto}.logo picture{flex:none}.logo span{white-space:nowrap}
.langs{display:flex;gap:4px}.langs a{padding:8px 10px;font-size:.85rem;text-decoration:none;border:1px solid var(--line);min-width:44px;text-align:center}.langs a[aria-current]{background:var(--ink);color:var(--ground);border-color:var(--ink)}
.crumbs{font-size:.85rem;color:var(--muted);margin:20px 0 0}.crumbs a{text-decoration:none}.crumbs a:hover{text-decoration:underline}
article{max-width:760px;padding-block:28px 56px}
h1{font-size:clamp(2rem,5vw,3.1rem);line-height:1.1;letter-spacing:-.02em;font-weight:500;margin:10px 0 14px}
.lead{font-size:1.15rem;color:var(--muted);margin:0 0 8px}.upd{font-size:.82rem;color:var(--muted)}
h2{font-size:1.45rem;font-weight:600;letter-spacing:-.01em;line-height:1.25;margin:2.1em 0 .5em}
p{margin:0 0 1em}ul{margin:0 0 1.2em;padding-inline-start:1.3em}li{margin-bottom:.45em}
article a{color:var(--accent);text-underline-offset:3px}
.tbl{overflow-x:auto;margin:0 0 1.4em;border:1px solid var(--line)}table{width:100%;border-collapse:collapse;font-size:.95rem;min-width:520px}th,td{text-align:start;padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}th{font-weight:600;background:var(--panel)}td.num{white-space:nowrap}
.cta{background:var(--panel);padding:26px 28px;margin:36px 0 0}.cta h2{margin:0 0 6px}.cta p{color:var(--muted)}
.btns{display:flex;flex-wrap:wrap;gap:10px}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;background:var(--ink);color:var(--ground)!important;text-decoration:none;font-weight:600}.btn.wa{background:var(--wa);color:#fff!important}
.more{border-top:1px solid var(--line);padding-block:36px 56px}.more h2{margin:0 0 14px;font-size:1.2rem}.more ul{list-style:none;padding:0;display:grid;gap:10px}.more a{color:inherit}
footer{background:#161616;color:#c9c9c2;font-size:.85rem;padding:28px 0}footer .wrap{display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:space-between}
bdi{unicode-bidi:isolate}
</style>
</head>
<body>
<header><div class="wrap"><a class="logo" href="${esc(homeHref(cur, l))}" dir="ltr" aria-label="Formosa Espresso"><picture><source srcset="${A}img/logo/mark-bold-light.svg" media="(prefers-color-scheme: dark)"><img src="${A}img/logo/mark-bold.svg" alt="" width="23" height="40"></picture><span><b>formosa</b> espresso</span></a>
<nav class="langs" aria-label="${u.lang}">${LANGS.map(x => `<a href="${esc(rel(cur, pg.path[x]))}" hreflang="${x}" lang="${x}"${x === l ? ' aria-current="page"' : ""}>${{ fr: "FR", en: "EN", ar: "عربي" }[x]}</a>`).join("")}</nav></div></header>
<main class="wrap">
<nav class="crumbs" aria-label="breadcrumb">${crumbs.map(c => c[1] ? `<a href="${esc(c[1])}">${esc(c[0])}</a>` : `<span${c[2] === url ? ' aria-current="page"' : ""}>${esc(c[0])}</span>`).join(" / ")}</nav>
<article>
<h1>${esc(title)}</h1>
<p class="lead">${esc(pg.desc[l])}</p>
${pg.type === "article" ? `<p class="upd">${u.updated} <time datetime="${TODAY}">${TODAY}</time></p>` : ""}
${html}
<section class="cta"><h2>${u.cta}</h2><p>${u.ctaP}</p><div class="btns"><a class="btn" href="${esc(homeHref(cur, l, "#guide"))}">${u.guide}</a><a class="btn" href="${esc(homeHref(cur, l, "#contact"))}">${u.quote}</a><a class="btn wa" href="https://wa.me/${D.cfg.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></div></section>
</article>
<section class="more"><h2>${u.read}</h2><ul>${others.map(o => `<li><a href="${esc(rel(cur, o.path[l]))}">${esc(o.title[l])} ${l === "ar" ? "←" : "→"}</a></li>`).join("")}</ul></section>
</main>
<footer><div class="wrap"><span>${esc(D.legal1)}</span><span><bdi dir="ltr">${esc(D.cfg.email)}</bdi> · <bdi dir="ltr">${esc(D.cfg.phone)}</bdi></span></div></footer>
<script data-goatcounter="https://amineformosa.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
</body>
</html>
`;
      fs.mkdirSync(path.dirname(path.join(ROOT, cur)), { recursive: true });
      fs.writeFileSync(path.join(ROOT, cur), out);
    }
  }
  fs.writeFileSync(path.join(__dirname, "pages.json"), JSON.stringify(PAGES.map(p => ({ key: p.key, path: p.path })), null, 1));
  console.log(`OK: ${PAGES.length * LANGS.length} pages (à propos + conseils)`);
})();
