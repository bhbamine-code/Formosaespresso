/* Académie Formosa — contenu des leçons (fr / en / ar).
   Pour ajouter une leçon : copiez un bloc, donnez-lui une "key" unique, choisissez "ch" (chapitre)
   et, s'il y a une vidéo YouTube, son identifiant dans "video". */
(function () {
  const L = (fr, en, ar) => ({ fr, en, ar });

  const LEVELS = [
    { title: L("Comprendre", "Understand", "الفهم"),
      text: L("Le café et l’espresso, avant de toucher la machine.", "Coffee and espresso, before you touch the machine.", "القهوة والإسبريسو، قبل لمس الآلة.") },
    { title: L("Pratiquer", "Practise", "التطبيق"),
      text: L("Au comptoir : extraction, réglage, lait et carte.", "At the counter: extraction, dialling in, milk and menu.", "على المشرب: الاستخلاص والضبط والحليب وقائمة المشروبات.") },
    { title: L("Le métier", "The trade", "المهنة"),
      text: L("Garder la machine en forme, et aller plus loin.", "Keep the machine in shape, and go further.", "الحفاظ على الآلة في حالة جيدة، والتعمّق أكثر.") }
  ];

  const CHAPTERS = [
    { level: 0, title: L("Le café", "The coffee", "البن") },
    { level: 0, title: L("L’espresso", "Espresso", "الإسبريسو") },
    { level: 1, title: L("Préparer et régler", "Brew and dial in", "التحضير والضبط") },
    { level: 1, title: L("Le lait et la carte", "Milk and the menu", "الحليب وقائمة المشروبات") },
    { level: 2, title: L("L’entretien", "Cleaning and care", "التنظيف والصيانة") },
    { level: 2, title: L("Bonus", "Bonus", "إضافات") }
  ];

  const LESSONS = [
    /* ---------- Niveau 1 · Chapitre 1 : le café ---------- */
    { key: "grains", read: [{ t: "The Ultimate Guide to the Different Types of Coffee Beans", u: "https://qavashop.com/en/academy/coffee-processing-flavor/the-ultimate-guide-to-the-different-types-of-coffee-beans" }, { t: "Uncovering the Coffee Belt: Where Your Coffee Comes From", u: "https://qavashop.com/en/academy/post/uncovering-the-coffee-belt-where-your-coffee-comes-from" }, { t: "Coffee 101: Coffee Terminology, Brewing, and Maintenance", u: "https://qavashop.com/en/academy/post/popular-coffee-terminology-from-bean-to-brew" }], ch: 0,
      title: L("Arabica et robusta", "Arabica and robusta", "أرابيكا وروبوستا"),
      text: L("Les deux grandes espèces de café, et ce qu’elles changent dans la tasse.", "The two main coffee species, and what they change in the cup.", "النوعان الرئيسيان من البن، وتأثيرهما على الفنجان."),
      pts: [
        L("L’arabica pousse en altitude : plus d’arômes, plus d’acidité, moins de caféine.", "Arabica grows at altitude: more aroma, more acidity, less caffeine.", "الأرابيكا تُزرع في المرتفعات: نكهات أكثر، حموضة أكثر، وكافيين أقل."),
        L("Le robusta est plus amer et plus corsé, avec environ deux fois plus de caféine.", "Robusta is more bitter and full-bodied, with about twice the caffeine.", "الروبوستا أكثر مرارة وقوة، ويحتوي على نحو ضعف كمية الكافيين."),
        L("Un peu de robusta dans un mélange donne une crème plus épaisse et un goût plus fort, apprécié dans l’espresso à l’italienne.", "A little robusta in a blend gives thicker crema and a stronger taste, popular in Italian-style espresso.", "القليل من الروبوستا في الخلطة يعطي كريما أكثف وطعمًا أقوى، وهو مرغوب في الإسبريسو الإيطالي."),
        L("Choisissez selon vos clients : 100 % arabica pour la douceur, un mélange pour l’intensité.", "Choose for your customers: 100% arabica for smoothness, a blend for intensity.", "اختر حسب زبائنك: أرابيكا 100% للنعومة، وخلطة للقوة.")
      ],
      ex: L("Préparez un espresso avec un 100 % arabica puis avec un mélange contenant du robusta. Comparez l’amertume et la crème.", "Pull one espresso with 100% arabica and one with a robusta blend. Compare bitterness and crema.", "حضّر إسبريسو بأرابيكا 100% ثم بخلطة فيها روبوستا، وقارن المرارة والكريما.") },

    { key: "TG1tuwq5Rrw", read: [{ t: "Light, Medium, and Dark Roast Coffee Explained", u: "https://qavashop.com/en/academy/Post/a-guide-to-different-coffee-roast-light-medium-and-dark-roast-coffee-explained" }], ch: 0, video: "TG1tuwq5Rrw", by: "Qavashop", dur: "5:53",
      title: L("Les niveaux de torréfaction", "Roast levels", "درجات التحميص"),
      text: L("Clair, moyen ou foncé : pourquoi la torréfaction change tout pour l’espresso.", "Light, medium or dark: why roast changes everything for espresso.", "فاتح أو متوسط أو داكن: لماذا يغيّر التحميص كل شيء في الإسبريسو."),
      pts: [
        L("Torréfaction claire : fruitée et acide, mais difficile à extraire en espresso.", "Light roast: fruity and bright, but hard to extract as espresso.", "التحميص الفاتح: فاكهي وحامض، لكنه صعب الاستخلاص في الإسبريسو."),
        L("Torréfaction moyenne à foncée : chocolat, caramel, plus de corps, et beaucoup plus facile à régler.", "Medium to dark roast: chocolate, caramel, more body, and much easier to dial in.", "التحميص المتوسط إلى الداكن: شوكولاتة وكراميل وقوام أكبر، وضبطه أسهل بكثير."),
        L("Plus le café est foncé, plus il s’extrait vite : il faut souvent moudre un peu plus gros.", "The darker the coffee, the faster it extracts: you often need a slightly coarser grind.", "كلما كان البن أغمق كان استخلاصه أسرع: غالبًا تحتاج إلى طحنة أخشن قليلًا."),
        L("Pour un café qui sert beaucoup de boissons lactées, une torréfaction moyenne-foncée est le choix le plus sûr.", "For a café serving many milk drinks, a medium-dark roast is the safest choice.", "للمقهى الذي يقدّم الكثير من المشروبات بالحليب، التحميص المتوسط الداكن هو الخيار الأضمن.")
      ],
      ex: L("Goûtez deux cafés de torréfaction différente avec la même recette. Notez lequel passe le mieux avec du lait.", "Taste two coffees of different roasts with the same recipe. Note which works best with milk.", "تذوّق نوعين من البن بتحميص مختلف بنفس الوصفة، ولاحظ أيهما يناسب الحليب أكثر.") },

    { key: "UthE8Uj_MAs", read: [{ t: "A Comprehensive Beginners Guide to Choosing Coffee Beans", u: "https://qavashop.com/en/academy/post/a-comprehensive-beginners-guide-to-choosing-coffee-beans" }], ch: 0, video: "UthE8Uj_MAs", by: "Qavashop",
      title: L("Choisir un café pour l’espresso", "Choosing coffee for espresso", "اختيار البن للإسبريسو"),
      text: L("Tout café ne convient pas à l’espresso : voici comment bien acheter.", "Not every coffee works for espresso: how to buy well.", "ليس كل بن يصلح للإسبريسو: كيف تشتري جيدًا."),
      pts: [
        L("Regardez la date de torréfaction : idéalement entre 7 et 30 jours avant utilisation.", "Check the roast date: ideally 7 to 30 days before use.", "انظر إلى تاريخ التحميص: الأفضل بين 7 و30 يومًا قبل الاستعمال."),
        L("Achetez en grains et moulez à la demande : le café moulu perd ses arômes en quelques minutes.", "Buy whole beans and grind on demand: ground coffee loses its aroma within minutes.", "اشترِ البن حبوبًا واطحنه عند الطلب: البن المطحون يفقد نكهته خلال دقائق."),
        L("Un café vendu « pour filtre » est souvent trop clair : il donnera un espresso acide.", "Coffee sold “for filter” is often too light: it makes a sour espresso.", "البن المخصّص «للفلتر» غالبًا فاتح جدًا، ويعطي إسبريسو حامضًا."),
        L("Gardez une seule recette maison stable : vos clients reviennent pour un goût constant.", "Keep one stable house blend: customers come back for a consistent taste.", "حافظ على خلطة ثابتة للمحل: الزبائن يعودون من أجل طعم ثابت.")
      ],
      ex: L("Vérifiez la date de torréfaction de votre paquet actuel et calculez depuis combien de jours il est ouvert.", "Check the roast date on your current bag and how many days it has been open.", "تحقّق من تاريخ تحميص الكيس الحالي، واحسب منذ كم يومًا هو مفتوح.") },

    { key: "etiquette", read: [{ t: "How to Choose Specialty Coffee? Reading the Label", u: "https://qavashop.com/en/academy/post/how-to-choose-specialty-coffee" }, { t: "Colombian vs Ethiopian Coffee", u: "https://qavashop.com/en/academy/coffee-culture-origins/the-difference-between-colombian-and-ethiopian-coffee-which-one-to-choose-for-your-palate" }], ch: 0,
      title: L("Lire l’étiquette d’un café", "Reading a coffee label", "قراءة ملصق البن"),
      text: L("Origine, procédé, altitude, notes : ce que dit vraiment un paquet.", "Origin, process, altitude, notes: what a bag really tells you.", "المصدر والمعالجة والارتفاع والنكهات: ماذا يقول الكيس فعلًا."),
      pts: [
        L("Date de torréfaction et date limite ne sont pas la même chose : fiez-vous à la première.", "Roast date and best-before date are not the same: trust the first one.", "تاريخ التحميص ليس تاريخ الصلاحية: اعتمد على الأول."),
        L("Procédé lavé : tasse nette et vive. Procédé nature : plus fruité et sucré.", "Washed process: clean, bright cup. Natural process: fruitier and sweeter.", "المعالجة المغسولة: فنجان نظيف وحيوي. المعالجة الطبيعية: أكثر فاكهية وحلاوة."),
        L("Plus l’altitude est élevée, plus le grain est dense et l’acidité marquée.", "The higher the altitude, the denser the bean and the brighter the acidity.", "كلما ارتفع مكان الزراعة كانت الحبة أكثف والحموضة أوضح."),
        L("Les notes de dégustation (chocolat, fruits rouges…) décrivent des arômes naturels, pas des ajouts.", "Tasting notes (chocolate, red fruit…) describe natural aromas, not added flavours.", "نكهات التذوّق (شوكولاتة، فواكه حمراء…) تصف روائح طبيعية وليست إضافات.")
      ],
      ex: L("Prenez votre paquet de café et retrouvez ces quatre informations. Celles qui manquent sont à demander à votre torréfacteur.", "Take your coffee bag and find these four details. Ask your roaster for any that are missing.", "خذ كيس البن وابحث عن هذه المعلومات الأربع، واسأل المحمصة عمّا ينقص منها.") },

    /* ---------- Niveau 1 · Chapitre 2 : l'espresso ---------- */
    { key: "ratio", read: [{ t: "The Golden Ratio: Exploring the Espresso Brewing Ratio", u: "https://qavashop.com/en/academy/post/the-golden-ratio-exploring-the-espresso-brewing-ratio-" }], ch: 1,
      title: L("Le ratio : dose, rendement, temps", "The ratio: dose, yield, time", "النسبة: الجرعة والمردود والوقت"),
      text: L("Les trois chiffres qui définissent un espresso.", "The three numbers that define an espresso.", "الأرقام الثلاثة التي تحدّد الإسبريسو."),
      pts: [
        L("La dose : le café moulu dans le panier, par exemple 18 g pour un double.", "Dose: the ground coffee in the basket, for example 18 g for a double.", "الجرعة: البن المطحون في السلة، مثل 18 غرامًا للدبل."),
        L("Le rendement : le poids d’espresso dans la tasse. Le ratio classique est 1:2, soit 18 g → 36 g.", "Yield: the weight of espresso in the cup. The classic ratio is 1:2, so 18 g → 36 g.", "المردود: وزن الإسبريسو في الفنجان. النسبة الكلاسيكية 1:2، أي 18 غ ← 36 غ."),
        L("Le temps : visez 25 à 30 secondes pour ce rendement.", "Time: aim for 25 to 30 seconds for that yield.", "الوقت: استهدف 25 إلى 30 ثانية لهذا المردود."),
        L("Pesez avec une balance, ne vous fiez pas au volume : la crème fausse la lecture.", "Weigh with a scale, don’t trust volume: crema distorts the reading.", "استعمل ميزانًا ولا تعتمد على الحجم: الكريما تُضلّل القراءة.")
      ],
      ex: L("Préparez trois espressos à 18 g → 36 g. Notez le temps de chacun : l’écart doit rester sous 3 secondes.", "Pull three espressos at 18 g → 36 g. Note each time: they should be within 3 seconds.", "حضّر ثلاثة إسبريسو بنسبة 18 غ ← 36 غ، وسجّل وقت كل واحد: يجب ألا يتجاوز الفرق 3 ثوانٍ.") },

    { key: "formats", read: [{ t: "Single vs Double Shot Espresso", u: "https://qavashop.com/en/academy/espresso-brewing-techniques/single-vs-double-shot-espresso-which-is-best-for-your-brew" }, { t: "Espresso vs Lungo vs Ristretto", u: "https://qavashop.com/en/academy/espresso-brewing-techniques/exploring-the-espresso-vs-lungo-vs-ristretto-difference-your-ultimate-guide-to-coffee-shots" }, { t: "Americano and Black Coffee: A Comparison", u: "https://qavashop.com/en/academy/espresso-coffee/the-difference-between-americano-and-black-coffee" }], ch: 1,
      title: L("Simple, double, ristretto, lungo", "Single, double, ristretto, lungo", "مفرد، مزدوج، ريستريتو، لونغو"),
      text: L("Les formats d’espresso et quand les servir.", "Espresso formats and when to serve them.", "أنواع الإسبريسو ومتى تقدّمها."),
      pts: [
        L("Le double (16–20 g de café) est la base de la plupart des cafés : plus stable que le simple.", "The double (16–20 g of coffee) is the base in most cafés: more consistent than a single.", "الدبل (16 إلى 20 غرامًا من البن) هو الأساس في أغلب المقاهي: أكثر ثباتًا من المفرد."),
        L("Ristretto : même dose, moins d’eau (environ 1:1 à 1:1,5). Plus sucré et plus intense.", "Ristretto: same dose, less water (about 1:1 to 1:1.5). Sweeter and more intense.", "ريستريتو: نفس الجرعة وماء أقل (نحو 1:1 إلى 1:1.5). أحلى وأكثر تركيزًا."),
        L("Lungo : même dose, plus d’eau (environ 1:3). Plus léger, mais plus amer s’il coule trop.", "Lungo: same dose, more water (about 1:3). Lighter, but more bitter if it runs too long.", "لونغو: نفس الجرعة وماء أكثر (نحو 1:3). أخف، لكنه أكثر مرارة إذا طال."),
        L("Un américano, c’est un espresso allongé d’eau chaude après extraction, pas un lungo.", "An Americano is espresso topped with hot water after extraction, not a lungo.", "الأمريكانو هو إسبريسو يُضاف إليه ماء ساخن بعد الاستخلاص، وليس لونغو.")
      ],
      ex: L("Avec la même dose, préparez un ristretto, un espresso et un lungo. Goûtez-les côte à côte.", "With the same dose, pull a ristretto, an espresso and a lungo. Taste them side by side.", "بنفس الجرعة حضّر ريستريتو وإسبريسو ولونغو، وتذوّقها جنبًا إلى جنب.") },

    { key: "1--98uRngJo", read: [{ t: "What Is Coffee Crema and How to Get It", u: "https://qavashop.com/en/academy/Post/what-is-coffee-crema-and-how-to-get-it-tips-for-perfecting-your-espresso" }], ch: 1, video: "1--98uRngJo", by: "Qavashop",
      title: L("Lire la crème", "Reading the crema", "فهم الكريما"),
      text: L("Ce que la crème dit de votre espresso, et ses limites.", "What crema tells you about your espresso, and its limits.", "ماذا تخبرك الكريما عن الإسبريسو، وما حدودها."),
      pts: [
        L("La crème est une mousse d’huiles et de gaz carbonique libérée par le café frais.", "Crema is a foam of oils and carbon dioxide released by fresh coffee.", "الكريما رغوة من الزيوت وثاني أكسيد الكربون يطلقها البن الطازج."),
        L("Pâle et fine : café éventé ou extraction trop rapide. Très foncée et tachée : extraction trop longue.", "Pale and thin: stale coffee or a fast shot. Very dark and patchy: an over-long shot.", "فاتحة ورقيقة: بن قديم أو استخلاص سريع. داكنة جدًا ومبقّعة: استخلاص طويل."),
        L("Beaucoup de crème ne veut pas dire bon goût : le robusta en fait beaucoup, sans être meilleur.", "Lots of crema doesn’t mean good taste: robusta makes plenty without being better.", "كثرة الكريما لا تعني طعمًا جيدًا: الروبوستا يعطي الكثير منها دون أن يكون أفضل."),
        L("Fiez-vous d’abord au goût, la crème n’est qu’un indice.", "Trust taste first: crema is only a clue.", "اعتمد على الطعم أولًا، فالكريما مجرد مؤشر.")
      ],
      ex: L("Comparez la crème d’un café torréfié il y a une semaine et d’un café ouvert depuis un mois.", "Compare the crema of coffee roasted a week ago with coffee opened a month ago.", "قارن كريما بن محمّص منذ أسبوع ببن مفتوح منذ شهر.") },

    { key: "turc", read: [{ t: "Differences Between Turkish Coffee and Espresso", u: "https://qavashop.com/en/academy/espresso-brewing-techniques/differences-between-turkish-coffee-and-espresso-a-detailed-comparison" }], ch: 1,
      title: L("Café turc et espresso", "Turkish coffee and espresso", "القهوة التركية والإسبريسو"),
      text: L("Deux méthodes que vos clients connaissent, et ce qui les distingue.", "Two methods your customers know, and what sets them apart.", "طريقتان يعرفهما زبائنك، وما الذي يميّز كلًّا منهما."),
      pts: [
        L("Café turc : mouture en poudre très fine, chauffée dans un cezve, servie non filtrée avec le marc.", "Turkish coffee: very fine powder, heated in a cezve, served unfiltered with the grounds.", "القهوة التركية: طحنة ناعمة كالبودرة تُسخّن في الركوة وتُقدَّم دون تصفية مع التفل."),
        L("Espresso : mouture fine mais pas en poudre, eau poussée à 9 bars, filtrée en 25 à 30 secondes.", "Espresso: fine but not powder grind, water pushed at 9 bar, filtered in 25 to 30 seconds.", "الإسبريسو: طحنة ناعمة لكن ليست بودرة، وماء يُدفع بضغط 9 بار ويُصفّى في 25 إلى 30 ثانية."),
        L("Ne réglez pas votre moulin espresso en poudre pour le café turc : utilisez un moulin dédié.", "Don’t set your espresso grinder to powder for Turkish coffee: use a dedicated grinder.", "لا تضبط مطحنة الإسبريسو على البودرة للقهوة التركية: استعمل مطحنة مخصّصة."),
        L("Proposer les deux à la carte fidélise une clientèle tunisienne habituée aux deux.", "Offering both on the menu keeps Tunisian customers who are used to both.", "تقديم الاثنين في القائمة يحافظ على زبائن تونسيين معتادين على كليهما.")
      ],
      ex: L("Goûtez un café turc et un espresso du même café. Décrivez la texture et l’amertume de chacun.", "Taste a Turkish coffee and an espresso from the same beans. Describe the texture and bitterness of each.", "تذوّق قهوة تركية وإسبريسو من نفس البن، وصف قوام ومرارة كل منهما.") },

    /* ---------- Niveau 2 · Chapitre 3 : préparer et régler ---------- */
    { key: "34gfHUU3KSc", read: [{ t: "How to Become a Professional Barista", u: "https://qavashop.com/en/academy/post/how-to-become-a-professional-barista" }], ch: 2, video: "34gfHUU3KSc", by: "Qavashop",
      title: L("Réussir son premier espresso", "Your first good espresso", "أول إسبريسو ناجح"),
      text: L("Les gestes de base, du moulin à la tasse.", "The basic steps, from grinder to cup.", "الخطوات الأساسية من المطحنة إلى الفنجان."),
      pts: [
        L("Purgez le groupe quelques secondes avant chaque extraction pour stabiliser la température.", "Flush the group for a few seconds before each shot to stabilise temperature.", "اشطف المجموعة بضع ثوانٍ قبل كل استخلاص لتثبيت الحرارة."),
        L("Pesez la dose, répartissez le café à plat, puis tassez bien droit et fermement.", "Weigh the dose, level the coffee, then tamp straight and firmly.", "زِن الجرعة ووزّع البن بالتساوي، ثم اكبسه باستقامة وبقوة."),
        L("Lancez l’extraction dès que le porte-filtre est en place, sans attendre.", "Start the shot as soon as the portafilter is locked in, without waiting.", "ابدأ الاستخلاص فور تركيب حامل الفلتر دون انتظار."),
        L("Visez 1:2 en 25 à 30 secondes, puis goûtez avant de changer quoi que ce soit.", "Aim for 1:2 in 25 to 30 seconds, then taste before changing anything.", "استهدف 1:2 في 25 إلى 30 ثانية، ثم تذوّق قبل تغيير أي شيء.")
      ],
      ex: L("Faites cinq espressos identiques et notez dose, rendement et temps dans un carnet.", "Make five identical espressos and note dose, yield and time in a notebook.", "حضّر خمسة إسبريسو متطابقة وسجّل الجرعة والمردود والوقت في دفتر.") },

    { key: "CfeBkgGpbGY", ch: 2, video: "CfeBkgGpbGY", by: "Coffee With Ahmed",
      title: L("Régler son espresso pas à pas", "Dialling in, step by step", "معايرة الإسبريسو خطوة بخطوة"),
      text: L("La méthode pour trouver le bon réglage chaque matin.", "The method to find the right setting every morning.", "الطريقة للوصول إلى الضبط الصحيح كل صباح."),
      pts: [
        L("Gardez la dose fixe et réglez d’abord la mouture.", "Keep the dose fixed and adjust the grind first.", "ثبّت الجرعة واضبط الطحنة أولًا."),
        L("Trop rapide et acide : moulez plus fin. Trop lent et amer : moulez plus gros.", "Too fast and sour: grind finer. Too slow and bitter: grind coarser.", "سريع وحامض: اطحن أنعم. بطيء ومر: اطحن أخشن."),
        L("Après chaque réglage, jetez une dose : le moulin garde l’ancienne mouture.", "After each change, discard one dose: the grinder still holds the old grind.", "بعد كل تعديل تخلّص من جرعة: المطحنة تحتفظ بالطحنة السابقة."),
        L("Le café change avec l’humidité et l’âge : réglez chaque matin avant l’ouverture.", "Coffee changes with humidity and age: dial in every morning before opening.", "البن يتغيّر مع الرطوبة والعمر: اضبط كل صباح قبل فتح المحل.")
      ],
      ex: L("Demain matin, réglez votre espresso avant l’ouverture et notez le réglage du moulin et l’heure.", "Tomorrow morning, dial in before opening and write down the grinder setting and time.", "صباح الغد اضبط الإسبريسو قبل الفتح، وسجّل رقم ضبط المطحنة والساعة.") },

    { key: "VG7jmgxn67w", ch: 2, video: "VG7jmgxn67w", by: "Qavashop", dur: "5:36",
      title: L("5 erreurs qui gâchent l’espresso", "5 mistakes that ruin espresso", "5 أخطاء تفسد الإسبريسو"),
      text: L("Les habitudes qui ruinent la tasse, même avec un bon équipement.", "Habits that ruin the cup, even with good equipment.", "عادات تفسد الفنجان حتى مع معدّات جيدة."),
      pts: [
        L("Café vieux ou paquet laissé ouvert : gardez-le fermé, à l’abri de l’air et de la lumière.", "Old coffee or a bag left open: keep it sealed, away from air and light.", "بن قديم أو كيس مفتوح: احفظه مغلقًا بعيدًا عن الهواء والضوء."),
        L("Machine pas assez chaude : laissez-la chauffer 20 à 30 minutes avant le premier café.", "Machine not hot enough: let it heat for 20 to 30 minutes before the first shot.", "آلة غير ساخنة بما يكفي: اتركها تسخن 20 إلى 30 دقيقة قبل أول فنجان."),
        L("Changer plusieurs réglages à la fois : modifiez un seul paramètre à chaque essai.", "Changing several settings at once: change only one variable per try.", "تغيير عدة إعدادات معًا: غيّر متغيّرًا واحدًا في كل محاولة."),
        L("Matériel sale : un porte-filtre gras donne un goût rance à chaque tasse.", "Dirty equipment: an oily portafilter gives every cup a rancid taste.", "معدّات متّسخة: حامل الفلتر الدهني يعطي كل فنجان طعمًا زنخًا.")
      ],
      ex: L("Faites une liste de contrôle d’ouverture (chauffe, café frais, purge, propreté) et suivez-la une semaine.", "Write an opening checklist (warm-up, fresh coffee, flush, cleanliness) and follow it for a week.", "اكتب قائمة تحقّق للافتتاح (التسخين، بن طازج، الشطف، النظافة) والتزم بها أسبوعًا.") },

    { key: "bh0zXzAcqmE", read: [{ t: "Why Does My Coffee Taste Bitter? Simple Fixes", u: "https://qavashop.com/en/academy/espresso-coffee/why-does-my-coffee-taste-bitter-simple-fixes-to-brew-a-perfect-cup" }], ch: 2, video: "bh0zXzAcqmE", by: "Qavashop",
      title: L("Goûter : acide, amer, sucré", "Tasting: sour, bitter, sweet", "التذوّق: حامض، مر، حلو"),
      text: L("Apprendre à reconnaître ce qui ne va pas dans la tasse.", "Learning to recognise what is wrong in the cup.", "تعلّم كيف تعرف الخطأ في الفنجان."),
      pts: [
        L("Acide et piquant : sous-extraction. Moulez plus fin ou allongez légèrement.", "Sharp and sour: under-extraction. Grind finer or run slightly longer.", "حامض ولاذع: استخلاص ناقص. اطحن أنعم أو أطل قليلًا."),
        L("Amer et sec en bouche : sur-extraction. Moulez plus gros ou raccourcissez.", "Bitter and drying: over-extraction. Grind coarser or run shorter.", "مر وجاف في الفم: استخلاص زائد. اطحن أخشن أو قصّر."),
        L("Le but est l’équilibre : une douceur qui reste en bouche après la gorgée.", "The goal is balance: a sweetness that lingers after the sip.", "الهدف هو التوازن: حلاوة تبقى في الفم بعد الرشفة."),
        L("Goûtez aussi l’espresso un peu refroidi : les défauts y ressortent mieux.", "Also taste the espresso slightly cooled: flaws show more clearly.", "تذوّق الإسبريسو أيضًا بعد أن يبرد قليلًا: العيوب تظهر بوضوح أكبر.")
      ],
      ex: L("Préparez volontairement un espresso trop rapide et un trop lent. Goûtez-les et décrivez la différence.", "Deliberately pull one shot too fast and one too slow. Taste them and describe the difference.", "حضّر عمدًا إسبريسو سريعًا جدًا وآخر بطيئًا جدًا، وتذوّقهما وصف الفرق.") },

    /* ---------- Niveau 2 · Chapitre 4 : le lait et la carte ---------- */
    { key: "SkZio_PKaU0", ch: 3, video: "SkZio_PKaU0", by: "Qavashop",
      title: L("Texturer le lait", "Steaming milk", "تبخير الحليب"),
      text: L("Une mousse fine et brillante pour toutes les boissons lactées.", "Fine, glossy microfoam for every milk drink.", "رغوة ناعمة ولامعة لكل المشروبات بالحليب."),
      pts: [
        L("Lait bien froid, pichet froid, et purgez la buse avant de commencer.", "Cold milk, a cold pitcher, and purge the wand before you start.", "حليب بارد وإبريق بارد، واشطف ذراع البخار قبل البدء."),
        L("Phase d’air : buse juste sous la surface, un léger « tss » jusqu’à environ 35–40 °C.", "Air phase: tip just below the surface, a light “tss” until about 35–40 °C.", "مرحلة الهواء: الفوهة تحت السطح مباشرة مع صوت «تسس» خفيف حتى نحو 35 إلى 40 درجة."),
        L("Puis enfoncez un peu la buse pour faire tourner le lait jusqu’à 60–65 °C. Au-delà de 70 °C, le lait perd sa douceur.", "Then sink the tip a little to spin the milk up to 60–65 °C. Above 70 °C, milk loses its sweetness.", "ثم أدخل الفوهة قليلًا لتدوير الحليب حتى 60 إلى 65 درجة. فوق 70 درجة يفقد الحليب حلاوته."),
        L("Tapotez et faites tourner le pichet, puis essuyez et purgez la buse immédiatement.", "Tap and swirl the pitcher, then wipe and purge the wand immediately.", "انقر الإبريق وحرّكه دائريًا، ثم امسح ذراع البخار واشطفه فورًا.")
      ],
      ex: L("Entraînez-vous avec de l’eau et une goutte de liquide vaisselle : vous apprenez le geste sans gaspiller de lait.", "Practise with water and a drop of washing-up liquid: you learn the movement without wasting milk.", "تدرّب بالماء وقطرة من سائل الجلي: تتعلّم الحركة دون إهدار الحليب.") },

    { key: "latteart", read: [{ t: "How to Do Latte Art: A Beginner's Guide", u: "https://qavashop.com/en/academy/Post/how-to-do-latte-art-a-beginner-s-guide-to-making-delicious-coffee-creations-at-home" }], ch: 3,
      title: L("Premiers pas en latte art", "First steps in latte art", "خطواتك الأولى في فن اللاتيه"),
      text: L("Du cœur à la rosette, la base du dessin dans la tasse.", "From heart to rosetta, the basics of pouring a design.", "من القلب إلى الوردة: أساسيات الرسم في الفنجان."),
      pts: [
        L("Sans une mousse fine et brillante, aucun dessin ne tient : maîtrisez d’abord le lait.", "Without fine, glossy foam no design holds: master the milk first.", "بدون رغوة ناعمة ولامعة لا يثبت أي رسم: أتقن الحليب أولًا."),
        L("Versez d’abord haut et lentement pour mélanger, puis approchez le bec tout près de la surface.", "Pour high and slow first to blend, then bring the spout close to the surface.", "اسكب من الأعلى ببطء أولًا للخلط، ثم قرّب فوهة الإبريق من السطح."),
        L("Inclinez la tasse et redressez-la au fur et à mesure qu’elle se remplit.", "Tilt the cup and straighten it as it fills.", "أمِل الفنجان ثم اعدله تدريجيًا كلما امتلأ."),
        L("Commencez par le cœur : c’est la base de tous les autres dessins.", "Start with the heart: it is the base of every other design.", "ابدأ بالقلب: هو أساس كل الرسومات الأخرى.")
      ],
      ex: L("Réalisez dix cœurs d’affilée. Photographiez-les pour voir vos progrès d’une semaine à l’autre.", "Pour ten hearts in a row. Photograph them to see your progress from week to week.", "ارسم عشرة قلوب متتالية وصوّرها لترى تقدّمك من أسبوع لآخر.") },

    { key: "carte", read: [{ t: "Cappuccino, Latte and Macchiato: The Difference", u: "https://qavashop.com/en/academy/Post/demystifying-the-difference-between-cappuccino-latte-and-macchiato" }, { t: "How to Make a Flat White", u: "https://qavashop.com/en/academy/post/how-to-make-a-flat-white" }, { t: "The Difference Between Latte and Flat White", u: "https://qavashop.com/en/academy/Post/the-difference-between-latte-and-flat-white" }, { t: "How to Make a Cortado", u: "https://qavashop.com/en/academy/Post/how-to-make-cortado-and-how-is-it-different-from-other-types-of-coffee" }, { t: "Five Easy Ways to Make a Spanish Latte", u: "https://qavashop.com/en/academy/Post/five-easy-ways-to-make-a-spanish-latte-coffee" }], ch: 3,
      title: L("La carte du café", "The café menu", "قائمة مشروبات المقهى"),
      text: L("Les boissons classiques et leurs proportions.", "The classic drinks and their proportions.", "المشروبات الكلاسيكية ونِسَبها."),
      pts: [
        L("Macchiato : un espresso « taché » d’une cuillère de mousse. En Tunisie, le « capucin » en est proche.", "Macchiato: an espresso “marked” with a spoon of foam. In Tunisia, the “capucin” is close to it.", "ماكياتو: إسبريسو «مُعلَّم» بملعقة رغوة، وهو قريب من «الكابوسان» في تونس."),
        L("Cortado : espresso et lait chaud à parts égales, très peu de mousse.", "Cortado: espresso and warm milk in equal parts, very little foam.", "كورتادو: إسبريسو وحليب ساخن بنسب متساوية مع رغوة قليلة جدًا."),
        L("Cappuccino : environ 150–180 ml avec une mousse épaisse. Latte : plus grand, mousse fine.", "Cappuccino: about 150–180 ml with thick foam. Latte: larger, with thin foam.", "كابتشينو: نحو 150 إلى 180 مل برغوة كثيفة. لاتيه: أكبر برغوة رقيقة."),
        L("Flat white : double ristretto et environ 120 ml de lait finement texturé. Spanish latte : latte sucré au lait concentré.", "Flat white: double ristretto and about 120 ml of finely textured milk. Spanish latte: latte sweetened with condensed milk.", "فلات وايت: دبل ريستريتو ونحو 120 مل من حليب ناعم القوام. سبانش لاتيه: لاتيه محلّى بالحليب المكثّف.")
      ],
      ex: L("Écrivez la recette exacte de chaque boisson de votre carte (dose, lait, taille de tasse) et affichez-la au comptoir.", "Write the exact recipe for every drink on your menu (dose, milk, cup size) and post it at the counter.", "اكتب الوصفة الدقيقة لكل مشروب في قائمتك (الجرعة، الحليب، حجم الفنجان) وعلّقها على المشرب.") },

    /* ---------- Niveau 3 · Chapitre 5 : l'entretien ---------- */
    { key: "Co7G2TuxGeY", ch: 4, video: "Co7G2TuxGeY", by: "Abdulmohsin Alobid", dur: "8:46",
      title: L("Nettoyer le groupe (backflush)", "Cleaning the group (backflush)", "تنظيف المجموعة (باكفلش)"),
      text: L("Le geste quotidien qui protège la machine et le goût.", "The daily routine that protects the machine and the taste.", "الإجراء اليومي الذي يحمي الآلة وطعم القهوة."),
      pts: [
        L("Placez le filtre aveugle dans le porte-filtre et lancez de courts cycles pour rincer le groupe.", "Fit the blind basket in the portafilter and run short cycles to rinse the group.", "ضع السلة العمياء في حامل الفلتر وشغّل دورات قصيرة لشطف المجموعة."),
        L("À la fermeture, ajoutez la poudre détergente prévue pour les machines espresso, puis rincez bien à l’eau.", "At closing, add espresso machine detergent powder, then rinse thoroughly with water.", "عند الإغلاق أضف مسحوق المنظّف الخاص بآلات الإسبريسو، ثم اشطف جيدًا بالماء."),
        L("Brossez le joint et la douchette du groupe pour enlever le marc.", "Brush the group gasket and shower screen to remove grounds.", "نظّف حشوة المجموعة وموزّع الماء بالفرشاة لإزالة بقايا البن."),
        L("Faites tremper porte-filtres et paniers dans le détergent, puis rincez avant le service suivant.", "Soak portafilters and baskets in detergent, then rinse before the next service.", "انقع حوامل الفلتر والسلال في المنظّف، ثم اشطفها قبل الخدمة التالية.")
      ],
      ex: L("Ajoutez le backflush à votre routine de fermeture et cochez-le chaque soir pendant deux semaines.", "Add the backflush to your closing routine and tick it off every evening for two weeks.", "أضف الباكفلش إلى روتين الإغلاق وأشّر عليه كل مساء لمدة أسبوعين.") },

    { key: "planning", read: [{ t: "Espresso Machine Cleaning Schedule and How to Do It", u: "https://qavashop.com/en/academy/Post/espresso-machine-cleaning-schedule-and-how-to-do-it" }, { t: "How to Clean Your Espresso Machine in Easy Steps", u: "https://qavashop.com/en/academy/Post/master-how-to-clean-your-espresso-machine-with-these-easy-steps" }], ch: 4,
      title: L("Le planning de nettoyage", "The cleaning schedule", "جدول التنظيف"),
      text: L("Quoi nettoyer, et à quelle fréquence.", "What to clean, and how often.", "ماذا تنظّف، وكم مرة."),
      pts: [
        L("À chaque café : purgez le groupe, essuyez et purgez la buse vapeur.", "Every drink: flush the group, wipe and purge the steam wand.", "مع كل مشروب: اشطف المجموعة وامسح ذراع البخار واشطفه."),
        L("Chaque soir : backflush, porte-filtres, bac d’égouttage et buse vapeur trempée.", "Every evening: backflush, portafilters, drip tray and a soaked steam wand.", "كل مساء: باكفلش، حوامل الفلتر، صينية التقطير، ونقع ذراع البخار."),
        L("Chaque semaine : démontez et nettoyez la douchette, videz et lavez la trémie du moulin.", "Every week: remove and clean the shower screen, empty and wash the grinder hopper.", "كل أسبوع: فكّ موزّع الماء ونظّفه، وأفرغ حاوية حبوب المطحنة واغسلها."),
        L("Chaque mois : brossez les meules du moulin et vérifiez l’usure des joints.", "Every month: brush the grinder burrs and check the gaskets for wear.", "كل شهر: نظّف شفرات المطحنة بالفرشاة وتحقّق من تآكل الحشوات.")
      ],
      ex: L("Imprimez ce planning, collez-le près de la machine et faites-le signer par l’équipe.", "Print this schedule, stick it near the machine and have the team sign it off.", "اطبع هذا الجدول وألصقه قرب الآلة واطلب من الفريق التوقيع عليه.") },

    { key: "2iGnWQPElMc", ch: 4, video: "2iGnWQPElMc", by: "Koryaiko Philippine", dur: "4:59",
      title: L("Entretien préventif d’une Gemilai", "Preventive care for a Gemilai", "الصيانة الوقائية لآلة Gemilai"),
      text: L("Les contrôles réguliers sur votre machine, montrés sur une G3120C.", "Regular checks on your machine, shown on a G3120C.", "الفحوصات الدورية لآلتك، معروضة على G3120C."),
      pts: [
        L("Surveillez les manomètres : environ 9 bars en extraction et 1 à 1,5 bar sur la chaudière vapeur.", "Watch the gauges: about 9 bar during extraction and 1 to 1.5 bar on the steam boiler.", "راقب مقاييس الضغط: نحو 9 بار أثناء الاستخلاص و1 إلى 1.5 بار في غلاية البخار."),
        L("Remplacez joints de groupe et douchettes avant qu’ils ne fuient, en général tous les 6 à 12 mois.", "Replace group gaskets and shower screens before they leak, usually every 6 to 12 months.", "استبدل حشوات المجموعة وموزّعات الماء قبل أن تسرّب، عادة كل 6 إلى 12 شهرًا."),
        L("Changez la cartouche ou régénérez l’adoucisseur selon le volume d’eau consommé.", "Change the cartridge or regenerate the softener according to the water volume used.", "غيّر الخرطوشة أو جدّد مُليّن الماء حسب كمية الماء المستهلكة."),
        L("Prévoyez une révision annuelle par un technicien : c’est moins cher qu’une panne en plein service.", "Plan a yearly technician service: it costs less than a breakdown mid-service.", "خطّط لمراجعة سنوية لدى فنّي: تكلفتها أقل من عطل في وقت الذروة.")
      ],
      ex: L("Notez aujourd’hui la pression affichée par vos manomètres, puis comparez chaque semaine.", "Write down your gauge readings today, then compare every week.", "سجّل اليوم ضغط المقاييس، ثم قارنه كل أسبوع.") },

    { key: "eau", ch: 4,
      title: L("L’eau et le calcaire", "Water and scale", "الماء والترسّبات الكلسية"),
      text: L("Pourquoi l’eau est la première cause de pannes en Tunisie.", "Why water is the first cause of breakdowns in Tunisia.", "لماذا يُعدّ الماء السبب الأول للأعطال في تونس."),
      pts: [
        L("Un espresso, c’est environ 98 % d’eau : une eau de mauvaise qualité gâche même le meilleur café.", "An espresso is about 98% water: poor water spoils even the best coffee.", "الإسبريسو نحو 98% ماء: الماء الرديء يفسد حتى أفضل بن."),
        L("L’eau du robinet en Tunisie est souvent très calcaire : le tartre bouche les chaudières et les circuits.", "Tap water in Tunisia is often very hard: scale clogs boilers and pipes.", "ماء الحنفية في تونس كلسي جدًا في الغالب: الترسّبات تسدّ الغلايات والأنابيب."),
        L("Un adoucisseur ou un filtre adapté est indispensable, et les dégâts dus au calcaire ne sont pas couverts par la garantie.", "A suitable softener or filter is essential, and scale damage is not covered by the warranty.", "مُليّن أو فلتر مناسب ضروري، وأضرار الترسّبات لا يشملها الضمان."),
        L("Le détartrage d’une machine à chaudières est une intervention de technicien, pas un geste maison.", "Descaling a boiler machine is a technician’s job, not a do-it-yourself task.", "إزالة الترسّبات من آلة بغلايات عمل فنّي، وليست إجراءً منزليًا.")
      ],
      ex: L("Mesurez la dureté de votre eau avec une bandelette de test et demandez-nous le réglage d’adoucisseur adapté.", "Measure your water hardness with a test strip and ask us for the right softener setting.", "قِس عسر الماء بشريط اختبار واطلب منّا ضبط المُليّن المناسب.") },

    /* ---------- Niveau 3 · Chapitre 6 : bonus ---------- */
    { key: "kUe0n55GQI4", ch: 5, video: "kUe0n55GQI4", by: "Qavashop", dur: "0:37",
      title: L("Café turc à la buse vapeur", "Turkish coffee with the steam wand", "القهوة التركية بذراع البخار"),
      text: L("Une astuce rapide pour servir le café turc avec votre machine.", "A quick trick to serve Turkish coffee with your machine.", "حيلة سريعة لتقديم القهوة التركية بآلتك."),
      pts: [
        L("Mettez café en poudre, eau (et sucre si besoin) dans un petit pichet inox.", "Put powdered coffee, water (and sugar if wanted) in a small stainless pitcher.", "ضع البن المطحون كالبودرة والماء (والسكر عند الحاجة) في إبريق صغير من الستانلس."),
        L("Chauffez doucement à la buse vapeur jusqu’à ce que la mousse monte, sans faire bouillir.", "Heat gently with the steam wand until the foam rises, without boiling.", "سخّن برفق بذراع البخار حتى ترتفع الرغوة، دون غليان."),
        L("Nettoyez et purgez la buse aussitôt : le marc l’encrasse vite.", "Clean and purge the wand right away: the grounds clog it quickly.", "نظّف ذراع البخار واشطفه فورًا: بقايا البن تسدّه بسرعة.")
      ],
      ex: L("Essayez la méthode et comparez le temps de service avec votre méthode habituelle.", "Try the method and compare serving time with your usual method.", "جرّب الطريقة وقارن وقت التقديم بطريقتك المعتادة.") },

    { key: "uFhRIaQWbgo", ch: 5, video: "uFhRIaQWbgo", by: "Qavashop",
      title: L("Les fines de mouture", "Grind fines", "الجزيئات الناعمة في الطحن"),
      text: L("Ces particules minuscules qui influencent le goût.", "The tiny particles that affect the taste.", "جزيئات صغيرة جدًا تؤثّر على الطعم."),
      pts: [
        L("Tout moulin produit des « fines », de très petites particules de café.", "Every grinder makes “fines”, very small coffee particles.", "كل مطحنة تنتج «جزيئات ناعمة» صغيرة جدًا من البن."),
        L("Trop de fines rendent l’espresso amer et peuvent ralentir l’extraction.", "Too many fines make espresso bitter and can slow the shot.", "كثرتها تجعل الإسبريسو مرًا وقد تبطئ الاستخلاص."),
        L("Des meules usées en produisent davantage : surveillez leur usure et remplacez-les à temps.", "Worn burrs produce more of them: watch their wear and replace them in time.", "الشفرات المتآكلة تنتج المزيد منها: راقب تآكلها واستبدلها في الوقت المناسب.")
      ],
      ex: L("Notez la date de mise en service de vos meules et demandez-nous leur durée de vie selon votre volume.", "Note when your burrs were installed and ask us their expected life for your volume.", "سجّل تاريخ تركيب الشفرات واسألنا عن عمرها المتوقّع حسب حجم عملك.") }
  ];

  window.ACADEMY = { LEVELS, CHAPTERS, LESSONS };
})();
