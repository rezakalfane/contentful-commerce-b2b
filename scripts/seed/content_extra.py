"""Sample content for the extra content types. Company names, people and figures are fictional placeholders."""

# (topic, question, [answer paragraphs], featured)
FAQS = [
    ("Ordering", "How do I place a large order quickly?",
     ["Use the quick order form: type or paste a list of part numbers and quantities, one per line, and add everything to your cart at once. Unknown part numbers are flagged before you check out.",
      "If you buy the same items regularly, save them as a shopping list and reorder in one click."], True),
    ("Ordering", "Can I reorder a previous order?",
     ["Yes. Open your order history, choose an order and add all of its lines, or just the ones you need, back into your cart. Prices and stock are refreshed, so you always see today's figures."], False),
    ("Ordering", "Can several people in my company order on the same account?",
     ["Yes. Account administrators can invite colleagues, assign roles such as buyer or approver, and set spending limits. Every user keeps their own lists and order history inside the shared company account."], False),
    ("Pricing & Credit", "Will I see my own negotiated prices online?",
     ["When you are signed in, every product, search result and cart line shows the price agreed for your account, including any quantity breaks. If a price looks wrong, contact your account manager and we will review it."], True),
    ("Pricing & Credit", "Can I pay on account with credit terms?",
     ["Approved trade accounts can order on terms such as net 30. Your available credit and outstanding balance are shown at checkout, and an order that would exceed the limit is held for review rather than rejected."], True),
    ("Pricing & Credit", "Do you accept purchase orders?",
     ["Yes. Enter your purchase order number at checkout and we carry it through to your invoice. Accounts that need a PO on every order can make the field required."], False),
    ("Delivery & Returns", "When will my order arrive?",
     ["In-stock items show an estimated delivery window on the product page and in the cart. Orders with items on different lead times can ship in several parcels, and you can follow each one from the order page."], True),
    ("Delivery & Returns", "How do I return a battery?",
     ["Start a return from the order page and choose the items. Batteries are classified as hazardous goods for transport, so we arrange collection rather than asking you to post them. Keep the product in its original packaging until it is collected."], False),
    ("Delivery & Returns", "What should I do with my old battery?",
     ["Used batteries must be recycled responsibly. When we deliver a replacement we can collect the old battery at the same time; ask for this at checkout or contact support to arrange it."], False),
    ("Account & Users", "How do I apply for a trade account?",
     ["Complete the short application with your company details and tax information. We review it, usually within a couple of working days, and you will be told what happens next at every step."], False),
    ("Account & Users", "How do I download invoices?",
     ["Go to Invoices in your account. Each invoice has a status, due date and PDF download, and you can export a list for your accounts team."], False),
    ("Account & Users", "I forgot my password. What now?",
     ["Choose Forgot password on the sign-in page and we will email you a reset link. If you do not receive it, ask your account administrator to check the email address on your user."], False),
    ("Products & Fitment", "How do I choose between AGM, EFB and standard batteries?",
     ["Vehicles with start-stop systems normally need an AGM or EFB battery, while older vehicles without start-stop usually use a standard flooded battery. Check the vehicle handbook and read our buying guide for a step-by-step check."], True),
    ("Products & Fitment", "What do the Ah and A numbers mean?",
     ["Ah is the capacity: how much energy the battery stores. The A figure is the cold cranking current: how much power it can deliver to start the engine. Match or slightly exceed the original specification, and make sure the terminal layout and dimensions fit."], False),
    ("Products & Fitment", "Can I fit a higher-capacity battery than the original?",
     ["Often yes, provided it physically fits the tray, has the right terminal position and is the same technology. Fitting a lower specification, or swapping AGM for standard in a start-stop vehicle, is not recommended."], False),
]

# Real products on the storefront channel (BigCommerce product id, sku)
P = {
    "exide_agm": (377, "VC9596"), "varta_agm": (378, "VC87011"), "bosch_s3": (379, "VC10139"),
    "yuasa_efb": (380, "VC60014"), "energizer_agm": (381, "VC50101"), "fulbat_aux": (385, "VC9926"),
    "varta_truck": (391, "VC8766"), "numax_truck": (392, "VC8888"), "exide_truck": (393, "VC9696"),
    "autopro_truck": (394, "VC9532"), "lucas_d26": (395, "VC9013"), "lucas_d31": (401, "VC9014"),
    # leisure / deep-cycle
    "fulbat_gel": (426, "VC9873"), "exide_marine": (423, "VC9742"), "numax_dual": (418, "VC8917"), "lucas_marine": (419, "VC9022"),
    # chargers and jump starters
    "ctek_mxs": (507, "VC07075"), "fulload": (516, "VC1220"), "ansmann_charger": (509, "VC2303"),
    "noco_gb40": (522, "VC07063"), "fulboost": (525, "VC9589"),
    # motorcycle
    "numax_moto": (413, "VC9537"), "fulbat_ft9b": (403, "VC1046"), "fulbat_ftz7s": (412, "VC1036"),
    "exide_gel_moto": (410, "VC10751"), "numax_harley": (404, "VC9239"),
}

GUIDES = [
    {
        "title": "How to Choose a Car Battery: AGM, EFB or Standard",
        "audience": "Workshops", "minutes": 6, "theme": 0,
        "summary": "A practical, five-step check for matching a replacement car battery to the vehicle: technology, size, capacity, cranking current and terminal layout.",
        "steps": [
            ("Identify the technology", "Check whether the vehicle has start-stop. Start-stop vehicles need an AGM or EFB battery. Vehicles without it usually use a standard flooded battery.", "Never replace an AGM battery with a standard one: it will fail early in a start-stop vehicle."),
            ("Match the physical size", "Measure the battery tray and compare length, width and height with the product dimensions. The case style, such as L2 or L3, indicates the footprint.", "Check the hold-down clamp will still seat correctly."),
            ("Check capacity and cranking current", "Match or slightly exceed the original Ah and A ratings. A higher cranking rating is helpful in cold climates; lower is not advisable.", None),
            ("Confirm the terminal layout", "Look at which side the positive terminal is on. A mirrored layout may not reach the cables, and a stretched cable is a safety risk.", "Photograph the old battery before disconnecting it."),
            ("Fit and register", "Many modern vehicles need the new battery registered with the battery management system. Follow the manufacturer's procedure, and recycle the old battery.", None),
        ],
        "checklist": ["Start-stop fitted? Choose AGM or EFB", "Case size and tray dimensions match", "Ah and A rating meet or exceed the original", "Positive terminal on the correct side", "Battery registration required?"],
        "products": ["exide_agm", "varta_agm", "yuasa_efb", "energizer_agm", "bosch_s3"],
        "faqs": ["How do I choose between AGM, EFB and standard batteries?", "What do the Ah and A numbers mean?", "Can I fit a higher-capacity battery than the original?"],
        "author": 0,
    },
    {
        "title": "Truck and Commercial Batteries: A Fleet Buyer's Checklist",
        "audience": "Fleet managers", "minutes": 5, "theme": 3,
        "summary": "What fleet and workshop buyers should check before ordering heavy-duty batteries: voltage, capacity, cranking current, terminals and total cost of ownership.",
        "steps": [
            ("Confirm voltage and wiring", "Most commercial vehicles use 12V batteries, often in pairs for a 24V system. Some older vehicles use 6V batteries. Confirm which before ordering.", "For 24V systems, replace both batteries together."),
            ("Size for the duty cycle", "Vehicles that make many short trips or run equipment with the engine off need more capacity. Choose a heavy-duty battery with a higher Ah rating for those routines.", None),
            ("Verify cranking current", "A large diesel engine in cold conditions needs a high cranking rating. Compare the A figure with the engine manufacturer's recommendation.", None),
            ("Plan for the whole fleet", "Standardizing on a few part numbers simplifies stock holding and reduces fitting errors. Ask your account manager about volume pricing and scheduled deliveries.", "Set up a shopping list for each vehicle type and reorder in one click."),
        ],
        "checklist": ["12V or 24V system?", "Ah rating suits the duty cycle", "Cranking current meets the engine requirement", "Terminal type and position confirmed", "Core return arranged for old batteries"],
        "products": ["varta_truck", "numax_truck", "exide_truck", "autopro_truck"],
        "faqs": ["Can I pay on account with credit terms?", "What should I do with my old battery?", "Will I see my own negotiated prices online?"],
        "author": 1,
    },
    {
        "title": "Leisure and Auxiliary Batteries Explained",
        "audience": "Leisure & marine", "minutes": 4, "theme": 2,
        "summary": "Starter batteries and leisure batteries do different jobs. This guide explains deep-cycle versus starting duty, and where an auxiliary battery fits.",
        "steps": [
            ("Understand the job", "A starter battery delivers a short burst of high current. A leisure battery delivers a lower current for hours, and is designed to be discharged and recharged repeatedly.", None),
            ("Choose the right type", "For caravans, boats and campervans, pick a battery designed for leisure or marine use. Using a starter battery for lighting and appliances shortens its life.", "Check the charger is compatible with the battery chemistry."),
            ("Add an auxiliary battery where needed", "Some vehicles use a small auxiliary battery to support start-stop and electronic systems. Replace it with the same specification.", None),
        ],
        "checklist": ["Starting or deep-cycle duty?", "Capacity suits expected hours of use", "Charger and charging system compatible", "Secure mounting and ventilation"],
        "products": ["lucas_d26", "lucas_d31", "fulbat_aux"],
        "faqs": ["What do the Ah and A numbers mean?", "How do I return a battery?"],
        "author": 2,
    },
    {
        "title": "Deep-Cycle Batteries for Boats and Motorhomes: Gel, AGM or Dual-Purpose",
        "audience": "Leisure & marine", "minutes": 6, "theme": 2,
        "summary": "Leisure batteries power lights, fridges and electronics for hours at a time. Learn how to size one from your daily energy use and choose between gel, AGM and dual-purpose designs.",
        "steps": [
            ("Work out your daily energy use", "Multiply the power of each appliance by the hours it runs, add them up and divide by 12 to get amp-hours per day. Then add a margin of about 50 percent, because a lead-acid battery lasts longest when it is never fully drained.", "Aim to use no more than half of a lead-acid battery's rated capacity between charges."),
            ("Choose the chemistry", "AGM batteries are sealed, maintenance-free and accept higher charge currents. Gel batteries have excellent deep-cycle life but need a charger with a gel profile. Dual-purpose batteries can both start an engine and run loads, at the cost of being a compromise at each.", None),
            ("Check size, terminals and mounting", "Compare the group size and the length, width and height with the battery compartment, and confirm the terminal type and position. On a boat, secure the battery firmly: vibration and movement damage plates and connections.", "Leave a little room for ventilation and for cables to curve without strain."),
            ("Match the charging system", "The alternator, mains charger and solar controller must all support the battery chemistry you choose. A wrong charging profile is the most common reason a good deep-cycle battery fails early.", "Check the charger supports AGM or gel before you buy the battery."),
        ],
        "checklist": ["Daily energy use calculated in amp-hours", "AGM, gel or dual-purpose chosen for the job", "Group size and terminals fit the compartment", "Charger and alternator support the chemistry", "Mounting secured against vibration"],
        "products": ["fulbat_gel", "exide_marine", "numax_dual", "lucas_marine"],
        "faqs": ["What do the Ah and A numbers mean?", "What should I do with my old battery?"],
        "author": 2,
    },
    {
        "title": "Battery Chargers and Jump Starters: Choosing the Right One",
        "audience": "Workshops", "minutes": 5, "theme": 4,
        "summary": "A charger restores and maintains a battery; a jump starter gets a stranded engine running. Here is how to tell which you need, and how to size and specify each.",
        "steps": [
            ("Decide: charger or jump starter?", "A charger replenishes a battery slowly and safely and can keep it topped up for weeks. A jump starter delivers a short burst of current to start an engine with a flat battery. Many workshops need both.", None),
            ("Match voltage and chemistry", "Choose a charger for the system voltage you service, such as 6, 12 or 24 V, and make sure it has modes for the battery types you handle: lead-acid, AGM, gel or lithium.", "Never charge a lithium battery with a lead-acid-only charger."),
            ("Pick the right charge current", "As a rule of thumb, a charge current of about 10 percent of the battery's capacity is a good balance. A 50 Ah battery on a 5 A charger takes roughly ten hours to recover from flat.", None),
            ("Look for smart features", "Multi-stage charging, temperature compensation, a maintenance mode and reverse-polarity protection protect both the battery and the user. A supply mode that holds vehicle memory settings is useful during battery changes.", None),
            ("Size the jump starter to the largest engine", "Peak current matters most with large diesel engines and in cold weather. Check the manufacturer's guidance, and choose a unit with headroom for the biggest vehicle you will meet.", "Keep jump starters charged: a flat unit is no help on the day you need it."),
        ],
        "checklist": ["System voltage: 6, 12 or 24 V", "Battery types supported by the charger", "Charge current about 10 percent of capacity", "Smart multi-stage charging and maintenance mode", "Jump starter peak current suits the largest engine"],
        "products": ["ctek_mxs", "fulload", "ansmann_charger", "noco_gb40", "fulboost"],
        "faqs": ["What do the Ah and A numbers mean?", "How do I choose between AGM, EFB and standard batteries?"],
        "author": 0,
    },
    {
        "title": "Motorcycle and Powersports Batteries: Sizing, Chemistry and Care",
        "audience": "Everyone", "minutes": 5, "theme": 5,
        "summary": "Motorcycle batteries are small, but a wrong fit or a flat one in spring is a big nuisance. Find the right code, choose between sealed and conventional designs, and keep the battery healthy.",
        "steps": [
            ("Find the original battery code", "The code printed on the old battery or in the owner's manual, such as YB, YT or YTX, identifies the case size and terminal layout. Start from that code rather than from the model name of the bike.", "Photograph the old battery and its terminal layout before you disconnect it."),
            ("Choose the chemistry", "Conventional flooded batteries are the least expensive but need topping up. Sealed AGM and gel batteries are maintenance-free, resist vibration and will not spill, which suits motorcycles and powersports vehicles well.", None),
            ("Match capacity and cranking current", "Keep the amp-hour rating at or above the original, and do not go below the original cranking current. Larger engines and cold starts demand more.", None),
            ("Check polarity and dimensions", "A mirrored terminal layout will not reach the cables, and an oversized battery will not fit the tray or leave room for the vent tube. Confirm both before ordering.", None),
            ("Look after it", "Bikes often stand for weeks. Use a smart maintainer during storage, avoid fast-charging sealed batteries, and store the battery fully charged.", "A battery left flat for long periods loses capacity for good."),
        ],
        "checklist": ["Battery code from the old battery or manual", "Sealed AGM or gel chosen for vibration-prone use", "Capacity and cranking current at least equal to original", "Polarity and dimensions confirmed", "Maintainer planned for long storage"],
        "products": ["numax_moto", "fulbat_ft9b", "fulbat_ftz7s", "exide_gel_moto", "numax_harley"],
        "faqs": ["How do I return a battery?", "What should I do with my old battery?"],
        "author": 4,
    },
]

SPOTLIGHTS = [
    ("exide_agm", "Exide AGM G34 EK508 Start-Stop", "Start-stop power for modern, high-demand vehicles", "Trade favourite",
     ["AGM technology built for start-stop systems", "12V, 50Ah capacity", "800A cold cranking current"],
     [("Start-stop cars", "Replace like-for-like where the vehicle was fitted with an AGM battery.")], ["VC9626"], True),
    ("yuasa_efb", "Yuasa YBX7019 EFB Start-Stop", "High capacity EFB for demanding start-stop duty", "Best seller",
     ["Enhanced flooded battery (EFB) construction", "12V, 100Ah capacity", "850A cold cranking current"],
     [("Large engines and vans", "A big-capacity option for vehicles with higher electrical loads.")], [], True),
    ("exide_truck", "Exide CV Range D05 EG1803 Truck Battery", "A heavy-duty workhorse for commercial fleets", "Heavy duty",
     ["Commercial vehicle range", "12V, 180Ah capacity", "1000A cold cranking current"],
     [("Trucks and coaches", "Reliable starting for large diesel engines."), ("Long-haul fleets", "High capacity for in-cab loads.")], ["VC9532"], True),
    ("lucas_d26", "Lucas Marine Starter D26 LL22 Leisure Battery", "Dependable power for boats and caravans", "None",
     ["Leisure and marine duty", "12V, 75Ah capacity", "420A cranking current"],
     [("Boats", "Starting and onboard power."), ("Caravans and motorhomes", "Reliable supply for lighting and appliances.")], ["VC9014"], False),
    ("bosch_s3", "Bosch S3002 Car Battery", "A trusted brand at a sharp trade price", "Best seller",
     ["12V, 45Ah capacity", "400A (EN) cold cranking current", "Suited to vehicles without start-stop"],
     [("Everyday cars", "A dependable replacement for smaller vehicles.")], [], False),
    ("fulbat_aux", "Fulbat AUX9 AGM Auxiliary Battery", "Compact AGM backup for on-board electronics", "New in",
     ["AGM auxiliary battery", "12V, 8.4Ah capacity", "135A current"],
     [("Start-stop and electronics support", "Maintains the vehicle's systems during engine restarts.")], [], False),
]

ANNOUNCEMENTS = [
    {"title": "Trade terms announcement", "message": "Trade accounts: apply for net 30 credit terms online in minutes.",
     "cta": ("Learn how", "/faq"), "style": "promo", "audience": "guests"},
    {"title": "Delivery cut-off notice", "message": "Order in-stock batteries before 2pm for dispatch the same day.",
     "cta": ("See delivery FAQs", "/faq"), "style": "info", "audience": "everyone"},
]

HOME = {
    "title": "Commerce B2B",
    "description": "Trade batteries for workshops, fleets and distributors: your prices, your credit terms and fast reordering.",
    "rich_text": "<p>Sign in to see your negotiated pricing, order on account and reorder in one click. Browse our <a href=\"/products\">products</a> and <a href=\"/guides\">buying guides</a>, or read the <a href=\"/blog\">blog</a>.</p>",
    "blocks": [
        ("Your prices, every time", "<p>Contract and tiered prices show everywhere you shop, from search results to the cart, so there are no surprises at checkout.</p>", "image_left", 0),
        ("Reorder in seconds", "<p>Save lists for each vehicle or depot and rebuy a whole order in one click. Quick order lets you paste part numbers straight from a spreadsheet.</p>", "image_right", 3),
        ("Built for teams", "<p>Invite colleagues, set roles and spending limits, and keep approvals and invoices in one shared company account.</p>", "image_left", 4),
    ],
}

NAV = {
    "title": "Main Navigation",
    "header": [("Products", "/products"), ("Buying guides", "/guides"), ("Blog", "/blog"), ("FAQ", "/faq")],
    "footer": [
        ("Shop & learn", [("Products", "/products"), ("Buying guides", "/guides"), ("Blog", "/blog"), ("FAQ", "/faq")]),
        ("Help", [("Delivery & returns", "/faq"), ("Trade accounts & credit", "/faq")]),
    ],
    "contact": ("sales@example.com", "+44 20 7946 0000", "Monday to Friday, 8am to 6pm"),
    "legal": "Commerce B2B. Sample storefront content.",
}
