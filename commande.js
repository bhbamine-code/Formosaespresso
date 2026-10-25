/* Commande en ligne Formosa : panier, paiement à la livraison, acompte de 10 % par virement pour les machines (fr / en / ar).
   Utilise les données et fonctions de index.html (PRODUCTS, byId, T, t, num, lang, CONFIG, FORM_ENDPOINT, track, toast, openLink, closeSheet). */
(function () {
  /* ===== Réglages : modifiez ici ===== */
  const SHOP = {
    delivery: { accessory: 7, grinder: 20, machine: 50 }, /* DT : accessoires = une fois par commande ; moulin et machine = par article */
    depositRate: 0.10,                                     /* acompte des machines, payé par virement avant l'expédition */
    price: p => p.price[0]                                 /* prix de commande = prix de départ affiché sur le site */
  };

  const L = (fr, en, ar) => ({ fr, en, ar });
  const $ = id => document.getElementById(id);
  const e = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const S = k => T(STR[k]);
  const fill = (s, o) => Object.entries(o).reduce((a, [k, v]) => a.split("{" + k + "}").join(v), s);
  const dt = n => `${num(Math.round(n))} ${t("cur")}`;

  const STR = {
    buy: L("Commander", "Order", "اطلب الآن"),
    added: L("Ajouté au panier : {n}", "Added to cart: {n}", "أضيف إلى السلة: {n}"),
    cart: L("Panier", "Cart", "السلة"),
    cartTitle: L("Votre commande", "Your order", "طلبك"),
    empty: L("Votre panier est vide. Ouvrez une machine ou un moulin et cliquez sur « Commander ».", "Your cart is empty. Open a machine or grinder and click “Order”.", "سلتك فارغة. افتح آلة أو مطحنة واضغط على «اطلب الآن»."),
    close: L("Fermer", "Close", "إغلاق"),
    remove: L("Retirer", "Remove", "حذف"),
    qty: L("Quantité", "Quantity", "الكمية"),
    from: L("prix de départ, confirmé par téléphone", "starting price, confirmed by phone", "السعر الأدنى، يُؤكَّد بالهاتف"),
    toConfirm: L("prix confirmé par téléphone", "price confirmed by phone", "السعر يُؤكَّد بالهاتف"),
    sub: L("Articles", "Items", "المنتجات"),
    del: L("Livraison", "Delivery", "التوصيل"),
    total: L("Total", "Total", "المجموع"),
    accNote: L("+ accessoires, prix confirmé par téléphone", "+ accessories, price confirmed by phone", "+ الإكسسوارات، السعر يُؤكَّد بالهاتف"),
    depNow: L("Acompte à envoyer par virement (10 % des machines)", "Deposit to send by bank transfer (10% of machines)", "تسبقة تُرسل بتحويل بنكي (10% من ثمن الآلات)"),
    onDel: L("À payer au livreur, à la livraison", "To pay the courier on delivery", "تُدفع لعون التوصيل عند الاستلام"),
    howH: L("Comment ça marche", "How it works", "كيف تتمّ العملية"),
    how1: L("Vous confirmez la commande ici : nous vous appelons pour valider le prix et la date de livraison.", "You confirm the order here: we call you to confirm the price and delivery date.", "تؤكّد الطلب هنا: نتصل بك لتأكيد السعر وموعد التوصيل."),
    how2: L("Pour une machine, vous envoyez un acompte de 10 % par virement bancaire. Nous vous envoyons notre RIB par WhatsApp ou SMS ; la machine est expédiée à la réception de l’acompte.", "For a machine, you send a 10% deposit by bank transfer. We send you our bank details by WhatsApp or SMS; the machine ships once the deposit is received.", "بالنسبة للآلة، ترسل تسبقة 10% بتحويل بنكي. نرسل لك معرّفنا البنكي (RIB) عبر واتساب أو رسالة قصيرة، وتُشحن الآلة عند استلام التسبقة."),
    how3: L("Vous payez le reste en espèces au livreur, à la réception.", "You pay the rest in cash to the courier on delivery.", "تدفع الباقي نقدًا لعون التوصيل عند الاستلام."),
    delRule: L("Livraison partout en Tunisie : accessoires 7 DT par commande, moulin 20 DT, machine 50 DT par article.", "Delivery anywhere in Tunisia: accessories 7 DT per order, grinder 20 DT, machine 50 DT per item.", "التوصيل إلى كامل تراب الجمهورية: الإكسسوارات 7 د.ت للطلب، المطحنة 20 د.ت، الآلة 50 د.ت للقطعة."),
    fH: L("Vos coordonnées", "Your details", "معلوماتك"),
    fName: L("Nom et prénom", "Full name", "الاسم واللقب"),
    fPhone: L("Téléphone", "Phone", "الهاتف"),
    fGov: L("Gouvernorat", "Governorate", "الولاية"),
    fGovPick: L("Choisir…", "Choose…", "اختر…"),
    fAddr: L("Adresse de livraison", "Delivery address", "عنوان التوصيل"),
    fAddrPh: L("Rue, numéro, ville, code postal", "Street, number, town, postcode", "النهج، الرقم، المدينة، الترقيم البريدي"),
    fNote: L("Remarque (facultatif)", "Note (optional)", "ملاحظة (اختياري)"),
    fNotePh: L("Ex. : couleur souhaitée, horaires de livraison, nom du café.", "E.g. preferred colour, delivery hours, café name.", "مثال: اللون المطلوب، أوقات التوصيل، اسم المقهى."),
    fAgree: L("J’ai compris : paiement à la livraison, et acompte de 10 % par virement avant l’expédition d’une machine.", "I understand: payment on delivery, and a 10% deposit by bank transfer before a machine ships.", "فهمت: الدفع عند الاستلام، وتسبقة 10% بتحويل بنكي قبل شحن الآلة."),
    fSend: L("Confirmer la commande", "Confirm the order", "تأكيد الطلب"),
    fSending: L("Envoi…", "Sending…", "جارٍ الإرسال…"),
    fReq: L("Indiquez votre nom, votre téléphone, votre gouvernorat et votre adresse, puis cochez la case.", "Please give your name, phone, governorate and address, then tick the box.", "يرجى ذكر الاسم والهاتف والولاية والعنوان، ثم تأكيد الخانة."),
    fFail: L("L’envoi n’a pas abouti. Réessayez, ou envoyez la commande par WhatsApp.", "Sending failed. Try again, or send the order by WhatsApp.", "تعذّر الإرسال. أعد المحاولة أو أرسل الطلب عبر واتساب."),
    okH: L("Merci {n}, commande reçue", "Thank you {n}, order received", "شكرًا {n}، تم استلام طلبك"),
    okRef: L("Numéro de commande", "Order number", "رقم الطلب"),
    okCall: L("Nous vous appelons au {p} pour confirmer le prix et la date de livraison.", "We will call you on {p} to confirm the price and delivery date.", "سنتصل بك على الرقم {p} لتأكيد السعر وموعد التوصيل."),
    okDep: L("Acompte à envoyer : {d} par virement. Nous vous envoyons le RIB par WhatsApp ou SMS ; indiquez le numéro {r} dans le motif du virement.", "Deposit to send: {d} by bank transfer. We send you our bank details by WhatsApp or SMS; put the number {r} in the transfer reference.", "التسبقة المطلوبة: {d} بتحويل بنكي. نرسل لك المعرّف البنكي عبر واتساب أو رسالة قصيرة؛ اذكر الرقم {r} في سبب التحويل."),
    okCod: L("À payer au livreur : {d}.", "To pay the courier: {d}.", "المبلغ عند الاستلام: {d}."),
    okWa: L("Envoyer aussi par WhatsApp", "Also send by WhatsApp", "أرسل أيضًا عبر واتساب"),
    okDone: L("Fermer", "Close", "إغلاق"),
    waHead: L("Bonjour Formosa Espresso, nouvelle commande {r}", "Hello Formosa Espresso, new order {r}", "مرحبًا Formosa Espresso، طلب جديد {r}")
  };
  const GOVS = ["Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan", "Kasserine", "Kébili", "Le Kef", "Mahdia", "La Manouba", "Médenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"];

  /* ===== panier ===== */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("fe-cart") || "[]").filter(x => x && x.id && x.qty > 0); } catch (err) { cart = []; }
  const save = () => { try { localStorage.setItem("fe-cart", JSON.stringify(cart)); } catch (err) {} };
  const isAcc = id => id.startsWith("acc:");
  const accList = () => (window.FE_TOOLS && FE_TOOLS.acc) || [];
  function info(id) {
    if (isAcc(id)) { const a = accList().find(([k]) => "acc:" + k === id); return { name: a ? T(a[1]) : id, kind: "accessory", unit: null }; }
    const p = byId[id]; if (!p) return null;
    return { name: T(p.name), kind: p.cat === "grinder" ? "grinder" : "machine", unit: SHOP.price(p) };
  }
  function totals() {
    let sub = 0, mach = 0, del = 0, hasAcc = false, n = 0;
    cart.forEach(x => {
      const i = info(x.id); if (!i) return; n += x.qty;
      if (i.kind === "accessory") { hasAcc = true; return; }
      sub += i.unit * x.qty; del += SHOP.delivery[i.kind] * x.qty;
      if (i.kind === "machine") mach += i.unit * x.qty;
    });
    if (hasAcc) del += SHOP.delivery.accessory;
    const dep = Math.ceil(mach * SHOP.depositRate);
    return { sub, del, total: sub + del, dep, cod: sub + del - dep, hasAcc, n };
  }
  function add(id, qty) {
    if (!info(id)) return;
    const x = cart.find(c => c.id === id);
    if (x) x.qty += qty || 1; else cart.push({ id, qty: qty || 1 });
    save(); badge(); toast(fill(S("added"), { n: info(id).name }));
    track("panier-" + id, "Ajout au panier");
  }

  /* ===== interface ===== */
  const fab = document.createElement("button");
  fab.type = "button"; fab.className = "cart-fab"; fab.hidden = true; fab.setAttribute("data-cartopen", "");
  document.body.appendChild(fab);
  const box = document.createElement("div");
  box.className = "cart-dlg"; box.id = "cartDlg"; box.hidden = true; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-labelledby", "cartH");
  document.body.appendChild(box);
  let done = null, failMsg = "", lastFocus = null;

  function badge() {
    const n = totals().n;
    fab.hidden = !n;
    fab.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L21 8H6"/><circle cx="9.5" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg><span>${e(S("cart"))}</span><b>${n}</b>`;
    fab.setAttribute("aria-label", `${S("cart")} (${n})`);
  }
  function lines() {
    return cart.map(x => {
      const i = info(x.id); if (!i) return "";
      return `<li class="cart-line"><div><b>${e(i.name)}</b><small>${i.unit == null ? e(S("toConfirm")) : e(dt(i.unit)) + (x.qty > 1 ? " × " + x.qty : "") + " · " + e(S("from"))}</small></div>
        <div class="cart-qty" role="group" aria-label="${e(S("qty"))}"><button type="button" data-cq="${e(x.id)}:-1" aria-label="−">−</button><span>${x.qty}</span><button type="button" data-cq="${e(x.id)}:1" aria-label="+">+</button></div>
        <button type="button" class="cart-rm" data-crm="${e(x.id)}">${e(S("remove"))}</button></li>`;
    }).join("");
  }
  function summary(tt) {
    return `<dl class="cart-sum">
      <div><dt>${e(S("sub"))}</dt><dd>${e(dt(tt.sub))}${tt.hasAcc ? `<small>${e(S("accNote"))}</small>` : ""}</dd></div>
      <div><dt>${e(S("del"))}</dt><dd>${e(dt(tt.del))}</dd></div>
      <div class="tot"><dt>${e(S("total"))}</dt><dd>${e(dt(tt.total))}</dd></div>
      ${tt.dep ? `<div class="dep"><dt>${e(S("depNow"))}</dt><dd>${e(dt(tt.dep))}</dd></div>` : ""}
      <div class="cod"><dt>${e(S("onDel"))}</dt><dd>${e(dt(tt.cod))}</dd></div></dl>`;
  }
  function form() {
    const f = done ? null : (box.querySelector("#cartForm") ? Object.fromEntries(["cN", "cP", "cG", "cA", "cNote"].map(k => [k, ($(k) || {}).value || ""])) : {});
    return `<form id="cartForm" class="cart-form" novalidate>
      <h3>${e(S("fH"))}</h3>
      <div class="f"><label for="cN">${e(S("fName"))}</label><input id="cN" autocomplete="name" required value="${e(f.cN || "")}"></div>
      <div class="f"><label for="cP">${e(S("fPhone"))}</label><input id="cP" type="tel" autocomplete="tel" required placeholder="+216" dir="ltr" value="${e(f.cP || "")}"></div>
      <div class="f"><label for="cG">${e(S("fGov"))}</label><select id="cG" required><option value="">${e(S("fGovPick"))}</option>${GOVS.map(g => `<option${g === f.cG ? " selected" : ""}>${g}</option>`).join("")}</select></div>
      <div class="f full"><label for="cA">${e(S("fAddr"))}</label><input id="cA" autocomplete="street-address" required placeholder="${e(S("fAddrPh"))}" value="${e(f.cA || "")}"></div>
      <div class="f full"><label for="cNote">${e(S("fNote"))}</label><textarea id="cNote" rows="2" placeholder="${e(S("fNotePh"))}">${e(f.cNote || "")}</textarea></div>
      <input type="text" id="cHoney" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
      <label class="cart-agree full"><input type="checkbox" id="cAgree"> <span>${e(S("fAgree"))}</span></label>
      <p class="cart-err full" id="cErr" role="alert">${e(failMsg)}</p>
      <button class="btn full" type="submit" id="cSend">${e(S("fSend"))}</button>
    </form>`;
  }
  function render() {
    badge();
    if (box.hidden) return;
    const tt = totals();
    let body;
    if (done) {
      body = `<div class="cart-ok"><h3>${e(fill(S("okH"), { n: done.name }))}</h3>
        <p class="ref"><span>${e(S("okRef"))}</span><b dir="ltr">${e(done.ref)}</b></p>
        <p>${e(fill(S("okCall"), { p: done.phone }))}</p>
        ${done.dep ? `<p class="dep">${e(fill(S("okDep"), { d: dt(done.dep), r: done.ref }))}</p>` : ""}
        <p>${e(fill(S("okCod"), { d: dt(done.cod) }))}</p>
        <div class="cart-btns"><button class="btn wa" type="button" data-cwa>${e(S("okWa"))}</button><button class="btn ghost" type="button" data-cclose>${e(S("okDone"))}</button></div></div>`;
    } else if (!tt.n) {
      body = `<p class="cart-empty">${e(S("empty"))}</p>`;
    } else {
      body = `<ul class="cart-lines">${lines()}</ul>${summary(tt)}
        <div class="cart-how"><h3>${e(S("howH"))}</h3><ol><li>${e(S("how1"))}</li>${tt.dep ? `<li>${e(S("how2"))}</li>` : ""}<li>${e(S("how3"))}</li></ol><p>${e(S("delRule"))}</p></div>
        ${form()}`;
    }
    box.innerHTML = `<div class="cart-panel"><div class="cart-bar"><h2 id="cartH">${e(S("cartTitle"))}</h2><button class="btn ghost" type="button" data-cclose>${e(S("close"))}</button></div><div class="cart-body">${body}</div></div>`;
  }
  function open() { lastFocus = document.activeElement; if (typeof closeSheet === "function" && !document.getElementById("sheet").hidden) closeSheet(); box.hidden = false; document.body.style.overflow = "hidden"; render(); const c = box.querySelector("[data-cclose]"); if (c) c.focus(); track("panier-ouvert", "Panier"); }
  function close() { box.hidden = true; document.body.style.overflow = ""; if (done) { done = null; } if (lastFocus && lastFocus.focus) lastFocus.focus(); render(); }

  function orderText(o) {
    const L1 = o.items.map(x => `- ${x.qty} × ${x.name}${x.unit == null ? " (" + S("toConfirm") + ")" : " : " + dt(x.unit * x.qty)}`).join("\n");
    return `${fill(S("waHead"), { r: o.ref })}\n${L1}\n${S("del")} : ${dt(o.del)}\n${S("total")} : ${dt(o.total)}${o.dep ? `\n${S("depNow")} : ${dt(o.dep)}` : ""}\n${S("onDel")} : ${dt(o.cod)}\n\n${o.name}\n${o.phone}\n${o.gov} — ${o.addr}${o.note ? "\n" + o.note : ""}`;
  }

  /* ===== événements ===== */
  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-buy]"); if (b) { add(b.dataset.buy, 1); return; }
    if (ev.target.closest("[data-cartopen]")) { open(); return; }
    if (box.hidden) return;
    if (ev.target === box || ev.target.closest("[data-cclose]")) { close(); return; }
    const q = ev.target.closest("[data-cq]");
    if (q) { const [id, d] = [q.dataset.cq.slice(0, q.dataset.cq.lastIndexOf(":")), +q.dataset.cq.slice(q.dataset.cq.lastIndexOf(":") + 1)]; const x = cart.find(c => c.id === id); if (x) { x.qty = Math.max(1, Math.min(20, x.qty + d)); save(); render(); } return; }
    const r = ev.target.closest("[data-crm]");
    if (r) { cart = cart.filter(c => c.id !== r.dataset.crm); save(); render(); return; }
    if (ev.target.closest("[data-cwa]") && done) { openLink(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(orderText(done))}`); track("commande-whatsapp", "Commande WhatsApp"); }
  });
  document.addEventListener("keydown", ev => { if (ev.key === "Escape" && !box.hidden) close(); });
  document.addEventListener("submit", ev => {
    if (ev.target.id !== "cartForm") return;
    ev.preventDefault();
    const v = id => $(id).value.trim();
    if (!v("cN") || !v("cP") || !v("cG") || !v("cA") || !$("cAgree").checked) { $("cErr").textContent = S("fReq"); return; }
    if (v("cHoney")) return;
    const tt = totals(), d = new Date();
    const ref = "FE-" + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-" + String(Math.floor(Math.random() * 900) + 100);
    const items = cart.map(x => { const i = info(x.id); return { name: i.name, qty: x.qty, unit: i.unit }; });
    const o = { ref, items, del: tt.del, total: tt.total, dep: tt.dep, cod: tt.cod, name: v("cN"), phone: v("cP"), gov: v("cG"), addr: v("cA"), note: v("cNote") };
    const btn = $("cSend"); btn.disabled = true; btn.textContent = S("fSending"); failMsg = "";
    const data = {
      "Commande": ref, "Nom": o.name, "Téléphone": o.phone, "Gouvernorat": o.gov, "Adresse": o.addr, "Remarque": o.note || "—",
      "Articles": items.map(x => `${x.qty} × ${x.name}${x.unit == null ? " (prix à confirmer)" : " = " + dt(x.unit * x.qty)}`).join(" | "),
      "Sous-total": dt(tt.sub) + (tt.hasAcc ? " + accessoires à confirmer" : ""), "Livraison": dt(tt.del), "Total": dt(tt.total),
      "Acompte virement (10 % machines)": tt.dep ? dt(tt.dep) : "aucun", "À payer à la livraison": dt(tt.cod), "Langue": lang,
      _subject: `Commande ${ref} — ${o.name} (${o.gov}) — ${dt(tt.total)}`, _template: "table", _captcha: "false"
    };
    fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
      .then(r => r.ok ? r.json() : Promise.reject(r)).then(j => { if (String(j.success) === "false") throw j; done = o; cart = []; save(); render(); box.querySelector(".cart-body").scrollTop = 0; track("commande-envoyee", "Commande envoyée"); })
      .catch(() => { failMsg = S("fFail"); btn.disabled = false; btn.textContent = S("fSend"); $("cErr").innerHTML = `${e(failMsg)} <button type="button" class="link" data-cwafail>WhatsApp</button>`; window.__feLastOrder = o; });
  });
  document.addEventListener("click", ev => { if (ev.target.closest("[data-cwafail]") && window.__feLastOrder) openLink(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(orderText(window.__feLastOrder))}`); });

  window.FE_CART = { add, render, open, buyLabel: () => S("buy") };
  render();
})();
