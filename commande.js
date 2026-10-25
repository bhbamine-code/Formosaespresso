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
    buy: L("Ajouter au panier", "Add to basket", "أضف إلى السلة"),
    buyShort: L("+ Panier", "+ Basket", "+ السلة"),
    view: L("Voir le panier", "View basket", "عرض السلة"),
    keep: L("Continuer mes achats", "Continue shopping", "مواصلة التسوق"),
    checkout: L("Passer la commande", "Checkout", "إتمام الطلب"),
    back: L("Retour au panier", "Back to basket", "العودة إلى السلة"),
    stepCart: L("Panier", "Basket", "السلة"),
    stepInfo: L("Livraison et paiement", "Delivery and payment", "التوصيل والدفع"),
    nItems: L("{n} article(s)", "{n} item(s)", "{n} منتج"),
    added: L("Ajouté au panier : {n}", "Added to basket: {n}", "أضيف إلى السلة: {n}"),
    cart: L("Panier", "Basket", "السلة"),
    cartTitle: L("Votre panier", "Your basket", "سلتك"),
    empty: L("Votre panier est vide. Ajoutez une machine, un moulin ou des accessoires avec « Ajouter au panier ».", "Your basket is empty. Add a machine, grinder or accessories with “Add to basket”.", "سلتك فارغة. أضف آلة أو مطحنة أو إكسسوارات عبر «أضف إلى السلة»."),
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
    fFirst: L("Prénom", "First name", "الاسم"),
    fLast: L("Nom", "Last name", "اللقب"),
    fEmail: L("E-mail", "E-mail", "البريد الإلكتروني"),
    fCity: L("Ville / délégation", "Town / delegation", "المدينة / المعتمدية"),
    fZip: L("Code postal", "Postcode", "الترقيم البريدي"),
    eFirst: L("Indiquez votre prénom.", "Enter your first name.", "أدخل اسمك."),
    eLast: L("Indiquez votre nom.", "Enter your last name.", "أدخل لقبك."),
    ePhone: L("Numéro tunisien à 8 chiffres, par ex. 22 123 456 ou +216 22 123 456.", "Tunisian number with 8 digits, e.g. 22 123 456 or +216 22 123 456.", "رقم تونسي من 8 أرقام، مثال: 22 123 456 أو 216 22 123 456+."),
    eEmail: L("Adresse e-mail invalide.", "Invalid e-mail address.", "البريد الإلكتروني غير صالح."),
    eGov: L("Choisissez votre gouvernorat.", "Choose your governorate.", "اختر ولايتك."),
    eCity: L("Indiquez la ville ou la délégation.", "Enter the town or delegation.", "أدخل المدينة أو المعتمدية."),
    eZip: L("Code postal tunisien à 4 chiffres, par ex. 2010.", "Tunisian 4-digit postcode, e.g. 2010.", "ترقيم بريدي تونسي من 4 أرقام، مثال: 2010."),
    eAddr: L("Indiquez la rue et le numéro (au moins 6 caractères).", "Enter the street and number (at least 6 characters).", "أدخل النهج والرقم (6 أحرف على الأقل)."),
    eNote: L("Ajoutez une remarque (au moins 3 caractères).", "Add a note (at least 3 characters).", "أضف ملاحظة (3 أحرف على الأقل)."),
    eAgree: L("Cochez la case pour accepter les conditions de paiement.", "Tick the box to accept the payment terms.", "أكّد الخانة لقبول شروط الدفع."),
    fPhone: L("Téléphone", "Phone", "الهاتف"),
    fGov: L("Gouvernorat", "Governorate", "الولاية"),
    fGovPick: L("Choisir…", "Choose…", "اختر…"),
    fAddr: L("Rue et numéro", "Street and number", "النهج والرقم"),
    fAddrPh: L("Ex. : 12 rue de Rome, Résidence Nablus, appt 3", "E.g. 12 rue de Rome, Résidence Nablus, apt 3", "مثال: 12 نهج روما، إقامة نابلس، شقة 3"),
    fNote: L("Remarque", "Note", "ملاحظة"),
    fNotePh: L("Ex. : couleur souhaitée, horaires de livraison, nom du café.", "E.g. preferred colour, delivery hours, café name.", "مثال: اللون المطلوب، أوقات التوصيل، اسم المقهى."),
    fAgree: L("J’ai compris : paiement à la livraison, et acompte de 10 % par virement avant l’expédition d’une machine.", "I understand: payment on delivery, and a 10% deposit by bank transfer before a machine ships.", "فهمت: الدفع عند الاستلام، وتسبقة 10% بتحويل بنكي قبل شحن الآلة."),
    fSend: L("Confirmer la commande", "Confirm the order", "تأكيد الطلب"),
    fSending: L("Envoi…", "Sending…", "جارٍ الإرسال…"),
    fReq: L("Vérifiez les champs signalés en rouge.", "Please check the fields marked in red.", "يرجى مراجعة الخانات المشار إليها بالأحمر."),
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
  function add(id, qty, quiet) {
    if (!info(id)) return;
    const x = cart.find(c => c.id === id);
    if (x) x.qty += qty || 1; else cart.push({ id, qty: qty || 1 });
    save(); badge(); if (!quiet) showAdded(info(id).name);
    track("panier-" + id, "Ajout au panier");
  }

  function showAdded(name) {
    bar.innerHTML = `<span>✓ ${e(fill(S("added"), { n: name }))}</span><div><button type="button" class="btn ghost" data-barclose>${e(S("keep"))}</button><button type="button" class="btn buy" data-cartopen>${e(S("view"))}</button></div>`;
    bar.hidden = false; clearTimeout(barT); barT = setTimeout(() => { bar.hidden = true; }, 6000);
  }
  /* ===== interface ===== */
  const head = document.getElementById("cartHead");
  const bar = document.createElement("div"); bar.className = "cart-added"; bar.hidden = true; bar.setAttribute("role", "status");
  document.body.appendChild(bar);
  let barT;
  const box = document.createElement("div");
  box.className = "cart-dlg"; box.id = "cartDlg"; box.hidden = true; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-labelledby", "cartH");
  document.body.appendChild(box);
  let done = null, failMsg = "", lastFocus = null, step = "cart";

  function badge() {
    const n = totals().n;
    if (!head) return;
    head.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L21 8H6"/><circle cx="9.5" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg><span class="lbl">${e(S("cart"))}</span>${n ? `<b>${n}</b>` : ""}`;
    head.setAttribute("aria-label", `${S("cart")} (${n})`);
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
  const FIELDS = ["cFirst", "cLast", "cP", "cE", "cG", "cCity", "cZip", "cA", "cNote"];
  let errs = {};
  function form() {
    const f = box.querySelector("#cartForm") ? Object.fromEntries(FIELDS.map(k => [k, ($(k) || {}).value || ""])) : {};
    const fld = (id, label, input, full) => `<div class="f${full ? " full" : ""}${errs[id] ? " bad" : ""}"><label for="${id}">${e(S(label))}</label>${input}<small class="ferr" id="${id}Err">${errs[id] ? e(S(errs[id])) : ""}</small></div>`;
    const inp = (id, attrs) => `<input id="${id}" ${attrs} value="${e(f[id] || "")}" aria-describedby="${id}Err">`;
    return `<form id="cartForm" class="cart-form" novalidate>
      <h3>${e(S("fH"))}</h3>
      ${fld("cFirst", "fFirst", inp("cFirst", 'autocomplete="given-name" required'))}
      ${fld("cLast", "fLast", inp("cLast", 'autocomplete="family-name" required'))}
      ${fld("cP", "fPhone", inp("cP", 'type="tel" inputmode="tel" autocomplete="tel" required placeholder="+216 22 123 456" dir="ltr"'))}
      ${fld("cE", "fEmail", inp("cE", 'type="email" inputmode="email" autocomplete="email" required placeholder="nom@exemple.com" dir="ltr"'))}
      ${fld("cG", "fGov", `<select id="cG" required aria-describedby="cGErr"><option value="">${e(S("fGovPick"))}</option>${GOVS.map(g => `<option${g === f.cG ? " selected" : ""}>${g}</option>`).join("")}</select>`)}
      ${fld("cCity", "fCity", inp("cCity", 'autocomplete="address-level2" required'))}
      ${fld("cZip", "fZip", inp("cZip", 'inputmode="numeric" autocomplete="postal-code" maxlength="4" required placeholder="2010" dir="ltr"'))}
      ${fld("cA", "fAddr", inp("cA", `autocomplete="street-address" required placeholder="${e(S("fAddrPh"))}"`), true)}
      ${fld("cNote", "fNote", `<textarea id="cNote" rows="2" required placeholder="${e(S("fNotePh"))}" aria-describedby="cNoteErr">${e(f.cNote || "")}</textarea>`, true)}
      <input type="text" id="cHoney" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
      <label class="cart-agree full${errs.cAgree ? " bad" : ""}"><input type="checkbox" id="cAgree"${box.querySelector("#cAgree") && $("cAgree").checked ? " checked" : ""}> <span>${e(S("fAgree"))}</span></label>
      <p class="cart-err full" id="cErr" role="alert">${e(failMsg)}</p>
      <button class="btn full" type="submit" id="cSend">${e(S("fSend"))}</button>
    </form>`;
  }
  /* téléphone tunisien : 8 chiffres commençant par 2, 3, 4, 5, 7 ou 9, avec ou sans +216 / 00216 */
  function tnPhone(raw) {
    let d = String(raw).replace(/[\s.\-()\/]/g, "");
    if (d.startsWith("+216")) d = d.slice(4); else if (d.startsWith("00216")) d = d.slice(5); else if (d.length === 11 && d.startsWith("216")) d = d.slice(3);
    return /^[234579][0-9]{7}$/.test(d) ? `+216 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}` : null;
  }
  function validate() {
    const v = id => $(id).value.trim(); errs = {};
    if (v("cFirst").length < 2) errs.cFirst = "eFirst";
    if (v("cLast").length < 2) errs.cLast = "eLast";
    if (!tnPhone(v("cP"))) errs.cP = "ePhone";
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v("cE"))) errs.cE = "eEmail";
    if (!GOVS.includes(v("cG"))) errs.cG = "eGov";
    if (v("cCity").length < 2) errs.cCity = "eCity";
    if (!/^[1-9][0-9]{3}$/.test(v("cZip"))) errs.cZip = "eZip";
    if (v("cA").length < 6) errs.cA = "eAddr";
    if (v("cNote").length < 3) errs.cNote = "eNote";
    if (!$("cAgree").checked) errs.cAgree = "eAgree";
    return !Object.keys(errs).length;
  }
  function showErrs() {
    FIELDS.forEach(id => { const box2 = $(id).closest(".f"); box2.classList.toggle("bad", !!errs[id]); $(id + "Err").textContent = errs[id] ? S(errs[id]) : ""; $(id).setAttribute("aria-invalid", errs[id] ? "true" : "false"); });
    $("cAgree").closest(".cart-agree").classList.toggle("bad", !!errs.cAgree);
    $("cErr").textContent = Object.keys(errs).length ? (errs.cAgree && Object.keys(errs).length === 1 ? S("eAgree") : S("fReq")) : "";
    const first = FIELDS.find(id => errs[id]); if (first) $(first).focus();
  }

  function steps(k) { return `<ol class="cart-steps"><li${k === 1 ? ' aria-current="step"' : ""}>1 · ${e(S("stepCart"))}</li><li${k === 2 ? ' aria-current="step"' : ""}>2 · ${e(S("stepInfo"))}</li></ol>`; }
  function render() {
    badge();
    if (box.hidden) return;
    const tt = totals();
    let body;
    if (done) {
      body = `<div class="cart-ok"><h3>${e(fill(S("okH"), { n: done.first }))}</h3>
        <p class="ref"><span>${e(S("okRef"))}</span><b dir="ltr">${e(done.ref)}</b></p>
        <p>${e(fill(S("okCall"), { p: done.phone }))}</p>
        ${done.dep ? `<p class="dep">${e(fill(S("okDep"), { d: dt(done.dep), r: done.ref }))}</p>` : ""}
        <p>${e(fill(S("okCod"), { d: dt(done.cod) }))}</p>
        <div class="cart-btns"><button class="btn wa" type="button" data-cwa>${e(S("okWa"))}</button><button class="btn ghost" type="button" data-cclose>${e(S("okDone"))}</button></div></div>`;
    } else if (!tt.n) {
      body = `<p class="cart-empty">${e(S("empty"))}</p>`;
    } else if (step === "cart") {
      body = `${steps(1)}<ul class="cart-lines">${lines()}</ul>${summary(tt)}<p class="cart-rule">${e(S("delRule"))}</p>
        <div class="cart-btns"><button class="btn ghost" type="button" data-cclose>${e(S("keep"))}</button><button class="btn buy" type="button" data-cstep="checkout">${e(S("checkout"))} →</button></div>`;
    } else {
      body = `${steps(2)}<button type="button" class="link cart-back" data-cstep="cart">← ${e(S("back"))} · ${e(fill(S("nItems"), { n: tt.n }))}</button>${summary(tt)}
        <div class="cart-how"><h3>${e(S("howH"))}</h3><ol><li>${e(S("how1"))}</li>${tt.dep ? `<li>${e(S("how2"))}</li>` : ""}<li>${e(S("how3"))}</li></ol></div>
        ${form()}`;
    }
    box.innerHTML = `<div class="cart-panel"><div class="cart-bar"><h2 id="cartH">${e(S(step === "checkout" && !done && tt.n ? "stepInfo" : "cartTitle"))}</h2><button class="btn ghost" type="button" data-cclose>${e(S("close"))}</button></div><div class="cart-body">${body}</div></div>`;
  }
  function open(st) { step = st || "cart"; bar.hidden = true; lastFocus = document.activeElement; if (typeof closeSheet === "function" && !document.getElementById("sheet").hidden) closeSheet(); box.hidden = false; document.body.style.overflow = "hidden"; render(); const c = box.querySelector("[data-cclose]"); if (c) c.focus(); track("panier-ouvert", "Panier"); }
  function close() { box.hidden = true; document.body.style.overflow = ""; if (done) { done = null; } if (lastFocus && lastFocus.focus) lastFocus.focus(); render(); }

  function orderText(o) {
    const L1 = o.items.map(x => `- ${x.qty} × ${x.name}${x.unit == null ? " (" + S("toConfirm") + ")" : " : " + dt(x.unit * x.qty)}`).join("\n");
    return `${fill(S("waHead"), { r: o.ref })}\n${L1}\n${S("del")} : ${dt(o.del)}\n${S("total")} : ${dt(o.total)}${o.dep ? `\n${S("depNow")} : ${dt(o.dep)}` : ""}\n${S("onDel")} : ${dt(o.cod)}\n\n${o.name}\n${o.phone} · ${o.email}\n${o.addr}, ${o.zip} ${o.city}, ${o.gov}\n${o.note}`;
  }

  /* ===== événements ===== */
  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-buy]"); if (b) { add(b.dataset.buy, 1); return; }
    if (ev.target.closest("[data-cartopen]")) { open(); return; }
    if (ev.target.closest("[data-barclose]")) { bar.hidden = true; return; }
    if (box.hidden) return;
    if (ev.target === box || ev.target.closest("[data-cclose]")) { close(); return; }
    const st = ev.target.closest("[data-cstep]");
    if (st) { step = st.dataset.cstep; render(); box.querySelector(".cart-body").scrollTop = 0; const f = box.querySelector(step === "checkout" ? "#cN" : "[data-cstep]"); if (f) f.focus({ preventScroll: true }); if (step === "checkout") track("panier-checkout", "Passer la commande"); return; }
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
    if (!validate()) { showErrs(); return; }
    if (v("cHoney")) return;
    const tt = totals(), d = new Date();
    const ref = "FE-" + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-" + String(Math.floor(Math.random() * 900) + 100);
    const items = cart.map(x => { const i = info(x.id); return { name: i.name, qty: x.qty, unit: i.unit }; });
    const o = { ref, items, del: tt.del, total: tt.total, dep: tt.dep, cod: tt.cod, first: v("cFirst"), name: `${v("cFirst")} ${v("cLast")}`, phone: tnPhone(v("cP")), email: v("cE"), gov: v("cG"), city: v("cCity"), zip: v("cZip"), addr: v("cA"), note: v("cNote") };
    const btn = $("cSend"); btn.disabled = true; btn.textContent = S("fSending"); failMsg = "";
    const data = {
      "Commande": ref, "Prénom": v("cFirst"), "Nom": v("cLast"), "Téléphone": o.phone, "E-mail": o.email, "Adresse": `${o.addr}, ${o.zip} ${o.city}, ${o.gov}`, "Remarque": o.note, _replyto: o.email,
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

  window.FE_CART = { add, render, open, buyLabel: () => S("buy"), buyShort: () => S("buyShort"), showAdded };
  render();
})();
