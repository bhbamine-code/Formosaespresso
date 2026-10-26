/* Outils Formosa : guide de choix, packs, paiement, accessoires, rentabilité, SAV (fr / en / ar).
   Utilise les données et fonctions de index.html (PRODUCTS, byId, T, t, money, quote, openProduct…). */
(function () {
  const L = (fr, en, ar) => ({ fr, en, ar });
  const $ = id => document.getElementById(id);
  const e = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const S = k => T(STR[k]);
  const fill = (s, o) => Object.entries(o).reduce((a, [k, v]) => a.replace("{" + k + "}", v), s);
  const imgOf = p => "img/" + (p.gallery ? p.gallery[0] : p.img.toLowerCase()) + ".jpg";
  const sum = ids => ids.reduce((a, id) => a + byId[id].price[0], 0);
  /* facilités : acompte 40 %, puis 12 ou 24 mensualités */
  const PLANS = { "12": { mk: 0.07, n: 12 }, "24": { mk: 0.13, n: 24 } };
  const plan = (base, k) => { const { mk, n } = PLANS[k], total = Math.round(base * (1 + mk)), dep = Math.round(total * 0.4); return { total, dep, n, m: Math.ceil((total - dep) / n) }; };
  const packOpt = {};

  const STR = {
    /* nav + footer */
    navGuide: L("guide de choix", "buying guide", "دليل الاختيار"),
    navPacks: L("packs", "packs", "الباقات"),
    navAcc: L("accessoires", "accessories", "الإكسسوارات"),
    navCalc: L("calculateur", "calculator", "الحاسبة"),
    navSav: L("SAV", "service", "خدمة ما بعد البيع"),
    ftAbout: L("À propos", "About us", "من نحن"),
    ftCalc: L("Calculer la rentabilité", "Profitability calculator", "حاسبة المردودية"),
    ftSav: L("Demande d’intervention (SAV)", "Service request", "طلب تدخل (صيانة)"),
    ftArticles: L("Conseils", "Guides", "نصائح"),
    ftA1: L("Prix d’une machine professionnelle", "Professional machine prices", "أسعار الآلات الاحترافية"),
    ftA2: L("1 ou 2 groupes ?", "1 or 2 groups?", "مجموعة أو مجموعتان؟"),
    ftA3: L("Planning d’entretien", "Cleaning schedule", "جدول الصيانة"),

    /* guide */
    gLabel: L("Guide de choix", "Buying guide", "دليل الاختيار"),
    gH: L("quelle machine pour mon café ?", "which machine for my café?", "أي آلة تناسب مقهاي؟"),
    gLede: L("Trois questions, et nous vous proposons la machine, le moulin et le budget de départ adaptés. Gratuit et sans engagement.",
             "Three questions, and we suggest the right machine, grinder and starting budget. Free, no commitment.",
             "ثلاثة أسئلة، ونقترح عليك الآلة والمطحنة والميزانية المناسبة للبداية. مجانًا ودون أي التزام."),
    q1: L("Combien de cafés par jour ?", "How many coffees a day?", "كم فنجان قهوة في اليوم؟"),
    v_s: L("moins de 100", "under 100", "أقل من 100"), v_m: L("100 à 250", "100 to 250", "من 100 إلى 250"),
    v_l: L("250 à 500", "250 to 500", "من 250 إلى 500"), v_xl: L("plus de 500", "over 500", "أكثر من 500"),
    q2: L("Votre établissement", "Your business", "نوع المحل"),
    t_cafe: L("café / salon de thé", "café / tea room", "مقهى / قاعة شاي"), t_resto: L("restaurant / hôtel", "restaurant / hotel", "مطعم / نزل"),
    t_kiosk: L("kiosque / snack", "kiosk / snack bar", "كشك / مطعم سريع"), t_office: L("bureau / entreprise", "office / company", "مكتب / شركة"),
    q3: L("Budget pour l’équipement", "Equipment budget", "ميزانية المعدّات"),
    b_1: L("moins de 5 000 DT", "under 5,000 DT", "أقل من 5000 د.ت"), b_2: L("5 000 à 9 000 DT", "5,000 to 9,000 DT", "من 5000 إلى 9000 د.ت"),
    b_3: L("plus de 9 000 DT", "over 9,000 DT", "أكثر من 9000 د.ت"), b_0: L("pas encore défini", "not decided yet", "لم أحدّد بعد"),
    gWait: L("Choisissez au moins le nombre de cafés par jour pour voir notre recommandation.", "Pick at least the number of coffees a day to see our recommendation.", "اختر على الأقل عدد الفناجين في اليوم لرؤية توصيتنا."),
    gReco: L("Notre recommandation", "Our recommendation", "توصيتنا"),
    gTotal: L("Budget de départ", "Starting budget", "ميزانية البداية"),
    gQuote: L("Demander ce devis", "Request this quote", "اطلب عرض السعر"),
    gSheet: L("Voir la machine", "See the machine", "عرض الآلة"),
    gNote: L("Repères indicatifs : le nombre de groupes dépend surtout de vos heures de pointe. Nous affinons le choix avec vous, gratuitement.",
             "Rules of thumb: the number of groups depends mostly on your peak hours. We fine-tune the choice with you, free of charge.",
             "هذه مؤشرات تقريبية: عدد المجموعات يتوقف أساسًا على أوقات الذروة. نضبط الاختيار معك مجانًا."),
    rGrinder: L("Moulin à la demande G9026A : mouture fraîche à chaque tasse, indispensable pour un espresso régulier.",
                "G9026A on-demand grinder: fresh grounds for every cup, essential for consistent espresso.",
                "مطحنة G9026A عند الطلب: بنّ مطحون طازج لكل فنجان، ضروري لإسبريسو ثابت الجودة."),
    rTwoGrinders: L("Deux moulins conseillés : un pour l’espresso du jour, un second pour le décaféiné ou un deuxième café.",
                    "Two grinders recommended: one for the house espresso, a second for decaf or a second coffee.",
                    "يُنصح بمطحنتين: واحدة لإسبريسو المحل والثانية لقهوة منزوعة الكافيين أو لنوع ثانٍ."),
    rSet: L("G3200F et moulin G9015C : le départ le plus économique, idéal pour un petit volume.",
            "G3200F with the G9015C grinder: the most affordable start, ideal for small volumes.",
            "G3200F مع مطحنة G9015C: أقلّ كلفة للبداية، مثالي للكميات الصغيرة."),
    r1g: L("Un groupe suffit pour ce volume : moins cher, compact, simple à utiliser.",
           "One group is enough for this volume: cheaper, compact and easy to use.",
           "مجموعة واحدة تكفي لهذا الحجم: أرخص وأصغر وسهلة الاستعمال."),
    r2g: L("Deux groupes pour servir deux commandes en même temps aux heures de pointe.",
           "Two groups to serve two orders at once during peak hours.",
           "مجموعتان لتحضير طلبين في نفس الوقت في أوقات الذروة."),
    rFlow: L("Débitmètre et doses programmées : la même tasse quel que soit le barista, utile pour un fort débit.",
             "Flowmeter and programmed doses: the same cup whoever the barista, useful at high volume.",
             "عدّاد تدفق وجرعات مبرمجة: نفس الفنجان مهما كان الباريستا، مفيد للكميات الكبيرة."),
    rE61: L("Groupe E61 saturé : stabilité de température haut de gamme pour un café de spécialité.",
            "Saturated E61 group: premium temperature stability for specialty coffee.",
            "مجموعة E61 مشبّعة: ثبات حرارة عالي الجودة للقهوة المختصة."),
    rBudget: L("Choix adapté à votre budget ; nous pouvons aussi étudier un paiement en plusieurs fois.",
               "Chosen to fit your budget; we can also look at paying in instalments.",
               "اختيار يناسب ميزانيتك؛ ويمكننا أيضًا دراسة الدفع على أقساط."),
    gMsg: L("Bonjour, le guide de choix me recommande : {items}. Établissement : {type}. Environ {vol} cafés par jour.",
            "Hello, the buying guide recommends: {items}. Business: {type}. About {vol} coffees a day.",
            "مرحبًا، دليل الاختيار يقترح: {items}. نوع المحل: {type}. حوالي {vol} فنجان في اليوم."),

    /* packs + paiement */
    pLabel: L("Packs ouverture", "Opening packs", "باقات الافتتاح"),
    pH: L("tout pour ouvrir votre comptoir", "everything to open your counter", "كل ما تحتاجه لافتتاح مشربك"),
    pLede: L("Machine, moulin, petit matériel, installation et formation : un seul devis, un seul interlocuteur.",
             "Machine, grinder, small tools, installation and training: one quote, one contact.",
             "آلة ومطحنة وأدوات صغيرة وتركيب وتكوين: عرض سعر واحد ومخاطب واحد."),
    pk1: L("Pack Démarrage", "Starter pack", "باقة البداية"), pk1d: L("Bureau, snack, petit café : jusqu’à 100 cafés par jour.", "Office, snack bar, small café: up to 100 coffees a day.", "مكتب أو مطعم سريع أو مقهى صغير: حتى 100 فنجان في اليوم."),
    pk2: L("Pack Café", "Café pack", "باقة المقهى"), pk2d: L("Café de quartier, deux groupes : 150 à 300 cafés par jour.", "Neighbourhood café, two groups: 150 to 300 coffees a day.", "مقهى الحي بمجموعتين: من 150 إلى 300 فنجان في اليوم."),
    pk3: L("Pack Spécialité", "Specialty pack", "باقة القهوة المختصة"), pk3d: L("Coffee-shop de spécialité : pression réglée à la main, grand moulin 83 mm.", "Specialty coffee shop: hand-controlled pressure, large 83 mm grinder.", "مقهى قهوة مختصة: ضغط مضبوط يدويًا ومطحنة كبيرة 83 mm."),
    pk4: L("Pack Grand débit", "High-volume pack", "باقة الكميات الكبيرة"), pk4d: L("Coffee-shop, hôtel, forte affluence : deux groupes, doses programmées.", "Coffee shop, hotel, heavy traffic: two groups, programmed doses.", "مقهى كبير أو نزل أو إقبال كثيف: مجموعتان وجرعات مبرمجة."),
    pInc1: L("Kit de démarrage : tasseur, pichets à lait, bac à marc", "Starter kit: tamper, milk jugs, knock box", "طقم البداية: مكبس، أباريق حليب، حاوية التفل"),
    pInc2: L("Installation, raccordement et réglage", "Installation, plumbing and set-up", "التركيب والتوصيل والضبط"),
    pInc3: L("Formation de votre équipe", "Training for your team", "تكوين فريقك"),
    pFrom: L("matériel à partir de", "equipment from", "المعدّات ابتداءً من"),
    oCash: L("Comptant", "Pay now", "نقدًا"), o12: L("12 mois", "12 months", "12 شهرًا"), o24: L("24 mois", "24 months", "24 شهرًا"),
    oPick: L("Mode de paiement", "Payment option", "طريقة الدفع"),
    dCash: L("10 % de remise, paiement complet à la commande", "10% off, full payment on order", "تخفيض 10%، دفع كامل المبلغ عند الطلب"),
    dPlanBig: L("{m} / mois × {n}", "{m} / month × {n}", "{m} / شهريًا × {n}"),
    dPlan: L("{d} à la commande (40 %), puis {n} mensualités", "{d} on order (40%), then {n} monthly instalments", "{d} عند الطلب (40%)، ثم {n} قسطًا شهريًا"),
    dPlanSub: L("facilités sur {n} mois", "spread over {n} months", "تسهيلات على {n} شهرًا"),
    pOptCash: L("paiement comptant avec remise de 10 %", "full payment with 10% discount", "الدفع نقدًا مع تخفيض 10%"),
    pOpt12: L("paiement en 12 mois (acompte de 40 %)", "payment over 12 months (40% deposit)", "الدفع على 12 شهرًا (تسبقة 40%)"),
    pOpt24: L("paiement en 24 mois (acompte de 40 %)", "payment over 24 months (40% deposit)", "الدفع على 24 شهرًا (تسبقة 40%)"),
    pTag: L("−10 % comptant · ou 24 mois", "−10% paid now · or 24 months", "−10% نقدًا · أو 24 شهرًا"),
    pBtn: L("Demander ce pack", "Request this pack", "اطلب هذه الباقة"),
    pNote: L("Comptant : 10 % de remise pour un paiement complet à la commande. Facilités : acompte de 40 % à la commande, puis 12 ou 24 mensualités, par traites ou virement, sous réserve d’acceptation du dossier. Prix indicatifs de la machine et du moulin ; le kit, l’installation et la formation sont détaillés dans votre devis.",
            "Pay now: 10% off for full payment on order. Instalments: 40% deposit on order, then 12 or 24 monthly payments, by bills of exchange or bank transfer, subject to approval. Indicative prices for the machine and grinder; the kit, installation and training are itemised in your quote.",
            "نقدًا: تخفيض 10% عند الدفع الكامل مع الطلب. التسهيلات: تسبقة 40% عند الطلب، ثم 12 أو 24 قسطًا شهريًا، بالكمبيالات أو بالتحويل البنكي، مع مراعاة قبول الملف. السعر تقديري للآلة والمطحنة؛ يتم تفصيل الطقم والتركيب والتكوين في عرض السعر."),
    pMsg: L("Bonjour, je suis intéressé(e) par le {pack} ({items}), avec {opt}. Pouvez-vous m’envoyer un devis ?",
            "Hello, I’m interested in the {pack} ({items}), with {opt}. Could you send me a quote?",
            "مرحبًا، أنا مهتم بـ {pack} ({items})، مع {opt}. هل يمكنكم إرسال عرض سعر؟"),
    payH: L("Paiement adapté à votre ouverture", "Payment that fits your opening", "دفع يناسب افتتاح مشروعك"),
    payP: L("Pour chaque pack : 10 % de remise en payant tout à la commande, ou des facilités avec un acompte de 40 % puis 12 ou 24 mensualités, sous réserve d’acceptation du dossier. Virement, chèque ou espèces, avec facture et TVA ; mensualités par traites ou virement.",
            "For every pack: 10% off when you pay everything on order, or instalments with a 40% deposit then 12 or 24 monthly payments, subject to approval. Bank transfer, cheque or cash, with a VAT invoice; monthly payments by bills of exchange or transfer.",
            "لكل باقة: تخفيض 10% عند دفع كامل المبلغ مع الطلب، أو تسهيلات بتسبقة 40% ثم 12 أو 24 قسطًا شهريًا، مع مراعاة قبول الملف. تحويل بنكي أو صك أو نقدًا، مع فاتورة بالأداءات؛ الأقساط بالكمبيالات أو بالتحويل."),
    payBtn: L("En parler sur WhatsApp", "Discuss on WhatsApp", "تحدّث معنا على واتساب"),
    payMsg: L("Bonjour, je voudrais connaître les facilités de paiement pour une ouverture de café.", "Hello, I’d like to know the payment options for a café opening.", "مرحبًا، أريد معرفة تسهيلات الدفع لافتتاح مقهى."),

    /* accessoires */
    aLabel: L("Accessoires et consommables", "Accessories and consumables", "الإكسسوارات والمستهلكات"),
    aH: L("le petit matériel du barista", "the barista’s small tools", "أدوات الباريستا الصغيرة"),
    aLede: L("Ajoutez au panier, payez à la livraison. Tout le petit matériel pour démarrer et entretenir votre machine.", "Add to your basket, pay on delivery. All the small tools to start and maintain your machine.", "أضف إلى السلة وادفع عند الاستلام. كل الأدوات الصغيرة لبدء العمل وصيانة آلتك."),
    aBtn: L("Demander les prix ({n})", "Request prices ({n})", "اطلب الأسعار ({n})"),
    aBuy: L("Ajouter au panier", "Add to basket", "أضف إلى السلة"),
    aAll: L("Tout", "All", "الكل"),
    aDemo: L("Prix indicatifs TTC, confirmés par téléphone avant la livraison. Livraison des accessoires : 7 DT par commande.", "Indicative prices incl. VAT, confirmed by phone before delivery. Accessories delivery: 7 DT per order.", "أسعار تقريبية بالأداءات، تُؤكَّد بالهاتف قبل التوصيل. توصيل الإكسسوارات: 7 د.ت للطلب."),
    aOther: L("Un autre article ? Demandez-le-nous", "Another item? Ask us", "منتج آخر؟ اطلبه منا"),
    aOtherMsg: L("Bonjour, je cherche un accessoire : ", "Hello, I am looking for an accessory: ", "مرحبًا، أبحث عن إكسسوار: "),
    aNone: L("Cochez au moins un article.", "Tick at least one item.", "اختر عنصرًا واحدًا على الأقل."),
    aMsg: L("Bonjour, je souhaite les prix de : {items}.", "Hello, I’d like prices for: {items}.", "مرحبًا، أريد أسعار: {items}."),

    /* rentabilité */
    cLabel: L("Calculateur", "Calculator", "حاسبة"),
    cH: L("en combien de temps la machine est-elle remboursée ?", "how fast does the machine pay for itself?", "في كم من الوقت تسترجع ثمن الآلة؟"),
    cLede: L("Une estimation simple à partir de vos chiffres. Modifiez les valeurs, le résultat se met à jour.", "A simple estimate from your own figures. Change the values and the result updates.", "تقدير بسيط انطلاقًا من أرقامك. غيّر القيم وستتحدّث النتيجة."),
    cPrice: L("Prix de vente moyen d’une boisson (DT)", "Average selling price per drink (DT)", "معدّل سعر بيع المشروب (د.ت)"),
    cCups: L("Boissons à base d’espresso par jour", "Espresso-based drinks per day", "عدد مشروبات الإسبريسو في اليوم"),
    cDays: L("Jours d’ouverture par mois", "Opening days per month", "أيام العمل في الشهر"),
    cCost: L("Coût matière par boisson (café, lait, sucre, gobelet) (DT)", "Ingredient cost per drink (coffee, milk, sugar, cup) (DT)", "كلفة المواد لكل مشروب (بن، حليب، سكر، كأس) (د.ت)"),
    cFixed: L("Charges fixes par mois : loyer, salaires, électricité (DT)", "Fixed costs per month: rent, wages, electricity (DT)", "المصاريف الثابتة في الشهر: كراء، أجور، كهرباء (د.ت)"),
    cNet: L("Reste par mois après charges", "Left per month after costs", "المتبقّي في الشهر بعد المصاريف"),
    cMachine: L("Machine", "Machine", "الآلة"), cGrinder: L("Ajouter le moulin G9026A", "Add the G9026A grinder", "إضافة مطحنة G9026A"),
    cEquip: L("Équipement (prix de départ)", "Equipment (starting price)", "المعدّات (السعر الأدنى)"),
    cMargin: L("Marge par boisson", "Margin per drink", "الهامش لكل مشروب"),
    cMonth: L("Marge brute par mois", "Gross margin per month", "الهامش الخام في الشهر"),
    cPay: L("Équipement remboursé en", "Equipment paid back in", "استرجاع ثمن المعدّات في"),
    cMonthsU: L("environ {n} mois", "about {n} months", "حوالي {n} شهر"),
    cNever: L("— les ventes ne couvrent pas encore les charges", "— sales don’t cover the costs yet", "— المبيعات لا تغطي المصاريف بعد"),
    cNote: L("Estimation indicative, hors taxes, crédit et autres dépenses : elle sert à comparer, pas à remplacer un vrai plan financier. Remplacez les valeurs par vos propres chiffres.",
             "Indicative estimate, excluding taxes, loans and other expenses: it is for comparison, not a substitute for a real business plan. Replace the values with your own figures.",
             "تقدير تقريبي دون احتساب الضرائب والقروض والمصاريف الأخرى: يصلح للمقارنة ولا يعوّض مخططًا ماليًا حقيقيًا. عوّض القيم بأرقامك."),

    /* SAV */
    sLabel: L("Service après-vente", "After-sales service", "خدمة ما بعد البيع"),
    sH: L("une panne, un réglage, un entretien ?", "a fault, an adjustment, a service?", "عطل أو ضبط أو صيانة؟"),
    sLede: L("Décrivez le problème : nous vous rappelons pour diagnostiquer et planifier l’intervention. Une photo ou une courte vidéo par WhatsApp aide beaucoup.",
             "Describe the problem: we call you back to diagnose it and plan the visit. A photo or short video on WhatsApp helps a lot.",
             "صف المشكلة: نتصل بك لتشخيصها وبرمجة التدخل. صورة أو فيديو قصير على واتساب يساعد كثيرًا."),
    sName: L("Nom", "Name", "الاسم"), sPhone: L("Téléphone", "Phone", "الهاتف"), sCity: L("Ville", "City", "المدينة"),
    sModel: L("Machine concernée", "Machine concerned", "الآلة المعنية"), sOther: L("Autre marque / je ne sais pas", "Other brand / not sure", "علامة أخرى / لا أعرف"),
    sKind: L("Type de demande", "Type of request", "نوع الطلب"),
    k1: L("Panne / ne fonctionne plus", "Breakdown / not working", "عطل / لا تعمل"), k2: L("Fuite, pression ou température", "Leak, pressure or temperature", "تسرّب أو ضغط أو حرارة"),
    k3: L("Entretien / détartrage / pièces d’usure", "Service / descaling / wear parts", "صيانة / إزالة الكلس / قطع غيار"), k4: L("Réglage ou formation", "Adjustment or training", "ضبط أو تكوين"),
    sProb: L("Décrivez le problème", "Describe the problem", "صف المشكلة"),
    sPh: L("Ex. : la machine chauffe mais l’eau coule très lentement depuis hier.", "E.g. the machine heats up but water flows very slowly since yesterday.", "مثال: الآلة تسخن لكن الماء ينزل ببطء شديد منذ البارحة."),
    sSend: L("Envoyer la demande", "Send the request", "أرسل الطلب"), sWa: L("WhatsApp avec photo", "WhatsApp with a photo", "واتساب مع صورة"),
    sSending: L("Envoi…", "Sending…", "جارٍ الإرسال…"),
    sOk: L("Merci {n}, votre demande est envoyée. Nous vous rappelons au plus vite.", "Thank you {n}, your request has been sent. We will call you back as soon as possible.", "شكرًا {n}، تم إرسال طلبك. سنتصل بك في أقرب وقت."),
    sFail: L("L’envoi n’a pas abouti. Réessayez ou écrivez-nous sur WhatsApp.", "Sending failed. Try again or message us on WhatsApp.", "تعذّر الإرسال. أعد المحاولة أو راسلنا على واتساب."),
    sReq: L("Indiquez votre nom, votre téléphone et le problème.", "Please give your name, phone and the problem.", "يرجى ذكر الاسم والهاتف والمشكلة."),
    sWaMsg: L("Bonjour, demande SAV.\nNom : {n}\nVille : {c}\nMachine : {m}\nType : {k}\nProblème : {p}\n(Je joins une photo.)",
              "Hello, service request.\nName: {n}\nCity: {c}\nMachine: {m}\nType: {k}\nProblem: {p}\n(I’m attaching a photo.)",
              "مرحبًا، طلب صيانة.\nالاسم: {n}\nالمدينة: {c}\nالآلة: {m}\nالنوع: {k}\nالمشكلة: {p}\n(أرفق صورة.)")
  };

  const ACC = [
    ["tamper", L("Tasseur 58 mm", "58 mm tamper", "مكبس 58 مم"), L("Inox, poignée bois ou aluminium.", "Stainless steel, wood or aluminium handle.", "فولاذ مقاوم للصدأ بمقبض خشبي أو ألومنيوم.")],
    ["mat", L("Tapis de tassage", "Tamping mat", "قاعدة الكبس"), L("Protège le comptoir et le porte-filtre.", "Protects the counter and portafilter.", "تحمي المشرب وحامل الفلتر.")],
    ["jugs", L("Pichets à lait 350 / 600 ml", "Milk jugs 350 / 600 ml", "أباريق حليب 350 / 600 مل"), L("Inox, bec fin pour le latte art.", "Stainless, fine spout for latte art.", "فولاذ، فوهة رفيعة للرسم على القهوة.")],
    ["knock", L("Bac à marc", "Knock box", "حاوية التفل"), L("Barre caoutchouc, passe au lave-vaisselle.", "Rubber bar, dishwasher safe.", "قضيب مطاطي، يُغسل في آلة الأواني.")],
    ["scale", L("Balance de précision 0,1 g", "0.1 g precision scale", "ميزان دقيق 0,1 غ"), L("Avec minuteur, pour peser dose et rendement.", "With timer, to weigh dose and yield.", "مع مؤقّت، لوزن الجرعة والمردود.")],
    ["dist", L("Répartiteur 58 mm", "58 mm distributor", "موزّع البن 58 مم"), L("Une mouture bien répartie, une extraction régulière.", "Even grounds, consistent extraction.", "توزيع متساوٍ للبن واستخلاص منتظم.")],
    ["baskets", L("Paniers filtres simple / double", "Single / double filter baskets", "سلال فلتر مفردة / مزدوجة"), L("Paniers de rechange et panier aveugle.", "Spare baskets and blind basket.", "سلال احتياطية وسلة صمّاء.")],
    ["gaskets", L("Joints et douchettes de groupe", "Group gaskets and shower screens", "حشوات ومصافي المجموعة"), L("Pièces d’usure à changer régulièrement.", "Wear parts to replace regularly.", "قطع تُستبدل بانتظام.")],
    ["clean", L("Produits de nettoyage", "Cleaning products", "مواد التنظيف"), L("Pastilles groupe, nettoyant buse vapeur, brosses.", "Group tablets, steam wand cleaner, brushes.", "أقراص المجموعة، منظّف ذراع البخار، فرش.")],
    ["water", L("Filtration et adoucisseur d’eau", "Water filtration and softener", "تصفية الماء ومزيل الكلس"), L("Indispensable avec l’eau calcaire en Tunisie.", "Essential with Tunisia’s hard water.", "ضروري مع الماء الكلسي في تونس.")],
    ["cups", L("Tasses et soucoupes", "Cups and saucers", "فناجين وصحون"), L("Espresso, cappuccino, porcelaine épaisse.", "Espresso and cappuccino, thick porcelain.", "إسبريسو وكابتشينو، خزف سميك.")],
    ["thermo", L("Thermomètre à lait", "Milk thermometer", "ميزان حرارة الحليب"), L("Pour former l’équipe à la bonne température.", "To train the team on the right temperature.", "لتدريب الفريق على الحرارة المناسبة.")]
  ];


  /* Articles accessoires (démonstration : prix indicatifs, à remplacer par vos prix réels) — [id, catégorie, nom, prix DT, image] */
  const ACC_ITEMS = [
    ["tamper-wood", "tamper", L("Tasseur 58 mm, poignée bois", "58 mm tamper, wooden handle", "مكبس 58 مم بمقبض خشبي"), 65],
    ["tamper-cal", "tamper", L("Tasseur calibré à ressort 58 mm", "58 mm calibrated spring tamper", "مكبس 58 مم بنابض معاير"), 95],
    ["mat", "mat", L("Tapis de tassage silicone", "Silicone tamping mat", "قاعدة كبس سيليكون"), 35],
    ["mat-corner", "mat", L("Tapis de tassage d’angle", "Corner tamping mat", "قاعدة كبس زاوية"), 45],
    ["jug-350", "jugs", L("Pichet à lait inox 350 ml", "Stainless milk jug 350 ml", "إبريق حليب 350 مل"), 45],
    ["jug-600", "jugs", L("Pichet à lait inox 600 ml", "Stainless milk jug 600 ml", "إبريق حليب 600 مل"), 55],
    ["knock", "knock", L("Bac à marc avec barre", "Knock box with bar", "حاوية تفل بقضيب"), 59],
    ["knock-drawer", "knock", L("Tiroir à marc inox", "Stainless knock drawer", "درج تفل فولاذي"), 180],
    ["scale", "scale", L("Balance 0,1 g avec minuteur", "0.1 g scale with timer", "ميزان 0,1 غ مع مؤقّت"), 89],
    ["dist", "dist", L("Répartiteur 58 mm", "58 mm distributor", "موزّع بن 58 مم"), 79],
    ["wdt", "dist", L("Outil WDT à aiguilles", "WDT needle tool", "أداة WDT بالإبر"), 35],
    ["basket-double", "baskets", L("Panier filtre double 58 mm", "58 mm double filter basket", "سلة فلتر مزدوجة 58 مم"), 25],
    ["basket-blind", "baskets", L("Panier aveugle de nettoyage", "Blind cleaning basket", "سلة صمّاء للتنظيف"), 18],
    ["gasket", "gaskets", L("Joint de groupe 58 mm", "58 mm group gasket", "حشوة مجموعة 58 مم"), 12],
    ["screen", "gaskets", L("Douchette inox 58 mm", "58 mm shower screen", "مصفاة مجموعة 58 مم"), 28],
    ["tablets", "clean", L("Pastilles de nettoyage (100)", "Cleaning tablets (100)", "أقراص تنظيف (100)"), 45],
    ["brush", "clean", L("Brosse de groupe", "Group head brush", "فرشاة المجموعة"), 18],
    ["filter", "water", L("Adoucisseur d’eau 8 L", "8 L water softener", "مزيل كلس 8 لتر"), 320],
    ["cartridge", "water", L("Cartouche filtrante de rechange", "Replacement filter cartridge", "خرطوشة تصفية احتياطية"), 120],
    ["cups-espresso", "cups", L("Tasses espresso + soucoupes (6)", "Espresso cups + saucers (6)", "فناجين إسبريسو مع صحون (6)"), 75],
    ["cups-cappu", "cups", L("Tasses cappuccino + soucoupes (6)", "Cappuccino cups + saucers (6)", "فناجين كابتشينو مع صحون (6)"), 95],
    ["thermo", "thermo", L("Thermomètre à lait", "Milk thermometer", "ميزان حرارة الحليب"), 25]
  ];
  /* ---------- état ---------- */
  const G = { vol: null, type: null, budget: null };
  const accSel = new Set(); let accCat = "all";
  const C = { price: 2.5, cups: 150, days: 26, cost: 0.6, fixed: 6000, machine: "g3201", grinder: true };
  let savState = null;

  function chips(name, opts, cur){
    return `<div class="gd-chips" role="group" aria-label="${e(S(name))}">${opts.map(k => `<button type="button" data-gd="${name}:${k}" aria-pressed="${cur === k}">${e(S(k))}</button>`).join("")}</div>`;
  }
  function recommend(){
    const { vol, budget, type } = G;
    let items, why = [];
    if (vol === "v_s") {
      if (budget === "b_1" || ((type === "t_kiosk" || type === "t_office") && budget !== "b_3")) { items = ["g3200f", "g9015c"]; why = ["rSet", "r1g"]; }
      else if (budget === "b_3") { items = ["g3126c", "g9026a"]; why = ["r1g", "rE61", "rGrinder"]; }
      else { items = ["g3111a", "g9026a"]; why = ["r1g", "rGrinder"]; }
    } else if (vol === "v_m") {
      if (budget === "b_1") { items = ["g3120c", "g9026a"]; why = ["r2g", "rGrinder", "rBudget"]; }
      else if (budget === "b_3") { items = ["g3211a", "g9026a"]; why = ["r2g", "rFlow", "rGrinder"]; }
      else { items = ["g3201", "g9026a"]; why = ["r2g", "rGrinder"]; }
    } else if (vol === "v_l") {
      if (budget === "b_1") { items = ["g3120c", "g9026a"]; why = ["r2g", "rGrinder", "rBudget"]; }
      else if (budget === "b_3") { items = ["g3211a", "g9026a"]; why = ["r2g", "rFlow", "rGrinder"]; }
      else { items = ["g3201", "g9026a"]; why = ["r2g", "rGrinder"]; }
    } else {
      items = ["g3211a", "g9026a", "g9026a"]; why = ["r2g", "rFlow", "rTwoGrinders"];
      if (budget === "b_1" || budget === "b_2") why.push("rBudget");
    }
    return { items, why };
  }
  function guideResult(){
    if (!G.vol) return `<p class="gd-wait">${e(S("gWait"))}</p>`;
    const { items, why } = recommend();
    const main = byId[items[0]];
    const counts = {}; items.forEach(id => counts[id] = (counts[id] || 0) + 1);
    const list = Object.entries(counts).map(([id, n]) => `${n > 1 ? n + " × " : ""}${pname(byId[id])}`);
    return `<div class="gd-card">
      <div class="gd-img"><img src="${imgOf(main)}" alt="${e(pname(main))}" loading="lazy"></div>
      <div class="gd-txt">
        <span class="label">${e(S("gReco"))}</span>
        <h3>${list.map(e).join(" + ")}</h3>
        <ul>${why.map(k => `<li>${e(S(k))}</li>`).join("")}</ul>
        <div class="gd-total"><small>${e(S("gTotal"))}</small><b>${e(t("from"))} ${e(money(sum(items)))}</b></div>
        <div class="gd-btns"><button class="btn" type="button" data-gdquote>${e(S("gQuote"))}</button><a class="btn ghost" href="${purl(main)}" data-open="${main.id}">${e(S("gSheet"))}</a></div>
        <p class="gd-note">${e(S("gNote"))}</p>
      </div></div>`;
  }
  function renderGuide(){
    const el = $("guide"); if (!el) return;
    el.innerHTML = `<div class="wrap">
      <div class="head"><div class="stack"><p class="label">${e(S("gLabel"))}</p><h2>${e(S("gH"))}</h2></div><p class="lede">${e(S("gLede"))}</p></div>
      <div class="gd">
        <div class="gd-qs">
          <div class="gd-q"><h3>1 · ${e(S("q1"))}</h3>${chips("vol", ["v_s", "v_m", "v_l", "v_xl"], G.vol)}</div>
          <div class="gd-q"><h3>2 · ${e(S("q2"))}</h3>${chips("type", ["t_cafe", "t_resto", "t_kiosk", "t_office"], G.type)}</div>
          <div class="gd-q"><h3>3 · ${e(S("q3"))}</h3>${chips("budget", ["b_1", "b_2", "b_3", "b_0"], G.budget)}</div>
        </div>
        <div class="gd-res" id="gdRes" aria-live="polite">${guideResult()}</div>
      </div></div>`;
  }

  // [name, description, items, cash price incl. VAT (about 10% off, rounded below a round number)]
  const PACKS = [["pk1", "pk1d", ["g3200f", "g9015c"], 3650], ["pk2", "pk2d", ["g3120c", "g9015c"], 7250], ["pk3", "pk3d", ["g3126c", "g9026a"], 8450], ["pk4", "pk4d", ["g3211a", "g9026a"], 11490]];
  function packPrice(i){
    const base = sum(PACKS[i][2]), o = packOpt[i] || "cash";
    if (o === "cash") return `<small>${e(S("pFrom"))} <s>${e(money(base))}</s></small><b>${e(money(PACKS[i][3] || Math.round(base * 0.9)))}</b><span>${e(S("dCash"))}</span>`;
    const pl = plan(base, o);
    return `<small>${e(fill(S("dPlanSub"), { n: pl.n }))}</small><b>${e(T(STR.dPlanBig).replace("{m}", money(pl.m)).replace("{n}", pl.n))}</b><span>${e(fill(S("dPlan"), { d: money(pl.dep), n: pl.n }))}</span>`;
  }
  function renderPacks(){
    const el = $("packs"); if (!el) return;
    el.innerHTML = `<div class="wrap">
      <div class="head"><div class="stack"><p class="label">${e(S("pLabel"))}</p><h2>${e(S("pH"))}</h2></div><p class="lede">${e(S("pLede"))}</p></div>
      <div class="pk-grid">${PACKS.map(([n, d, ids], i) => `<article class="pk${i === 1 ? " hi" : ""}">
        <div class="pk-img"><img src="img/packs/pack${i + 1}.jpg" alt="${e(ids.map(id => pname(byId[id])).join(" + "))}" loading="lazy" style="padding:0;object-fit:cover"><span class="pk-tag">${e(S("pTag"))}</span></div>
        <h3>${e(S(n))}</h3><p class="pk-d">${e(S(d))}</p>
        <ul><li><b>${ids.map(id => e(pname(byId[id]))).join(" + ")}</b></li><li>${e(S("pInc1"))}</li><li>${e(S("pInc2"))}</li><li>${e(S("pInc3"))}</li></ul>
        <div class="pk-opts" role="group" aria-label="${e(S("oPick"))}">${["cash", "12", "24"].map(o => `<button type="button" data-packopt="${i}:${o}" aria-pressed="${(packOpt[i] || "cash") === o}">${e(S(o === "cash" ? "oCash" : "o" + o))}</button>`).join("")}</div>
        <div class="pk-price" id="pkp${i}">${packPrice(i)}</div>
        <button class="btn${i === 1 ? "" : " ghost"}" type="button" data-pack="${i}">${e(S("pBtn"))}</button></article>`).join("")}</div>
      <p class="pk-note">${e(S("pNote"))}</p>
      <div class="pay"><div><h3>${e(S("payH"))}</h3><p>${e(S("payP"))}</p></div><button class="btn wa" type="button" data-paywa>${e(S("payBtn"))}</button></div>
    </div>`;
  }

  const ICONS = {
    tamper: '<path d="M8 3h8v5H8z"/><path d="M12 8v5"/><path d="M5 13h14v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/>',
    mat: '<rect x="3" y="8" width="18" height="10" rx="2"/><path d="M7 8V6h10v2"/>',
    jugs: '<path d="M7 5h9l-1 15H8z"/><path d="M16 8h2a2 2 0 0 1 0 4h-2.3"/><path d="M7 5 5 3"/>',
    knock: '<path d="M4 9h16l-2 11H6z"/><path d="M4 9h16"/><path d="M9 6h6"/>',
    scale: '<rect x="3" y="10" width="18" height="9" rx="2"/><path d="M8 14h4"/><circle cx="16" cy="14.5" r="1.5"/><path d="M6 10V7h12v3"/>',
    dist: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/>',
    baskets: '<ellipse cx="12" cy="8" rx="8" ry="3"/><path d="M4 8l2 9c1 2 11 2 12 0l2-9"/>',
    gaskets: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5"/>',
    clean: '<path d="M9 3h6v4H9z"/><path d="M7 7h10l-1 14H8z"/><path d="M10 12h4"/>',
    water: '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',
    cups: '<path d="M4 9h12v4a6 6 0 0 1-12 0z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2.5"/><path d="M3 20h15"/>',
    thermo: '<path d="M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>'
  };
  function renderAcc(){
    const el = $("accessoires"); if (!el) return;
    const items = ACC_ITEMS.filter(([, c]) => accCat === "all" || c === accCat);
    el.innerHTML = `<div class="wrap">
      <div class="head"><div class="stack"><p class="label">${e(S("aLabel"))}</p><h2>${e(S("aH"))}</h2></div><p class="lede">${e(S("aLede"))}</p></div>
      <div class="acc-cats" role="group" aria-label="${e(S("aLabel"))}"><button type="button" data-acccat="all" aria-pressed="${accCat === "all"}">${e(S("aAll"))}</button>${ACC.filter(([k]) => ACC_ITEMS.some(([, c]) => c === k)).map(([k, n]) => `<button type="button" data-acccat="${k}" aria-pressed="${accCat === k}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>${e(T(n))}</button>`).join("")}</div>
      <div class="acc-items">${items.map(([id, c, n, pr]) => `<div class="acc-item"><div class="pic"><img src="img/acc/${id}.svg" alt="${e(T(n))}" loading="lazy" width="200" height="200"></div>
        <span class="acat">${e(T((ACC.find(([k]) => k === c) || [, L("", "", "")])[1]))}</span><b>${e(T(n))}</b><span class="pr">${e(money(pr))}</span>${window.FE_CART ? FE_CART.stockBadge("acc:" + id) : ""}
        ${window.FE_CART ? FE_CART.buyButton("acc:" + id) : `<button type="button" class="btn buy" data-buy="acc:${id}">${e(S("aBuy"))}</button>`}</div>`).join("")}</div>
      <p class="acc-note">${e(S("aDemo"))} <button type="button" class="link" data-accother>${e(S("aOther"))}</button></p>
    </div>`;
  }


  function calcOut(){
    const n = v => Math.max(0, Number(String(v).replace(",", ".")) || 0);
    const equip = byId[C.machine].price[0] + (C.grinder && byId[C.machine].cat === "machine" ? byId.g9026a.price[0] : 0);
    const m = n(C.price) - n(C.cost), monthly = m * n(C.cups) * n(C.days), net = monthly - n(C.fixed);
    const fmt = x => num(Math.round(x * 100) / 100);
    const pay = net <= 0 ? S("cNever") : T(STR.cMonthsU).replace("{n}", num(Math.max(0.1, Math.round(equip / net * 10) / 10)));
    return `<div><small>${e(S("cEquip"))}</small><b>${e(money(equip))}</b></div>
      <div><small>${e(S("cMargin"))}</small><b>${e(fmt(m))} ${e(t("cur"))}</b></div>
      <div><small>${e(S("cMonth"))}</small><b>${e(money(Math.round(monthly)))}</b></div>
      <div><small>${e(S("cNet"))}</small><b>${e(money(Math.round(net)))}</b></div>
      <div class="hl"><small>${e(S("cPay"))}</small><b>${e(pay)}</b></div>`;
  }
  function renderCalc(){
    const el = $("rentabilite"); if (!el) return;
    const machines = PRODUCTS.filter(p => p.cat === "machine");
    const f = (id, lab, val, step) => `<div class="f"><label for="${id}">${e(S(lab))}</label><input id="${id}" type="number" inputmode="decimal" min="0" step="${step}" value="${val}" data-calc="${id.slice(2)}"></div>`;
    el.innerHTML = `<div class="wrap">
      <div class="head"><div class="stack"><p class="label">${e(S("cLabel"))}</p><h2>${e(S("cH"))}</h2></div><p class="lede">${e(S("cLede"))}</p></div>
      <div class="calc">
        <div class="calc-in">
          ${f("c_price", "cPrice", C.price, "0.1")}${f("c_cups", "cCups", C.cups, "10")}${f("c_days", "cDays", C.days, "1")}${f("c_cost", "cCost", C.cost, "0.05")}${f("c_fixed", "cFixed", C.fixed, "100")}
          <div class="f"><label for="c_machine">${e(S("cMachine"))}</label><select id="c_machine" data-calc="machine">${machines.map(p => `<option value="${p.id}"${p.id === C.machine ? " selected" : ""}>${e(pname(p))} · ${e(t("from"))} ${e(money(p.price[0]))}</option>`).join("")}</select></div>
          <label class="ck"><input type="checkbox" data-calc="grinder"${C.grinder ? " checked" : ""}> ${e(S("cGrinder"))}</label>
        </div>
        <div class="calc-out" id="calcOut" aria-live="polite">${calcOut()}</div>
      </div>
      <p class="calc-note">${e(S("cNote"))}</p></div>`;
  }

  function savPanel(){
    if (savState && savState.done) return `<div class="sav-ok" role="status"><p>${e(T(STR.sOk).replace("{n}", savState.name))}</p></div>`;
    const kinds = ["k1", "k2", "k3", "k4"];
    return `<form class="sav-form" id="savForm" novalidate>
      <div class="f"><label for="sName">${e(S("sName"))}</label><input id="sName" autocomplete="name" required></div>
      <div class="f"><label for="sPhone">${e(S("sPhone"))}</label><input id="sPhone" type="tel" autocomplete="tel" placeholder="+216" required dir="ltr"></div>
      <div class="f"><label for="sCity">${e(S("sCity"))}</label><input id="sCity" autocomplete="address-level2"></div>
      <div class="f"><label for="sModel">${e(S("sModel"))}</label><select id="sModel">${PRODUCTS.map(p => `<option>${e(pname(p))}</option>`).join("")}<option>${e(S("sOther"))}</option></select></div>
      <div class="f full"><label for="sKind">${e(S("sKind"))}</label><select id="sKind">${kinds.map(k => `<option>${e(S(k))}</option>`).join("")}</select></div>
      <div class="f full"><label for="sProb">${e(S("sProb"))}</label><textarea id="sProb" rows="4" placeholder="${e(S("sPh"))}" required></textarea></div>
      <input type="text" name="_honey" id="sHoney" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
      <p class="sav-err" id="savErr" role="alert">${savState && savState.fail ? e(S("sFail")) : ""}</p>
      <div class="sav-btns full"><button class="btn" type="submit" id="savSend">${e(S("sSend"))}</button><button class="btn wa" type="button" data-savwa>${e(S("sWa"))}</button></div>
    </form>`;
  }
  function renderSav(){
    const el = $("sav"); if (!el) return;
    const keep = {}; ["sName", "sPhone", "sCity", "sProb"].forEach(id => { const x = $(id); if (x) keep[id] = x.value; });
    el.innerHTML = `<div class="wrap sav">
      <div class="stack"><p class="label">${e(S("sLabel"))}</p><h2>${e(S("sH"))}</h2><p class="lede">${e(S("sLede"))}</p></div>
      <div id="savBox">${savPanel()}</div></div>`;
    Object.entries(keep).forEach(([id, v]) => { const x = $(id); if (x) x.value = v; });
  }

  function renderStatic(){
    document.querySelectorAll("[data-ft]").forEach(x => { x.textContent = S(x.dataset.ft); });
    document.querySelectorAll("[data-fhref]").forEach(x => { x.href = x.dataset["fhref" + lang] || x.dataset.fhref; });
  }
  function render(){ renderStatic(); renderGuide(); renderPacks(); renderAcc(); renderCalc(); renderSav(); }

  /* ---------- événements ---------- */
  document.addEventListener("click", ev => {
    const g = ev.target.closest("[data-gd]");
    if (g) { const [k, v] = g.dataset.gd.split(":"); G[k] = G[k] === v ? null : v; renderGuide(); if (k === "vol" && G.vol) track("guide-" + G.vol, "Guide de choix"); return; }
    if (ev.target.closest("[data-gdquote]")) {
      const { items } = recommend(); const counts = {}; items.forEach(id => counts[id] = (counts[id] || 0) + 1);
      const list = Object.entries(counts).map(([id, n]) => `${n > 1 ? n + " × " : ""}${pname(byId[id])}`).join(" + ");
      quote(items[0], fill(S("gMsg"), { items: list, type: G.type ? S(G.type) : "—", vol: S(G.vol) }));
      track("guide-devis", "Guide de choix → devis"); return;
    }
    const pk = ev.target.closest("[data-pack]");
    if (pk) { const k = +pk.dataset.pack, opt = packOpt[k] || "cash"; const [n, , ids] = PACKS[k]; quote(ids[0], fill(S("pMsg"), { pack: S(n), items: ids.map(id => pname(byId[id])).join(" + "), opt: S(opt === "cash" ? "pOptCash" : "pOpt" + opt) })); track("pack-" + (k + 1) + "-" + opt, "Pack " + S(n) + " (" + opt + ")"); return; }
    const po = ev.target.closest("[data-packopt]");
    if (po) { const [k, o] = po.dataset.packopt.split(":"); packOpt[k] = o; po.parentElement.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b === po)); $("pkp" + k).innerHTML = packPrice(+k); return; }
    if (ev.target.closest("[data-paywa]")) { openLink(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(S("payMsg"))}`); track("paiement-whatsapp", "Facilités de paiement"); return; }
    const ac = ev.target.closest("[data-acccat]");
    if (ac) { accCat = ac.dataset.acccat; renderAcc(); return; }
    if (ev.target.closest("[data-accother]")) { quote(null, S("aOtherMsg")); return; }
    if (ev.target.closest("[data-accbuy]")) {
      if (!accSel.size) { toast(S("aNone")); return; }
      if (window.FE_CART) { const n = accSel.size; accSel.forEach(k => FE_CART.add("acc:" + k, 1, true)); accSel.clear(); renderAcc(); FE_CART.showAdded(n + " × " + S("aLabel").toLowerCase()); }
      return;
    }
    if (ev.target.closest("[data-accgo]")) {
      if (!accSel.size) { toast(S("aNone")); return; }
      const items = ACC.filter(([k]) => accSel.has(k)).map(([, n]) => T(n)).join(", ");
      quote(null, fill(S("aMsg"), { items })); track("accessoires-devis", "Accessoires → devis"); return;
    }
    if (ev.target.closest("[data-savwa]")) {
      const v = id => ($(id) ? $(id).value.trim() : "");
      openLink(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(fill(S("sWaMsg"), { n: v("sName"), c: v("sCity"), m: v("sModel"), k: v("sKind"), p: v("sProb") }))}`);
      track("sav-whatsapp", "SAV WhatsApp"); return;
    }
  });
  document.addEventListener("change", ev => {
    const a = ev.target.closest("[data-acc]");
    if (a) { if (a.checked) accSel.add(a.dataset.acc); else accSel.delete(a.dataset.acc); const b = document.querySelector("[data-accgo]"); if (b) b.textContent = T(STR.aBtn).replace("{n}", accSel.size); const bb = document.querySelector("[data-accbuy]"); if (bb) bb.textContent = T(STR.aBuy).replace("{n}", accSel.size); return; }
    const c = ev.target.closest("[data-calc]");
    if (c) {
      const k = c.dataset.calc;
      if (k === "grinder") C.grinder = c.checked; else if (k === "machine") { C.machine = c.value; const g = document.querySelector('[data-calc="grinder"]');  } else C[k] = c.value;
      $("calcOut").innerHTML = calcOut();
    }
  });
  document.addEventListener("input", ev => { const c = ev.target.closest("input[data-calc]"); if (c && c.type === "number") { C[c.dataset.calc] = c.value; $("calcOut").innerHTML = calcOut(); } });
  document.addEventListener("submit", ev => {
    if (ev.target.id !== "savForm") return;
    ev.preventDefault();
    const v = id => $(id).value.trim();
    if (!v("sName") || !v("sPhone") || !v("sProb")) { $("savErr").textContent = S("sReq"); return; }
    if (v("sHoney")) return;
    const btn = $("savSend"); btn.disabled = true; btn.textContent = S("sSending");
    const data = { "Nom": v("sName"), "Téléphone": v("sPhone"), "Ville": v("sCity"), "Machine": v("sModel"), "Type": v("sKind"), "Problème": v("sProb"), "Langue": lang,
      _subject: `Demande SAV — ${v("sModel")} — ${v("sName")} (${v("sCity")})`, _template: "table", _captcha: "false" };
    fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
      .then(r => r.ok ? r.json() : Promise.reject(r)).then(j => { if (String(j.success) === "false") throw j; savState = { done: true, name: v("sName") }; $("savBox").innerHTML = savPanel(); track("sav-formulaire", "SAV formulaire"); })
      .catch(() => { savState = { fail: true }; btn.disabled = false; btn.textContent = S("sSend"); $("savErr").textContent = S("sFail"); });
  });

  window.FE_TOOLS = { render, acc: ACC, accItems: ACC_ITEMS };
  render();
})();
