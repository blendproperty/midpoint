-- Add the supplied Business Park entity/precinct pillar as a review-only CMS
-- record. It deliberately remains non-public and noindex until the estate-scale
-- figures marked for verification have been confirmed and the /about-us overlap
-- has been resolved.

INSERT INTO "Media" ("id", "filename", "url", "mimeType", "size", "alt", "createdAt")
VALUES
  ('business_park_media_01', 'banner.jpg', '/images/hero/banner.jpg', 'image/jpeg', 0, 'Wide view across Midpoint Business Park in Midrand', NOW()),
  ('business_park_media_02', 'about-banner.jpg', '/images/about/about-banner.jpg', 'image/jpeg', 0, 'Premium office space at Midpoint Business Park', NOW()),
  ('business_park_media_03', 'onpoint.jpeg', '/images/listings/onpoint.jpeg', 'image/jpeg', 0, 'OnPoint serviced office suite at Midpoint Business Park', NOW()),
  ('business_park_media_04', 'warehouse-exterior.webp', '/images/pillars/warehouses/warehouse-exterior.webp', 'image/webp', 0, 'Warehouse facilities at Midpoint Business Park', NOW()),
  ('business_park_media_05', 'blend-hero.png', '/images/developer/blend-hero.png', 'image/png', 0, 'Blend Property Group commercial property development', NOW()),
  ('business_park_media_06', 'johannesburg-pretoria-corridor.webp', '/images/pillars/warehouses/johannesburg-pretoria-corridor.webp', 'image/webp', 0, 'Midpoint positioned on the N1 between Johannesburg and Pretoria', NOW()),
  ('business_park_media_07', 'backup-power-generator.webp', '/images/pillars/warehouses/backup-power-generator.webp', 'image/webp', 0, 'Backup generator supporting resilient operations at Midpoint Business Park', NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "PillarPage" (
  "id", "slug", "title", "primaryEntity", "primaryAudience", "decisionStage",
  "primarySearchIntent", "primaryConversion", "heroAnswer", "heroImage",
  "trustStrip", "contentHtml", "faqs", "faqsHeading", "features",
  "considerations", "relatedSector", "listingsHeading", "listingsIntro",
  "showReadyToMove", "ctaHeading", "ctaText", "exploreLinks", "expertName",
  "expertRole", "expertBio", "reviewOwner", "lastReviewedAt", "nextReviewAt",
  "status", "passwordProtected", "seoTitle", "seoDescription", "focusKeyword",
  "ogTitle", "ogDescription", "ogImage", "noIndex", "canonicalUrl",
  "createdAt", "updatedAt"
)
VALUES (
  'business_park_pillar_review_20260731',
  'business-park-midrand',
  'Midpoint Business Park — Commercial & Industrial Property in Midrand',
  'Midpoint Business Park (developed and owned by Blend Property Group)',
  'Prospective tenants, brokers, and anyone researching Midpoint or Blend Property Group before enquiring about specific space',
  'Awareness — researching Midpoint before narrowing to office, warehouse or serviced office space',
  'Precinct and category demand — Midpoint Business Park, Blend Property Group Midrand, business park Midrand',
  'Explore availability; contact the leasing team',
  'Midpoint is a commercial and industrial business estate at 162 Tonetti Street, Halfway House, Midrand, positioned between Johannesburg and Pretoria with direct N1 frontage. Originally developed in the 1980s and now undergoing renewal, the estate combines office space, serviced offices and warehouse facilities with on-site amenities. Midpoint is owned and developed by Blend Property Group, a South African commercial and industrial property specialist operating since 2006.',
  '/images/hero/banner.jpg',
  $trust$Developed and owned by Blend Property Group since 2006
162 Tonetti Street, Halfway House, Midrand, 1685
Direct N1 frontage between Johannesburg and Pretoria
Offices, serviced offices and warehouses on one estate
Tenant count to be verified before publication$trust$,
  $content$
<h2>Midpoint Business Park: A Commercial and Industrial Estate in Midrand</h2>
<p>Midpoint is a commercial and industrial business estate at 162 Tonetti Street, Halfway House, Midrand, positioned directly on the N1 between Johannesburg and Pretoria. The estate brings together three ways to occupy space — premium offices, OnPoint serviced offices, and warehouse facilities — inside one secure, amenity-rich environment, rather than requiring a tenant to choose between a single-purpose office park and a single-purpose industrial park.</p>
<p>Originally developed in the 1980s, Midpoint is now in an active renewal phase, combining established infrastructure and location with modern fit-outs and amenities.</p>
<aside><strong>Review before publishing:</strong> Confirm when the current redevelopment phase began and what it covers — specific buildings, common areas, or the full estate. A specific date and scope is a stronger trust signal than “undergoing renewal” alone.</aside>

<h2>Who Developed Midpoint Business Park?</h2>
<p>Midpoint is owned and developed by Blend Property Group, a South African property company that has specialised in developing and investing in commercial and industrial properties since 2006. Blend Property Group’s stated focus is on productivity, operational efficiency and long-term staff satisfaction across its developments — a positioning that shows up directly in Midpoint’s amenity mix and resilience infrastructure, not just in its marketing copy.</p>
<p>For a prospective tenant or broker researching who stands behind a space before committing to a lease, that track record matters: Blend Property Group is not a single-project developer, and Midpoint is one property within a longer operating history.</p>
<aside><strong>Review before publishing:</strong> Confirm how many other properties Blend Property Group currently owns or manages. Even an approximate, dated portfolio count would add useful credibility.</aside>

<h2>Three Ways to Occupy Space at Midpoint</h2>
<p>Midpoint Business Park is organised around three distinct property products, each suited to a different kind of tenant.</p>
<h3>Premium offices</h3>
<p>Premium offices suit corporate teams, professional-services firms and growing enterprises that want dedicated, branded space on a conventional commercial lease. Current office suites range from roughly 266 m² up to just over 1,000 m², with rates from R105/m². The Offices pillar contains live availability and the detailed decision guide.</p>
<h3>OnPoint serviced offices</h3>
<p>OnPoint serviced offices suit smaller teams, project groups and businesses establishing a satellite presence in Midrand without immediately committing to a conventional lease term. The precise furnished-suite services and inclusions should be confirmed with the leasing team and reflected on the dedicated Serviced Offices pillar.</p>
<h3>Warehouse facilities</h3>
<p>Warehouse facilities suit logistics operators, distribution businesses and selected light manufacturers. Current warehouse space ranges from 2,320 m² to 11,443 m², from R109/m², with high eaves, loading infrastructure and generous yard capacity. The Warehouses pillar contains live availability and a detailed operational checklist.</p>
<p>A tenant may be able to change product as its needs evolve, but this should not be presented as a guaranteed pathway until the leasing team confirms how frequently moves between serviced offices, conventional offices and mixed office-and-warehouse facilities are supported in practice.</p>

<h2>On the N1 Between Johannesburg and Pretoria</h2>
<p>Midpoint’s single biggest structural advantage is its position: 1,470 metres of direct N1 highway frontage, roughly 25 km from Johannesburg and 31 km from Pretoria, with OR Tambo International Airport approximately 21 km away. Staff, clients and freight can reach Gauteng’s two largest business centres without locating entirely inside either one.</p>
<p>This can be valuable for organisations serving customers or managing teams across the Johannesburg–Pretoria corridor, particularly when compared with more congested and higher-rate nodes. Distances alone do not guarantee a suitable commute or logistics route, so prospective occupiers should test travel at the operating times that matter to them. The Location and Access pillar should remain the detailed source for verified routes, distances and typical drive-time ranges.</p>

<h2>Resilience Across the Estate</h2>
<p>Whichever property product a tenant chooses, Midpoint runs on generator-backed power and backup water with N+1 redundancy, protecting day-to-day operations against grid and water disruptions. The exact capacity, coverage and changeover arrangements associated with a particular building or tenant load should still be confirmed during the technical review of a specific unit.</p>
<p>Connectivity and fibre specification can vary by building and fit-out stage. Businesses with critical systems, contact centres, warehouse management platforms or cloud-based workflows should confirm available providers, lead times and redundancy options before occupation.</p>

<h2>Amenities and the Working Day</h2>
<p>Midpoint tenants have access to a broader work environment that includes a gym, padel courts, the on-site Fond restaurant and bar, cafés, and roughly 1.8 km of walking, running and cycling trails through the landscaped estate grounds, together with corporate accommodation for visiting teams.</p>
<p>These facilities support staff experience, informal meetings, wellness and the practical needs of teams spending a full working day at the estate. Some buildings and amenities may still be under construction. The Amenities pillar should distinguish clearly between facilities available now, those under construction and those planned for a later phase. Images of unbuilt or incomplete amenities should be labelled as illustrative.</p>

<h2>The Midpoint Estate at a Glance</h2>
<p>The estate-scale proof points below are valuable for a precinct page but must be confirmed and dated before publication:</p>
<ul>
  <li><strong>Total lettable GLA:</strong> to be verified.</li>
  <li><strong>Number of buildings:</strong> to be verified.</li>
  <li><strong>Current tenant count:</strong> to be verified.</li>
  <li><strong>Year the current redevelopment phase began:</strong> to be verified.</li>
</ul>
<p>Publishing these figures with a source date will make the scale of Midpoint Business Park easier for tenants, brokers and search engines to understand. Until they are confirmed, the page should avoid estimates that could quickly become stale.</p>

<h2>Who Chooses Midpoint?</h2>
<p>The estate’s tenant roster spans national and multinational organisations. Public tenant branding currently includes Bidvest, Capitec Bank, the City of Johannesburg, Fresenius Kabi, LG Electronics, Momentum, SANBS and Stellantis, among others.</p>
<p>This list and the total tenant count must be confirmed before the page is published as the canonical description of the estate. Converting the existing logo wall into accessible text is worthwhile because it makes tenant evidence readable by people using assistive technology and crawlable by search engines. One or two named tenant stories would strengthen the proof further by explaining why an organisation selected Midpoint and how it uses the space.</p>

<h2>How to Choose the Right Midpoint Property Product</h2>
<p>Most visitors arrive at this page while researching the estate rather than a specific vacant unit. The first useful decision is whether the requirement is primarily for a conventional office, a flexible serviced office, a warehouse, or a combination of office and operational space.</p>
<p>Teams needing a dedicated identity, private meeting space and a conventional lease should explore the Offices pillar. Smaller or project-based teams looking for a faster, more flexible setup should review OnPoint serviced offices. Logistics, distribution and operational users should start with the Warehouses pillar and compare loading, yard, clear-height, power and office requirements.</p>
<p>Mixed requirements should be discussed directly with the leasing team. A requirement brief covering size, staff numbers, occupation date, vehicle activity, power, parking and lease preferences will help identify the most relevant current or upcoming opportunity.</p>

<h2>Getting Started at Midpoint Business Park</h2>
<p>The next step is to explore current availability in the product that fits the requirement — offices, serviced offices, or warehouses — or speak directly with the leasing team about a need that does not map neatly onto a single category, such as a combined office-and-warehouse operation or a phased move.</p>
<p>Availability, rates and specifications change as leases are concluded and new buildings or renewed spaces become ready. Treat the live listings and pillar guides as the starting point, then confirm the final commercial and technical details for the specific unit before making a decision.</p>
  $content$,
  $faqs$[
    {"question":"What is Midpoint?","answer":"Midpoint is a commercial and industrial business estate in Midrand, Gauteng, positioned between Johannesburg and Pretoria with N1 access. It brings together office space, serviced offices and warehouse facilities in one connected environment. Originally developed in the 1980s, it is now a modern business destination combining practical workspace with lifestyle amenities."},
    {"question":"Who owns Midpoint?","answer":"Midpoint is owned and developed by Blend Property Group, a South African property company specialising in commercial and industrial developments since 2006."},
    {"question":"Where is Midpoint located?","answer":"Midpoint is at 162 Tonetti Street, Halfway House, Midrand, 1685. The Location and Access pillar contains more detailed route and distance information."},
    {"question":"Can I secure space before construction is complete?","answer":"In certain cases businesses may be able to secure office or warehouse space before construction or redevelopment is complete. Confirm current pre-leasing opportunities and timelines for the specific building with the leasing team."},
    {"question":"How big is the Midpoint estate?","answer":"The total lettable area and current building count still need to be verified and dated before specific figures are published."},
    {"question":"How many tenants are currently at Midpoint?","answer":"The current tenant count is being verified before a specific number is published on this page."},
    {"question":"What types of space does Midpoint offer?","answer":"Midpoint offers three main property products: premium conventional offices, OnPoint serviced offices and warehouse facilities. The dedicated Offices, Serviced Offices and Warehouses pillars explain each option."},
    {"question":"Is Midpoint secure?","answer":"Security and access-control arrangements should be confirmed for the estate and the specific building during the leasing process before detailed claims are published."},
    {"question":"Does Midpoint have backup power?","answer":"Yes. Midpoint uses generator-backed power and backup water with N+1 redundancy. Confirm the coverage and capacity applicable to a specific building and tenant load."},
    {"question":"How far is Midpoint from Johannesburg and Pretoria?","answer":"Midpoint is roughly 25 km from Johannesburg and 31 km from Pretoria, with approximately 1,470 metres of direct N1 highway frontage."},
    {"question":"What companies are based at Midpoint?","answer":"Public tenant branding includes organisations such as Bidvest, Capitec Bank, the City of Johannesburg, Fresenius Kabi, LG Electronics, Momentum, SANBS and Stellantis. The list is subject to confirmation before publication."},
    {"question":"Can I move between space types as my business grows?","answer":"Midpoint offers serviced offices, conventional offices and warehouses on one estate. Whether a particular tenant can move between them depends on availability and commercial arrangements, which the leasing team can confirm."},
    {"question":"Who do I contact about leasing at Midpoint?","answer":"Contact Boitumelo, Leasing Manager, on +27 11 380 9400 or boitumelo@blendproperty.co.za."},
    {"question":"What amenities are available at Midpoint?","answer":"The estate environment includes a gym, padel courts, the on-site Fond restaurant and bar, cafés, walking, running and cycling trails, and corporate accommodation. Check the Amenities pillar for current versus planned status."}
  ]$faqs$::jsonb,
  'Frequently Asked Questions About Midpoint Business Park',
  $features$[
    {"heading":"Premium Offices","text":"Professional office space for corporate teams, professional-services firms and growing enterprises, from smaller suites to full corporate headquarters.","image":"/images/about/about-banner.jpg","alt":"Premium office space at Midpoint Business Park"},
    {"heading":"Serviced Offices (OnPoint)","text":"Flexible, fully serviced workspace for smaller teams, project groups and businesses establishing a satellite presence in Midrand.","image":"/images/listings/onpoint.jpeg","alt":"OnPoint serviced office suite at Midpoint Business Park"},
    {"heading":"Warehouse Facilities","text":"Modern industrial facilities for logistics operators and operational businesses, with high eaves, loading access and generous yard space.","image":"/images/pillars/warehouses/warehouse-exterior.webp","alt":"Warehouse facilities at Midpoint Business Park"},
    {"heading":"Developed by Blend Property Group","text":"Since 2006, Blend Property Group has specialised in developing and investing in commercial and industrial properties across South Africa.","image":"/images/developer/blend-hero.png","alt":"Blend Property Group commercial property development"},
    {"heading":"On the N1, between Johannesburg and Pretoria","text":"Midpoint has 1,470 metres of direct N1 frontage and a central position between Johannesburg and Pretoria.","image":"/images/pillars/warehouses/johannesburg-pretoria-corridor.webp","alt":"Midpoint positioned on the N1 between Johannesburg and Pretoria"},
    {"heading":"Resilience built in","text":"Generator-backed power and backup water with N+1 redundancy support day-to-day operations across the estate.","image":"/images/pillars/warehouses/backup-power-generator.webp","alt":"Backup generator supporting resilient operations at Midpoint Business Park"}
  ]$features$::jsonb,
  $considerations$[
    {"heading":"Total estate scale","text":"Verify total lettable GLA, the number of buildings and the current tenant count before publishing specific figures."},
    {"heading":"Redevelopment status","text":"Confirm when the current redevelopment phase began and precisely which buildings and common areas it covers."},
    {"heading":"Tenant mix","text":"Confirm that the public tenant list and logo wall remain current before converting them into a canonical text list."},
    {"heading":"Pre-leasing availability","text":"Confirm which buildings currently support pre-leasing before presenting this as a general estate-wide option."},
    {"heading":"One estate, three products","text":"Route visitors confidently to offices, serviced offices or warehouses according to their actual space requirement."}
  ]$considerations$::jsonb,
  NULL,
  'The Midpoint Precinct',
  'Midpoint brings three ways to occupy space together on one estate: premium offices, OnPoint serviced offices and warehouse facilities. Explore each option, or review the location, developer, resilience and amenities that shape the wider precinct.',
  FALSE,
  'Ready to explore Midpoint?',
  'Browse current availability across offices, serviced offices and warehouses, or speak directly with the leasing team about your requirements.',
  $links$[
    {"label":"Offices to rent","href":"/offices"},
    {"label":"Warehouses to rent","href":"/warehouses"},
    {"label":"Serviced offices","href":"/serviced-offices"},
    {"label":"Why Midrand: Location and Access","href":"/location"},
    {"label":"Amenities","href":"/amenities"},
    {"label":"Contact the leasing team","href":"/contact-us"}
  ]$links$::jsonb,
  'Boitumelo',
  'Leasing Manager, Midpoint',
  'Boitumelo supports prospective tenants and brokers evaluating office, serviced office and warehouse opportunities at Midpoint, including requirements, availability and property inspections.',
  'Boitumelo, Leasing Manager',
  NULL,
  NULL,
  'REVIEW',
  FALSE,
  'Midpoint Business Park in Midrand | Commercial Property',
  'Explore Midpoint Business Park in Midrand: offices, serviced offices, warehouses, N1 access, amenities and resilient infrastructure.',
  'Midpoint Business Park Midrand',
  'Midpoint Business Park in Midrand | Commercial Property',
  'Discover Midpoint Business Park in Midrand, its offices, serviced offices, warehouses, central N1 location, amenities and Blend Property Group.',
  '/images/hero/banner.jpg',
  TRUE,
  'https://www.mid-point.co.za/business-park-midrand',
  NOW(),
  NOW()
)
ON CONFLICT ("slug") DO NOTHING;
