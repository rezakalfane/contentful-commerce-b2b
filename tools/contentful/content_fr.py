"""French translations of the non-blog content. Lists keep the order/shape of their English counterparts in
content.py / content_extra.py so the seeder can pair them by index."""

AUTHOR_BIOS_FR = [
    "Priya dirige la stratégie tarifaire d'équipes de commerce B2B. Depuis dix ans, elle démêle tarifs contractuels, remises par paliers et catalogues tentaculaires pour des distributeurs et des fabricants.",
    "Marcus conçoit des parcours de commande pour les équipes achats. Il écrit sur les flux de commande rapide, le réassort et les petits détails qui font préférer un portail au téléphone.",
    "Elena est architecte d'intégration et connecte les plateformes de commerce aux ERP, PIM et systèmes d'entrepôt. Elle est convaincue que la plupart des retards de lancement B2B sont des problèmes de données déguisés.",
    "Tom travaille depuis quinze ans dans les paiements B2B et le crédit commercial. Il traite du paiement à terme, de la facturation, des validations et de la façon dont les équipes financières peuvent dire oui à la commande numérique.",
    "Aisha aide les organisations commerciales à réunir commerciaux, devis et libre-service dans une même dynamique. Elle se concentre sur la vente assistée, les hiérarchies de comptes et les outils pour commerciaux.",
    "Daniel est ingénieur front-end, spécialiste des boutiques composables et headless. Il écrit sur les budgets de performance, la mise en cache et la livraison rapide sans monolithe.",
]

# Keywords appended to each post's SEO keywords, one per author theme.
THEME_KEYWORDS_FR = [
    "tarification et catalogue", "expérience acheteur", "intégrations et données",
    "paiements et crédit", "vente et devis", "headless et performance",
]

# (question, [answer paragraphs]) in the same order as content_extra.FAQS
FAQS_FR = [
    ("Comment passer rapidement une grosse commande ?",
     ["Utilisez le formulaire de commande rapide : saisissez ou collez une liste de références et de quantités, une par ligne, et ajoutez le tout au panier d'un coup. Les références inconnues sont signalées avant le paiement.",
      "Si vous achetez régulièrement les mêmes articles, enregistrez-les dans une liste d'achat et recommandez en un clic."]),
    ("Puis-je recommander une commande précédente ?",
     ["Oui. Ouvrez votre historique de commandes, choisissez une commande et ajoutez toutes ses lignes, ou seulement celles dont vous avez besoin, à votre panier. Les prix et les stocks sont actualisés : vous voyez toujours les chiffres du jour."]),
    ("Plusieurs personnes de mon entreprise peuvent-elles commander sur le même compte ?",
     ["Oui. Les administrateurs du compte peuvent inviter des collègues, attribuer des rôles comme acheteur ou valideur et fixer des limites de dépenses. Chaque utilisateur conserve ses propres listes et son historique de commandes au sein du compte d'entreprise partagé."]),
    ("Verrai-je mes propres prix négociés en ligne ?",
     ["Lorsque vous êtes connecté, chaque produit, résultat de recherche et ligne de panier affiche le prix convenu pour votre compte, y compris les éventuels paliers de quantité. Si un prix vous semble erroné, contactez votre responsable de compte et nous l'examinerons."]),
    ("Puis-je payer sur compte avec des conditions de crédit ?",
     ["Les comptes professionnels approuvés peuvent commander à des conditions telles que le paiement à 30 jours. Votre crédit disponible et votre solde en cours sont affichés au paiement, et une commande qui dépasserait la limite est mise en attente de revue plutôt que rejetée."]),
    ("Acceptez-vous les bons de commande ?",
     ["Oui. Saisissez votre numéro de bon de commande au paiement et nous le reportons sur votre facture. Les comptes qui exigent un bon de commande sur chaque commande peuvent rendre le champ obligatoire."]),
    ("Quand ma commande arrivera-t-elle ?",
     ["Les articles en stock affichent une fenêtre de livraison estimée sur la fiche produit et dans le panier. Les commandes dont les articles ont des délais différents peuvent être expédiées en plusieurs colis, et vous pouvez suivre chacun depuis la page de commande."]),
    ("Comment retourner une batterie ?",
     ["Lancez un retour depuis la page de commande et choisissez les articles. Les batteries sont classées marchandises dangereuses pour le transport : nous organisons donc l'enlèvement au lieu de vous demander de les expédier. Gardez le produit dans son emballage d'origine jusqu'à son enlèvement."]),
    ("Que faire de ma vieille batterie ?",
     ["Les batteries usagées doivent être recyclées de façon responsable. Lorsque nous livrons une batterie de remplacement, nous pouvons reprendre l'ancienne en même temps ; demandez-le au paiement ou contactez le support pour l'organiser."]),
    ("Comment demander un compte professionnel ?",
     ["Remplissez le court formulaire avec les informations de votre entreprise et vos données fiscales. Nous l'examinons, généralement sous quelques jours ouvrés, et on vous indique à chaque étape la suite des opérations."]),
    ("Comment télécharger mes factures ?",
     ["Rendez-vous dans Factures, dans votre compte. Chaque facture a un statut, une échéance et un PDF à télécharger, et vous pouvez exporter une liste pour votre service comptable."]),
    ("J'ai oublié mon mot de passe. Que faire ?",
     ["Choisissez Mot de passe oublié sur la page de connexion et nous vous enverrons un lien de réinitialisation par e-mail. Si vous ne le recevez pas, demandez à l'administrateur de votre compte de vérifier l'adresse e-mail de votre utilisateur."]),
    ("Comment choisir entre AGM, EFB et batterie standard ?",
     ["Les véhicules équipés d'un système start-stop nécessitent normalement une batterie AGM ou EFB, tandis que les véhicules plus anciens sans start-stop utilisent généralement une batterie standard à électrolyte liquide. Consultez le manuel du véhicule et lisez notre guide d'achat pour une vérification pas à pas."]),
    ("Que signifient les valeurs Ah et A ?",
     ["Ah est la capacité : la quantité d'énergie que la batterie stocke. La valeur en A est le courant de démarrage à froid : la puissance qu'elle peut fournir pour lancer le moteur. Respectez ou dépassez légèrement la spécification d'origine, et vérifiez que la disposition des bornes et les dimensions conviennent."]),
    ("Puis-je monter une batterie de capacité supérieure à l'originale ?",
     ["Souvent oui, à condition qu'elle tienne physiquement dans le logement, qu'elle ait la bonne position de bornes et qu'elle soit de même technologie. Monter une spécification inférieure, ou remplacer une AGM par une batterie standard sur un véhicule start-stop, n'est pas recommandé."]),
]

# Same order as content_extra.GUIDES. steps: (title, body, tip-or-None)
GUIDES_FR = [
    {
        "title": "Comment choisir une batterie de voiture : AGM, EFB ou standard",
        "summary": "Une vérification pratique en cinq étapes pour associer une batterie de remplacement au véhicule : technologie, taille, capacité, courant de démarrage et disposition des bornes.",
        "steps": [
            ("Identifier la technologie", "Vérifiez si le véhicule est équipé du start-stop. Les véhicules start-stop nécessitent une batterie AGM ou EFB. Les véhicules qui n'en sont pas équipés utilisent généralement une batterie standard à électrolyte liquide.", "Ne remplacez jamais une batterie AGM par une batterie standard : elle s'usera prématurément sur un véhicule start-stop."),
            ("Vérifier les dimensions", "Mesurez le logement de la batterie et comparez longueur, largeur et hauteur avec les dimensions du produit. Le type de bac, par exemple L2 ou L3, indique l'encombrement.", "Vérifiez que la bride de maintien se fixera toujours correctement."),
            ("Contrôler la capacité et le courant de démarrage", "Respectez ou dépassez légèrement les valeurs d'origine en Ah et en A. Un courant de démarrage plus élevé est utile par temps froid ; une valeur plus faible n'est pas conseillée.", None),
            ("Confirmer la disposition des bornes", "Regardez de quel côté se trouve la borne positive. Une disposition inversée peut ne pas atteindre les câbles, et un câble tendu présente un risque pour la sécurité.", "Photographiez l'ancienne batterie avant de la débrancher."),
            ("Monter et enregistrer", "De nombreux véhicules récents exigent que la nouvelle batterie soit enregistrée auprès du système de gestion de batterie. Suivez la procédure du constructeur et recyclez l'ancienne batterie.", None),
        ],
        "checklist": ["Start-stop présent ? Choisissez AGM ou EFB", "Format du bac et dimensions du logement concordent", "Capacité (Ah) et courant (A) égaux ou supérieurs à l'origine", "Borne positive du bon côté", "Enregistrement de la batterie nécessaire ?"],
    },
    {
        "title": "Batteries poids lourds et utilitaires : la check-list de l'acheteur de flotte",
        "summary": "Ce que les acheteurs de flotte et d'atelier doivent vérifier avant de commander des batteries pour usage intensif : tension, capacité, courant de démarrage, bornes et coût total de possession.",
        "steps": [
            ("Confirmer la tension et le câblage", "La plupart des véhicules utilitaires utilisent des batteries 12 V, souvent par paire pour un réseau 24 V. Certains véhicules plus anciens utilisent des batteries 6 V. Confirmez laquelle avant de commander.", "Pour les réseaux 24 V, remplacez les deux batteries ensemble."),
            ("Dimensionner selon le cycle d'utilisation", "Les véhicules qui font de nombreux trajets courts ou alimentent des équipements moteur coupé ont besoin de plus de capacité. Choisissez pour ces usages une batterie à usage intensif avec une capacité en Ah plus élevée.", None),
            ("Vérifier le courant de démarrage", "Un gros moteur diesel par temps froid exige un courant de démarrage élevé. Comparez la valeur en A avec la recommandation du constructeur du moteur.", None),
            ("Planifier pour toute la flotte", "Standardiser sur quelques références simplifie la gestion des stocks et réduit les erreurs de montage. Interrogez votre responsable de compte sur les tarifs de volume et les livraisons programmées.", "Créez une liste d'achat pour chaque type de véhicule et recommandez en un clic."),
        ],
        "checklist": ["Réseau 12 V ou 24 V ?", "Capacité (Ah) adaptée au cycle d'utilisation", "Courant de démarrage conforme à l'exigence du moteur", "Type et position des bornes confirmés", "Reprise des anciennes batteries organisée"],
    },
    {
        "title": "Batteries de loisirs et auxiliaires expliquées",
        "summary": "Les batteries de démarrage et les batteries de loisirs n'ont pas le même rôle. Ce guide explique la différence entre cycle profond et démarrage, et la place d'une batterie auxiliaire.",
        "steps": [
            ("Comprendre le rôle", "Une batterie de démarrage délivre une brève impulsion de courant élevé. Une batterie de loisirs délivre un courant plus faible pendant des heures et est conçue pour être déchargée puis rechargée de manière répétée.", None),
            ("Choisir le bon type", "Pour les caravanes, les bateaux et les camping-cars, choisissez une batterie conçue pour les loisirs ou la navigation. Utiliser une batterie de démarrage pour l'éclairage et les appareils réduit sa durée de vie.", "Vérifiez que le chargeur est compatible avec la chimie de la batterie."),
            ("Ajouter une batterie auxiliaire si nécessaire", "Certains véhicules utilisent une petite batterie auxiliaire pour soutenir le start-stop et les systèmes électroniques. Remplacez-la par une batterie de même spécification.", None),
        ],
        "checklist": ["Usage démarrage ou cycle profond ?", "Capacité adaptée au nombre d'heures d'utilisation prévu", "Chargeur et système de charge compatibles", "Fixation solide et ventilation"],
    },
    {
        "title": "Batteries à décharge lente pour bateaux et camping-cars : gel, AGM ou usage mixte",
        "summary": "Les batteries de loisirs alimentent éclairage, réfrigérateur et électronique pendant des heures. Apprenez à en dimensionner une à partir de votre consommation quotidienne et à choisir entre gel, AGM et usage mixte.",
        "steps": [
            ("Calculer votre consommation quotidienne", "Multipliez la puissance de chaque appareil par ses heures de fonctionnement, additionnez le tout et divisez par 12 pour obtenir les ampères-heures par jour. Ajoutez ensuite une marge d'environ 50 %, car une batterie au plomb dure plus longtemps lorsqu'elle n'est jamais vidée complètement.", "Visez une utilisation de la moitié au plus de la capacité nominale d'une batterie au plomb entre deux recharges."),
            ("Choisir la technologie", "Les batteries AGM sont étanches, sans entretien et acceptent des courants de charge plus élevés. Les batteries gel ont une excellente durée de vie en cycles profonds mais exigent un chargeur doté d'un profil gel. Les batteries à usage mixte peuvent à la fois démarrer un moteur et alimenter des appareils, au prix d'un compromis dans chaque rôle.", None),
            ("Vérifier format, bornes et fixation", "Comparez le format du bac et la longueur, la largeur et la hauteur avec le logement de la batterie, et confirmez le type et la position des bornes. Sur un bateau, fixez solidement la batterie : les vibrations et les mouvements abîment les plaques et les connexions.", "Laissez un peu de place pour la ventilation et pour que les câbles courbent sans contrainte."),
            ("Adapter le système de charge", "L'alternateur, le chargeur secteur et le régulateur solaire doivent tous être compatibles avec la technologie choisie. Un mauvais profil de charge est la cause la plus courante de défaillance prématurée d'une bonne batterie à décharge lente.", "Vérifiez que le chargeur prend en charge l'AGM ou le gel avant d'acheter la batterie."),
        ],
        "checklist": ["Consommation quotidienne calculée en ampères-heures", "AGM, gel ou usage mixte choisi selon l'usage", "Format et bornes adaptés au logement", "Chargeur et alternateur compatibles avec la technologie", "Fixation sécurisée contre les vibrations"],
    },
    {
        "title": "Chargeurs de batterie et boosters de démarrage : bien choisir",
        "summary": "Un chargeur restaure et entretient une batterie ; un booster remet en marche un moteur en panne. Voici comment savoir de quel appareil vous avez besoin, et comment dimensionner et spécifier chacun.",
        "steps": [
            ("Décider : chargeur ou booster ?", "Un chargeur recharge une batterie lentement et en sécurité, et peut la maintenir pendant des semaines. Un booster délivre une brève impulsion de courant pour démarrer un moteur dont la batterie est à plat. Beaucoup d'ateliers ont besoin des deux.", None),
            ("Adapter tension et technologie", "Choisissez un chargeur pour la tension des systèmes que vous entretenez, comme 6, 12 ou 24 V, et vérifiez qu'il propose des modes pour les types de batteries que vous traitez : plomb, AGM, gel ou lithium.", "Ne chargez jamais une batterie lithium avec un chargeur réservé au plomb."),
            ("Choisir le bon courant de charge", "En règle générale, un courant de charge d'environ 10 % de la capacité de la batterie offre un bon équilibre. Une batterie de 50 Ah chargée par un chargeur de 5 A met environ dix heures à se remettre d'une décharge complète.", None),
            ("Rechercher les fonctions intelligentes", "La charge en plusieurs phases, la compensation de température, un mode d'entretien et la protection contre l'inversion de polarité protègent à la fois la batterie et l'utilisateur. Un mode d'alimentation qui conserve la mémoire du véhicule est utile lors des changements de batterie.", None),
            ("Dimensionner le booster sur le plus gros moteur", "Le courant de crête compte surtout pour les gros moteurs diesel et par temps froid. Consultez les recommandations du constructeur et choisissez un appareil avec de la marge pour le plus gros véhicule que vous rencontrerez.", "Gardez les boosters chargés : un appareil à plat ne sert à rien le jour où l'on en a besoin."),
        ],
        "checklist": ["Tension du système : 6, 12 ou 24 V", "Types de batteries pris en charge par le chargeur", "Courant de charge d'environ 10 % de la capacité", "Charge intelligente en plusieurs phases et mode d'entretien", "Courant de crête du booster adapté au plus gros moteur"],
    },
    {
        "title": "Batteries moto et sports mécaniques : taille, technologie et entretien",
        "summary": "Les batteries de moto sont petites, mais un mauvais montage ou une batterie à plat au printemps est un vrai désagrément. Trouvez le bon code, choisissez entre conception étanche et conventionnelle, et gardez la batterie en bonne santé.",
        "steps": [
            ("Retrouver le code de la batterie d'origine", "Le code imprimé sur l'ancienne batterie ou dans le manuel du propriétaire, comme YB, YT ou YTX, identifie le format du bac et la disposition des bornes. Partez de ce code plutôt que du nom du modèle de la moto.", "Photographiez l'ancienne batterie et la disposition de ses bornes avant de la débrancher."),
            ("Choisir la technologie", "Les batteries conventionnelles à électrolyte liquide sont les moins chères mais demandent des appoints. Les batteries étanches AGM et gel sont sans entretien, résistent aux vibrations et ne coulent pas, ce qui convient bien aux motos et aux véhicules de sports mécaniques.", None),
            ("Respecter capacité et courant de démarrage", "Gardez une capacité en ampères-heures au moins égale à l'originale, et ne descendez pas sous le courant de démarrage d'origine. Les moteurs plus gros et les démarrages à froid en demandent davantage.", None),
            ("Contrôler polarité et dimensions", "Une disposition de bornes inversée n'atteindra pas les câbles, et une batterie trop grande n'ira pas dans le logement et ne laissera pas de place au tuyau d'évent. Confirmez les deux avant de commander.", None),
            ("En prendre soin", "Les motos restent souvent immobilisées plusieurs semaines. Utilisez un mainteneur intelligent pendant le remisage, évitez la charge rapide des batteries étanches et stockez la batterie complètement chargée.", "Une batterie laissée à plat longtemps perd définitivement de la capacité."),
        ],
        "checklist": ["Code de la batterie relevé sur l'ancienne ou dans le manuel", "AGM ou gel étanche choisi pour un usage exposé aux vibrations", "Capacité et courant de démarrage au moins égaux à l'origine", "Polarité et dimensions confirmées", "Mainteneur prévu pour un long remisage"],
    },
]

# Same order as content_extra.SPOTLIGHTS: (tagline, features, [(use_case, description)])
SPOTLIGHTS_FR = [
    ("La puissance start-stop pour les véhicules modernes très sollicités",
     ["Technologie AGM conçue pour les systèmes start-stop", "12 V, capacité de 50 Ah", "Courant de démarrage à froid de 800 A"],
     [("Voitures start-stop", "À remplacer à l'identique lorsque le véhicule était équipé d'une batterie AGM.")]),
    ("Une batterie EFB haute capacité pour les usages start-stop exigeants",
     ["Construction EFB (batterie à électrolyte liquide renforcée)", "12 V, capacité de 100 Ah", "Courant de démarrage à froid de 850 A"],
     [("Gros moteurs et utilitaires", "Une option de grande capacité pour les véhicules aux charges électriques plus élevées.")]),
    ("Un cheval de bataille robuste pour les flottes utilitaires",
     ["Gamme véhicules utilitaires", "12 V, capacité de 180 Ah", "Courant de démarrage à froid de 1 000 A"],
     [("Camions et autocars", "Un démarrage fiable pour les gros moteurs diesel."), ("Flottes longue distance", "Une grande capacité pour les consommateurs en cabine.")]),
    ("Une alimentation fiable pour bateaux et caravanes",
     ["Usage loisirs et nautisme", "12 V, capacité de 75 Ah", "Courant de démarrage de 420 A"],
     [("Bateaux", "Démarrage et alimentation de bord."), ("Caravanes et camping-cars", "Une alimentation fiable pour l'éclairage et les appareils.")]),
    ("Une marque de confiance à un prix professionnel serré",
     ["12 V, capacité de 45 Ah", "Courant de démarrage à froid de 400 A (EN)", "Adaptée aux véhicules sans start-stop"],
     [("Voitures de tous les jours", "Un remplacement fiable pour les véhicules plus petits.")]),
    ("Un secours AGM compact pour l'électronique embarquée",
     ["Batterie auxiliaire AGM", "12 V, capacité de 8,4 Ah", "Courant de 135 A"],
     [("Assistance start-stop et électronique", "Maintient les systèmes du véhicule pendant les redémarrages du moteur.")]),
]
SPOTLIGHT_SUMMARY_FR = "Vérifiez la spécification par rapport à la batterie d'origine du véhicule avant de commander, et consultez notre guide d'achat pour un contrôle de compatibilité pas à pas."

# Same order as content_extra.ANNOUNCEMENTS: (internal title, message, cta label)
ANNOUNCEMENTS_FR = [
    ("Annonce des conditions professionnelles", "Comptes professionnels : demandez en quelques minutes des conditions de paiement à 30 jours en ligne.", "En savoir plus"),
    ("Avis de limite horaire de livraison", "Commandez avant 14 h les batteries en stock pour une expédition le jour même.", "Voir la FAQ livraison"),
]

NAV_FR = {
    "title": "Navigation principale",
    "header": [("Produits", "/products"), ("Guides d'achat", "/guides"), ("Blog", "/blog"), ("FAQ", "/faq")],
    "footer": [
        ("Boutique et conseils", [("Produits", "/products"), ("Guides d'achat", "/guides"), ("Blog", "/blog"), ("FAQ", "/faq")]),
        ("Aide", [("Livraison et retours", "/faq"), ("Comptes professionnels et crédit", "/faq")]),
    ],
    "hours": "Du lundi au vendredi, de 8 h à 18 h",
    "legal": "Commerce B2B. Contenu de démonstration de la boutique.",
}

HOME_FR = {
    "description": "Batteries professionnelles pour ateliers, flottes et distributeurs : vos prix, vos conditions de crédit et un réassort rapide.",
    "rich_text": "<p>Connectez-vous pour voir vos prix négociés, commander sur compte et recommander en un clic. Parcourez nos <a href=\"/fr/produits\">produits</a> et nos <a href=\"/fr/guides\">guides d'achat</a>, ou lisez le <a href=\"/fr/blog\">blog</a>.</p>",
    "blocks": [
        ("Vos prix, à chaque fois", "<p>Les prix contractuels et par paliers s'affichent partout où vous achetez, des résultats de recherche au panier, pour qu'il n'y ait aucune surprise au paiement.</p>"),
        ("Recommandez en quelques secondes", "<p>Enregistrez des listes pour chaque véhicule ou dépôt et rachetez toute une commande en un clic. La commande rapide vous permet de coller des références directement depuis un tableur.</p>"),
        ("Pensé pour les équipes", "<p>Invitez vos collègues, définissez des rôles et des limites de dépenses, et gardez validations et factures dans un même compte d'entreprise partagé.</p>"),
    ],
}

# key -> (title, description, cta label, cta href). English titles are the lookup keys (see seed_extra.HEROES).
HEROES_FR = {
    "home": ("Commerce B2B", HOME_FR["description"], "Parcourir les guides d'achat", "/guides"),
    "faq": ("Questions fréquentes", "Des réponses rapides pour les acheteurs professionnels sur la commande, les prix et le crédit, la livraison, les comptes et la compatibilité.", "Parcourir les guides d'achat", "/guides"),
    "guides": ("Guides d'achat", "Des check-lists pratiques, pas à pas, pour associer la bonne batterie au besoin, destinées aux ateliers, aux flottes et aux amateurs de loisirs.", "Lire la FAQ", "/faq"),
    "blog": ("Le blog du commerce B2B", "Conseils pratiques sur les prix, la commande, les intégrations, les paiements, la vente et les boutiques headless pour les équipes de commerce B2B.", "Parcourir les articles", "/blog"),
}

PAGES_FR = {
    "/faq": ("FAQ", HEROES_FR["faq"][1]),
    "/guides": ("Guides d'achat", HEROES_FR["guides"][1]),
}

BLOG_LISTING_FR = {
    "title": "Blog",
    "placeholder": "Rechercher des articles",
    "search_button": "Rechercher",
    "from_blog_title": "Derniers articles",
    "view_articles": "Voir tous les articles",
    "widget_title": "À lire aussi",
}
