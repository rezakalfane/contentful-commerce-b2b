"""French translations of the 36 blog posts, in the same order and shape as content.POSTS:
(title, intro, (heading1, paragraph1), (heading2, paragraph2), [takeaways])."""

POSTS_FR = [
    # ---- Priya Raman : Tarification et catalogue
    [
        (
            "Tarifs contractuels : donner à chaque acheteur son propre prix",
            "En B2B, le prix affiché en rayon est rarement celui que le client paie. Les tarifs contractuels consistent à montrer à chaque compte le prix qu'il a négocié, et ils constituent le socle de tout portail de vente en gros sérieux.",
            ("Pourquoi les prix catalogue ne suffisent pas", "La plupart des relations B2B sont régies par des accords : un prix fixe pour un an, une remise en pourcentage sur une catégorie, ou un palier de volume qui s'applique à partir d'une palette. Lorsqu'un portail n'affiche que le prix catalogue, les acheteurs pensent qu'il se trompe et reviennent à l'e-mail. Les tarifs contractuels lèvent ce doute en affichant partout le prix négocié, des résultats de recherche jusqu'au panier."),
            ("Modéliser les prix en couches", "L'approche la plus propre consiste à superposer les prix : une base catalogue, puis des remises par groupe de clients, puis des contrats propres à chaque compte. Chaque couche ne stocke que les exceptions, de sorte que le prix de base peut évoluer sans remettre en cause les accords. Documentez l'ordre de priorité pour que les équipes commerciales et financières s'accordent sur la couche qui l'emporte."),
            ["Affichez le prix propre à l'acheteur sur toutes les pages, pas seulement au paiement", "Stockez les exceptions, pas des copies complètes du tarif", "Rendez l'ordre de priorité des couches de prix explicite et testable"],
        ),
        (
            "Des prix dégressifs que les acheteurs comprennent vraiment",
            "Les paliers de quantité récompensent les grosses commandes, à condition que les acheteurs puissent les voir. Un tableau de prix dégressifs bien conçu peut augmenter le panier moyen sans le moindre code promo.",
            ("Rendre les paliers visibles", "Affichez le tableau complet des paliers sur la fiche produit et mettez à jour le prix unitaire à mesure que la quantité change. L'acheteur ne devrait jamais avoir à deviner combien d'unités déclenchent le prix suivant. Un petit encouragement du type « ajoutez 12 unités pour économiser 4 % » transforme une règle tarifaire en incitation à acheter."),
            ("Anticiper les cas particuliers", "Les paliers se compliquent lorsqu'ils interagissent avec les conditionnements, les variantes mixtes et les prix contractuels. Décidez dès le départ si les quantités s'additionnent entre les variantes d'un même produit, et si un prix contractuel remplace le palier ou se cumule avec lui. Les mauvaises surprises au paiement abîment la confiance bien plus vite qu'un prix plus élevé."),
            ["Affichez les paliers et mettez à jour le prix unitaire en direct", "Décidez comment les variantes s'additionnent pour atteindre un palier", "Définissez comment les paliers se combinent avec les prix contractuels"],
        ),
        (
            "Maîtriser un catalogue de milliers de références",
            "Un catalogue de vente en gros n'est pas un catalogue de détail. Les acheteurs savent ce qu'ils veulent, souvent par référence, et une expérience centrée sur la navigation les ralentit.",
            ("Structurer pour ceux qui connaissent déjà la pièce", "Permettez la recherche par référence, par référence fabricant et par achat précédent. Proposez les attributs comme filtres, tels que le diamètre de filetage, la tension ou la matière, plutôt que de vous reposer uniquement sur la profondeur des catégories. Pour les acheteurs réguliers, une recherche qui renvoie l'article exact en une frappe vaut tous les méga-menus."),
            ("Garder des données produit fiables", "Les grands catalogues se dégradent. Les articles arrêtés traînent, les attributs sont incohérents et les images disparaissent. Désignez un responsable de la qualité des données, suivez la complétude par catégorie et masquez les produits qui ne respectent pas un standard minimal plutôt que de les publier à moitié finis."),
            ["Optimisez la recherche pour les références et les achats passés", "Privilégiez les filtres d'attributs aux arborescences profondes", "Mesurez et imposez la complétude des données produit"],
        ),
        (
            "Listes de prix, groupes de clients et visibilité",
            "Les règles de visibilité déterminent quels acheteurs peuvent voir et acheter quels produits. Bien les définir protège les marges et garde le catalogue pertinent pour chaque compte.",
            ("Segmenter avec intention", "Les groupes de clients sont puissants mais faciles à surutiliser. Ne créez un groupe que lorsqu'il change quelque chose de concret : un prix, un assortiment visible ou un mode de paiement. Un groupe par compte devient un tableur ingérable en moins d'un an."),
            ("Tester du point de vue de l'acheteur", "Le bogue de tarification le plus courant est une règle qui fonctionne pour l'administrateur et échoue pour l'acheteur. Prenez l'habitude de prévisualiser la boutique en tant que compte représentatif de chaque groupe avant de publier toute modification de prix ou de visibilité."),
            ["Ne créez un groupe de clients que s'il change un résultat", "Révisez régulièrement l'appartenance aux groupes", "Prévisualisez toujours les changements en tant qu'acheteur réel"],
        ),
        (
            "Des promotions qui protègent la marge en contexte B2B",
            "Les promotions B2B ne ressemblent pas à celles du commerce de détail. Les acheteurs négocient, les budgets sont planifiés et une remise surprise peut fragiliser un contrat.",
            ("Cibler les comptes, pas la foule", "Ciblez les promotions par groupe de clients ou par compte afin de ne pas remiser des acheteurs qui bénéficient déjà de meilleures conditions. Les offres limitées dans le temps sur les stocks à rotation lente ou les nouveautés fonctionnent souvent mieux que les opérations généralisées de remise en pourcentage."),
            ("Protéger le contrat", "Précisez si une promotion peut se cumuler avec un prix contractuel. Si oui, plafonnez la remise cumulée. Sinon, rendez la règle visible pour que les responsables de comptes n'aient pas à expliquer pourquoi une offre ne s'est pas appliquée."),
            ["Ciblez par compte ou par groupe, pas pour tout le monde", "Réservez les promotions aux stocks et aux lancements", "Définissez et affichez les règles de cumul"],
        ),
        (
            "Gouvernance des prix : qui peut modifier un prix ?",
            "À mesure qu'un portail grandit, de plus en plus de personnes veulent modifier les prix. Sans gouvernance, de petits changements s'accumulent en fuites de marge et en clients mécontents.",
            ("Définir responsabilités et validation", "Séparez ceux qui proposent les changements de prix de ceux qui les valident. Même un processus léger en deux étapes permet d'attraper les fautes de frappe, comme une virgule mal placée, avant qu'elles n'atteignent des milliers d'acheteurs."),
            ("Conserver une piste d'audit", "Journalisez qui a changé quoi et quand, et conservez les valeurs précédentes. Lorsqu'un client conteste un prix d'il y a trois semaines, pouvoir reconstituer l'état du catalogue à cette date règle la discussion en quelques minutes."),
            ["Séparez la proposition de la validation des prix", "Conservez un historique consultable des changements", "Faites relire les changements à fort impact avant publication"],
        ),
    ],
    # ---- Marcus Oyelaran : Expérience acheteur
    [
        (
            "Concevoir un formulaire de commande rapide que les acheteurs adorent",
            "Les acheteurs professionnels commandent souvent des dizaines de lignes à la fois. Un formulaire de commande rapide transforme une corvée de dix minutes en une tâche d'une minute.",
            ("La vitesse vient du clavier", "Laissez les acheteurs saisir ou coller une référence et une quantité, puis passer à la ligne suivante avec la touche Tab. Validez au fil de la saisie, signalez les références inconnues sur place et conservez le formulaire intact en cas d'erreur. Prenez en charge le collage d'un bloc de lignes copiées depuis un tableur, car c'est ainsi que beaucoup d'acheteurs tiennent déjà leurs listes."),
            ("Afficher la disponibilité d'emblée", "Rien n'est plus frustrant que de composer un grand panier et de découvrir au paiement que la moitié est en réapprovisionnement. Affichez le statut de stock et le délai prévu sur chaque ligne pour que les acheteurs puissent ajuster tant qu'ils sont dans le flux."),
            ["Optimisez pour la saisie au clavier et le collage depuis un tableur", "Validez chaque ligne au fil de la saisie", "Affichez stock et délai avant le panier"],
        ),
        (
            "Recommander en un clic : simplifier les achats récurrents",
            "L'essentiel du chiffre d'affaires B2B vient des achats récurrents. Si recommander est facile, les acheteurs reviennent sur votre portail ; sinon, ils retournent à leurs anciennes habitudes.",
            ("S'appuyer sur l'historique de commandes", "Proposez un historique de commandes consultable qui permet d'ajouter au panier une commande précédente complète, ou seulement certaines lignes. Affichez les prix actuels, et non ceux de la commande d'origine, et signalez tout article modifié ou arrêté."),
            ("Proposer des listes enregistrées", "Les listes d'achat permettent aux équipes de standardiser ce qu'elles achètent, comme les fournitures mensuelles d'un site ou un kit standard pour un chantier. Autorisez le partage des listes au sein d'une entreprise pour qu'un nouvel employé ne parte pas de zéro."),
            ["Permettez de recommander une commande entière ou certaines lignes", "Signalez les changements depuis le dernier achat", "Prenez en charge des listes partageables au sein d'un compte"],
        ),
        (
            "Une recherche qui comprend le langage industriel",
            "Les acheteurs B2B cherchent avec des références, des abréviations, des dimensions et du jargon de métier. Une zone de recherche générique conçue pour le commerce de détail en manquera l'essentiel.",
            ("Apprendre votre vocabulaire à la recherche", "Maintenez des synonymes pour les abréviations et les fautes courantes, et rendez les dimensions recherchables dans les formats utilisés par les acheteurs. Passez en revue chaque semaine les requêtes sans résultat : c'est gratuitement la liste de ce qui manque à votre catalogue ou à votre configuration de recherche."),
            ("Rendre les résultats faciles à parcourir", "Affichez dans la liste de résultats les attributs qui comptent, comme la taille, la matière et la quantité par conditionnement, pour que les acheteurs puissent comparer sans ouvrir dix pages. Intégrez directement dans les résultats le prix de l'acheteur et la disponibilité."),
            ["Passez en revue les recherches sans résultat chaque semaine", "Prenez en charge les synonymes et les variantes d'unités", "Affichez attributs clés, prix et stock dans les résultats"],
        ),
        (
            "Hiérarchies de comptes : une entreprise, plusieurs acheteurs",
            "Un client B2B est rarement une seule personne. C'est une entreprise avec des agences, des services, des acheteurs, des valideurs et parfois des maisons mères.",
            ("Refléter l'organisation de l'entreprise", "Laissez les administrateurs inviter des utilisateurs, attribuer des rôles et fixer des limites comme un montant maximal de commande ou des adresses de livraison autorisées. Les rôles doivent refléter de vrais métiers : un acheteur qui peut commander, un valideur qui peut libérer, un utilisateur finance qui ne peut que consulter les factures."),
            ("Garder une expérience personnelle", "Même au sein d'un compte partagé, chaque personne doit voir ses propres commandes, listes et adresses. Une bonne conception des hiérarchies réduit les appels au support, car les acheteurs peuvent gérer eux-mêmes des changements qui exigeaient autrefois un e-mail au responsable de compte."),
            ["Modélisez explicitement entreprises, utilisateurs et rôles", "Permettez aux administrateurs de gérer leur équipe en autonomie", "Conservez des vues personnelles au sein des comptes partagés"],
        ),
        (
            "Suivi de commande et libre-service qui réduisent les appels au support",
            "« Où est ma commande ? » est la question la plus coûteuse du support B2B. Y répondre dans le portail libère votre équipe pour des tâches à plus forte valeur.",
            ("Montrer tout le parcours", "Donnez aux acheteurs un statut clair pour chaque commande et chaque expédition, avec des liens de suivi transporteur et des livraisons partielles expliquées en langage simple. En cas de retard, dites-le de vous-même plutôt que d'attendre un appel."),
            ("Mettre les documents à portée de main", "Les acheteurs ont besoin de factures, de bons de livraison et de certificats à la demande. Proposez des téléchargements depuis la page de commande et laissez les utilisateurs finance exporter des listes de factures pour leur propre rapprochement."),
            ["Affichez le statut et le suivi de chaque expédition", "Prévenez de manière proactive en cas de retard", "Rendez factures et documents téléchargeables"],
        ),
        (
            "Le B2B sur mobile : commander depuis le chantier",
            "Beaucoup d'acheteurs B2B ne sont pas à leur bureau. Ils sont dans un entrepôt, sur un chantier ou dans un camion de livraison, et ils commandent depuis un téléphone.",
            ("Concevoir pour les pouces et les mauvaises connexions", "Utilisez de grandes zones tactiles, un panier sur une seule colonne et des formulaires qui retiennent ce qui a été saisi. Gardez des pages légères, car un chantier a souvent une connexion instable. Le scan de code-barres pour ajouter des articles peut transformer un téléphone en outil de commande très rapide."),
            ("Ne pas cacher l'essentiel", "Le réassort, le statut des commandes et les coordonnées de contact doivent être à un seul toucher. Testez sur des appareils milieu de gamme, et pas seulement sur le dernier modèle phare, car c'est ce que portent beaucoup d'équipes."),
            ["Optimisez pour l'usage à une main et les réseaux faibles", "Envisagez le scan de code-barres pour une saisie rapide", "Testez sur des appareils réalistes"],
        ),
    ],
    # ---- Elena Vasquez : Intégrations et données
    [
        (
            "Modèles d'intégration ERP pour le commerce B2B",
            "Votre ERP détient la vérité sur les clients, les prix, les stocks et les commandes. Une plateforme de commerce ne vaut que ce que vaut sa connexion à l'ERP.",
            ("Choisir quoi synchroniser et quand", "Toutes les données n'ont pas besoin de la même fraîcheur. Les commandes doivent circuler rapidement et de façon fiable, les stocks peuvent être synchronisés à intervalles courts, tandis que les descriptions produit peuvent être mises à jour chaque jour. Adapter la fréquence au besoin métier garde l'intégration simple et moins chère à exploiter."),
            ("Concevoir pour la panne", "Les réseaux tombent et des enregistrements sont rejetés. Prévoyez des relances, une file des messages en échec et des alertes pour qu'une commande en échec ne disparaisse pas en silence. Rendez les opérations idempotentes afin qu'une relance ne crée jamais de commande en double."),
            ["Adaptez la fréquence de synchronisation au besoin métier", "Rendez les opérations idempotentes", "Alertez sur les échecs plutôt que d'espérer"],
        ),
        (
            "Pourquoi votre PIM et votre plateforme de commerce devraient moins se contredire",
            "Les systèmes de gestion d'informations produit et les plateformes de commerce détiennent souvent des données qui se recoupent. Sans frontières claires, ils dérivent l'un de l'autre.",
            ("Tracer une ligne de propriété", "Décidez quel système possède chaque attribut. Le PIM peut posséder les descriptions, les spécifications et les médias, tandis que le commerce possède les prix et les indicateurs de merchandising. Consignez les règles par écrit et appliquez-les avec des synchronisations à sens unique chaque fois que possible."),
            ("Valider avant de publier", "Exécutez des contrôles sur les attributs obligatoires, la présence d'images et les conventions de nommage avant que les produits n'atteignent la boutique. Un enregistrement rejeté avec un message clair vaut mieux qu'un produit en ligne avec un tableau de spécifications vide."),
            ["Attribuez un seul propriétaire par attribut", "Privilégiez les synchronisations à sens unique", "Validez la complétude avant publication"],
        ),
        (
            "Un stock en temps réel sans douleur",
            "Les acheteurs veulent savoir si un article est en stock. Livrer cette réponse avec exactitude sans mettre à genoux votre système d'entrepôt demande un peu de soin.",
            ("Mettre en cache avec discernement", "Interrogez le stock en direct pour les pages produit et panier où l'exactitude compte, et utilisez des caches de courte durée pour les listes. Acceptez qu'un compteur de 5 000 n'ait pas besoin d'être exact, alors qu'un compteur de 3 doit l'être."),
            ("Communiquer l'incertitude honnêtement", "Utilisez des fourchettes et des statuts comme « en stock », « stock faible » et « disponible sous 5 jours » plutôt que de promettre une précision que vous ne pouvez pas fournir. Une communication honnête inspire plus de confiance qu'un chiffre parfois faux."),
            ["Utilisez des données en direct là où elles influencent la décision", "Mettez les listes en cache brièvement", "Affichez des statuts et des fourchettes pour les grandes quantités"],
        ),
        (
            "Webhooks ou interrogation : garder les systèmes synchronisés",
            "Chaque intégration doit décider comment apprendre qu'une chose a changé. Les deux principales options sont d'être prévenu ou de demander à répétition.",
            ("Préférer les événements quand c'est possible", "Les webhooks livrent les changements en quelques secondes et réduisent les requêtes inutiles. Ils sont idéaux pour les nouvelles commandes, les changements de statut et les mises à jour du catalogue. Vérifiez les signatures, répondez vite et traitez le travail de façon asynchrone."),
            ("Garder l'interrogation comme filet de sécurité", "Un webhook peut être manqué. Une tâche de rapprochement périodique qui compare les changements récents rattrape ce qui a échappé. L'association des événements pour la rapidité et de l'interrogation pour la certitude est généralement la plus robuste."),
            ["Utilisez les webhooks pour des mises à jour rapides", "Vérifiez et acquittez rapidement", "Exécutez une tâche de rapprochement périodique"],
        ),
        (
            "Migrer les données clients sans perdre la confiance",
            "Déplacer clients, adresses et historique de commandes vers une nouvelle plateforme est délicat. Les gens remarquent quand quelque chose manque.",
            ("Nettoyer avant de déplacer", "Les doublons, les adresses obsolètes et les noms d'entreprise incohérents se corrigent plus facilement à la source qu'après la migration. Convenez d'une règle de rapprochement pour les entreprises et les utilisateurs, et lancez des migrations d'essai jusqu'à ce que les chiffres concordent."),
            ("Préparer la bascule", "Communiquez auprès des clients sur ce qui va changer, par exemple les nouvelles étapes de connexion, et donnez-leur un moyen clair d'obtenir de l'aide. Gardez l'ancien système accessible en lecture seule pendant un temps pour que le support puisse répondre aux questions sur les commandes passées."),
            ["Dédoublonnez et standardisez d'abord", "Lancez plusieurs migrations d'essai", "Gardez l'ancien système consultable après la bascule"],
        ),
        (
            "Une approche pratique de la qualité des données en commerce",
            "Les mauvaises données sont une taxe silencieuse sur chaque projet de commerce. Elles se manifestent par des prix erronés, des commandes en échec et des acheteurs frustrés.",
            ("Mesurer ce qui compte", "Choisissez quelques indicateurs, comme la part des produits aux attributs complets, les commandes qui échouent à la validation et les adresses refusées par les transporteurs. Suivez-les dans le temps et passez-les en revue dans la même réunion que les chiffres de vente."),
            ("Corriger à la source", "Rapiécer les données en aval masque le problème et garantit son retour. Remontez les anomalies à l'équipe propriétaire avec des exemples, et automatisez les contrôles qui attrapent deux fois la même erreur."),
            ["Suivez un petit ensemble d'indicateurs de qualité des données", "Signalez les anomalies au système propriétaire des données", "Automatisez les contrôles récurrents"],
        ),
    ],
    # ---- Tom Whitfield : Paiements et crédit
    [
        (
            "Paiement à terme en ligne : offrir du crédit sans le chaos",
            "Beaucoup d'acheteurs B2B s'attendent à payer sur facture. Proposer un paiement à 30 jours dans votre portail peut faire gagner des affaires, mais cela demande des garde-fous.",
            ("Rattacher les conditions au compte", "Des conditions comme le paiement à 30 jours doivent être une propriété de l'entreprise, fixée par la finance après une étude de crédit. Montrez aux acheteurs leur crédit disponible et leur solde en cours pour qu'ils puissent s'organiser, et bloquez ou avertissez lorsqu'une commande dépasserait la limite."),
            ("Garder la finance dans la boucle", "Synchronisez les plafonds de crédit approuvés et les soldes avec votre comptabilité pour que le portail ne devienne pas une seconde source de vérité. En cas de paiement en retard, rendez-le visible à la fois pour l'acheteur et le responsable de compte."),
            ["Attribuez conditions et plafonds par entreprise", "Affichez soldes et crédit disponible", "Synchronisez les données de crédit avec la comptabilité"],
        ),
        (
            "Bons de commande dans un paiement numérique",
            "Les bons de commande sont la façon dont de nombreuses organisations contrôlent leurs dépenses. Un paiement moderne doit les traiter comme un élément à part entière, pas comme une réflexion après coup.",
            ("Saisir le numéro de bon de commande tôt", "Demandez le numéro de bon de commande et les champs de référence pendant le paiement, et reportez-les jusqu'à la facture. Certains acheteurs ont besoin d'un bon par commande, d'autres par projet : prévoyez les deux avec des champs facultatifs ou obligatoires selon le compte."),
            ("Prendre en charge pièces jointes et validations", "Laissez les acheteurs téléverser le document de bon de commande quand leur processus l'exige, et dirigez les commandes dépassant un seuil vers un valideur. Des messages de statut clairs indiquent à l'acheteur si une commande attend un paiement, une validation ou du stock."),
            ["Reportez les numéros de bon de commande sur les factures", "Autorisez des champs obligatoires par compte", "Prenez en charge pièces jointes et circuits de validation"],
        ),
        (
            "Facturation et rapprochement des paiements pour le B2B en ligne",
            "Prendre des commandes en ligne n'est que la moitié du travail. Les équipes financières veulent que les factures correspondent aux commandes et les paiements aux factures.",
            ("Offrir des factures en libre-service", "Proposez une liste de factures avec statut, échéances et liens de téléchargement. Permettez de payer une ou plusieurs factures en une seule action, et envoyez des rappels avant les échéances plutôt qu'après."),
            ("Rendre le rapprochement ennuyeux", "Utilisez des numéros de référence cohérents entre commande, facture et paiement. Quand les références concordent, la comptabilité clients cesse de passer ses vendredis après-midi à rapprocher à la main."),
            ["Fournissez des listes de factures avec statuts clairs", "Autorisez le paiement de plusieurs factures", "Gardez des références cohérentes de bout en bout"],
        ),
        (
            "Des circuits de validation qui ne ralentissent pas les acheteurs",
            "Les validations protègent les budgets, mais celles qui sont mal conçues créent des goulots d'étranglement. L'objectif est le contrôle sans friction.",
            ("Valider par exception", "Fixez des seuils pour que les commandes courantes passent automatiquement et que seules les commandes inhabituelles nécessitent une revue. Appuyez les règles sur la valeur, la catégorie de produit ou le centre de coûts, et laissez les administrateurs les ajuster sans l'aide d'un développeur."),
            ("Prévenir la bonne personne au bon moment", "Envoyez aux valideurs un résumé concis avec une seule action pour approuver ou rejeter. Ajoutez des rappels et la délégation pour les vacances, et montrez au demandeur où sa commande est en attente."),
            ["Déclenchez les validations selon des seuils", "Faites de la validation une action en un clic", "Prenez en charge rappels et délégation"],
        ),
        (
            "Taxes, exonérations et commandes transfrontalières",
            "Les règles fiscales sont l'une des parties les moins glamour et les plus importantes du commerce B2B. Les erreurs deviennent des problèmes de conformité.",
            ("Gérer correctement les exonérations", "De nombreux acheteurs professionnels sont exonérés de certaines taxes. Conservez les certificats d'exonération sur l'entreprise, appliquez-les automatiquement et tenez-les à jour avec des rappels d'expiration."),
            ("Prévoir les frontières", "Les commandes internationales ajoutent des droits de douane, des régimes fiscaux différents et des documents supplémentaires. Décidez tôt quels marchés vous servez, comment afficher les prix TTC ou HT et qui est responsable des droits."),
            ["Conservez les certificats d'exonération sur le compte", "Suivez l'expiration des certificats", "Soyez explicite sur les droits et l'affichage des taxes"],
        ),
        (
            "Réduire la friction du paiement en B2B",
            "Un acheteur qui a décidé d'acheter ne devrait pas être ralenti par des étapes de paiement. De petites améliorations ici paient immédiatement.",
            ("Proposer des moyens adaptés à la commande", "La carte convient aux achats petits et urgents. Le virement et la facture conviennent aux plus gros. Ne présentez que les moyens disponibles pour ce compte afin d'éviter les impasses."),
            ("Mémoriser ce qui fonctionne", "Autorisez les moyens de paiement et adresses enregistrés, et préremplissez-les pour les acheteurs récurrents. Affichez des erreurs claires en cas d'échec de paiement et conservez le panier intact pour que l'acheteur puisse réessayer aussitôt."),
            ["N'affichez que les moyens utilisables par le compte", "Enregistrez les données de paiement en toute sécurité", "Préservez le panier après un échec"],
        ),
    ],
    # ---- Aisha Rahman : Vente et devis
    [
        (
            "Les devis dans le portail : de la demande à la commande",
            "Les commandes importantes ou sur mesure commencent souvent par un devis. Faire passer cet échange dans le portail le rend plus rapide et plus facile à suivre.",
            ("Laisser l'acheteur lancer la conversation", "Permettez aux acheteurs de transformer un panier en demande de devis avec des notes et une date cible. Recueillez les informations dont un commercial a besoin, comme les quantités, le lieu de livraison et le budget, pour que la première réponse soit utile plutôt qu'une liste de questions."),
            ("Boucler la boucle", "Quand le devis est prêt, prévenez l'acheteur, montrez les prix proposés et laissez-le accepter en un clic. Un devis accepté doit devenir une commande sans que personne ne ressaisisse une ligne."),
            ["Créez des devis à partir des paniers", "Recueillez d'emblée les informations utiles aux commerciaux", "Convertissez directement les devis acceptés en commandes"],
        ),
        (
            "Outils pour les commerciaux : vendre pour le compte des clients",
            "Les commerciaux passent encore une grande part des commandes B2B. Leur donner les mêmes outils qu'aux acheteurs garde les données cohérentes et accélère leur journée.",
            ("Laisser le commercial agir comme le client", "Autorisez un commercial habilité à parcourir et à commander en tant que client, avec les prix et conditions du client. Enregistrez qui a passé la commande pour que le reporting soit exact et que les clients puissent consulter l'historique."),
            ("Réduire le travail de ressaisie", "Un commercial qui doit recopier les commandes dans un ERP finira par abandonner le portail. Assurez-vous que les commandes circulent automatiquement et que les commerciaux voient l'état du compte sans quitter leur flux de travail."),
            ["Prenez en charge la commande assistée par un commercial", "Enregistrez qui a passé chaque commande", "Supprimez la double saisie"],
        ),
        (
            "Allier libre-service et vente humaine",
            "Le libre-service ne remplace pas les équipes commerciales. Il change l'endroit où elles passent leur temps.",
            ("Automatiser le routinier", "Les réassorts, le statut des commandes et le téléchargement des factures ne devraient demander personne. Quand un commercial ne passe plus de temps sur ces demandes, il peut se concentrer sur la croissance, les nouveaux produits et les besoins complexes."),
            ("Faciliter le relais", "Proposez des chemins clairs du portail vers une personne, comme un chat ou un bouton « être rappelé » qui transmet le contexte. Le commercial doit arriver en sachant ce que regardait l'acheteur."),
            ["Automatisez les demandes répétitives", "Offrez des accès contextuels vers un humain", "Mesurez le temps des commerciaux passé sur les tâches courantes"],
        ),
        (
            "Prix négociés dans un canal numérique",
            "La négociation fait partie du B2B, et les canaux numériques doivent la soutenir plutôt que l'éliminer.",
            ("Consigner les accords au même endroit", "Enregistrez dans la plateforme les prix négociés avec leurs dates de début et de fin pour que les acheteurs les voient automatiquement. Les accords qui arrivent à échéance doivent alerter les deux parties avant d'expirer."),
            ("Autoriser les contre-propositions dans des limites", "Les outils de devis peuvent laisser les commerciaux ajuster les prix dans des marges préapprouvées, les changements plus importants étant soumis à validation. Cela fait avancer les affaires sans sacrifier le contrôle."),
            ["Stockez les accords avec leurs dates de validité", "Alertez avant l'expiration des accords", "Définissez les limites de remise des commerciaux"],
        ),
        (
            "Mesurer le succès d'un portail B2B",
            "Lancer un portail n'est que le début. Savoir s'il fonctionne exige quelques mesures bien choisies.",
            ("Observer l'adoption et les comportements", "Suivez la part des commandes passées en ligne, le nombre d'acheteurs actifs par compte et la fréquence des réassorts. Un portail avec beaucoup de connexions mais peu de commandes signale un problème d'ergonomie ou de prix à examiner."),
            ("Relier aux résultats métier", "Comparez le volume d'appels au support, le temps de saisie des commandes et le panier moyen avant et après. Ces chiffres transforment un projet technologique en histoire que la finance et la direction peuvent suivre."),
            ["Suivez la part de commandes en ligne et les acheteurs actifs", "Comparez la charge du support dans le temps", "Présentez les résultats en termes métier"],
        ),
        (
            "Intégrer de nouveaux clients B2B en ligne",
            "Le premier contact avec un nouveau client professionnel donne le ton. L'intégration numérique peut le rendre rapide et professionnel.",
            ("Recueillir l'essentiel une seule fois", "Utilisez un formulaire de demande clair pour les informations de l'entreprise, les données fiscales et les demandes de crédit. Orientez-le vers la bonne équipe et dites au demandeur ce qui se passe ensuite et dans quel délai."),
            ("Bien l'accueillir", "Une fois approuvé, offrez au nouveau client un démarrage guidé : créer les utilisateurs, importer une première liste et repérer où trouver les factures et le support. Les premiers succès font les longues relations."),
            ["Proposez un parcours de demande clair", "Fixez des attentes sur les délais", "Guidez les nouveaux comptes dans leurs premières tâches"],
        ),
    ],
    # ---- Daniel Kowalski : Headless et performance
    [
        (
            "Le commerce headless pour le B2B : quand est-ce pertinent ?",
            "Les architectures headless séparent la vitrine du moteur de commerce. Pour les équipes B2B, cette liberté est utile, mais elle n'est pas gratuite.",
            ("Là où le headless brille", "Des expériences acheteur sur mesure, plusieurs marques ou régions sur un même back-end et une intégration étroite avec les outils de contenu sont de bonnes raisons. Une vitrine headless permet aux designers et aux développeurs d'itérer sans attendre les cycles de livraison de la plateforme."),
            ("Compter honnêtement les coûts", "Vous assumez la responsabilité du front-end : performance, accessibilité, SEO et correctifs de sécurité. Assurez-vous que l'équipe a les compétences et l'envie avant de vous engager, et commencez par un périmètre ciblé plutôt que de tout reconstruire."),
            ["Choisissez le headless pour la maîtrise de l'expérience et la flexibilité", "Budgétez la responsabilité du front-end", "Commencez par un périmètre limité"],
        ),
        (
            "Associer un CMS à un back-end de commerce",
            "Le contenu et le commerce ont des forces différentes. Associer un CMS headless à une plateforme de commerce donne à chacun, marketeurs et merchandisers, le bon outil.",
            ("Répartir les responsabilités", "Gardez produits, prix et paniers dans la plateforme de commerce. Gardez pages d'atterrissage, articles et contenus de campagne dans le CMS. La vitrine compose les deux, en référençant les produits par identifiant depuis le contenu."),
            ("Prévisualiser et publier en sécurité", "Offrez aux éditeurs un aperçu qui inclut les données produit en direct pour qu'ils voient les pages comme les acheteurs. Utilisez des webhooks pour revalider les caches à la publication afin que les changements apparaissent vite sans reconstruction complète."),
            ["Laissez chaque système posséder son domaine", "Référencez les produits par ID dans le contenu", "Revalidez à la publication"],
        ),
        (
            "Budgets de performance pour les pages catalogue",
            "La vitesse influence la conversion, même en B2B. Une page catalogue qui met plusieurs secondes à se charger fait perdre le temps de personnes qui commandent toute la journée.",
            ("Fixer des limites et les faire respecter", "Définissez des budgets pour le poids de page, la taille du JavaScript et les principaux temps de chargement, puis vérifiez-les dans votre chaîne de build. Les budgets transforment la performance d'un vague objectif en critère de réussite ou d'échec."),
            ("Corriger les suspects habituels", "Les images surdimensionnées, les scripts bloquants et les balises tierces illimitées causent l'essentiel des lenteurs. Servez des images adaptatives dans des formats modernes, différez ce qui n'est pas nécessaire et auditez régulièrement les balises."),
            ["Définissez et automatisez des budgets de performance", "Optimisez d'abord les images", "Auditez les scripts tiers"],
        ),
        (
            "Stratégies de cache pour des prix personnalisés",
            "Les prix contractuels rendent les pages personnelles, ce qui complique la mise en cache. L'astuce est de mettre en cache ce qui est partagé et de récupérer ce qui est personnel.",
            ("Séparer la coquille des données", "Servez depuis le cache les parties partagées d'une page, comme les descriptions et les images. Récupérez séparément les prix et la disponibilité propres à l'acheteur pour qu'ils restent exacts sans rendre toute la page non cachable."),
            ("Invalider avec précision", "Étiquetez le contenu en cache par produit ou par catégorie et ne revalidez que ce qui a changé. Une invalidation précise garde les pages fraîches et vos factures d'infrastructure prévisibles."),
            ["Mettez en cache le contenu partagé, récupérez les données personnelles", "Étiquetez le contenu pour une invalidation ciblée", "Ne mettez jamais en cache publiquement ce qui est propre à l'acheteur"],
        ),
        (
            "L'accessibilité dans les boutiques B2B",
            "Les acheteurs professionnels incluent des personnes en situation de handicap, et de nombreuses organisations exigent des outils accessibles. L'accessibilité est à la fois la bonne chose à faire et une exigence pratique.",
            ("L'intégrer dès le départ", "Utilisez du HTML sémantique, des états de focus visibles et un contraste suffisant. Assurez-vous que les tableaux denses, comme les grilles de commande et les formulaires de commande rapide, sont utilisables au clavier et avec un lecteur d'écran."),
            ("Tester avec de vrais outils", "Les contrôles automatiques n'attrapent qu'une partie du problème. Parcourez les parcours clés au clavier et avec un lecteur d'écran, et incluez l'accessibilité dans votre définition de « terminé »."),
            ["Utilisez du HTML sémantique et un focus visible", "Rendez les formulaires denses utilisables au clavier", "Testez manuellement les parcours clés"],
        ),
        (
            "Migrer vers une boutique composable pas à pas",
            "Peu d'équipes peuvent mettre l'activité en pause pour une refonte. Une migration progressive permet de livrer de la valeur pendant la transition.",
            ("Commencer par la périphérie", "Choisissez une section à valeur claire, comme la page d'accueil, une page d'atterrissage ou la fiche produit, et dirigez-la vers la nouvelle vitrine pendant que le reste reste en l'état. Chaque étape valide l'approche et renforce la confiance."),
            ("Garder une expérience cohérente", "Partagez les design tokens, la navigation et l'analytique entre l'ancien et le nouveau pour que les acheteurs ne sentent pas les coutures. Suivez les mêmes indicateurs des deux côtés pour confirmer que les nouvelles pages performent au moins aussi bien."),
            ["Migrez section par section", "Partagez design et analytique entre ancien et nouveau", "Comparez les indicateurs pour valider chaque étape"],
        ),
    ],
]

assert len(POSTS_FR) == 6 and all(len(p) == 6 for p in POSTS_FR)
