/* Vitrine — shorter homepage (concept A, Nov 2026).
   Groups machines, packs, accessories and coffees into one tabbed shop with swipe rows,
   and folds technicians, referral programme and calculator into a partners hub.
   Every existing section keeps its own code; this file only moves and frames them.
   "Tout voir" opens a section full screen, the same way product sheets open. */
(function () {
  const L = (fr, en, ar) => ({ fr, en, ar });
  const TXT = {
    shopLabel: L("La boutique", "The shop", "المتجر"),
    shopH: L("tout pour votre comptoir", "everything for your counter", "كل ما يحتاجه الكونتوار متاعك"),
    tMachines: L("Machines", "Machines", "الآلات"),
    tPacks: L("Packs", "Packs", "الباقات"),
    tAcc: L("Accessoires", "Accessories", "الإكسسوارات"),
    tCafe: L("Cafés", "Coffee", "القهوة"),
    seeAll: L("Tout voir", "See all", "عرض الكل"),
    close: L("Fermer", "Close", "إغلاق"),
    swipe: L("Glissez pour voir la suite", "Swipe to see more", "اسحب لرؤية المزيد"),
    hubLabel: L("Partenaires et outils", "Partners and tools", "الشركاء والأدوات"),
    hubH: L("on avance ensemble", "we grow together", "نتقدّم معًا"),
    hRoast: L("Torréfacteurs", "Roasters", "المحمّصون"),
    hRoastP: L("Les cafés de nos torréfacteurs tunisiens partenaires.", "Coffee from our partner Tunisian roasters.", "قهوة شركائنا من المحمّصين التونسيين."),
    hTech: L("Techniciens agréés", "Approved technicians", "التقنيون المعتمدون"),
    hTechP: L("Installation et réparation près de chez vous, ou devenez partenaire.", "Installation and repairs near you, or become a partner.", "تركيب وإصلاح قريب منك، أو كن شريكًا."),
    hRef: L("Espace client et parrainage", "Customer area and referrals", "فضاء الحرفاء والإحالة"),
    hRefP: L("Créez votre compte et gagnez en recommandant Formosa.", "Create your account and earn by recommending Formosa.", "أنشئ حسابك واربح عند التوصية بـ Formosa."),
    hCalc: L("Calculateur de rentabilité", "Profit calculator", "حاسبة المردودية"),
    hCalcP: L("Combien de tasses pour rembourser votre machine ?", "How many cups to pay back your machine?", "كم فنجانًا لاسترجاع ثمن آلتك؟"),
    open: L("Ouvrir", "Open", "افتح")
  };
  const lang = () => (["fr", "en", "ar"].includes(document.documentElement.lang) ? document.documentElement.lang : "fr");
  const t = k => TXT[k][lang()];
  const $ = id => document.getElementById(id);

  const SHOP = [
    { id: "gamme", tab: "tMachines", count: () => $("range") ? $("range").children.length : 0 },
    { id: "packs", tab: "tPacks", count: s => (s.querySelector(".pk-grid") || { children: [] }).children.length },
    { id: "accessoires", tab: "tAcc", count: s => (s.querySelector(".acc-items") || { children: [] }).children.length },
    { id: "torrefacteurs", tab: "tCafe", count: s => (s.querySelector(".acc-items") || { children: [] }).children.length }
  ];
  const HUB = [
    { id: "torrefacteurs", h: "hRoast", p: "hRoastP", icon: "#torrefacteurs", shop: true },
    { id: "techniciens", h: "hTech", p: "hTechP", icon: "#techniciens" },
    { id: "espace-client", h: "hRef", p: "hRefP", icon: "#inscription" },
    { id: "rentabilite", h: "hCalc", p: "hCalcP", icon: "#rentabilite" }
  ];
  if (!SHOP.every(s => $(s.id)) || !HUB.every(h => $(h.id))) return;

  /* ---------- build the shop ---------- */
  const shop = document.createElement("section");
  shop.className = "section vt-shop"; shop.id = "boutique";
  shop.innerHTML = `<div class="wrap"><div class="vt-head"><p class="label" data-vt="shopLabel"></p><h2 data-vt="shopH"></h2></div>
    <div class="vt-tabs" role="tablist"></div></div>`;
  $("gamme").before(shop);
  const tabs = shop.querySelector(".vt-tabs");
  SHOP.forEach((s, i) => {
    const sec = $(s.id);
    sec.classList.add("vt-panel"); sec.setAttribute("role", "tabpanel"); sec.style.paddingTop = "";
    shop.appendChild(sec);
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "tab"); b.dataset.panel = s.id; b.id = "vt-tab-" + s.id;
    sec.setAttribute("aria-labelledby", b.id);
    tabs.appendChild(b);
    ensureMore(sec);
    /* some sections redraw themselves (language switch, filters): put the button back and refresh counts */
    new MutationObserver(() => { if (!sec.querySelector(":scope > .vt-more")) { ensureMore(sec); label(); } else label(); })
      .observe(sec, { childList: true });
  });
  function ensureMore(sec) {
    if (sec.querySelector(":scope > .vt-more")) return;
    const more = document.createElement("div");
    more.className = "vt-more wrap";
    more.innerHTML = `<button type="button" class="btn ghost" data-vt-full="${sec.id}"></button><span class="vt-swipe"></span>`;
    sec.appendChild(more);
  }

  /* ---------- build the partners hub ---------- */
  const hub = document.createElement("section");
  hub.className = "section vt-hub"; hub.id = "partenaires";
  hub.innerHTML = `<div class="wrap"><div class="vt-head"><p class="label" data-vt="hubLabel"></p><h2 data-vt="hubH"></h2></div><div class="vt-cards"></div></div>`;
  (document.getElementById("faq") || $("sav")).before(hub);
  const cards = hub.querySelector(".vt-cards");
  HUB.forEach(h => {
    const icon = document.querySelector(`nav.cats a[href="${h.icon}"] svg`);
    const c = document.createElement("button");
    c.type = "button"; c.className = "vt-card"; c.dataset.vtFull = h.id;
    c.innerHTML = `<span class="vt-ic">${icon ? icon.outerHTML : ""}</span><span class="vt-tx"><b data-vt="${h.h}"></b><span data-vt="${h.p}"></span></span><span class="vt-go" data-vt="open"></span>`;
    cards.appendChild(c);
    const sec = $(h.id);
    if (!h.shop) { sec.classList.add("vt-folded"); hub.after(sec); }
  });
  /* the calculator and partner sections now live after the hub, folded */

  /* ---------- full-screen view ---------- */
  let openSec = null, lastFocus = null, closeBar = null;
  function openFull(id) {
    const sec = $(id); if (!sec) return;
    if (openSec) closeFull(true);
    if (sec.classList.contains("vt-panel")) activate(id);
    lastFocus = document.activeElement;
    closeBar = document.createElement("div");
    closeBar.className = "vt-bar";
    const title = sec.querySelector("h2");
    closeBar.innerHTML = `<div class="wrap"><b>${title ? title.textContent : ""}</b><button type="button" class="btn ghost" data-vt-close>${t("close")}</button></div>`;
    sec.prepend(closeBar);
    sec.classList.add("vt-full");
    sec.setAttribute("role", "dialog"); sec.setAttribute("aria-modal", "true");
    document.body.style.overflow = "hidden";
    openSec = sec; sec.scrollTop = 0;
    closeBar.querySelector("button").focus({ preventScroll: true });
  }
  function closeFull(silent) {
    if (!openSec) return;
    openSec.classList.remove("vt-full"); openSec.removeAttribute("aria-modal");
    if (openSec.classList.contains("vt-panel")) openSec.setAttribute("role", "tabpanel"); else openSec.removeAttribute("role");
    if (closeBar) closeBar.remove();
    document.body.style.overflow = "";
    openSec = null; closeBar = null;
    if (!silent && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* ---------- tabs ---------- */
  let active = "gamme";
  try { const k = sessionStorage.getItem("vt-tab"); if (k && SHOP.some(s => s.id === k)) active = k; } catch (e) {}
  function activate(id) {
    active = id;
    try { sessionStorage.setItem("vt-tab", id); } catch (e) {}
    SHOP.forEach(s => {
      const on = s.id === id;
      $(s.id).classList.toggle("vt-on", on);
      const b = $("vt-tab-" + s.id); b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1;
      const row = $(s.id).querySelector(".range,.pk-grid,.acc-items");
      if (row && !on) row.scrollLeft = 0;
    });
  }
  tabs.addEventListener("click", e => { const b = e.target.closest("[data-panel]"); if (b) activate(b.dataset.panel); });
  tabs.addEventListener("keydown", e => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const ids = SHOP.map(s => s.id), rtl = document.documentElement.dir === "rtl";
    let i = ids.indexOf(active) + ((e.key === "ArrowRight") !== rtl ? 1 : -1);
    i = (i + ids.length) % ids.length; activate(ids[i]); $("vt-tab-" + ids[i]).focus();
  });

  /* ---------- labels (follow the site's language switch) ---------- */
  function label() {
    document.querySelectorAll("[data-vt]").forEach(el => { const v = t(el.dataset.vt); if (el.textContent !== v) el.textContent = v; });
    SHOP.forEach(s => {
      const sec = $(s.id), n = s.count(sec);
      const more = sec.querySelector(":scope > .vt-more");
      if (more) {
        const sw = more.querySelector(".vt-swipe"), bt = more.querySelector("button");
        if (sw.textContent !== t("swipe")) sw.textContent = t("swipe");
        const lbl = `${t("seeAll")} (${n})`; if (bt.textContent !== lbl) bt.textContent = lbl;
      }
      const tab = $("vt-tab-" + s.id), th = `${t(s.tab)}<small>${n || ""}</small>`;
      if (tab.innerHTML !== th) tab.innerHTML = th;
    });
    if (closeBar) closeBar.querySelector("button").textContent = t("close");
  }
  new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  /* ---------- clicks and links ---------- */
  document.addEventListener("click", e => {
    const f = e.target.closest("[data-vt-full]"); if (f) { e.preventDefault(); openFull(f.dataset.vtFull); return; }
    if (e.target.closest("[data-vt-close]")) { closeFull(); return; }
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute("href").slice(1); if (!id) return;
    const el = document.getElementById(id); if (!el) return;
    const panel = el.closest(".vt-panel"), folded = el.closest(".vt-folded");
    if (openSec && !openSec.contains(a)) closeFull(true);
    if (panel) {
      activate(panel.id);
      if (panel.id === "gamme" && a.dataset.filter) return; /* the site's own filter handler scrolls to the range */
      e.preventDefault(); shop.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    } else if (folded) {
      e.preventDefault(); openFull(folded.id);
      if (el !== folded) setTimeout(() => el.scrollIntoView({ block: "start" }), 50);
    }
  }, true);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && openSec && document.getElementById("sheet").hidden) closeFull(); });

  function fromHash() {
    const id = location.hash.slice(1); if (!id) return;
    const el = document.getElementById(id); if (!el) return;
    const panel = el.closest(".vt-panel"), folded = el.closest(".vt-folded");
    if (panel) activate(panel.id);
    else if (folded) openFull(folded.id);
  }

  activate(active); label(); fromHash();
  /* lists are drawn by other scripts; refresh counts once they are in */
  window.addEventListener("load", () => { label(); setTimeout(label, 600); });
  window.FE_VITRINE = { open: openFull, close: closeFull, tab: activate };
})();
