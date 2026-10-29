/* Programme parrain Formosa Espresso (fr / en / ar)
   - Un technicien partage son lien  formosaespresso.com/?ref=CODE  (ou donne son code de vive voix).
   - Le client crée son espace client (inscription sans mot de passe, identifié par son téléphone) :
     l'inscription part par e-mail (FormSubmit) avec le code parrain.
   - Formosa valide l'inscription dans l'Admin (onglet Referrals) puis paie le technicien.
   Données publiques et résultats chiffrés des parrains : parrainage-data.js (généré par l'Admin).
   Utilise index.html (T, lang, esc, sheet, openId, lastFocus, track, openLink, CONFIG, FORM_ENDPOINT). */
(function () {
  const L = (fr, en, ar) => ({ fr, en, ar });
  const $ = id => document.getElementById(id);
  const e = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const S = k => T(STR[k]);
  const fill = (s, o) => Object.entries(o).reduce((a, [k, v]) => a.split("{" + k + "}").join(v), s);
  const DATA = Object.assign({ reward: 10, payDay: 10, partners: [], stats: [] }, window.FE_REF || {});
  const REF_DAYS = 90;
  const cleanCode = c => String(c || "").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 20);
  const partner = code => DATA.partners.find(p => p.code === code && p.active !== false);
  const dt = n => n.toLocaleString("fr-FR") + (lang === "ar" ? " د.ت" : " DT");

  const STR = {
    navClient: L("espace client", "customer area", "فضاء الحريف"),
    label: L("Espace client", "Customer area", "فضاء الحريف"),
    h: L("enregistrez votre machine.", "register your machine.", "سجّل آلتك."),
    lede: L("Créez votre espace client en une minute : nous gardons les informations de votre établissement et de votre machine pour mieux vous servir.",
            "Create your customer area in one minute: we keep your business and machine details on file to serve you better.",
            "أنشئ فضاء الحريف في دقيقة: نحتفظ بمعلومات مؤسستك وآلتك لنخدمك بشكل أفضل."),
    b1: L("Rappels d’entretien", "Maintenance reminders", "تذكير بالصيانة"),
    b1t: L("Détartrage, joints, filtre à eau : un message WhatsApp quand c’est le moment.", "Descaling, gaskets, water filter: a WhatsApp message when it’s due.", "إزالة الكلس، الحشيات، فلتر الماء: رسالة واتساب عندما يحين الوقت."),
    b2: L("Historique de la machine", "Machine history", "سجلّ الآلة"),
    b2t: L("Modèle, achat et interventions gardés au même endroit, utiles pour la garantie.", "Model, purchase and service visits kept in one place, useful for the warranty.", "الطراز والشراء والتدخلات في مكان واحد، مفيدة للضمان."),
    b3: L("SAV prioritaire", "Priority service", "أولوية في الصيانة"),
    b3t: L("Un seul numéro : nous retrouvons votre dossier et envoyons le bon technicien.", "One number: we find your file and send the right technician.", "رقم واحد: نجد ملفك ونرسل التقني المناسب."),
    b4: L("Conseils et nouveautés", "Tips and news", "نصائح وجديد"),
    b4t: L("Leçons de l’Académie, cafés de nos torréfacteurs, offres si vous les acceptez.", "Academy lessons, coffee from our roasters, offers if you opt in.", "دروس الأكاديمية، قهوة المحمّصين، وعروض إن وافقت."),
    noPwd: L("Pas de mot de passe : nous vous reconnaissons par votre numéro de téléphone.", "No password: we recognise you by your phone number.", "دون كلمة سر: نتعرّف عليك برقم هاتفك."),
    open: L("Créer mon espace client", "Create my customer area", "أنشئ فضاء الحريف"),
    /* bandeau parrain */
    byTech: L("Recommandé par {n}", "Recommended by {n}", "بتوصية من {n}"),
    byCode: L("Code parrain : {c}", "Referral code: {c}", "رمز الإحالة: {c}"),
    /* formulaire client */
    fTitle: L("créer mon espace client", "create my customer area", "إنشاء فضاء الحريف"),
    you: L("Vous", "You", "أنت"), biz: L("Votre établissement", "Your business", "مؤسستك"), mach: L("Votre machine", "Your machine", "آلتك"),
    first: L("Prénom", "First name", "الاسم"), last: L("Nom", "Last name", "اللقب"),
    phone: L("Téléphone (WhatsApp de préférence)", "Phone (WhatsApp if possible)", "الهاتف (واتساب إن أمكن)"),
    email: L("E-mail (facultatif)", "E-mail (optional)", "البريد الإلكتروني (اختياري)"),
    bizName: L("Nom de l’établissement", "Business name", "اسم المؤسسة"),
    bizType: L("Type", "Type", "النوع"), gov: L("Gouvernorat", "Governorate", "الولاية"), city: L("Ville / délégation", "Town / district", "المدينة / المعتمدية"),
    choose: L("Choisir…", "Choose…", "اختر…"),
    status: L("Situation", "Situation", "الوضعية"),
    st1: L("J’ai déjà une machine espresso", "I already have an espresso machine", "لديّ آلة إسبريسو"),
    st2: L("Je cherche une machine", "I am looking for a machine", "أبحث عن آلة"),
    st3: L("Les deux (remplacement, deuxième machine)", "Both (replacement, second machine)", "الاثنان (تعويض، آلة ثانية)"),
    brand: L("Marque de la machine", "Machine brand", "علامة الآلة"), model: L("Modèle", "Model", "الطراز"),
    groups: L("Groupes", "Groups", "المجموعات"), year: L("Année d’achat", "Year bought", "سنة الشراء"),
    code: L("Code parrain (facultatif)", "Referral code (optional)", "رمز الإحالة (اختياري)"),
    consent: L("J’accepte que Formosa Espresso enregistre ces informations pour mon suivi client (entretien, SAV). Elles ne sont jamais vendues.",
               "I agree that Formosa Espresso keeps this information for my customer follow-up (maintenance, service). It is never sold.",
               "أوافق على أن تحتفظ Formosa Espresso بهذه المعلومات لمتابعتي كحريف (الصيانة وخدمة ما بعد البيع). لا تُباع أبدًا."),
    optin: L("Je veux aussi recevoir les offres et nouveautés sur WhatsApp.", "I also want offers and news on WhatsApp.", "أرغب أيضًا في تلقي العروض والجديد على واتساب."),
    privacy: L("Le technicien qui vous a recommandé voit seulement votre prénom, l’initiale de votre nom et votre ville. Pour consulter, corriger ou supprimer vos données : {m}.",
               "The technician who referred you only sees your first name, last initial and town. To see, correct or delete your data: {m}.",
               "التقني الذي أوصى بك لا يرى إلا اسمك والحرف الأول من لقبك ومدينتك. للاطلاع على بياناتك أو تصحيحها أو حذفها: {m}."),
    send: L("Créer mon espace client", "Create my customer area", "أنشئ فضاء الحريف"), sending: L("Envoi…", "Sending…", "جارٍ الإرسال…"),
    req: L("Indiquez votre prénom, votre nom, un numéro tunisien valide, votre gouvernorat et votre type d’établissement, puis cochez l’accord.",
           "Please give your first and last name, a valid Tunisian number, your governorate and business type, then tick the agreement.",
           "يرجى ذكر الاسم واللقب ورقم تونسي صحيح والولاية ونوع المؤسسة، ثم تأكيد الموافقة."),
    fail: L("L’envoi n’a pas abouti. Réessayez ou écrivez-nous sur WhatsApp.", "Sending failed. Try again or message us on WhatsApp.", "تعذّر الإرسال. أعد المحاولة أو راسلنا على واتساب."),
    ok: L("Merci {n}, votre espace client est créé.", "Thank you {n}, your customer area is created.", "شكرًا {n}، تم إنشاء فضاء الحريف."),
    okT: L("Nous vous contactons dans les prochains jours pour confirmer vos informations. Pour aller plus vite, confirmez dès maintenant sur WhatsApp :",
           "We will contact you in the coming days to confirm your details. To speed things up, confirm now on WhatsApp:",
           "سنتصل بك خلال الأيام القادمة لتأكيد معلوماتك. للتسريع، أكّد الآن على واتساب:"),
    okWa: L("Confirmer sur WhatsApp", "Confirm on WhatsApp", "التأكيد على واتساب"),
    waMsg: L("Bonjour Formosa Espresso, je confirme mon inscription : {n}, {b} ({c}).{r}", "Hello Formosa Espresso, I confirm my registration: {n}, {b} ({c}).{r}", "مرحبًا Formosa Espresso، أؤكد تسجيلي: {n}، {b} ({c}).{r}"),
    waRef: L(" Code parrain : {c}.", " Referral code: {c}.", " رمز الإحالة: {c}."),
    again: L("Inscrire un autre établissement", "Register another business", "تسجيل مؤسسة أخرى"),
    close: L("Fermer", "Close", "إغلاق"),
    /* programme technicien */
    pLabel: L("Programme parrain techniciens", "Technician referral programme", "برنامج الإحالة للتقنيين"),
    pH: L("{r} pour chaque client inscrit.", "{r} for every customer you sign up.", "{r} عن كل حريف مسجّل."),
    pLede: L("Vous êtes technicien et vous entretenez des machines à café ? Proposez à vos clients de créer leur espace client Formosa. Chaque inscription validée vous rapporte {r}, payés chaque mois.",
             "Are you a technician servicing coffee machines? Invite your customers to create their Formosa customer area. Each validated sign-up earns you {r}, paid monthly.",
             "هل أنت تقني تصون آلات القهوة؟ اقترح على حرفائك إنشاء فضاء الحريف في Formosa. كل تسجيل مُصادق عليه يربحك {r}، تُدفع كل شهر."),
    s1: L("Inscrivez-vous", "Join", "سجّل"), s1t: L("Nous vous envoyons votre code, votre lien et votre page de suivi.", "We send you your code, your link and your tracking page.", "نرسل لك رمزك ورابطك وصفحة المتابعة."),
    s2: L("Partagez", "Share", "شارك"), s2t: L("Chez le client : il scanne votre QR code ou ouvre votre lien et s’inscrit en une minute.", "At the customer’s: they scan your QR code or open your link and sign up in a minute.", "عند الحريف: يمسح رمز QR أو يفتح رابطك ويسجّل في دقيقة."),
    s3: L("Soyez payé", "Get paid", "استلم أجرك"), s3t: L("Nous confirmons chaque inscription avec le client, puis vous payons avant le {d} du mois suivant.", "We confirm each sign-up with the customer, then pay you before the {d}th of the next month.", "نؤكد كل تسجيل مع الحريف، ثم ندفع لك قبل يوم {d} من الشهر الموالي."),
    rulesT: L("Règles du programme", "Programme rules", "شروط البرنامج"),
    rules: [
      L("Une inscription est payée quand elle est validée : un vrai client (café, restaurant, hôtel, bureau ou particulier) qui a ou cherche une machine espresso, joignable au numéro donné.",
        "A sign-up is paid once validated: a real customer (café, restaurant, hotel, office or home) who has or wants an espresso machine, reachable on the number given.",
        "يُدفع التسجيل عند المصادقة عليه: حريف حقيقي (مقهى، مطعم، نزل، مكتب أو فرد) لديه أو يبحث عن آلة إسبريسو، ويمكن الاتصال به على الرقم المذكور."),
      L("Un seul paiement par établissement et par numéro. Un client déjà connu de Formosa n’est pas payé.",
        "One payment per business and per number. A customer Formosa already knows is not paid.",
        "دفعة واحدة لكل مؤسسة ولكل رقم. لا يُدفع عن حريف معروف مسبقًا لدى Formosa."),
      L("Le client doit être d’accord et remplir lui-même le formulaire (ou devant vous, sur son téléphone). Les inscriptions inventées ou sans accord entraînent l’exclusion du programme.",
        "The customer must agree and fill in the form themselves (or in front of you, on their phone). Made-up sign-ups or sign-ups without consent mean exclusion from the programme.",
        "يجب أن يوافق الحريف ويملأ الاستمارة بنفسه (أو أمامك على هاتفه). التسجيلات المختلقة أو دون موافقة تؤدي إلى الإقصاء من البرنامج."),
      L("Validation sous 7 jours après appel ou message au client. Vous suivez vos inscriptions et vos gains sur votre page parrain.",
        "Validation within 7 days after we call or message the customer. You track your sign-ups and earnings on your referral page.",
        "المصادقة خلال 7 أيام بعد الاتصال بالحريف أو مراسلته. تتابع تسجيلاتك وأرباحك على صفحتك."),
      L("Paiement par virement, D17 ou en espèces au showroom de Manouba. Le montant peut évoluer ; les inscriptions déjà validées restent payées au montant en vigueur.",
        "Payment by bank transfer, D17 or cash at the Manouba showroom. The amount may change; sign-ups already validated are paid at the amount then in force.",
        "الدفع بتحويل بنكي أو D17 أو نقدًا في صالة العرض بمنوبة. قد يتغيّر المبلغ؛ التسجيلات المصادق عليها تُدفع بالمبلغ المعمول به آنذاك.")
    ],
    pApply: L("Devenir parrain", "Become a referrer", "كن شريك إحالة"),
    pHave: L("Déjà parrain ? Ouvrez le lien de votre page de suivi reçu sur WhatsApp.", "Already a referrer? Open the tracking-page link we sent you on WhatsApp.", "شريك إحالة بالفعل؟ افتح رابط صفحة المتابعة الذي أرسلناه لك على واتساب."),
    /* candidature parrain */
    aTitle: L("devenir parrain", "become a referrer", "كن شريك إحالة"),
    aName: L("Nom et prénom", "Full name", "الاسم واللقب"), aBiz: L("Entreprise (facultatif)", "Business (optional)", "المؤسسة (اختياري)"),
    aCity: L("Ville", "Town", "المدينة"), aPhone: L("Téléphone WhatsApp", "WhatsApp phone", "هاتف واتساب"), aEmail: L("E-mail (facultatif)", "E-mail (optional)", "البريد الإلكتروني (اختياري)"),
    aJob: L("Activité", "Work", "النشاط"),
    j1: L("Technicien machines à café", "Coffee machine technician", "تقني آلات قهوة"), j2: L("Technicien froid / électroménager", "Refrigeration / appliance technician", "تقني تبريد / أجهزة منزلية"),
    j3: L("Plombier / électricien", "Plumber / electrician", "سبّاك / كهربائي"), j4: L("Autre", "Other", "أخرى"),
    aPay: L("Paiement préféré", "Preferred payment", "طريقة الدفع المفضّلة"),
    p1: L("Virement bancaire", "Bank transfer", "تحويل بنكي"), p2: L("D17", "D17", "D17"), p3: L("Espèces au showroom", "Cash at the showroom", "نقدًا في صالة العرض"),
    aClients: L("Nombre de clients que vous suivez (environ)", "Customers you look after (roughly)", "عدد الحرفاء الذين تتابعهم (تقريبًا)"),
    aMsg: L("Zones et remarques", "Areas and notes", "المناطق والملاحظات"),
    aRules: L("J’ai lu les règles du programme et je les accepte.", "I have read and accept the programme rules.", "قرأت شروط البرنامج وأوافق عليها."),
    aSend: L("Envoyer ma demande", "Send my request", "أرسل طلبي"),
    aReq: L("Indiquez votre nom, votre ville, un numéro tunisien valide, et acceptez les règles.", "Please give your name, town, a valid Tunisian number, and accept the rules.", "يرجى ذكر الاسم والمدينة ورقم تونسي صحيح، وقبول الشروط."),
    aOk: L("Merci {n} ! Nous vous envoyons votre code et votre lien parrain sur WhatsApp sous 48 h.", "Thank you {n}! We will send your referral code and link on WhatsApp within 48 hours.", "شكرًا {n}! سنرسل لك رمز الإحالة ورابطك على واتساب خلال 48 ساعة.")
  };
  const TYPES = [["cafe", L("Café / salon de thé", "Café / tea room", "مقهى / قاعة شاي")], ["resto", L("Restaurant", "Restaurant", "مطعم")], ["hotel", L("Hôtel", "Hotel", "نزل")],
    ["kiosk", L("Coffee shop / kiosque", "Coffee shop / kiosk", "كوفي شوب / كشك")], ["office", L("Bureau / entreprise", "Office / company", "مكتب / شركة")],
    ["bakery", L("Pâtisserie / boulangerie", "Pastry shop / bakery", "مرطبات / مخبزة")], ["home", L("Particulier", "Home user", "فرد")], ["other", L("Autre", "Other", "أخرى")]];
  const GOVS = [["Ariana","أريانة"],["Béja","باجة"],["Ben Arous","بن عروس"],["Bizerte","بنزرت"],["Gabès","قابس"],["Gafsa","قفصة"],["Jendouba","جندوبة"],["Kairouan","القيروان"],["Kasserine","القصرين"],["Kébili","قبلي"],["Le Kef","الكاف"],["Mahdia","المهدية"],["La Manouba","منوبة"],["Médenine","مدنين"],["Monastir","المنستير"],["Nabeul","نابل"],["Sfax","صفاقس"],["Sidi Bouzid","سيدي بوزيد"],["Siliana","سليانة"],["Sousse","سوسة"],["Tataouine","تطاوين"],["Tozeur","توزر"],["Tunis","تونس"],["Zaghouan","زغوان"]];
  const typeFr = k => (TYPES.find(x => x[0] === k) || [k, L(k, k, k)])[1].fr;
  const govName = g => { const x = GOVS.find(y => y[0] === g); return x ? (lang === "ar" ? x[1] : x[0]) : g; };

  /* ---------- lien parrain : ?ref=CODE ---------- */
  function readRef() {
    try { const r = JSON.parse(localStorage.getItem("fe-ref") || "null"); if (r && r.code && Date.now() - r.at < REF_DAYS * 864e5) return r; } catch (err) {}
    return null;
  }
  let REF = readRef(), cameWithRef = false;
  (function capture() {
    const params = new URLSearchParams(location.search), c = cleanCode(params.get("ref"));
    if (!c) return;
    REF = { code: c, at: Date.now() }; cameWithRef = true;
    try { localStorage.setItem("fe-ref", JSON.stringify(REF)); } catch (err) {}
    track("parrain-lien-" + c.toLowerCase(), "Lien parrain " + c);
    params.delete("ref"); const q = params.toString();
    try { history.replaceState(null, "", location.pathname + (q ? "?" + q : "") + (location.hash || "#inscription")); } catch (err) {}
  })();

  /* ---------- état des formulaires ---------- */
  let cs = null;   /* client : { done, name, wa } | { fail } */
  let as = null;   /* candidature parrain */
  const norm = p => { let d = String(p || "").replace(/\D/g, ""); if (d.startsWith("00216")) d = d.slice(5); else if (d.startsWith("216") && d.length === 11) d = d.slice(3); return d; };
  const tnOk = p => /^[2-9]\d{7}$/.test(norm(p));

  /* ---------- section de la page d'accueil ---------- */
  function render() {
    document.querySelectorAll("[data-rt]").forEach(x => { x.textContent = S(x.dataset.rt); });
    const el = $("espace-client"); if (!el) return;
    const r = dt(DATA.reward);
    const ben = [["b1", "b1t"], ["b2", "b2t"], ["b3", "b3t"], ["b4", "b4t"]];
    el.innerHTML = `<div class="wrap">
      <div class="head"><div class="stack"><p class="label">${e(S("label"))}</p><h2>${e(S("h"))}</h2></div><p class="lede">${e(S("lede"))}</p></div>
      <div class="ref-ben">${ben.map(([a, b]) => `<div><b>${e(S(a))}</b><p>${e(S(b))}</p></div>`).join("")}</div>
      <div class="ref-cta"><button class="btn" type="button" data-signup>${e(S("open"))}</button><span>${e(S("noPwd"))}</span></div>
      <div class="ref-prog" id="parrainage">
        <div class="stack"><p class="label">${e(S("pLabel"))}</p><h3>${e(fill(S("pH"), { r }))}</h3><p class="lede">${e(fill(S("pLede"), { r }))}</p>
          <div class="ref-cta"><button class="btn" type="button" data-refapply>${e(S("pApply"))}</button></div><p class="ref-small">${e(S("pHave"))}</p></div>
        <div class="stack">
          <ol class="ref-steps">${[["s1", "s1t"], ["s2", "s2t"], ["s3", "s3t"]].map(([a, b], i) => `<li><span>${i + 1}</span><div><b>${e(S(a))}</b><p>${e(fill(S(b), { d: DATA.payDay }))}</p></div></li>`).join("")}</ol>
          <details class="ref-rules"><summary>${e(S("rulesT"))}</summary><ul>${STR.rules.map(x => `<li>${e(T(x))}</li>`).join("")}</ul></details>
        </div>
      </div></div>`;
    if (typeof openId === "string" && openId.startsWith("__ref:") && !sheet.hidden) openSheet(openId.slice(6), true);
  }

  /* ---------- fiches plein écran ---------- */
  const opt = (list, cur) => `<option value="">${e(S("choose"))}</option>` + list.map(([v, l]) => `<option value="${e(v)}"${v === cur ? " selected" : ""}>${e(l)}</option>`).join("");
  function shell(crumb, body) {
    return `<div class="sheet-bar"><div class="wrap"><span class="crumb">${e(crumb)}</span><button class="btn ghost" data-close>${e(S("close"))}</button></div></div><div class="wrap ref-sheet">${body}</div>`;
  }
  function banner() {
    if (!REF) return "";
    const p = partner(REF.code);
    return `<p class="ref-banner"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg>${e(p ? fill(S("byTech"), { n: p.biz ? `${p.name} · ${p.biz}` : p.name }) : fill(S("byCode"), { c: REF.code }))}</p>`;
  }
  function signupHtml() {
    if (cs && cs.done) return shell(S("label").toLowerCase(), `<div class="ref-done" role="status"><h2 id="pdName">${e(fill(S("ok"), { n: cs.name }))}</h2><p>${e(S("okT"))}</p>
      <div class="ctas"><a class="btn wa" href="${e(cs.wa)}" target="_blank" rel="noopener" data-refwa>${e(S("okWa"))}</a><button class="btn ghost" type="button" data-refagain>${e(S("again"))}</button></div></div>`);
    const v = (cs && cs.v) || {}, val = k => e(v[k] || "");
    const sit = v.sit || "have";
    return shell(S("label").toLowerCase(), `
      <div class="ref-form-head"><h2 id="pdName">${e(S("fTitle"))}</h2>${banner()}<p class="lede">${e(S("lede"))}</p></div>
      <form class="sav-form ref-form" id="refForm" novalidate>
        <p class="ref-group full">${e(S("you"))}</p>
        <div class="f"><label for="rfFirst">${e(S("first"))}</label><input id="rfFirst" autocomplete="given-name" value="${val("first")}" required></div>
        <div class="f"><label for="rfLast">${e(S("last"))}</label><input id="rfLast" autocomplete="family-name" value="${val("last")}" required></div>
        <div class="f"><label for="rfPhone">${e(S("phone"))}</label><input id="rfPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+216 20 123 456" dir="ltr" value="${val("phone")}" required></div>
        <div class="f"><label for="rfEmail">${e(S("email"))}</label><input id="rfEmail" type="email" autocomplete="email" dir="ltr" value="${val("email")}"></div>
        <p class="ref-group full">${e(S("biz"))}</p>
        <div class="f"><label for="rfBiz">${e(S("bizName"))}</label><input id="rfBiz" autocomplete="organization" value="${val("biz")}"></div>
        <div class="f"><label for="rfType">${e(S("bizType"))}</label><select id="rfType" required>${opt(TYPES.map(([k, l]) => [k, T(l)]), v.type)}</select></div>
        <div class="f"><label for="rfGov">${e(S("gov"))}</label><select id="rfGov" required>${opt(GOVS.map(([k, a]) => [k, lang === "ar" ? a : k]), v.gov)}</select></div>
        <div class="f"><label for="rfCity">${e(S("city"))}</label><input id="rfCity" autocomplete="address-level2" value="${val("city")}"></div>
        <p class="ref-group full">${e(S("mach"))}</p>
        <div class="f full"><span class="lbl">${e(S("status"))}</span><div class="acc-cats" role="radiogroup">${[["have", "st1"], ["want", "st2"], ["both", "st3"]].map(([k, s]) => `<button type="button" role="radio" data-rfsit="${k}" aria-checked="${sit === k}" aria-pressed="${sit === k}">${e(S(s))}</button>`).join("")}</div></div>
        <div class="f rf-has"${sit === "want" ? " hidden" : ""}><label for="rfBrand">${e(S("brand"))}</label><input id="rfBrand" list="rfBrands" value="${val("brand")}"><datalist id="rfBrands">${["Gemilai", "La Cimbali", "Faema", "La Marzocco", "Rancilio", "Nuova Simonelli", "Wega", "Astoria", "Gaggia", "Saeco", "Expobar"].map(b => `<option value="${b}">`).join("")}</datalist></div>
        <div class="f rf-has"${sit === "want" ? " hidden" : ""}><label for="rfModel">${e(S("model"))}</label><input id="rfModel" value="${val("model")}"></div>
        <div class="f rf-has"${sit === "want" ? " hidden" : ""}><label for="rfGroups">${e(S("groups"))}</label><select id="rfGroups">${opt([["1", "1"], ["2", "2"], ["3", "3"]], v.groups)}</select></div>
        <div class="f rf-has"${sit === "want" ? " hidden" : ""}><label for="rfYear">${e(S("year"))}</label><input id="rfYear" inputmode="numeric" maxlength="4" dir="ltr" value="${val("year")}"></div>
        <div class="f full"><label for="rfCode">${e(S("code"))}</label><input id="rfCode" dir="ltr" autocapitalize="characters" value="${e(v.code ?? (REF ? REF.code : ""))}"></div>
        <label class="ref-check full"><input type="checkbox" id="rfConsent"${v.consent ? " checked" : ""} required> <span>${e(S("consent"))}</span></label>
        <label class="ref-check full"><input type="checkbox" id="rfOptin"${v.optin ? " checked" : ""}> <span>${e(S("optin"))}</span></label>
        <p class="ref-small full">${e(fill(S("privacy"), { m: CONFIG.email }))}</p>
        <input type="text" id="rfHoney" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
        <p class="sav-err" id="rfErr" role="alert">${cs && cs.fail ? e(S("fail")) : ""}</p>
        <div class="sav-btns full"><button class="btn" type="submit" id="rfSend">${e(S("send"))}</button></div>
      </form>`);
  }
  function applyHtml() {
    if (as && as.done) return shell(S("pLabel").toLowerCase(), `<div class="ref-done" role="status"><h2 id="pdName">${e(fill(S("aOk"), { n: as.name }))}</h2></div>`);
    const v = (as && as.v) || {}, val = k => e(v[k] || "");
    return shell(S("pLabel").toLowerCase(), `
      <div class="ref-form-head"><h2 id="pdName">${e(S("aTitle"))}</h2><p class="lede">${e(fill(S("pLede"), { r: dt(DATA.reward) }))}</p></div>
      <form class="sav-form ref-form" id="raForm" novalidate>
        <div class="f"><label for="raName">${e(S("aName"))}</label><input id="raName" autocomplete="name" value="${val("name")}" required></div>
        <div class="f"><label for="raBiz">${e(S("aBiz"))}</label><input id="raBiz" autocomplete="organization" value="${val("biz")}"></div>
        <div class="f"><label for="raPhone">${e(S("aPhone"))}</label><input id="raPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+216" dir="ltr" value="${val("phone")}" required></div>
        <div class="f"><label for="raCity">${e(S("aCity"))}</label><input id="raCity" autocomplete="address-level2" value="${val("city")}" required></div>
        <div class="f"><label for="raJob">${e(S("aJob"))}</label><select id="raJob">${opt([["j1", S("j1")], ["j2", S("j2")], ["j3", S("j3")], ["j4", S("j4")]], v.job || "j1")}</select></div>
        <div class="f"><label for="raPay">${e(S("aPay"))}</label><select id="raPay">${opt([["p1", S("p1")], ["p2", S("p2")], ["p3", S("p3")]], v.pay)}</select></div>
        <div class="f"><label for="raEmail">${e(S("aEmail"))}</label><input id="raEmail" type="email" autocomplete="email" dir="ltr" value="${val("email")}"></div>
        <div class="f"><label for="raClients">${e(S("aClients"))}</label><input id="raClients" inputmode="numeric" dir="ltr" value="${val("clients")}"></div>
        <div class="f full"><label for="raMsg">${e(S("aMsg"))}</label><textarea id="raMsg" rows="3">${val("msg")}</textarea></div>
        <details class="ref-rules full"><summary>${e(S("rulesT"))}</summary><ul>${STR.rules.map(x => `<li>${e(T(x))}</li>`).join("")}</ul></details>
        <label class="ref-check full"><input type="checkbox" id="raRules"${v.rules ? " checked" : ""} required> <span>${e(S("aRules"))}</span></label>
        <input type="text" id="raHoney" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
        <p class="sav-err" id="raErr" role="alert">${as && as.fail ? e(S("fail")) : ""}</p>
        <div class="sav-btns full"><button class="btn" type="submit" id="raSend">${e(S("aSend"))}</button></div>
      </form>`);
  }
  function openSheet(kind, keep) {
    if (!keep) { lastFocus = document.activeElement; track(kind === "signup" ? "espace-client-ouvert" : "parrain-candidature-ouverte", kind === "signup" ? "Espace client ouvert" : "Candidature parrain ouverte"); }
    if (keep) snapshot();
    openId = "__ref:" + kind;
    sheet.innerHTML = kind === "signup" ? signupHtml() : applyHtml();
    sheet.hidden = false; document.body.style.overflow = "hidden";
    if (!keep) { sheet.scrollTop = 0; const f = sheet.querySelector("input:not(.hp)") || sheet.querySelector("[data-close]"); f.focus(); }
  }
  /* garde la saisie quand la langue change */
  function snapshot() {
    const g = id => { const x = $(id); return x ? (x.type === "checkbox" ? x.checked : x.value) : undefined; };
    if ($("refForm")) cs = Object.assign(cs || {}, { v: { first: g("rfFirst"), last: g("rfLast"), phone: g("rfPhone"), email: g("rfEmail"), biz: g("rfBiz"), type: g("rfType"), gov: g("rfGov"), city: g("rfCity"),
      sit: (sheet.querySelector('[data-rfsit][aria-pressed="true"]') || {}).dataset?.rfsit, brand: g("rfBrand"), model: g("rfModel"), groups: g("rfGroups"), year: g("rfYear"), code: g("rfCode"), consent: g("rfConsent"), optin: g("rfOptin") } });
    if ($("raForm")) as = Object.assign(as || {}, { v: { name: g("raName"), biz: g("raBiz"), phone: g("raPhone"), city: g("raCity"), job: g("raJob"), pay: g("raPay"), email: g("raEmail"), clients: g("raClients"), msg: g("raMsg"), rules: g("raRules") } });
  }
  const post = data => fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
    .then(x => x.ok ? x.json() : Promise.reject(x)).then(j => { if (String(j.success) === "false") throw j; return j; });

  /* ---------- événements ---------- */
  document.addEventListener("click", ev => {
    if (ev.target.closest("[data-signup]")) { ev.preventDefault(); openSheet("signup"); return; }
    if (ev.target.closest("[data-refapply]")) { ev.preventDefault(); openSheet("apply"); return; }
    if (ev.target.closest("[data-refagain]")) { cs = null; openSheet("signup", true); return; }
    if (ev.target.closest("[data-refwa]")) { track("espace-client-confirme-whatsapp", "Inscription confirmée sur WhatsApp"); return; }
    const s = ev.target.closest("[data-rfsit]");
    if (s) { s.parentElement.querySelectorAll("button").forEach(b => { b.setAttribute("aria-pressed", b === s); b.setAttribute("aria-checked", b === s); }); sheet.querySelectorAll(".rf-has").forEach(x => x.hidden = s.dataset.rfsit === "want"); return; }
    if (ev.target.closest("[data-close]") && typeof openId === "string" && openId.startsWith("__ref:")) { try { if (/^#(inscription|devenir-parrain)$/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search); } catch (err) {} }
  }, true);
  document.addEventListener("submit", ev => {
    const id = ev.target.id; if (id !== "refForm" && id !== "raForm") return;
    ev.preventDefault();
    const v = k => { const x = $(k); return x ? x.value.trim() : ""; };
    if (id === "refForm") {
      const consent = $("rfConsent").checked;
      if (!v("rfFirst") || !v("rfLast") || !tnOk(v("rfPhone")) || !v("rfGov") || !v("rfType") || !consent) { $("rfErr").textContent = S("req"); return; }
      if (v("rfHoney")) return;
      const sit = (sheet.querySelector('[data-rfsit][aria-pressed="true"]') || { dataset: { rfsit: "have" } }).dataset.rfsit;
      const code = cleanCode(v("rfCode")), p = partner(code), phone = norm(v("rfPhone")), name = `${v("rfFirst")} ${v("rfLast")}`;
      const btn = $("rfSend"); btn.disabled = true; btn.textContent = S("sending");
      const sitFr = { have: "A déjà une machine", want: "Cherche une machine", both: "Les deux" }[sit];
      const data = { "Formulaire": "Inscription client", "Prénom": v("rfFirst"), "Nom": v("rfLast"), "Téléphone": "+216 " + phone, "E-mail": v("rfEmail"),
        "Établissement": v("rfBiz"), "Type": typeFr(v("rfType")), "Gouvernorat": v("rfGov"), "Ville": v("rfCity"), "Situation": sitFr,
        "Machine": sit === "want" ? "" : [v("rfBrand"), v("rfModel")].filter(Boolean).join(" "), "Groupes": sit === "want" ? "" : v("rfGroups"), "Année": sit === "want" ? "" : v("rfYear"),
        "Code parrain": code || "aucun", "Parrain": p ? `${p.name}${p.biz ? " · " + p.biz : ""}` : (code ? "code inconnu" : ""),
        "Via lien parrain": REF && REF.code === code ? "oui, le " + new Date(REF.at).toLocaleDateString("fr-FR") : "non",
        "Accord données": "oui", "Offres WhatsApp": $("rfOptin").checked ? "oui" : "non", "Langue": lang,
        _replyto: v("rfEmail") || undefined, _subject: `Inscription client — parrain ${code || "aucun"} — ${name} (${v("rfGov")})`, _template: "table", _captcha: "false" };
      post(data).then(() => {
        const r = code ? fill(S("waRef"), { c: code }) : "";
        cs = { done: true, name: v("rfFirst"), wa: `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(fill(S("waMsg"), { n: name, b: v("rfBiz") || typeFr(v("rfType")), c: v("rfCity") || v("rfGov"), r }))}` };
        sheet.innerHTML = signupHtml(); sheet.scrollTop = 0;
        track("espace-client-inscrit" + (code ? "-" + code.toLowerCase() : ""), "Inscription client" + (code ? " " + code : ""));
      }).catch(() => { snapshot(); cs.fail = true; btn.disabled = false; btn.textContent = S("send"); $("rfErr").textContent = S("fail"); });
    } else {
      if (!v("raName") || !v("raCity") || !tnOk(v("raPhone")) || !$("raRules").checked) { $("raErr").textContent = S("aReq"); return; }
      if (v("raHoney")) return;
      const btn = $("raSend"); btn.disabled = true; btn.textContent = S("sending");
      const fr = k => STR[k].fr;
      const data = { "Formulaire": "Candidature parrain", "Nom": v("raName"), "Entreprise": v("raBiz"), "Téléphone": "+216 " + norm(v("raPhone")), "Ville": v("raCity"),
        "Activité": v("raJob") ? fr(v("raJob")) : "", "Paiement préféré": v("raPay") ? fr(v("raPay")) : "", "E-mail": v("raEmail"), "Clients suivis": v("raClients"), "Remarques": v("raMsg"),
        "Règles acceptées": "oui", "Langue": lang, _replyto: v("raEmail") || undefined, _subject: `Candidature parrain — ${v("raName")} (${v("raCity")})`, _template: "table", _captcha: "false" };
      post(data).then(() => { as = { done: true, name: v("raName") }; sheet.innerHTML = applyHtml(); sheet.scrollTop = 0; track("parrain-candidature-envoyee", "Candidature parrain envoyée"); })
        .catch(() => { snapshot(); as.fail = true; btn.disabled = false; btn.textContent = S("aSend"); $("raErr").textContent = S("fail"); });
    }
  });

  window.FE_REF_UI = { render, open: openSheet, ref: () => REF };
  render();
  if (location.hash === "#inscription" || cameWithRef) openSheet("signup");
  else if (location.hash === "#devenir-parrain") openSheet("apply");
})();
