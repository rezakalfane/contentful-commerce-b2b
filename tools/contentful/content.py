"""Seed content for Contentful: fictional authors and generic B2B commerce articles.

Each post is (title, intro, (heading1, paragraph1), (heading2, paragraph2), [takeaways]).
"""

AUTHORS = [
    {
        "name": "Priya Raman",
        "theme": "Pricing & Catalog",
        "colors": ((14, 70, 140), (60, 160, 220)),
        "bio": "Priya leads pricing strategy for B2B commerce teams. She has spent a decade untangling contract prices, tiered discounts and catalog sprawl for distributors and manufacturers.",
    },
    {
        "name": "Marcus Oyelaran",
        "theme": "Buyer Experience",
        "colors": ((120, 40, 90), (220, 100, 140)),
        "bio": "Marcus designs ordering experiences for procurement teams. He writes about quick order flows, reordering and the small details that make buyers choose a portal over the phone.",
    },
    {
        "name": "Elena Vasquez",
        "theme": "Integrations & Data",
        "colors": ((20, 100, 80), (90, 190, 150)),
        "bio": "Elena is an integration architect who connects commerce platforms to ERPs, PIMs and warehouse systems. She believes most B2B launch delays are data problems in disguise.",
    },
    {
        "name": "Tom Whitfield",
        "theme": "Payments & Credit",
        "colors": ((150, 90, 10), (240, 180, 60)),
        "bio": "Tom has worked in B2B payments and trade credit for fifteen years. He covers net terms, invoicing, approvals and how finance teams can say yes to digital ordering.",
    },
    {
        "name": "Aisha Rahman",
        "theme": "Sales & Quoting",
        "colors": ((90, 50, 150), (170, 130, 235)),
        "bio": "Aisha helps sales organizations bring reps, quotes and self-service into one motion. Her focus is on assisted selling, account hierarchies and sales rep tooling.",
    },
    {
        "name": "Daniel Kowalski",
        "theme": "Headless & Performance",
        "colors": ((40, 50, 60), (110, 130, 150)),
        "bio": "Daniel is a frontend engineer specializing in composable and headless storefronts. He writes about performance budgets, caching and shipping fast without a monolith.",
    },
]

# One list of six posts per author, in the same order as AUTHORS.
POSTS = [
    # ---- Priya Raman: Pricing & Catalog
    [
        (
            "Contract Pricing 101: Giving Every Buyer Their Own Price",
            "In B2B, the price on the shelf is rarely the price a customer pays. Contract pricing is the practice of showing each account the price they negotiated, and it is the foundation of any serious wholesale portal.",
            ("Why list prices fall short", "Most B2B relationships are governed by agreements: a fixed price for a year, a percentage off a category, or a volume break that kicks in at a pallet. When a portal shows only list price, buyers assume the portal is wrong and go back to email. Contract pricing removes that doubt by showing the negotiated number everywhere, from search results to the cart."),
            ("Model prices as layers", "The cleanest approach is to layer prices: a base list, then customer group overrides, then account-specific contracts. Each layer only stores exceptions, so the base price can change without breaking agreements. Document the order of precedence so sales and finance agree on which layer wins."),
            ["Show the buyer's own price on every surface, not just at checkout", "Store exceptions, not full copies of the price book", "Make the precedence of price layers explicit and testable"],
        ),
        (
            "Tiered and Volume Pricing That Buyers Actually Understand",
            "Quantity breaks reward bigger orders, but only if buyers can see them. A well designed volume pricing table can lift average order value without a single discount code.",
            ("Make the breaks visible", "Show the full tier table on the product page and update the displayed unit price as the quantity changes. Buyers should never have to guess how many units earn the next price. A small nudge such as add 12 more to save 4 percent turns a pricing rule into a prompt to buy."),
            ("Watch for edge cases", "Tiers get complicated when they interact with pack sizes, mixed variants and contract prices. Decide early whether quantities aggregate across variants of a product, and whether a contract price replaces the tier or stacks with it. Surprises at checkout damage trust faster than a higher price ever would."),
            ["Display tiers and update the unit price live", "Decide how variants aggregate toward a break", "Define how tiers combine with contract pricing"],
        ),
        (
            "Taming a Catalog with Thousands of SKUs",
            "A wholesale catalog is not a retail catalog. Buyers know what they want, often by part number, and a browsing-first experience slows them down.",
            ("Structure for people who already know the part", "Support search by SKU, manufacturer part number and previous purchase. Offer attributes as filters, such as thread size, voltage or material, rather than relying on category depth alone. For repeat buyers, a search that returns their exact item in one keystroke beats any mega menu."),
            ("Keep product data honest", "Large catalogs decay. Discontinued items linger, attributes are inconsistent and images go missing. Assign ownership of data quality, track completeness per category, and hide products that fail a minimum standard instead of publishing them half finished."),
            ["Optimize search for part numbers and past orders", "Use attribute filters over deep category trees", "Measure and enforce product data completeness"],
        ),
        (
            "Price Lists, Customer Groups and Who Sees What",
            "Visibility rules decide which buyers can see and buy which products. Getting them right protects margins and keeps the catalog relevant to each account.",
            ("Segment with intent", "Customer groups are powerful but easy to overuse. Create groups only when they change something real: a price, a visible assortment or a payment option. A group for every account turns into an unmaintainable spreadsheet within a year."),
            ("Test as the buyer", "The most common pricing bug is a rule that works for the admin and fails for the buyer. Build a habit of previewing the storefront as a representative account from each group before launching any change to prices or visibility."),
            ["Create a customer group only when it changes an outcome", "Review group membership on a schedule", "Always preview changes as a real buyer"],
        ),
        (
            "Margin-Aware Promotions in a B2B Context",
            "Promotions in B2B look different from retail. Buyers negotiate, budgets are planned and a surprise discount can undermine a contract.",
            ("Promote to accounts, not the crowd", "Target promotions by customer group or account so you do not discount buyers who already receive better terms. Time-boxed offers on slow-moving stock or new product introductions tend to work better than blanket percentage-off events."),
            ("Protect the contract", "Spell out whether a promotion can stack with contract pricing. If it can, cap the combined discount. If it cannot, make that rule visible so account managers are not fielding questions about why a deal did not apply."),
            ["Target by account or group, not by everyone", "Use promotions for inventory and launches", "Define and display stacking rules"],
        ),
        (
            "Pricing Governance: Who Gets to Change a Price?",
            "As a portal grows, more people want to edit prices. Without governance, small changes snowball into margin leaks and angry customers.",
            ("Define ownership and approval", "Separate the people who propose price changes from the people who approve them. Even a lightweight two-step process catches typos, such as a decimal in the wrong place, before they reach thousands of buyers."),
            ("Keep an audit trail", "Log who changed what and when, and keep the previous values. When a customer disputes a price from three weeks ago, being able to reconstruct the state of the catalog on that date resolves the conversation in minutes."),
            ["Split proposing from approving price changes", "Keep a searchable history of changes", "Review high-impact changes before publishing"],
        ),
    ],
    # ---- Marcus Oyelaran: Buyer Experience
    [
        (
            "Designing a Quick Order Form Procurement Teams Love",
            "Professional buyers often order dozens of lines at a time. A quick order form turns a ten minute chore into a one minute task.",
            ("Speed comes from the keyboard", "Let buyers type or paste a SKU and quantity, then tab to the next row. Validate as they go, flag unknown parts inline and keep the form intact when something is wrong. Support pasting a block of rows copied from a spreadsheet, because that is how many buyers already keep their lists."),
            ("Show availability up front", "Nothing is more frustrating than building a large cart and discovering at checkout that half of it is back-ordered. Display stock status and expected lead time on each row so buyers can adjust while they are still in the flow."),
            ["Optimize for keyboard entry and spreadsheet paste", "Validate each line inline", "Surface stock and lead time before the cart"],
        ),
        (
            "Reorder in One Click: Making Repeat Purchases Effortless",
            "Most B2B revenue comes from repeat purchases. If reordering is easy, buyers come back to your portal; if it is not, they go back to their old habits.",
            ("Build on order history", "Provide an order history that is searchable and lets buyers add a full previous order, or selected lines, to the cart. Show current prices, not the prices from the original order, and highlight any item that has changed or been discontinued."),
            ("Offer saved lists", "Shopping lists let teams standardize what they buy, such as monthly supplies for a site or a standard kit for a job. Allow lists to be shared within a company so a new employee does not start from zero."),
            ["Let buyers reorder a whole order or selected lines", "Flag changes since the last purchase", "Support shareable lists inside an account"],
        ),
        (
            "Search That Understands Industrial Language",
            "B2B buyers search with part numbers, abbreviations, dimensions and brand slang. A generic search box built for retail will miss most of it.",
            ("Teach search your vocabulary", "Maintain synonyms for abbreviations and common misspellings, and make dimensions searchable in the formats buyers use. Review zero-result queries every week; they are a free list of what your catalog or your search configuration is missing."),
            ("Make results scannable", "Show the attributes that matter in the result list, such as size, material and pack quantity, so buyers can compare without opening ten pages. Include the buyer's price and availability right in the results."),
            ["Review zero-result searches weekly", "Support synonyms and unit variations", "Show key attributes, price and stock in results"],
        ),
        (
            "Account Hierarchies: One Company, Many Buyers",
            "A B2B customer is rarely one person. It is a company with branches, departments, buyers, approvers and sometimes parent organizations.",
            ("Match how the company is organized", "Let administrators invite users, assign roles and set limits such as maximum order value or allowed shipping addresses. Roles should reflect real jobs: a buyer who can order, an approver who can release, a finance user who can only view invoices."),
            ("Keep the experience personal", "Even inside a shared account, each person should see their own orders, lists and addresses. Good hierarchy design reduces support calls because buyers can self-serve changes that used to require an email to the account manager."),
            ["Model companies, users and roles explicitly", "Allow admins to self-manage their team", "Keep personal views inside shared accounts"],
        ),
        (
            "Order Tracking and Self-Service That Cuts Support Calls",
            "Where is my order? is the most expensive question in B2B support. Answering it inside the portal frees your team for more valuable work.",
            ("Show the whole journey", "Give buyers a clear status for each order and each shipment, with carrier tracking links and partial shipments explained in plain language. If something is delayed, say so proactively rather than waiting for a call."),
            ("Put documents within reach", "Buyers need invoices, packing slips and certificates on demand. Offer downloads from the order page, and let finance users export lists of invoices for their own reconciliation."),
            ["Display per-shipment status and tracking links", "Notify proactively about delays", "Make invoices and documents downloadable"],
        ),
        (
            "Mobile B2B: Ordering from the Job Site",
            "Plenty of B2B buyers are not at a desk. They are on a warehouse floor, a job site or a delivery truck, and they are ordering from a phone.",
            ("Design for thumbs and poor connections", "Use large tap targets, a single-column cart and forms that remember what was entered. Keep pages light, because a job site often has a patchy connection. Barcode scanning to add items can turn a phone into a very fast ordering tool."),
            ("Do not hide the essentials", "Reordering, order status and contact information should be one tap away. Test on mid-range devices, not just the latest flagship, since that is what many teams actually carry."),
            ["Optimize for one-handed use and weak networks", "Consider barcode scanning for fast entry", "Test on realistic devices"],
        ),
    ],
    # ---- Elena Vasquez: Integrations & Data
    [
        (
            "ERP Integration Patterns for B2B Commerce",
            "Your ERP holds the truth about customers, prices, stock and orders. A commerce platform is only as good as its connection to it.",
            ("Choose what to sync and when", "Not all data needs the same freshness. Orders must flow quickly and reliably, inventory can sync on a short schedule, while product descriptions can update daily. Matching the frequency to the business need keeps the integration simple and cheaper to run."),
            ("Design for failure", "Networks fail and records get rejected. Build retries, a dead letter queue and alerts so that a failed order does not disappear silently. Make operations idempotent so a retry never creates a duplicate order."),
            ["Match sync frequency to business need", "Make operations idempotent", "Alert on failures instead of hoping"],
        ),
        (
            "Why Your PIM and Your Commerce Platform Should Disagree Less",
            "Product information management systems and commerce platforms often hold overlapping data. Without clear boundaries, they drift apart.",
            ("Draw a line of ownership", "Decide which system owns each attribute. The PIM might own descriptions, specifications and media, while commerce owns pricing and merchandising flags. Write the rules down and enforce them with one-way syncs wherever possible."),
            ("Validate before you publish", "Run checks for required attributes, image presence and naming conventions before products reach the storefront. A rejected record with a clear message is better than a live product with an empty specification table."),
            ["Assign a single owner per attribute", "Prefer one-way syncs", "Validate completeness before publishing"],
        ),
        (
            "Real-Time Inventory Without Real-Time Pain",
            "Buyers want to know if an item is in stock. Delivering that answer accurately without hammering your warehouse system takes some care.",
            ("Cache with a purpose", "Query live stock for the product and cart pages where accuracy matters, and use short-lived caches for listings. Accept that a count of 5,000 does not need to be exact, while a count of 3 does."),
            ("Communicate uncertainty honestly", "Use ranges and statuses like in stock, low stock and available in 5 days instead of promising precision you cannot provide. Honest messaging builds more trust than a number that is sometimes wrong."),
            ["Use live data where it affects the decision", "Cache listings briefly", "Show statuses and ranges for large quantities"],
        ),
        (
            "Webhooks vs Polling: Keeping Systems in Sync",
            "Every integration has to decide how to learn that something changed. The two main options are being told and asking repeatedly.",
            ("Prefer events when you can", "Webhooks deliver changes within seconds and reduce wasted requests. They are ideal for new orders, status changes and catalog updates. Verify signatures, respond quickly and process the work asynchronously."),
            ("Keep polling as a safety net", "Webhooks can be missed. A periodic reconciliation job that compares recent changes catches anything that slipped through. The combination of events for speed and polling for certainty is usually the most robust."),
            ["Use webhooks for timely updates", "Verify and acknowledge quickly", "Run a periodic reconciliation job"],
        ),
        (
            "Migrating Customer Data Without Losing Trust",
            "Moving customers, addresses and order history into a new platform is delicate. People notice when something goes missing.",
            ("Clean before you move", "Duplicates, outdated addresses and inconsistent company names are easier to fix in the source than after migration. Agree on a matching rule for companies and users, and run trial migrations until the numbers reconcile."),
            ("Plan the cutover", "Communicate with customers about what will change, such as new login steps, and give them a clear route for help. Keep the old system available read-only for a period so support can answer questions about historic orders."),
            ["Deduplicate and standardize first", "Run repeated trial migrations", "Keep the legacy system readable after cutover"],
        ),
        (
            "A Practical Approach to Data Quality in Commerce",
            "Bad data is a quiet tax on every commerce project. It shows up as wrong prices, failed orders and frustrated buyers.",
            ("Measure what matters", "Pick a few indicators, such as the share of products with complete attributes, orders that fail validation and addresses rejected by carriers. Track them over time and review them in the same meeting as sales numbers."),
            ("Fix at the source", "Patching data downstream hides the problem and guarantees it returns. Feed issues back to the owning team with examples, and automate the checks that catch the same mistake twice."),
            ["Track a small set of data quality metrics", "Report issues to the system that owns the data", "Automate recurring checks"],
        ),
    ],
    # ---- Tom Whitfield: Payments & Credit
    [
        (
            "Net Terms Online: Offering Credit Without the Chaos",
            "Many B2B buyers expect to pay on invoice. Offering net terms in your portal can win business, but it needs guardrails.",
            ("Tie terms to the account", "Terms such as net 30 should be a property of the company, set by finance after a credit review. Show buyers their available credit and outstanding balance so they can plan, and block or warn when an order would exceed the limit."),
            ("Keep finance in the loop", "Sync approved credit limits and balances with your accounting system so the portal does not become a second source of truth. When a payment is overdue, make it visible to both the buyer and the account manager."),
            ["Assign terms and limits per company", "Show balances and available credit", "Sync credit data with accounting"],
        ),
        (
            "Purchase Orders in a Digital Checkout",
            "Purchase orders are how many organizations control spending. A modern checkout should treat them as a first-class citizen, not an afterthought.",
            ("Capture the PO number early", "Ask for the PO number and any reference fields during checkout and carry them through to the invoice. Some buyers need a PO per order, others per project; allow for both with optional or required fields per account."),
            ("Support attachments and approvals", "Let buyers upload the PO document when their process demands it, and route orders over a threshold to an approver. Clear status messages tell the buyer whether an order is waiting on payment, approval or stock."),
            ["Carry PO numbers to invoices", "Allow per-account required fields", "Support attachments and approval routing"],
        ),
        (
            "Invoicing and Payment Reconciliation for Online B2B",
            "Taking orders online is only half the job. Finance teams care about invoices matching orders and payments matching invoices.",
            ("Give buyers self-service invoices", "Offer an invoice list with status, due dates and download links. Allow payment of one or many invoices in a single action, and send reminders before due dates rather than after."),
            ("Make reconciliation boring", "Use consistent reference numbers across order, invoice and payment. When references line up, accounts receivable stops spending Friday afternoons on manual matching."),
            ["Provide invoice lists with clear statuses", "Allow multi-invoice payment", "Keep references consistent end to end"],
        ),
        (
            "Approval Workflows That Do Not Slow Buyers Down",
            "Approvals protect budgets, but poorly designed ones create bottlenecks. The goal is control without friction.",
            ("Approve by exception", "Set thresholds so routine orders flow through automatically and only unusual ones need review. Base rules on value, product category or cost center, and let administrators adjust them without developer help."),
            ("Notify the right person at the right time", "Send approvers a concise summary with a single action to approve or reject. Add reminders and delegation for holidays, and show the requester where their order is waiting."),
            ["Trigger approvals on thresholds", "Make approving a one-click action", "Support reminders and delegation"],
        ),
        (
            "Taxes, Tax Exemptions and Cross-Border Orders",
            "Tax rules are one of the least glamorous and most important parts of B2B commerce. Mistakes become compliance problems.",
            ("Handle exemptions properly", "Many business buyers are exempt from certain taxes. Store exemption certificates against the company, apply them automatically and keep them current with expiry reminders."),
            ("Plan for borders", "International orders add duties, different tax regimes and extra documents. Decide early which markets you serve, how you display tax inclusive or exclusive prices and who is responsible for duties."),
            ["Store exemption certificates on the account", "Track certificate expiry", "Be explicit about duties and tax display"],
        ),
        (
            "Reducing Payment Friction at B2B Checkout",
            "A buyer who has decided to purchase should not be slowed down by payment steps. Small improvements here pay off immediately.",
            ("Offer methods that match the order", "Cards suit small, urgent purchases. Bank transfer and invoice suit larger ones. Present only the methods available to that account so there are no dead ends."),
            ("Remember what works", "Allow saved payment methods and addresses, and prefill them for returning buyers. Show clear errors when a payment fails and keep the cart intact so the buyer can try again immediately."),
            ["Show only methods the account can use", "Save payment details securely", "Preserve the cart after a failure"],
        ),
    ],
    # ---- Aisha Rahman: Sales & Quoting
    [
        (
            "Quotes in the Portal: From Request to Order",
            "Large or custom orders often start with a quote. Moving that conversation into the portal makes it faster and easier to track.",
            ("Let buyers start the conversation", "Allow buyers to turn a cart into a quote request with notes and a target date. Capture the details a rep needs, such as quantities, delivery location and budget, so the first reply is useful instead of a list of questions."),
            ("Close the loop", "When the quote is ready, notify the buyer, show the proposed prices and let them accept it with one click. An accepted quote should become an order without anyone retyping a line."),
            ["Create quotes from carts", "Capture the details reps need up front", "Convert accepted quotes directly to orders"],
        ),
        (
            "Sales Rep Tools: Selling on Behalf of Customers",
            "Reps still place a large share of B2B orders. Giving them the same tools as buyers keeps data consistent and speeds up their day.",
            ("Let reps act as the customer", "Allow an authorized rep to browse and order as the customer, with the customer's prices and terms. Record who placed the order so reporting is accurate and customers can see the history."),
            ("Reduce swivel-chair work", "A rep who has to copy orders into an ERP will eventually stop using the portal. Make sure orders flow through automatically and that reps can see account status without leaving their workflow."),
            ["Support rep-assisted ordering", "Record who placed each order", "Remove double entry"],
        ),
        (
            "Blending Self-Service with Human Selling",
            "Self-service does not replace sales teams. It changes where they spend their time.",
            ("Automate the routine", "Reorders, order status and invoice downloads should need no human. When a rep is not spending time on those requests, they can focus on growth, new products and complex needs."),
            ("Make handoffs easy", "Provide clear paths from the portal to a person, such as a chat or a request-a-call button that carries context. The rep should arrive knowing what the buyer was looking at."),
            ["Automate repetitive requests", "Provide contextual routes to a human", "Measure rep time spent on routine tasks"],
        ),
        (
            "Negotiated Pricing Inside a Digital Channel",
            "Negotiation is a part of B2B that digital channels should support, not eliminate.",
            ("Capture agreements in one place", "Record negotiated prices with their start and end dates in the platform so buyers see them automatically. Expiring agreements should alert both sides before they lapse."),
            ("Allow counter-offers within limits", "Quoting tools can let reps adjust prices within pre-approved margins, with larger changes routed for review. This keeps deals moving without sacrificing control."),
            ["Store agreements with validity dates", "Alert before agreements expire", "Define rep discount limits"],
        ),
        (
            "Measuring Success in a B2B Portal",
            "Launching a portal is the beginning. Knowing whether it works requires a few well chosen measures.",
            ("Look at adoption and behavior", "Track the share of orders placed online, the number of active buyers per account and how often reorders happen. A portal with plenty of logins but few orders signals a usability or pricing issue worth investigating."),
            ("Connect to business outcomes", "Compare support call volume, order entry time and average order value before and after. These figures turn a technology project into a story that finance and leadership can follow."),
            ["Track online order share and active buyers", "Compare support load over time", "Report outcomes in business terms"],
        ),
        (
            "Onboarding New B2B Customers Online",
            "The first interaction with a new business customer sets the tone. Digital onboarding can make it quick and professional.",
            ("Collect what you need once", "Use a clear application form for company details, tax information and credit requests. Route it to the right team and tell the applicant what happens next and how long it will take."),
            ("Welcome them properly", "Once approved, give the new customer a guided start: set up users, import a first list and highlight where to find invoices and support. Early success leads to long relationships."),
            ["Provide a clear application flow", "Set expectations on timing", "Guide new accounts through first tasks"],
        ),
    ],
    # ---- Daniel Kowalski: Headless & Performance
    [
        (
            "Headless Commerce for B2B: When It Makes Sense",
            "Headless architectures separate the storefront from the commerce engine. For B2B teams, that freedom is useful, but it is not free.",
            ("Where headless shines", "Custom buyer experiences, multiple brands or regions on one backend and tight integration with content tools are strong reasons. A headless storefront lets designers and developers iterate without waiting for platform release cycles."),
            ("Count the costs honestly", "You take on responsibility for the frontend: performance, accessibility, SEO and security patches. Make sure the team has the skills and appetite before you commit, and start with a focused scope rather than rebuilding everything."),
            ["Choose headless for experience control and flexibility", "Budget for frontend ownership", "Start with a limited scope"],
        ),
        (
            "Combining a CMS with a Commerce Backend",
            "Content and commerce have different strengths. Pairing a headless CMS with a commerce platform gives marketers and merchandisers each the right tool.",
            ("Split responsibilities", "Keep products, prices and carts in the commerce platform. Keep landing pages, articles and campaign content in the CMS. The storefront composes both, referencing products by identifier from within content."),
            ("Preview and publish safely", "Give editors a preview that includes live product data so they can see pages as buyers will. Use webhooks to revalidate caches on publish so changes appear quickly without a full rebuild."),
            ["Let each system own its domain", "Reference products by ID in content", "Revalidate on publish"],
        ),
        (
            "Performance Budgets for Catalog Pages",
            "Speed affects conversion even in B2B. A catalog page that takes seconds to load wastes the time of people who order all day.",
            ("Set limits and enforce them", "Define budgets for page weight, JavaScript size and key timings, then check them in your build pipeline. Budgets turn performance from a vague aim into a pass or fail criterion."),
            ("Fix the usual suspects", "Oversized images, blocking scripts and unbounded third-party tags cause most slowdowns. Serve responsive images in modern formats, defer what is not needed and audit tags regularly."),
            ["Define and automate performance budgets", "Optimize images first", "Audit third-party scripts"],
        ),
        (
            "Caching Strategies for Personalized Pricing",
            "Contract pricing makes pages personal, which makes caching harder. The trick is to cache what is shared and fetch what is personal.",
            ("Separate the shell from the data", "Render the shared parts of a page, such as descriptions and images, from cache. Fetch buyer-specific prices and availability separately so they stay accurate without making the whole page uncacheable."),
            ("Invalidate precisely", "Tag cached content by product or category and revalidate only what changed. Precise invalidation keeps pages fresh and keeps your infrastructure bills predictable."),
            ["Cache shared content, fetch personal data", "Tag content for targeted invalidation", "Avoid caching anything buyer-specific publicly"],
        ),
        (
            "Accessibility in B2B Storefronts",
            "Business buyers include people with disabilities, and many organizations require accessible tools. Accessibility is both the right thing and a practical requirement.",
            ("Build it in from the start", "Use semantic HTML, visible focus states and sufficient contrast. Make sure dense tables, such as order grids and quick order forms, are usable with a keyboard and a screen reader."),
            ("Test with real tools", "Automated checks catch only part of the problem. Walk through key journeys with a keyboard and a screen reader, and include accessibility in your definition of done."),
            ["Use semantic HTML and visible focus", "Make data-dense forms keyboard friendly", "Test key journeys manually"],
        ),
        (
            "Migrating to a Composable Storefront Step by Step",
            "Few teams can pause the business for a rewrite. An incremental migration lets you deliver value while you move.",
            ("Start at the edge", "Pick a section with clear value, such as the home page, a landing page or the product detail page, and route it to the new storefront while the rest stays as is. Each step proves the approach and builds confidence."),
            ("Keep the experience consistent", "Share design tokens, navigation and analytics between old and new so buyers do not feel the seams. Track the same metrics on both sides to confirm the new pages perform at least as well."),
            ["Migrate section by section", "Share design and analytics across old and new", "Compare metrics to validate each step"],
        ),
    ],
]

assert len(AUTHORS) == 6 and all(len(p) == 6 for p in POSTS) and len(POSTS) == 6
