/* Partenaires Formosa : torréfacteurs (cafés vendus sur la boutique) et réseau de techniciens agréés (fr / en / ar).
   Profils de DÉMONSTRATION : noms, adresses et visuels fictifs, à remplacer par les vrais partenaires.
   Utilise index.html (T, lang, money, esc, sheet, closeSheet, openId, lastFocus, track, openLink, CONFIG, FORM_ENDPOINT, toast)
   et commande.js (FE_CART) pour l'achat. */
(function () {
  const L = (fr, en, ar) => ({ fr, en, ar });
  const $ = id => document.getElementById(id);
  const e = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const S = k => T(STR[k]);
  const fill = (s, o) => Object.entries(o).reduce((a, [k, v]) => a.split("{" + k + "}").join(v), s);
  const mapUrl = q => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);

  const STR = {
    navCoffee: L("cafés", "coffee", "القهوة"),
    navTech: L("techniciens", "technicians", "التقنيون"),
    demo: L("Profils de démonstration : noms, adresses et photos sont fictifs, en attendant nos premiers partenaires.",
            "Demo profiles: names, addresses and pictures are fictional while we sign our first partners.",
            "ملفات تجريبية: الأسماء والعناوين والصور خيالية إلى حين انضمام أول شركائنا."),
    rLabel: L("Torréfacteurs partenaires", "Partner roasters", "المحمّصون الشركاء"),
    rH: L("le café des torréfacteurs tunisiens.", "coffee from Tunisian roasters.", "قهوة المحمّصين التونسيين."),
    rLede: L("Des cafés torréfiés en Tunisie, choisis pour l’espresso. Commandez-les avec votre machine ou séparément : livraison 7 DT, paiement à la livraison.",
             "Coffee roasted in Tunisia, chosen for espresso. Order it with your machine or on its own: 7 DT delivery, cash on delivery.",
             "قهوة محمّصة في تونس ومختارة للإسبريسو. اطلبها مع آلتك أو وحدها: التوصيل 7 د.ت والدفع عند الاستلام."),
    rAll: L("Tous les torréfacteurs", "All roasters", "كل المحمّصين"),
    rSee: L("Voir le torréfacteur", "See the roaster", "عرض المحمّص"),
    rCoffees: L("Ses cafés", "Their coffees", "قهوته"),
    origin: L("Origine", "Origin", "المصدر"), process: L("Procédé", "Process", "المعالجة"), roast: L("Torréfaction", "Roast", "التحميص"),
    notes: L("Notes", "Notes", "النكهات"), use: L("Idéal pour", "Best for", "مثالي لـ"),
    tLabel: L("Techniciens agréés", "Approved technicians", "تقنيون معتمدون"),
    tH: L("un technicien près de chez vous.", "a technician near you.", "تقني قريب منك."),
    tLede: L("Installation, entretien et réparation par des techniciens formés sur les machines Gemilai. Formosa Espresso planifie l’intervention et garantit le travail.",
             "Installation, maintenance and repair by technicians trained on Gemilai machines. Formosa Espresso schedules the visit and guarantees the work.",
             "تركيب وصيانة وإصلاح على يد تقنيين مكوَّنين على آلات Gemilai. تتولى Formosa Espresso برمجة التدخل وضمان العمل."),
    tAll: L("Toutes les régions", "All regions", "كل الجهات"),
    tSee: L("Voir le profil", "See profile", "عرض الملف"),
    zones: L("Zones couvertes", "Areas covered", "المناطق المغطاة"),
    skills: L("Spécialités", "Specialities", "الاختصاصات"),
    exp: L("Expérience", "Experience", "الخبرة"), years: L("{n} ans", "{n} years", "{n} سنة"),
    langs: L("Langues", "Languages", "اللغات"),
    hours: L("Horaires", "Hours", "أوقات العمل"),
    address: L("Adresse", "Address", "العنوان"),
    map: L("Voir sur Google Maps", "See on Google Maps", "عرض على خرائط Google"),
    since: L("Depuis", "Since", "منذ"),
    approved: L("Partenaire agréé Formosa", "Formosa approved partner", "شريك معتمد من Formosa"),
    book: L("Demander une intervention", "Book a visit", "اطلب تدخّلًا"),
    bookMsg: L("Bonjour Formosa Espresso, je souhaite une intervention de {n} ({b}) à {c}. Machine : ",
               "Hello Formosa Espresso, I would like a visit from {n} ({b}) in {c}. Machine: ",
               "مرحبًا Formosa Espresso، أرغب في تدخّل من {n} ({b}) في {c}. الآلة: "),
    bookNote: L("Les interventions passent par Formosa Espresso : un seul numéro, un devis clair, et la garantie respectée.",
                "Visits are booked through Formosa Espresso: one number, a clear quote, and your warranty respected.",
                "تُحجز التدخلات عبر Formosa Espresso: رقم واحد، عرض سعر واضح، واحترام الضمان."),
    savForm: L("Formulaire SAV", "Service form", "استمارة الصيانة"),
    close: L("Fermer", "Close", "إغلاق"),
    /* programme partenaire */
    pLabel: L("Programme partenaire", "Partner programme", "برنامج الشراكة"),
    pH: L("travaillons ensemble.", "let’s work together.", "لنعمل معًا."),
    pRoaster: L("Vous êtes torréfacteur", "You are a roaster", "أنت محمّص"),
    pRoasterTxt: L("Vendez vos cafés à nos clients cafés, restaurants et particuliers. Vous fixez vos prix ; nous mettons vos cafés en ligne, gérons la commande, la livraison et l’encaissement, puis vous reversons les ventes chaque mois, commission convenue ensemble.",
                   "Sell your coffee to our café, restaurant and home customers. You set your prices; we list your coffee, handle orders, delivery and payment, then pay you monthly, at a commission agreed together.",
                   "بِع قهوتك لزبائننا من المقاهي والمطاعم والأفراد. أنت تحدد الأسعار؛ ونحن نعرض قهوتك ونتولى الطلب والتوصيل والتحصيل، ثم نحوّل لك المبيعات شهريًا بعمولة نتفق عليها معًا."),
    pTech: L("Vous êtes technicien", "You are a technician", "أنت تقني"),
    pTechTxt: L("Rejoignez notre réseau : formation sur les machines Gemilai, pièces d’origine à prix partenaire, interventions envoyées dans votre région et paiement rapide. Nous demandons 3 ans d’expérience, un véhicule et une intervention sous 48 h.",
                "Join our network: training on Gemilai machines, genuine parts at partner prices, jobs sent in your area and fast payment. We ask for 3 years’ experience, a vehicle and on-site visits within 48 hours.",
                "انضم إلى شبكتنا: تكوين على آلات Gemilai، قطع غيار أصلية بأسعار الشركاء، تدخلات في جهتك ودفع سريع. نشترط 3 سنوات خبرة، وسيلة نقل، والتدخل خلال 48 ساعة."),
    pApply: L("Devenir partenaire", "Become a partner", "كن شريكًا"),
    fKind: L("Je suis", "I am", "أنا"), kRoaster: L("torréfacteur", "a roaster", "محمّص"), kTech: L("technicien", "a technician", "تقني"),
    fName: L("Nom et prénom", "Full name", "الاسم واللقب"), fBiz: L("Entreprise", "Business name", "اسم المؤسسة"),
    fCity: L("Ville", "City", "المدينة"), fPhone: L("Téléphone", "Phone", "الهاتف"), fEmail: L("E-mail", "E-mail", "البريد الإلكتروني"),
    fMsg: L("Présentez votre activité", "Tell us about your business", "عرّف بنشاطك"),
    fMsgPh: L("Années d’expérience, zones, cafés proposés, capacité…", "Years of experience, areas, coffees offered, capacity…", "سنوات الخبرة، المناطق، أنواع القهوة، القدرة…"),
    fSend: L("Envoyer ma candidature", "Send my application", "أرسل طلبي"), fSending: L("Envoi…", "Sending…", "جارٍ الإرسال…"),
    fReq: L("Indiquez au moins votre nom, votre téléphone et votre ville.", "Please give at least your name, phone and city.", "يرجى ذكر الاسم والهاتف والمدينة على الأقل."),
    fOk: L("Merci {n} ! Nous vous recontactons sous 48 h pour en parler.", "Thank you {n}! We will get back to you within 48 hours.", "شكرًا {n}! سنتواصل معك خلال 48 ساعة."),
    fFail: L("L’envoi n’a pas abouti. Écrivez-nous sur WhatsApp.", "Sending failed. Please message us on WhatsApp.", "تعذّر الإرسال. راسلنا على واتساب.")
  };

  /* ---------- torréfacteurs (fictifs) ---------- */
  const ROASTERS = [
    { id: "nakhla", name: "Atelier Nakhla", city: L("La Marsa, Tunis", "La Marsa, Tunis", "المرسى، تونس"), gov: "Tunis",
      address: "Avenue Habib Bourguiba, La Marsa 2070, Tunisie", since: 2019,
      tag: L("Cafés de spécialité, origines uniques", "Speciality coffee, single origins", "قهوة مختصة، مصدر واحد"),
      bio: L("Petit atelier de torréfaction artisanale : des lots d’origine unique, torréfiés chaque semaine en petites quantités, pour des espressos fruités et des filtres.",
             "A small craft roastery: single-origin lots, roasted weekly in small batches, for fruity espressos and filter coffee.",
             "ورشة تحميص حرفية صغيرة: دفعات من مصدر واحد تُحمَّص أسبوعيًا بكميات صغيرة، لإسبريسو بنكهة الفواكه وللقهوة المقطّرة."),
      hours: L("Lundi – samedi, 9 h – 19 h", "Monday – Saturday, 9 am – 7 pm", "الاثنين – السبت، 9:00 – 19:00") },
    { id: "kerkennah", name: "Grains de Kerkennah", city: L("Sfax", "Sfax", "صفاقس"), gov: "Sfax",
      address: "Route de Tunis km 4, Sfax 3000, Tunisie", since: 2008,
      tag: L("Mélanges espresso pour cafés", "Espresso blends for cafés", "خلطات إسبريسو للمقاهي"),
      bio: L("Torréfaction familiale qui fournit les cafés du Sud depuis plus de quinze ans : des mélanges réguliers, généreux en crème et qui tiennent bien dans le lait.",
             "A family roastery supplying cafés in the South for over fifteen years: consistent blends, rich crema, holding up well in milk.",
             "محمصة عائلية تزوّد مقاهي الجنوب منذ أكثر من خمس عشرة سنة: خلطات ثابتة، كريما غنية، وطعم يصمد مع الحليب."),
      hours: L("Lundi – vendredi, 8 h – 17 h", "Monday – Friday, 8 am – 5 pm", "الاثنين – الجمعة، 8:00 – 17:00") },
    { id: "bnina", name: "Maison Bnina", city: L("Sousse", "Sousse", "سوسة"), gov: "Sousse",
      address: "Boulevard du 14 Janvier, Sousse 4000, Tunisie", since: 2014,
      tag: L("Café turc, cardamome et espresso", "Turkish coffee, cardamom and espresso", "قهوة تركية، بالهيل وإسبريسو"),
      bio: L("Maison de Sousse connue pour son café turc moulu extra-fin et son mélange à la cardamome, avec aussi un espresso pensé pour les salons de thé.",
             "A Sousse house known for its extra-fine Turkish coffee and its cardamom blend, plus an espresso made for tea rooms.",
             "دار من سوسة معروفة بقهوتها التركية المطحونة ناعمًا جدًا وخلطتها بالهيل، إضافة إلى إسبريسو مخصص لقاعات الشاي."),
      hours: L("Tous les jours, 8 h – 20 h", "Every day, 8 am – 8 pm", "كل الأيام، 8:00 – 20:00") }
  ];
  /* [id, roaster, name, origin, process, roast, notes, use, weight, price DT] */
  const COFFEES = [
    ["nakhla-ethiopie", "nakhla", L("Éthiopie Yirgacheffe", "Ethiopia Yirgacheffe", "إثيوبيا يرغاتشيفي"), L("Éthiopie", "Ethiopia", "إثيوبيا"), L("lavé", "washed", "مغسولة"), L("claire", "light", "فاتح"), L("jasmin, agrumes, thé noir", "jasmine, citrus, black tea", "ياسمين، حمضيات، شاي أسود"), L("espresso fruité, filtre", "fruity espresso, filter", "إسبريسو بالفواكه، قهوة مقطّرة"), "250 g", 38],
    ["nakhla-colombie", "nakhla", L("Colombie Huila", "Colombia Huila", "كولومبيا ويلا"), L("Colombie", "Colombia", "كولومبيا"), L("lavé", "washed", "مغسولة"), L("moyenne", "medium", "متوسط"), L("caramel, pomme rouge, cacao", "caramel, red apple, cocoa", "كراميل، تفاح أحمر، كاكاو"), L("espresso, cappuccino", "espresso, cappuccino", "إسبريسو، كابتشينو"), "250 g", 34],
    ["nakhla-bresil", "nakhla", L("Brésil Cerrado", "Brazil Cerrado", "البرازيل سيرادو"), L("Brésil", "Brazil", "البرازيل"), L("nature", "natural", "طبيعية"), L("moyenne", "medium", "متوسط"), L("noisette, chocolat au lait", "hazelnut, milk chocolate", "بندق، شوكولاتة بالحليب"), L("espresso du quotidien", "everyday espresso", "إسبريسو يومي"), "1 kg", 95],
    ["kerk-maison", "kerkennah", L("Mélange Maison", "House Blend", "خلطة الدار"), L("Brésil 70 %, Inde 30 %", "Brazil 70%, India 30%", "البرازيل 70%، الهند 30%"), L("nature et lavé", "natural and washed", "طبيعية ومغسولة"), L("moyenne-foncée", "medium-dark", "متوسط إلى داكن"), L("chocolat noir, crème épaisse", "dark chocolate, thick crema", "شوكولاتة داكنة، كريما كثيفة"), L("espresso de café, lait", "café espresso, milk drinks", "إسبريسو المقاهي، مشروبات الحليب"), "1 kg", 62],
    ["kerk-intenso", "kerkennah", L("Intenso Bar", "Intenso Bar", "إنتنسو بار"), L("arabica 60 %, robusta 40 %", "60% arabica, 40% robusta", "أرابيكا 60%، روبوستا 40%"), L("mélange", "blend", "خلطة"), L("foncée", "dark", "داكن"), L("cacao, épices, longue tenue en lait", "cocoa, spice, strong in milk", "كاكاو، توابل، يصمد مع الحليب"), L("direct, café au lait", "direct, café au lait", "قهوة مباشرة، قهوة بالحليب"), "1 kg", 54],
    ["kerk-decaf", "kerkennah", L("Décaféiné Colombie", "Colombia Decaf", "كولومبيا منزوعة الكافيين"), L("Colombie", "Colombia", "كولومبيا"), L("décaféiné à l’eau", "water-process decaf", "منزوعة الكافيين بالماء"), L("moyenne", "medium", "متوسط"), L("cacao, sucre roux", "cocoa, brown sugar", "كاكاو، سكر بني"), L("espresso sans caféine", "caffeine-free espresso", "إسبريسو دون كافيين"), "500 g", 42],
    ["bnina-turc", "bnina", L("Café turc", "Turkish coffee", "قهوة تركية"), L("Brésil", "Brazil", "البرازيل"), L("mouture extra-fine", "extra-fine grind", "طحن ناعم جدًا"), L("moyenne-foncée", "medium-dark", "متوسط إلى داكن"), L("cacao, pain grillé", "cocoa, toast", "كاكاو، خبز محمّص"), L("zezwa, café turc", "zezwa, Turkish coffee", "الززوة، القهوة التركية"), "250 g", 14],
    ["bnina-cardamome", "bnina", L("Café à la cardamome", "Cardamom coffee", "قهوة بالهيل"), L("Brésil + cardamome", "Brazil + cardamom", "البرازيل + هيل"), L("mouture fine", "fine grind", "طحن ناعم"), L("moyenne", "medium", "متوسط"), L("cardamome, miel", "cardamom, honey", "هيل، عسل"), L("café turc parfumé", "spiced Turkish coffee", "قهوة تركية معطرة"), "250 g", 16],
    ["bnina-espresso", "bnina", L("Espresso Sousse", "Sousse Espresso", "إسبريسو سوسة"), L("Brésil, Ouganda", "Brazil, Uganda", "البرازيل، أوغندا"), L("mélange", "blend", "خلطة"), L("moyenne-foncée", "medium-dark", "متوسط إلى داكن"), L("noisette, caramel", "hazelnut, caramel", "بندق، كراميل"), L("salon de thé, capucin", "tea room, capucin", "قاعة الشاي، الكابوسان"), "1 kg", 58]
  ];
  const rById = id => ROASTERS.find(r => r.id === id);

  /* ---------- techniciens (fictifs) ---------- */
  const techImg = t => `img/partners/tech-${t.id}.${t.photo || "svg"}`;
  const TECHS = [
    { id: "karim", photo: "jpg", name: "Karim B.", biz: "KB Service Café", city: L("Mégrine, Ben Arous", "Mégrine, Ben Arous", "مقرين، بن عروس"), region: "nord-est",
      address: "Avenue de la République, Mégrine 2033, Ben Arous", years: 12, langs: L("arabe, français", "Arabic, French", "العربية، الفرنسية"),
      zones: L("Tunis, Ariana, Ben Arous, Manouba", "Tunis, Ariana, Ben Arous, Manouba", "تونس، أريانة، بن عروس، منوبة"),
      skills: [L("installation et mise en service", "installation and set-up", "التركيب والتشغيل"), L("cartes électroniques et affichages", "control boards and displays", "البطاقات الإلكترونية والشاشات"), L("contrats d’entretien", "maintenance contracts", "عقود الصيانة")],
      bio: L("Douze ans dans la réparation de machines professionnelles à Tunis, spécialiste des pannes électroniques. Il installe la plupart des machines Gemilai du Grand Tunis.",
             "Twelve years repairing professional machines in Tunis, specialist in electronic faults. He installs most Gemilai machines in Greater Tunis.",
             "اثنتا عشرة سنة في إصلاح الآلات الاحترافية بتونس، مختص في الأعطال الإلكترونية. يتولى تركيب أغلب آلات Gemilai في تونس الكبرى."),
      hours: L("Lundi – samedi, 8 h – 18 h ; urgences le dimanche", "Monday – Saturday, 8 am – 6 pm; Sunday emergencies", "الاثنين – السبت، 8:00 – 18:00؛ الطوارئ يوم الأحد") },
    { id: "sana", name: "Sana M.", biz: "Atelier Barista Pro", city: L("Sousse", "Sousse", "سوسة"), region: "sahel",
      address: "Rue de Palestine, Sousse 4000", years: 7, langs: L("arabe, français, anglais", "Arabic, French, English", "العربية، الفرنسية، الإنجليزية"),
      zones: L("Sousse, Monastir, Mahdia", "Sousse, Monastir, Mahdia", "سوسة، المنستير، المهدية"),
      skills: [L("réglage des moulins", "grinder calibration", "ضبط المطاحن"), L("formation barista", "barista training", "تكوين الباريستا"), L("entretien préventif", "preventive maintenance", "الصيانة الوقائية")],
      bio: L("Ancienne barista devenue technicienne : elle règle machine et moulin ensemble et forme votre équipe le jour de l’installation.",
             "A former barista turned technician: she tunes machine and grinder together and trains your team on installation day.",
             "باريستا سابقة أصبحت تقنية: تضبط الآلة والمطحنة معًا وتكوّن فريقك يوم التركيب."),
      hours: L("Lundi – samedi, 9 h – 18 h", "Monday – Saturday, 9 am – 6 pm", "الاثنين – السبت، 9:00 – 18:00") },
    { id: "youssef", name: "Youssef H.", biz: "Sud Espresso Technique", city: L("Sfax", "Sfax", "صفاقس"), region: "sud",
      address: "Route de Gabès km 2, Sfax 3000", years: 15, langs: L("arabe, français", "Arabic, French", "العربية، الفرنسية"),
      zones: L("Sfax, Gabès, Médenine, Kairouan", "Sfax, Gabès, Médenine, Kairouan", "صفاقس، قابس، مدنين، القيروان"),
      skills: [L("chaudières et résistances", "boilers and heating elements", "الغلايات والمقاومات"), L("pompes et électrovannes", "pumps and solenoid valves", "المضخات والصمامات الكهربائية"), L("détartrage complet", "full descaling", "إزالة الكلس الكاملة")],
      bio: L("Quinze ans d’expérience sur l’hydraulique des machines espresso. Atelier équipé pour le détartrage complet des chaudières.",
             "Fifteen years on espresso machine hydraulics. Workshop equipped for full boiler descaling.",
             "خمس عشرة سنة خبرة في الأجزاء المائية لآلات الإسبريسو. ورشة مجهزة لإزالة الكلس الكاملة من الغلايات."),
      hours: L("Lundi – samedi, 8 h – 17 h", "Monday – Saturday, 8 am – 5 pm", "الاثنين – السبت، 8:00 – 17:00") },
    { id: "hichem", name: "Hichem T.", biz: "Nord Café Service", city: L("Bizerte", "Bizerte", "بنزرت"), region: "nord",
      address: "Avenue Habib Bougatfa, Bizerte 7000", years: 9, langs: L("arabe, français", "Arabic, French", "العربية، الفرنسية"),
      zones: L("Bizerte, Béja, Jendouba", "Bizerte, Béja, Jendouba", "بنزرت، باجة، جندوبة"),
      skills: [L("installation eau et électricité", "water and power hook-up", "توصيل الماء والكهرباء"), L("adoucisseurs et filtres", "softeners and filters", "مزيلات الكلس والفلاتر"), L("dépannage toutes marques", "repairs on all brands", "إصلاح كل العلامات")],
      bio: L("Plombier de formation, il prépare l’arrivée d’eau, l’adoucisseur et l’électricité pour que la machine dure longtemps.",
             "A plumber by training, he prepares the water supply, softener and power so the machine lasts.",
             "سبّاك في الأصل، يجهّز مدخل الماء ومزيل الكلس والكهرباء لتعيش الآلة طويلًا."),
      hours: L("Lundi – vendredi, 8 h – 17 h", "Monday – Friday, 8 am – 5 pm", "الاثنين – الجمعة، 8:00 – 17:00") },
    { id: "walid", name: "Walid S.", biz: "Cap Bon Machines", city: L("Nabeul", "Nabeul", "نابل"), region: "nord-est",
      address: "Avenue Habib Thameur, Nabeul 8000", years: 10, langs: L("arabe, français, italien", "Arabic, French, Italian", "العربية، الفرنسية، الإيطالية"),
      zones: L("Nabeul, Hammamet, Zaghouan", "Nabeul, Hammamet, Zaghouan", "نابل، الحمامات، زغوان"),
      skills: [L("réparation toutes marques", "repairs on all brands", "إصلاح كل العلامات"), L("pièces d’origine", "genuine parts", "قطع غيار أصلية"), L("hôtels et grands comptes", "hotels and large accounts", "النزل والحرفاء الكبار")],
      bio: L("Dix ans au service des hôtels de Hammamet : interventions rapides en saison et stock de pièces sur place.",
             "Ten years serving Hammamet hotels: fast call-outs in season and parts kept in stock locally.",
             "عشر سنوات في خدمة نزل الحمامات: تدخل سريع في الموسم ومخزون قطع غيار في عين المكان."),
      hours: L("Tous les jours en saison, 8 h – 20 h", "Every day in season, 8 am – 8 pm", "كل الأيام في الموسم، 8:00 – 20:00") }
  ];
  const REGIONS = [["nord-est", L("Grand Tunis & Cap Bon", "Greater Tunis & Cap Bon", "تونس الكبرى والوطن القبلي")], ["nord", L("Nord", "North", "الشمال")], ["sahel", L("Sahel", "Sahel", "الساحل")], ["sud", L("Sud", "South", "الجنوب")]];

  let rFilter = "all", tFilter = "all", form = null;

  /* ---------- rendu ---------- */
  const buy = id => window.FE_CART ? FE_CART.buyButton(id) : "";
  const badge = id => window.FE_CART ? FE_CART.stockBadge(id) : "";
  function coffeeCard(c) {
    const [id, rid, n, origin, , roast, notes, , w, price] = c, r = rById(rid);
    return `<div class="acc-item cafe-item"><div class="pic"><img src="img/partners/${id}.svg" alt="${e(T(n))}" loading="lazy" width="200" height="200"></div>
      <button type="button" class="acat link-plain" data-roaster="${rid}">${e(r.name)}</button><b>${e(T(n))} · ${e(w)}</b>
      <span class="cafe-meta">${e(T(origin))} · ${e(S("roast").toLowerCase())} ${e(T(roast))}</span><span class="cafe-notes">${e(T(notes))}</span>
      <span class="pr">${e(money(price))}</span>${badge("cafe:" + id)}${buy("cafe:" + id)}</div>`;
  }
  function renderRoasters() {
    const el = $("torrefacteurs"); if (!el) return;
    const list = COFFEES.filter(c => rFilter === "all" || c[1] === rFilter);
    el.innerHTML = `<div class="wrap">
      <div class="head"><div class="stack"><p class="label">${e(S("rLabel"))}</p><h2>${e(S("rH"))}</h2></div><p class="lede">${e(S("rLede"))}</p></div>
      <div class="roaster-circles">${ROASTERS.map(r => `<button type="button" class="roaster-circle" data-roaster="${r.id}"><img src="img/partners/logo-${r.id}.svg" alt="" width="120" height="120" loading="lazy"><b>${e(r.name)}</b><small>${e(T(r.city))}</small></button>`).join("")}</div>
      <div class="acc-cats" role="group" aria-label="${e(S("rLabel"))}"><button type="button" data-rfilter="all" aria-pressed="${rFilter === "all"}">${e(S("rAll"))}</button>${ROASTERS.map(r => `<button type="button" data-rfilter="${r.id}" aria-pressed="${rFilter === r.id}">${e(r.name)}</button>`).join("")}</div>
      <div class="acc-items">${list.map(coffeeCard).join("")}</div>
      <p class="acc-note">${e(S("demo"))}</p></div>`;
  }
  function techCard(t) {
    return `<button type="button" class="tech-card" data-tech="${t.id}"><img src="${techImg(t)}" alt="" width="200" height="200" loading="lazy">
      <span class="tc-body"><span class="tc-badge">${e(S("approved"))}</span><b>${e(t.name)}</b><small>${e(t.biz)}</small>
      <span class="tc-city"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>${e(T(t.city))}</span>
      <span class="tc-skills">${t.skills.slice(0, 2).map(s => `<i>${e(T(s))}</i>`).join("")}</span><em>${e(S("tSee"))} →</em></span></button>`;
  }
  function renderTechs() {
    const el = $("techniciens"); if (!el) return;
    const list = TECHS.filter(t => tFilter === "all" || t.region === tFilter);
    el.innerHTML = `<div class="wrap">
      <div class="head"><div class="stack"><p class="label">${e(S("tLabel"))}</p><h2>${e(S("tH"))}</h2></div><p class="lede">${e(S("tLede"))}</p></div>
      <div class="acc-cats" role="group" aria-label="${e(S("tLabel"))}"><button type="button" data-tfilter="all" aria-pressed="${tFilter === "all"}">${e(S("tAll"))}</button>${REGIONS.map(([k, n]) => `<button type="button" data-tfilter="${k}" aria-pressed="${tFilter === k}">${e(T(n))}</button>`).join("")}</div>
      <div class="tech-grid">${list.map(techCard).join("")}</div>
      <p class="acc-note">${e(S("demo"))}</p>
      ${programme()}</div>`;
  }
  function programme() {
    return `<div class="partner-prog" id="devenir-partenaire">
      <div class="stack"><p class="label">${e(S("pLabel"))}</p><h3>${e(S("pH"))}</h3>
        <div class="pp-col"><b>${e(S("pRoaster"))}</b><p>${e(S("pRoasterTxt"))}</p></div>
        <div class="pp-col"><b>${e(S("pTech"))}</b><p>${e(S("pTechTxt"))}</p></div></div>
      <div id="ppBox">${ppForm()}</div></div>`;
  }
  function ppForm() {
    if (form && form.done) return `<div class="sav-ok" role="status"><p>${e(fill(S("fOk"), { n: form.name }))}</p></div>`;
    const k = (form && form.kind) || "tech";
    return `<form class="sav-form" id="ppForm" novalidate>
      <div class="f full"><span class="lbl">${e(S("fKind"))}</span><div class="acc-cats" role="radiogroup"><button type="button" role="radio" data-ppkind="roaster" aria-checked="${k === "roaster"}" aria-pressed="${k === "roaster"}">${e(S("kRoaster"))}</button><button type="button" role="radio" data-ppkind="tech" aria-checked="${k === "tech"}" aria-pressed="${k === "tech"}">${e(S("kTech"))}</button></div></div>
      <div class="f"><label for="ppName">${e(S("fName"))}</label><input id="ppName" autocomplete="name" required></div>
      <div class="f"><label for="ppBiz">${e(S("fBiz"))}</label><input id="ppBiz" autocomplete="organization"></div>
      <div class="f"><label for="ppCity">${e(S("fCity"))}</label><input id="ppCity" autocomplete="address-level2" required></div>
      <div class="f"><label for="ppPhone">${e(S("fPhone"))}</label><input id="ppPhone" type="tel" autocomplete="tel" placeholder="+216" dir="ltr" required></div>
      <div class="f full"><label for="ppEmail">${e(S("fEmail"))}</label><input id="ppEmail" type="email" autocomplete="email" dir="ltr"></div>
      <div class="f full"><label for="ppMsg">${e(S("fMsg"))}</label><textarea id="ppMsg" rows="3" placeholder="${e(S("fMsgPh"))}"></textarea></div>
      <input type="text" id="ppHoney" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
      <p class="sav-err" id="ppErr" role="alert">${form && form.fail ? e(S("fFail")) : ""}</p>
      <div class="sav-btns full"><button class="btn" type="submit" id="ppSend">${e(S("fSend"))}</button></div></form>`;
  }

  /* ---------- profils (fiche plein écran) ---------- */
  function shell(crumb, body) {
    return `<div class="sheet-bar"><div class="wrap"><span class="crumb">${e(crumb)}</span><button class="btn ghost" data-close>${e(S("close"))}</button></div></div><div class="wrap pf">${body}</div>`;
  }
  function facts(rows) { return `<dl class="pf-facts">${rows.filter(Boolean).map(([k, v]) => `<div><dt>${e(k)}</dt><dd>${v}</dd></div>`).join("")}</dl>`; }
  function roasterHtml(r) {
    const cs = COFFEES.filter(c => c[1] === r.id);
    return shell(`${S("rLabel").toLowerCase()} / ${r.name.toLowerCase()}`, `
      <div class="pf-head"><img class="pf-logo" src="img/partners/logo-${r.id}.svg" alt="${e(r.name)}" width="160" height="160">
        <div class="stack"><span class="label">${e(T(r.tag))}</span><h2 id="pdName">${e(r.name)}</h2><p class="lede">${e(T(r.bio))}</p>
        ${facts([[S("address"), `<bdi dir="ltr">${e(r.address)}</bdi> <a class="map-link" href="${mapUrl(r.address)}" target="_blank" rel="noopener">${e(S("map"))} ↗</a>`], [S("hours"), e(T(r.hours))], [S("since"), String(r.since)]])}</div></div>
      <h3 class="pf-sub">${e(S("rCoffees"))}</h3>
      <div class="pf-coffees">${cs.map(c => { const [id, , n, origin, proc, roast, notes, use, w, price] = c; return `<div class="pf-coffee"><img src="img/partners/${id}.svg" alt="" width="140" height="140" loading="lazy"><div class="stack"><b>${e(T(n))} · ${e(w)}</b>
        ${facts([[S("origin"), e(T(origin))], [S("process"), e(T(proc))], [S("roast"), e(T(roast))], [S("notes"), e(T(notes))], [S("use"), e(T(use))]])}
        <div class="pf-buy"><span class="pr">${e(money(price))}</span>${badge("cafe:" + id)}${buy("cafe:" + id)}</div></div></div>`; }).join("")}</div>
      <p class="acc-note">${e(S("demo"))}</p>`);
  }
  function techHtml(t) {
    return shell(`${S("tLabel").toLowerCase()} / ${t.name.toLowerCase()}`, `
      <div class="pf-head"><img class="pf-photo" src="${techImg(t)}" alt="${e(t.name)}" width="220" height="220">
        <div class="stack"><span class="tc-badge">${e(S("approved"))}</span><h2 id="pdName">${e(t.name)}</h2><p class="pf-biz">${e(t.biz)} · ${e(T(t.city))}</p><p class="lede">${e(T(t.bio))}</p>
        <div class="ctas"><button type="button" class="btn" data-book="${t.id}">${e(S("book"))}</button><a class="btn ghost" href="#sav" data-close>${e(S("savForm"))}</a></div>
        <p class="pf-note">${e(S("bookNote"))}</p></div></div>
      ${facts([[S("address"), `<bdi dir="ltr">${e(t.address)}</bdi> <a class="map-link" href="${mapUrl(t.address)}" target="_blank" rel="noopener">${e(S("map"))} ↗</a>`], [S("zones"), e(T(t.zones))],
        [S("skills"), `<ul class="pf-list">${t.skills.map(s => `<li>${e(T(s))}</li>`).join("")}</ul>`], [S("exp"), e(fill(S("years"), { n: t.years }))], [S("langs"), e(T(t.langs))], [S("hours"), e(T(t.hours))]])}
      <p class="acc-note">${e(S("demo"))}</p>`);
  }
  function openProfile(kind, id, keep) {
    const item = kind === "r" ? rById(id) : TECHS.find(t => t.id === id); if (!item) return;
    if (!keep) { lastFocus = document.activeElement; track(`partenaire-${kind === "r" ? "torrefacteur" : "technicien"}-${id}`, "Partenaire " + item.name); }
    openId = `__p:${kind}:${id}`;
    sheet.innerHTML = kind === "r" ? roasterHtml(item) : techHtml(item);
    sheet.hidden = false; document.body.style.overflow = "hidden";
    if (!keep) { sheet.scrollTop = 0; sheet.querySelector("[data-close]").focus(); }
    try { history.replaceState(null, "", location.pathname + location.search + `#partenaire-${kind === "r" ? "torrefacteur" : "technicien"}-${id}`); } catch (err) {}
  }

  function render() {
    document.querySelectorAll("[data-pt]").forEach(x => { x.textContent = S(x.dataset.pt); });
    renderRoasters(); renderTechs();
    if (typeof openId === "string" && openId.startsWith("__p:") && !sheet.hidden) { const [, k, id] = openId.split(":"); openProfile(k, id, true); }
  }

  /* ---------- événements ---------- */
  document.addEventListener("click", ev => {
    if (ev.target.closest("[data-close]") && typeof openId === "string" && openId.startsWith("__p:")) { try { if (/^#partenaire-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search); } catch (err) {} return; }
    const r = ev.target.closest("[data-roaster]"); if (r) { openProfile("r", r.dataset.roaster); return; }
    const t = ev.target.closest("[data-tech]"); if (t) { openProfile("t", t.dataset.tech); return; }
    const rf = ev.target.closest("[data-rfilter]"); if (rf) { rFilter = rf.dataset.rfilter; renderRoasters(); return; }
    const tf = ev.target.closest("[data-tfilter]"); if (tf) { tFilter = tf.dataset.tfilter; renderTechs(); return; }
    const pk = ev.target.closest("[data-ppkind]"); if (pk) { form = Object.assign(form || {}, { kind: pk.dataset.ppkind }); pk.parentElement.querySelectorAll("button").forEach(b => { b.setAttribute("aria-pressed", b === pk); b.setAttribute("aria-checked", b === pk); }); return; }
    const bk = ev.target.closest("[data-book]");
    if (bk) { const x = TECHS.find(y => y.id === bk.dataset.book); openLink(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(fill(S("bookMsg"), { n: x.name, b: x.biz, c: T(x.city) }))}`); track("partenaire-intervention-" + x.id, "Intervention " + x.name); return; }
  }, true);
  document.addEventListener("submit", ev => {
    if (ev.target.id !== "ppForm") return;
    ev.preventDefault();
    const v = id => $(id).value.trim();
    if (!v("ppName") || !v("ppPhone") || !v("ppCity")) { $("ppErr").textContent = S("fReq"); return; }
    if (v("ppHoney")) return;
    const kind = (form && form.kind) || "tech", kindFr = kind === "tech" ? "Technicien" : "Torréfacteur";
    const btn = $("ppSend"); btn.disabled = true; btn.textContent = S("fSending");
    const data = { "Type": kindFr, "Nom": v("ppName"), "Entreprise": v("ppBiz"), "Ville": v("ppCity"), "Téléphone": v("ppPhone"), "E-mail": v("ppEmail"), "Présentation": v("ppMsg"), "Langue": lang,
      _replyto: v("ppEmail") || undefined, _subject: `Candidature partenaire — ${kindFr} — ${v("ppBiz") || v("ppName")} (${v("ppCity")})`, _template: "table", _captcha: "false" };
    fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
      .then(x => x.ok ? x.json() : Promise.reject(x)).then(j => { if (String(j.success) === "false") throw j; form = { done: true, name: v("ppName") }; $("ppBox").innerHTML = ppForm(); track("partenaire-candidature-" + kind, "Candidature partenaire"); })
      .catch(() => { form = Object.assign(form || {}, { fail: true }); btn.disabled = false; btn.textContent = S("fSend"); $("ppErr").textContent = S("fFail"); });
  });

  window.FE_PARTNERS = { render, coffees: COFFEES, roasters: ROASTERS, techs: TECHS, open: openProfile };
  render();
  if (window.FE_CART) FE_CART.render();
  const m = location.hash.match(/^#partenaire-(torrefacteur|technicien)-([a-z]+)$/);
  if (m) openProfile(m[1] === "torrefacteur" ? "r" : "t", m[2]);
})();
