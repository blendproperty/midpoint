-- Review-only OnPoint serviced-offices pillar built from the supplied CMS
-- draft. It remains non-public and noindex because pricing, inclusions, terms,
-- team sizes, availability and brand/entity details still require confirmation.

INSERT INTO "Media" ("id", "filename", "url", "mimeType", "size", "alt", "createdAt")
VALUES
  ('serviced_office_media_01', 'onpoint.jpeg', '/images/listings/onpoint.jpeg', 'image/jpeg', 0, 'Shared reception and meeting space at OnPoint serviced offices in Midrand', NOW()),
  ('serviced_office_media_02', 'johannesburg-pretoria-corridor.webp', '/images/pillars/warehouses/johannesburg-pretoria-corridor.webp', 'image/webp', 0, 'Map showing Midpoint Business Park on the N1 between Johannesburg and Pretoria', NOW()),
  ('serviced_office_media_03', 'gallery-10-restaurant.jpg', '/images/gallery/gallery-10-restaurant.jpg', 'image/jpeg', 0, 'On-site restaurant amenity at Midpoint Business Park', NOW()),
  ('serviced_office_media_04', 'gallery-9-gym.jpg', '/images/gallery/gallery-9-gym.jpg', 'image/jpeg', 0, 'Gym available within the Midpoint Business Park precinct', NOW()),
  ('serviced_office_media_05', 'contact-banner.jpg', '/images/pages/contact-banner.jpg', 'image/jpeg', 0, 'Midpoint leasing team contact and tour enquiry', NOW())
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
  'serviced_offices_pillar_review_20260731',
  'serviced-offices',
  'Serviced Offices in Midrand — OnPoint at Midpoint',
  'OnPoint, Midpoint''s serviced office offering — entity relationship requires confirmation',
  'Smaller teams, project groups, and businesses establishing a first or satellite presence in Midrand without committing to a conventional lease',
  'Awareness to consideration — comparing serviced space with a conventional office lease',
  'Category demand — serviced offices in Midrand, flexible office space Midrand, OnPoint Midrand',
  'Book an OnPoint tour; discuss your requirements',
  'OnPoint is Midpoint''s serviced office offering in Midrand — furnished, ready-to-occupy space for teams that want flexibility without a standard commercial lease. The exact team-size range, inclusions and pricing structure must be confirmed before publication. It is intended for smaller teams, project groups and businesses opening a Midrand presence for the first time. Book a tour or discuss your requirements with the leasing team.',
  '/images/listings/onpoint.jpeg',
  $trust$Review required before publishing these claims
Furnished, ready-to-occupy suites — confirm exact standard
Shared reception and meeting rooms — confirm access and charges
Flexible terms — confirm minimum term and notice period
Part of Midpoint Business Park on the N1
Developed and managed by Blend Property Group since 2006$trust$,
  $content$
<h2>Serviced Offices in Midrand: What OnPoint Offers</h2>
<p>If you are looking for serviced offices in Midrand, the appeal is usually speed and flexibility rather than customisation. OnPoint is Midpoint’s serviced office offering — furnished, ready-to-occupy space within the same business estate at 162 Tonetti Street, Halfway House, Midrand, that hosts Midpoint’s conventional office suites and warehouse facilities.</p>
<aside><strong>Review before publishing:</strong> Confirm the current inclusions, team-size range, pricing and whether OnPoint is formally a separate brand or a Midpoint product line.</aside>
<p>What can be said with confidence is the location: direct N1 frontage between Johannesburg and Pretoria, the wider Midpoint estate infrastructure and amenities, and access to a leasing team rather than an anonymous booking system.</p>
<p>Serviced offices exist to solve a specific problem: a team needs professional space quickly, without the multi-month process of fitting out a conventional lease and without committing to a term that assumes certainty about headcount or timeline. That is the gap OnPoint is positioned to fill. Before the page is published, it must answer exactly how furnished, how flexible and at what price.</p>

<h2>Who OnPoint Serviced Offices Suit</h2>
<p>Serviced offices generally suit several recognisable situations, although the precise OnPoint parameters require confirmation. Smaller teams can obtain professional space without managing furniture, reception and meeting-room logistics themselves. Project groups with a defined but uncertain end date may benefit from a shorter or more flexible commitment than a conventional multi-year commercial lease.</p>
<p>Businesses establishing a first or satellite presence in Midrand can test the location and the estate before committing to a larger dedicated footprint. A growing tenant may also value the possibility of moving from serviced space to a conventional Midpoint office without relocating to another precinct.</p>
<aside><strong>Review before publishing:</strong> Confirm the practical minimum and maximum team sizes, actual term flexibility and whether transitions into conventional Midpoint offices are supported in practice.</aside>
<p>A larger team that needs a dedicated branded identity, bespoke fit-out or long-term control may be better suited to a conventional Midpoint office. The Offices pillar should remain the detailed guide for that option.</p>

<h2>Serviced Office Versus a Conventional Lease</h2>
<p>The two products solve different problems. The choice normally comes down to time horizon, team size, headcount certainty, desired control and the total cost of occupation.</p>
<p>A conventional office lease gives a tenant a dedicated, branded suite on a standard commercial term, with more control over fit-out and identity. It also requires the tenant to commit to the lease term, plan the fit-out, furnish the space and manage more of the day-to-day workplace infrastructure.</p>
<p>OnPoint is intended to trade some customisation and long-term branding control for quicker occupation and lower setup effort. The final comparison cannot be completed responsibly until the furnished standard, reception arrangement, meeting-room access, connectivity, term and pricing are confirmed.</p>
<table>
  <thead><tr><th>Consideration</th><th>OnPoint serviced office</th><th>Conventional Midpoint office</th></tr></thead>
  <tbody>
    <tr><td>Term</td><td>To be confirmed</td><td>Standard commercial lease term</td></tr>
    <tr><td>Fit-out</td><td>Furnished and ready to occupy — specification to confirm</td><td>Base or tenant fit-out, depending on the unit</td></tr>
    <tr><td>Reception and meeting rooms</td><td>Access and charging structure to confirm</td><td>Tenant generally provides its own</td></tr>
    <tr><td>Best suited to</td><td>Smaller teams, project groups and satellite presences</td><td>Corporate teams, headquarters and dedicated branded space</td></tr>
    <tr><td>Pricing</td><td>A genuine “from” price must be supplied</td><td>From R105/m² on the Offices pillar</td></tr>
  </tbody>
</table>
<p>If a business knows its requirements for the next several years, a conventional lease may be more cost-effective over time. If it does not, serviced space can reduce the cost of getting the size or timing decision wrong — provided the real terms support that flexibility.</p>

<h2>What Is Actually Included at OnPoint?</h2>
<p>This is the section that most needs operational input before publication. A prospective tenant comparing OnPoint with other serviced-office providers in Midrand will want clear answers. Is furniture included, and to what standard? Is reception staffed, and during what hours? How many meeting-room hours are included before additional charges apply? Is fibre or Wi-Fi included in the base rate? Is there a shared kitchen or breakout space? Is cleaning included?</p>
<p>The published page should turn those questions into a specific inclusions list, with any fair-use limits or additional charges stated plainly. Vague “all-inclusive” wording is not sufficient if core items are billed separately or depend on the suite selected.</p>
<p>Publishing unconfirmed claims would damage trust. The inclusions list should come directly from the team operating OnPoint and should be reviewed whenever the serviced-office package or pricing changes.</p>

<h2>Pricing and Terms</h2>
<aside><strong>Review entirely before publishing:</strong> Supply a genuine starting price and confirm whether OnPoint charges per desk, per suite or per month. Never publish R0 or imply that pricing is unavailable.</aside>
<p>At minimum, this page needs a transparent “from” figure, even if the final price depends on team size, suite, term or included services. The page should also state whether utilities, connectivity, furniture, reception, meeting rooms, cleaning, parking and VAT are included or charged separately.</p>
<p>Term flexibility is the other major unknown. If OnPoint offers month-to-month occupation, short minimum terms or flexible notice periods, those are meaningful differentiators and should be stated precisely. If its terms are closer to a short conventional lease, the flexibility claim should be more modest.</p>
<p>A useful comparison should consider total occupancy cost, not only a headline desk or suite rate. A serviced price may include items that a conventional tenant would otherwise procure separately, but those inclusions must be documented before the comparison is credible.</p>

<h2>Location and Amenities at Midpoint</h2>
<p>The location advantage is already established across the Midpoint estate: 1,470 metres of direct N1 frontage between Johannesburg and Pretoria, roughly 25 km from Johannesburg and 31 km from Pretoria, with OR Tambo International Airport around 21 km away.</p>
<p>OnPoint tenants occupy space inside the same wider precinct as Midpoint’s conventional office and warehouse tenants. The estate environment includes a gym, padel courts, the on-site Fond restaurant and bar, cafés, and walking, running and cycling trails.</p>
<aside><strong>Review before publishing:</strong> Confirm that OnPoint tenants receive the same amenity access and whether any facilities require separate membership, booking or payment.</aside>
<p>For a smaller team or satellite office, the combination of a central Gauteng address and on-site amenities can provide a more complete workplace than an isolated serviced suite. Prospective tenants should still test actual staff routes and inspect the available suite before deciding.</p>

<h2>Booking an OnPoint Tour</h2>
<p>Moving from “we may need serviced space in Midrand” to viewing an actual OnPoint suite should be straightforward. The product is intended for teams that want to assess a ready-to-use option quickly, so the enquiry path should connect them to someone who can answer questions about pricing, inclusions, current suite sizes and terms.</p>
<aside><strong>Review before publishing:</strong> Confirm whether OnPoint has a dedicated contact or whether enquiries are handled by Midpoint’s general leasing team.</aside>
<p>A useful enquiry should include the number of people, preferred occupation date, expected duration, parking needs, meeting-room requirements and any essential connectivity or access requirements. This allows the leasing contact to confirm whether an available suite is realistic before arranging the tour.</p>

<h2>Growing From OnPoint Into a Conventional Office</h2>
<p>A potentially valuable advantage is the ability to start in a serviced OnPoint suite and later move into a conventional Midpoint office as headcount and certainty increase. This could allow a business to retain the same Midrand location and estate amenities while gaining a larger dedicated and branded workplace.</p>
<aside><strong>Review before publishing:</strong> Confirm that this transition is genuinely supported and subject to conventional office availability. Do not present it as guaranteed.</aside>
<p>If confirmed, the growth path should be described prominently and linked to the Offices pillar. If it is not supported as a deliberate leasing pathway, the page should simply explain the separate products without implying a future move.</p>
  $content$,
  $faqs$[
    {"question":"What is included in a serviced office at OnPoint?","answer":"The precise furniture, reception, meeting-room, connectivity, kitchen and cleaning inclusions still need to be confirmed with the team operating OnPoint before publication."},
    {"question":"What team sizes does OnPoint suit?","answer":"OnPoint is intended for smaller teams, project groups and satellite presences, but the practical minimum and maximum team sizes must still be confirmed."},
    {"question":"How is OnPoint priced?","answer":"The pricing basis and genuine starting price still require confirmation. The published page must show a transparent from-price and must never display R0."},
    {"question":"How is OnPoint different from a conventional office at Midpoint?","answer":"OnPoint is intended for faster occupation and a more flexible, furnished setup. A conventional office suits tenants seeking dedicated branded space and greater fit-out control on a standard commercial lease."},
    {"question":"What is the minimum term at OnPoint?","answer":"The minimum term, notice period and any month-to-month option require confirmation before publication."},
    {"question":"Is reception included?","answer":"Reception access, staffing hours and whether the service is included in the base price still need to be confirmed."},
    {"question":"Are meeting rooms included or billed separately?","answer":"Meeting-room access, included hours, booking rules and additional charges require confirmation."},
    {"question":"Is Wi-Fi or fibre included in the rate?","answer":"Available providers, service level, fair-use terms and whether connectivity is included or separately billed require confirmation."},
    {"question":"Can I move from OnPoint into a conventional Midpoint office later?","answer":"Midpoint also offers conventional offices, but the transition process and availability must be confirmed before this is presented as a guaranteed growth path."},
    {"question":"Do OnPoint tenants have access to the estate amenities?","answer":"The wider estate includes a gym, padel courts, restaurants, cafés and outdoor trails. The access and charging arrangements for OnPoint tenants require confirmation."},
    {"question":"How close is OnPoint to the N1?","answer":"OnPoint is within Midpoint Business Park, which has approximately 1,470 metres of direct N1 highway frontage between Johannesburg and Pretoria."},
    {"question":"How do I book a tour?","answer":"Submit an enquiry through the page or contact the Midpoint leasing team to discuss your team size, preferred occupation date and requirements and arrange a tour."},
    {"question":"Is OnPoint a separate company from Midpoint?","answer":"The formal legal and brand relationship between OnPoint and Midpoint Business Park requires confirmation before publication."},
    {"question":"What happens if my team outgrows an OnPoint suite?","answer":"Conventional office space is available elsewhere at Midpoint, subject to live availability. The process for moving between products requires confirmation with the leasing team."}
  ]$faqs$::jsonb,
  'Frequently Asked Questions About OnPoint Serviced Offices',
  $features$[
    {"heading":"Ready to occupy, with no fit-out period","text":"OnPoint is intended to provide furnished space that can be occupied quickly. The exact furniture standard and inclusions must be confirmed before publication.","image":"/images/listings/onpoint.jpeg","alt":"Furnished serviced office and shared reception space at OnPoint, Midpoint Business Park"},
    {"heading":"Shared reception and meeting areas","text":"A professional shared environment can give a smaller team client-facing facilities without carrying the full overhead itself. Confirm access and charges.","image":"/images/listings/onpoint.jpeg","alt":"Shared reception and meeting space at OnPoint serviced offices in Midrand"},
    {"heading":"Flexible terms for changing requirements","text":"OnPoint is aimed at project groups, new market entrants and smaller teams whose headcount or timeline may change. Actual minimum terms must be confirmed.","image":"/images/about/about-footer.jpg","alt":"Small professional team discussing flexible office requirements"},
    {"heading":"A Midrand address on the N1","text":"OnPoint sits within Midpoint Business Park, with direct N1 frontage between Johannesburg and Pretoria.","image":"/images/pillars/warehouses/johannesburg-pretoria-corridor.webp","alt":"Map showing Midpoint Business Park on the N1 between Johannesburg and Pretoria"},
    {"heading":"On-site amenities from day one","text":"The wider estate includes restaurants, fitness facilities and outdoor trails. Confirm the access arrangements that apply specifically to OnPoint tenants.","image":"/images/gallery/gallery-10-restaurant.jpg","alt":"On-site restaurant amenity at Midpoint Business Park"},
    {"heading":"Speak to the leasing team","text":"A named contact should confirm current availability, real inclusions and pricing before a tour. Confirm the person responsible for OnPoint enquiries.","image":"/images/pages/contact-banner.jpg","alt":"Contact the Midpoint leasing team to arrange an OnPoint serviced office tour"}
  ]$features$::jsonb,
  $considerations$[
    {"heading":"What is actually included","text":"Confirm furniture, reception, meeting rooms, connectivity, kitchens, cleaning and any fair-use limits in writing."},
    {"heading":"Pricing structure","text":"Publish a genuine from-price and state whether pricing is per desk, per suite or per month and which costs are separate."},
    {"heading":"Team-size fit","text":"Confirm the practical minimum and maximum number of people so prospective tenants can self-qualify."},
    {"heading":"Term flexibility","text":"Confirm minimum term, notice period and whether month-to-month occupation is available."},
    {"heading":"Growth path","text":"Confirm whether OnPoint tenants can move into a conventional Midpoint office when availability permits."},
    {"heading":"Branding and customisation","text":"Explain the identity and fit-out control traded for quicker occupation and greater flexibility."},
    {"heading":"Total cost comparison","text":"Compare all serviced inclusions with the fit-out and operating costs of a conventional lease."}
  ]$considerations$::jsonb,
  NULL,
  'Current Availability at OnPoint',
  'Current suite inventory, real starting pricing and the appropriate availability format must be confirmed with the OnPoint leasing team before this section is enabled.',
  FALSE,
  'Ready to see OnPoint for yourself?',
  'Book a tour or tell us your requirements and the Midpoint leasing team will confirm current availability, inclusions and pricing.',
  $links$[
    {"label":"Conventional offices to rent","href":"/offices"},
    {"label":"Warehouses to rent","href":"/warehouses"},
    {"label":"Amenities and lifestyle","href":"/amenities"},
    {"label":"About Midpoint and Blend Property Group","href":"/business-park-midrand"},
    {"label":"Contact the leasing team","href":"/contact-us"}
  ]$links$::jsonb,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'REVIEW',
  FALSE,
  'Serviced Offices in Midrand | OnPoint at Midpoint',
  'Explore OnPoint serviced offices in Midrand for smaller teams, projects and satellite offices. Review flexible workspace and book a tour.',
  'serviced offices in Midrand',
  'Serviced Offices in Midrand | OnPoint at Midpoint',
  'Review OnPoint serviced offices at Midpoint Business Park: flexible workspace, central N1 location, amenities and tour enquiries.',
  '/images/listings/onpoint.jpeg',
  TRUE,
  'https://www.mid-point.co.za/serviced-offices',
  NOW(),
  NOW()
)
ON CONFLICT ("slug") DO NOTHING;
