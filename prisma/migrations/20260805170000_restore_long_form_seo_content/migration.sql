-- Restore the substantive long-form SEO content that was shortened by
-- 20260805143000. Sources are the immediately preceding approved migrations,
-- the preserved warehouse review record, and the original office seed.

UPDATE "PillarPage"
SET
  "heroAnswer" = 'Midpoint is a secure business estate on the N1 between Johannesburg and Pretoria, with backup power, security and on-site amenities included. Live availability below — book a viewing or discuss your requirements with the leasing team.',
  "trustStrip" = E'N1 highway frontage\nBackup power & water\nOn-site amenities',
  "features" = $json$[
    {"heading":"Flexible office environments.","text":"Office suites across the estate vary in size and configuration, allowing businesses to scale as their needs evolve. Some offices are newly refurbished or redeveloped, while others provide larger floorplates suited to corporate teams, professional services firms, and operational headquarters. Layouts incorporate features such as private reception areas, dedicated kitchens, modern HVAC systems, and secure access control, creating professional working environments that balance practicality with comfort.","image":"https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a16a7cc8af199f89084d8f0_Office-image-p-500.jpg"},
    {"heading":"Connected, professional surroundings.","text":"Midpoint’s office buildings benefit from strong regional connectivity and visibility. Several spaces offer exposure to the N1 highway, while others sit within quieter areas of the estate overlooking landscaped green areas. These settings allow businesses to maintain a professional presence while providing teams with a more balanced working environment.","image":"https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a16c26beae69b5c5eacdd65_professionals-p-500.jpg"},
    {"heading":"A workplace that supports your team.","text":"At Midpoint, the working day does not begin and end at the desk. The wider environment and amenities offer opportunities to meet colleagues, enjoy a meal, take a break, exercise, or simply step outside.","image":"https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a16c3bea9126473ae8b83ae_Workplace-p-500.jpg"}
  ]$json$::jsonb,
  "considerations" = $json$[
    {"heading":"Staff access and commute","text":"Midpoint sits directly on the N1, roughly 25 km from Johannesburg and 31 km from Pretoria, with 1,470 metres of highway frontage and approximately 21 km to OR Tambo International Airport. Teams should test representative routes at relevant times."},
    {"heading":"Resilience","text":"The estate uses generator-backed power and backup water with N+1 redundancy. Confirm connectivity, coverage and capacity for the specific unit."},
    {"heading":"Amenities on your doorstep","text":"A gym, padel facilities, the Fond restaurant and bar, cafés, and approximately 1.8 km of trails form part of the estate offering. Confirm current operating and access arrangements."},
    {"heading":"Conventional or serviced space","text":"Conventional offices suit teams that want dedicated, branded space. Smaller, shorter-term or ready-to-use requirements can be compared with OnPoint serviced offices."},
    {"heading":"Total occupancy cost","text":"Confirm what is included in the quoted rate and what is billed separately, including utilities, operating costs and parking, before comparing offers."}
  ]$json$::jsonb,
  "contentHtml" = '',
  "faqs" = $json$[
    {"question":"What office space is available in Midrand at Midpoint?","answer":"Midpoint offers office suites from smaller professional-team spaces up to full corporate headquarters, alongside OnPoint serviced offices. Current availability, size and rate are listed on this page."},
    {"question":"Which Midpoint space suits a head office versus a satellite team?","answer":"Larger single-tenant offices suit corporate head offices needing dedicated, branded space. Smaller or shorter-term needs can be compared with OnPoint serviced offices."},
    {"question":"Is there backup power and water at Midpoint?","answer":"The estate uses generator-backed power and backup water with N+1 redundancy. Confirm coverage and capacity for the specific building and load."},
    {"question":"How close is Midpoint to the N1?","answer":"Midpoint has 1,470 metres of N1 highway frontage and is approximately 25 km from Johannesburg, 31 km from Pretoria and 21 km from OR Tambo International Airport."},
    {"question":"Can a broker get a current availability schedule?","answer":"Yes. Midpoint’s vacancy schedule is published on the site, and brokers can contact the leasing team for tenant-specific requirements."},
    {"question":"How do I book a viewing or get in touch about leasing?","answer":"Contact +27 11 380 9400 or boitumelo@blendproperty.co.za, or use the Contact Us form."}
  ]$json$::jsonb,
  "faqsHeading" = 'Frequently asked questions about offices at Midpoint',
  "ctaHeading" = 'Talk to the leasing team',
  "ctaText" = 'Contact Boitumelo on +27 11 380 9400 or boitumelo@blendproperty.co.za to book a viewing or discuss your requirements.',
  "seoDescription" = 'Modern offices to rent in Midrand at Midpoint, between Johannesburg and Pretoria. View live availability and arrange a viewing.',
  "updatedAt" = NOW()
WHERE "slug" = 'offices';

-- Extend the existing published /location record without publishing unverified
-- commute times, public-transport details or node-comparison claims.
UPDATE "PillarPage"
SET
  "title" = 'Why Midrand: Location, Access and Logistics at Midpoint',
  "primaryEntity" = 'Midpoint Business Park''s N1 location in Midrand',
  "primaryAudience" = 'Facilities, HR and logistics decision-makers comparing Midrand with Sandton, Waterfall and Centurion',
  "decisionStage" = 'Consideration â€” location and access are early filters before a specific space is shortlisted',
  "primarySearchIntent" = 'Midpoint location, business park Midrand N1, and office or warehouse access in Midrand',
  "primaryConversion" = 'Discuss access, commute requirements or arrange a site visit',
  "heroImage" = '/images/sitemap/aerial.jpg',
  "heroAnswer" = 'Midpoint is at 162 Tonetti Street, Halfway House, Midrand, 1685 â€” on the N1 with 1,470 metres of direct highway frontage, positioned between Johannesburg and Pretoria. It is approximately 25 km from Johannesburg, 31 km from Pretoria and 21 km from OR Tambo International Airport. Distances last verified 28 July 2026.',
  "trustStrip" = E'1,470 metres of direct N1 highway frontage\n25 km to Johannesburg\n31 km to Pretoria\n21 km to OR Tambo International Airport',
  "features" = $json$[
    {"heading":"Direct N1 frontage","text":"1,470 metres of direct highway frontage puts Midpoint on one of Gauteng's principal arterial routes, with straightforward estate access rather than a multi-turn approach through a dense city centre.","image":"/images/sitemap/aerial.jpg","alt":"Aerial view of Midpoint Business Park's direct N1 highway frontage in Midrand"},
    {"heading":"Between two business centres, not inside either","text":"At approximately 25 km from Johannesburg and 31 km from Pretoria, Midpoint sits between Gauteng's two largest business centres. Teams can assess access in both directions without locating inside either CBD.","image":"/images/pillars/warehouses/johannesburg-pretoria-corridor.webp","alt":"Map showing Midpoint on the N1 corridor between Johannesburg and Pretoria"},
    {"heading":"Approximately 21 km from OR Tambo","text":"For teams with regular travel, client visits or air-freight requirements, OR Tambo International Airport is approximately 21 km from Midpoint. Test the route at the operating times relevant to your team before making a location decision.","image":"/images/location/map-background.avif","alt":"Map of Midpoint's central Gauteng location and access routes"}
  ]$json$::jsonb,
  "considerations" = $json$[
    {"heading":"Drive time, not just distance","text":"Traffic changes throughout the day. Test representative staff, client and delivery routes in both peak and off-peak conditions rather than relying on a single optimistic travel-time estimate."},
    {"heading":"Freight and logistics access","text":"N1 frontage is useful for regional movement, but confirm the access point, vehicle route, turning space and loading requirements for the specific warehouse or building being considered."},
    {"heading":"Comparing commercial nodes","text":"When comparing Midrand with Sandton, Waterfall or Centurion, use real staff-origin data, current rentals, parking costs and operating requirements. The best node depends on where a team and its customers actually travel from."},
    {"heading":"Public and alternative transport","text":"If public transport, Gautrain access, staff shuttles or cycling routes affect the decision, discuss the current options with the leasing team and test the final connection to the estate."}
  ]$json$::jsonb,
  "contentHtml" = $html$<h2>Why Midrand for Business?</h2><p>Location is usually one of the first filters applied when comparing business parks, often before a team reviews a specific floor plan or rental. Midpoint's answer is straightforward: 162 Tonetti Street, Halfway House, Midrand, 1685, directly alongside the N1 and positioned between Johannesburg and Pretoria.</p><p>That â€œbetween, not insideâ€ position is the core of the location case. Johannesburg is approximately 25 km away, Pretoria approximately 31 km, and OR Tambo International Airport approximately 21 km away. These figures describe distance, not a guaranteed journey time; traffic, the exact destination and time of travel still matter.</p><table><thead><tr><th>Metric</th><th>Verified value</th></tr></thead><tbody><tr><td>Johannesburg</td><td>Approximately 25 km</td></tr><tr><td>Pretoria</td><td>Approximately 31 km</td></tr><tr><td>OR Tambo International Airport</td><td>Approximately 21 km</td></tr><tr><td>Direct N1 highway frontage</td><td>1,470 metres</td></tr></tbody></table><h2>Distance and Drive Time</h2><p>A kilometre figure is useful for orientation, but it does not tell a facilities or HR team what a Monday-morning commute will feel like. Test realistic peak and off-peak journeys from the residential areas where staff live and the destinations customers, suppliers and delivery vehicles use most often.</p><p>Midpoint's structural advantage is direct access to the N1 corridor in both directions. The practical benefit differs by journey, so arrange a site visit at a representative operating time rather than relying on one universal drive-time claim.</p><h2>Comparing Midrand, Sandton, Waterfall and Centurion</h2><p>The right commercial node depends on a business's real travel pattern. Midpoint is most compelling when a business needs access across the Johannesburgâ€“Pretoria corridor, values N1 visibility, or combines office activity with logistics and distribution requirements.</p><p>Compare total occupancy cost rather than rent alone. Current rental, parking, staff travel, delivery routes, resilience infrastructure and the suitability of the available space all affect the final decision.</p><h2>Freight and Logistics Access</h2><p>For distribution and operational businesses, direct N1 frontage reduces reliance on lower-capacity urban roads for the regional leg of a journey. Confirm the entrance used by large vehicles, internal circulation, turning space, loading configuration and any operating restrictions for the unit under consideration.</p><h2>Access to OR Tambo International Airport</h2><p>OR Tambo International Airport is approximately 21 km from Midpoint. Allow for traffic and test the route at the times that matter to the operation before treating distance as a schedule.</p><h2>Getting to Midpoint</h2><p>Midpoint is at 162 Tonetti Street, Halfway House, Midrand, 1685. Use the Google Maps link below for turn-by-turn directions, or contact the leasing team to arrange a visit.</p>$html$,
  "faqs" = $json$[
    {"question":"Is Midpoint between Johannesburg and Pretoria?","answer":"Yes. Midpoint sits on the N1 corridor, approximately 25 km from Johannesburg and 31 km from Pretoria."},
    {"question":"How close is Midpoint to the N1?","answer":"Midpoint has 1,470 metres of direct N1 highway frontage."},
    {"question":"How far is Midpoint from OR Tambo International Airport?","answer":"Approximately 21 km. Actual travel time varies with traffic and the time of day."},
    {"question":"What is Midpoint's address?","answer":"162 Tonetti Street, Halfway House, Midrand, 1685."},
    {"question":"Is Midpoint suitable for a business with logistics or freight needs?","answer":"Its N1 frontage supports regional route access, but vehicle access, internal circulation, yards and loading suitability must be confirmed for the specific building."},
    {"question":"Can I visit the estate before deciding?","answer":"Yes. Contact the leasing team to arrange a site visit and assess the access routes at a time relevant to your operation."},
    {"question":"Who do I contact about access or commute questions?","answer":"Contact Boitumelo, Leasing Manager, on +27 11 380 9400 or boitumelo@blendproperty.co.za."}
  ]$json$::jsonb,
  "faqsHeading" = 'Frequently Asked Questions About Midpoint''s Location',
  "ctaHeading" = 'Want to see the access for yourself?',
  "ctaText" = 'Arrange a site visit, or discuss your team''s commute, client and logistics access needs with Boitumelo before booking a viewing.',
  "exploreLinks" = '[{"label":"Offices to rent","href":"/offices"},{"label":"Warehouses to rent","href":"/warehouses"},{"label":"About Midpoint & Blend Property Group","href":"/business-park-midrand"},{"label":"View Midpoint on Google Maps","href":"https://www.google.com/maps?q=162+Tonetti+St,+Halfway+House,+Midrand,+1685"}]'::jsonb,
  "expertName" = 'Boitumelo',
  "expertRole" = 'Leasing Manager, Midpoint',
  "expertBio" = 'Boitumelo helps prospective tenants compare Midpoint''s office and warehouse options, arrange site visits and work through practical access requirements with the leasing team.',
  "reviewOwner" = 'Boitumelo',
  "lastReviewedAt" = '2026-07-28T00:00:00.000Z',
  "seoTitle" = 'Midpoint Location Midrand | N1 Access & Distances',
  "seoDescription" = 'Explore Midpoint''s N1 location in Midrand, verified distances to Johannesburg, Pretoria and OR Tambo, access considerations and site-visit details.',
  "focusKeyword" = 'Midpoint location Midrand',
  "updatedAt" = NOW()
WHERE "slug" = 'location';

-- Extend /amenities while keeping unverified operating status, security,
-- connectivity and infrastructure specifications out of published claims.
UPDATE "PillarPage"
SET
  "title" = 'Amenities, Security & Backup Power at Midpoint',
  "primaryEntity" = 'Midpoint''s on-site amenities, security and resilience infrastructure',
  "primaryAudience" = 'Facilities managers, HR and procurement teams weighing workday experience and operational risk',
  "decisionStage" = 'Consideration to decision â€” amenities and resilience are evaluated after location and space fit',
  "primarySearchIntent" = 'Midpoint amenities, backup power Midrand office, and business park security Midrand',
  "primaryConversion" = 'Check availability and discuss operational requirements',
  "heroImage" = '/images/pages/amenities-banner.jpg',
  "heroAnswer" = 'Midpoint''s planned and available amenities include a gym, padel courts, the Fond restaurant and bar, cafÃ©s, 1.8 km of walking, running and cycling trails, and corporate accommodation. The estate also uses generator-backed power and backup water with N+1 redundancy. Some amenities and buildings remain under construction; confirm current status before relying on availability.',
  "trustStrip" = E'Gym and padel facilities\nFond restaurant, bar and cafÃ©s\n1.8 km of landscaped trails\nCorporate accommodation\nGenerator-backed power and backup water',
  "showReadyToMove" = FALSE,
  "features" = $json$[
    {"heading":"Fond restaurant, bar and cafÃ©s","text":"These spaces are intended to give tenants and clients somewhere to meet, eat or take a break without leaving the estate. Confirm which venues are operating, their hours and public-access arrangements before a visit.","image":"/images/gallery/gallery-10-restaurant.jpg","alt":"Illustrative restaurant and cafÃ© setting representing Midpoint's workday amenities"},
    {"heading":"Gym and padel facilities","text":"Fitness facilities support exercise and informal team connection around the working day. Confirm current operating status, membership or booking terms and tenant access with the leasing team.","image":"/images/gallery/gallery-9-gym.jpg","alt":"Illustrative gym image for Midpoint's fitness amenities"},
    {"heading":"1.8 km of landscaped trails","text":"Walking, running and cycling routes extend for approximately 1.8 km through the landscaped estate grounds, offering an outdoor alternative to remaining at a desk throughout the day.","image":"/images/gallery/gallery-8-running.jpg","alt":"Illustrative view of landscaped walking, running and cycling trails at a business park"},
    {"heading":"Corporate accommodation","text":"Corporate accommodation is intended for visiting executives, project teams and short-term stays. Confirm current availability, finished specification, eligibility and the booking process before making travel arrangements.","image":"/images/listings/corporate-accommodation.png","alt":"Architectural visualisation of proposed corporate accommodation at Midpoint"},
    {"heading":"Generator-backed power and backup water","text":"Midpoint uses generator-backed power and backup water with N+1 redundancy. Coverage, capacity and changeover arrangements must be confirmed for the specific building and tenant load.","image":"/images/pillars/warehouses/backup-power-generator.webp","alt":"Generator representing backup power infrastructure at Midpoint"}
  ]$json$::jsonb,
  "considerations" = $json$[
    {"heading":"Current versus planned status","text":"Some buildings and amenities remain under construction. Confirm what is operational on the date of your visit; renderings and generic lifestyle images are illustrative, not proof of current availability."},
    {"heading":"Security and access","text":"Ask the leasing team to confirm the current perimeter, visitor, vehicle and building-level access arrangements applicable to your staff, clients and operating hours."},
    {"heading":"Power and water resilience","text":"Confirm generator coverage and capacity, changeover arrangements, backup-water configuration and any limitations for the exact building and load under consideration."},
    {"heading":"Connectivity","text":"Fibre providers, capacity and redundancy can vary by building and fit-out stage. Treat connectivity as a unit-level technical check rather than an estate-wide assumption."},
    {"heading":"Amenity access and booking","text":"Confirm operating hours, tenant or public eligibility, booking rules, fees and the corporate-accommodation process before relying on an amenity for staff or visitors."}
  ]$json$::jsonb,
  "contentHtml" = $html$<h2>A Workplace With Room to Breathe</h2><p>Midpoint is designed around more than leased square metres. Its workday proposition combines places to eat and meet, fitness and outdoor activity, accommodation for visiting teams, and resilience infrastructure within the wider business estate.</p><p>That proposition must be assessed against what is available today. Some amenities and buildings remain under construction, and some site imagery is illustrative. Prospective tenants should confirm current operating status, access terms and completion timing with the leasing team before making a decision.</p><h2>Current and Planned Amenities</h2><table><thead><tr><th>Amenity</th><th>Purpose</th><th>Status</th></tr></thead><tbody><tr><td>Gym</td><td>On-site fitness facility</td><td>Confirm before visiting</td></tr><tr><td>Padel facilities</td><td>Exercise and team activity</td><td>Confirm before booking</td></tr><tr><td>Fond restaurant and bar</td><td>Meals, meetings and informal gatherings</td><td>Confirm opening status and hours</td></tr><tr><td>CafÃ©s</td><td>Coffee and quick-bite options</td><td>Confirm current venues and hours</td></tr><tr><td>Walking, running and cycling trails</td><td>Approximately 1.8 km through landscaped grounds</td><td>Confirm current route access</td></tr><tr><td>Corporate accommodation</td><td>Short stays for visiting teams</td><td>Confirm availability and booking process</td></tr></tbody></table><h2>Security and Access Control</h2><p>Security is a building-selection and operational question, not a label. Ask for the current estate and building-level arrangements, including visitor processing, vehicle access, after-hours procedures and the controls applicable to the specific premises.</p><p>The page does not publish an assumed access-control method or security specification. These details should be confirmed directly because they may change and because a tenant's operating hours and visitor profile affect what is suitable.</p><h2>Power and Water Resilience</h2><p>Midpoint uses generator-backed power and backup water with N+1 redundancy. Before signing for a specific unit, confirm which loads are covered, generator capacity, changeover behaviour, water configuration and any building-specific limitations.</p><p>Businesses with critical equipment or extended operating hours should include expected load and continuity requirements in their technical brief rather than relying on a general estate claim.</p><h2>Connectivity</h2><p>Fibre and connectivity specifications can vary by building and fit-out stage. Confirm available providers, installation lead times, service level and redundancy options for the exact unit being assessed.</p><h2>Corporate Accommodation</h2><p>Corporate accommodation is intended to support visiting executives, project teams and short-term stays close to the workplace. Current availability, completed specification, booking eligibility and rates should be confirmed before travel is arranged.</p><h2>Choosing Amenities That Matter to Your Team</h2><p>Different teams value different parts of the workday environment. HR may focus on wellness and retention; facilities teams may prioritise access and resilience; operations teams may care most about power, water and connectivity. Bring those priorities to a site visit and test the facilities that materially affect the decision.</p>$html$,
  "faqs" = $json$[
    {"question":"What amenities are available or planned at Midpoint?","answer":"The amenity mix includes a gym, padel facilities, the Fond restaurant and bar, cafÃ©s, approximately 1.8 km of landscaped trails and corporate accommodation. Some amenities and buildings remain under construction, so confirm current operating status before visiting."},
    {"question":"Is there backup power at Midpoint?","answer":"Yes. Midpoint uses generator-backed power. Confirm coverage, capacity and changeover arrangements for the specific building and tenant load."},
    {"question":"Is there backup water at Midpoint?","answer":"Yes. The estate describes its backup-water arrangement as N+1 redundant. Confirm the practical configuration and coverage for the specific building during technical review."},
    {"question":"What security is in place at Midpoint?","answer":"Security and access arrangements should be confirmed with the leasing team for the estate and the specific building, including visitor, vehicle and after-hours requirements."},
    {"question":"Is fibre or connectivity included?","answer":"Connectivity varies by building and fit-out stage. Confirm providers, capacity, installation timing, service levels and whether costs are included for the unit being considered."},
    {"question":"How long are the walking and cycling trails?","answer":"The landscaped walking, running and cycling routes extend for approximately 1.8 km through the estate grounds."},
    {"question":"Is corporate accommodation available?","answer":"Corporate accommodation forms part of the Midpoint amenity plan. Confirm current availability, completed specification, eligibility, rates and the booking process before arranging a stay."},
    {"question":"Are all amenities shown on the site currently built?","answer":"No. Some buildings and amenities remain under construction. Renderings and generic lifestyle imagery are illustrative; confirm current-versus-planned status with the leasing team."}
  ]$json$::jsonb,
  "faqsHeading" = 'Frequently Asked Questions About Amenities at Midpoint',
  "ctaHeading" = 'Ready to experience Midpoint?',
  "ctaText" = 'Check current availability, or discuss your team''s specific amenity, security, connectivity and resilience requirements with Boitumelo.',
  "exploreLinks" = '[{"label":"Offices to rent","href":"/offices"},{"label":"Warehouses to rent","href":"/warehouses"},{"label":"About Midpoint & Blend Property Group","href":"/business-park-midrand"}]'::jsonb,
  "expertName" = 'Boitumelo',
  "expertRole" = 'Leasing Manager, Midpoint',
  "expertBio" = 'Boitumelo helps prospective tenants compare Midpoint''s office and warehouse options, arrange site visits and confirm practical amenity, access and resilience requirements.',
  "reviewOwner" = 'Boitumelo',
  "lastReviewedAt" = NULL,
  "seoTitle" = 'Midpoint Amenities Midrand | Security & Backup Power',
  "seoDescription" = 'Explore Midpoint amenities in Midrand, including fitness, trails, hospitality, corporate accommodation, backup power and the questions to confirm before leasing.',
  "focusKeyword" = 'Midpoint amenities Midrand',
  "updatedAt" = NOW()
WHERE "slug" = 'amenities';

-- Replace the internal review draft that was accidentally published with
-- concise customer-facing OnPoint content. Availability and the headline
-- figures are rendered from live SERVICED_OFFICE vacancy rows.
UPDATE "PillarPage"
SET
  "title" = 'Serviced Offices in Midrand â€” OnPoint at Midpoint',
  "primaryEntity" = 'OnPoint serviced offices',
  "heroAnswer" = 'Flexible serviced offices for businesses that want a professional Midrand address, a ready-to-use workplace and room to grow.',
  "trustStrip" = E'N1 highway frontage\nBackup power & water\nOn-site amenities',
  "relatedSector" = 'SERVICED_OFFICE',
  "contentHtml" = $content$
<h2>A simpler way to move into office space</h2>
<p>OnPoint offers serviced offices within Midpoint Business Park in Midrand. It is a practical option for smaller teams, project offices and businesses establishing a satellite presence without taking on the setup of a conventional office.</p>
<p>Choose from the suites currently available, compare the size and rate, and arrange a viewing with the Midpoint leasing team. Each live unit has its own page with the latest information supplied through the Blend Listings platform.</p>

<h2>Work from a connected Midrand location</h2>
<p>Midpoint Business Park is positioned on the N1 between Johannesburg and Pretoria. Tenants have the convenience of an established business precinct with on-site food, fitness and outdoor amenities, as well as backup infrastructure serving the estate.</p>

<h2>Serviced office or conventional office?</h2>
<p>A serviced office is suited to businesses that value speed, flexibility and a workplace that is easier to occupy. A conventional office is better for a larger team that wants more control over its own fit-out, branding and long-term layout.</p>
<p>The leasing team can help you compare the live OnPoint suites with the conventional office space available elsewhere at Midpoint.</p>

<h2>Arrange a viewing</h2>
<p>Tell us how many people need space, your preferred occupation date and any meeting-room, parking or connectivity requirements. We will match your needs to the available suites and arrange a tour.</p>
  $content$,
  "features" = $features$[
    {"heading":"Ready-to-use workspace","text":"Move into a professional office environment without managing a full office fit-out from scratch.","image":"/images/listings/onpoint.jpeg","alt":"Serviced office workspace at OnPoint in Midpoint Business Park"},
    {"heading":"A professional shared environment","text":"Meet clients and work alongside other businesses in an established office setting within Midpoint.","image":"/images/listings/onpoint.jpeg","alt":"Shared office environment at OnPoint serviced offices"},
    {"heading":"Flexible space for changing teams","text":"A useful option for smaller teams, project groups and satellite offices whose space needs may change.","image":"/images/about/about-footer.jpg","alt":"Professional team meeting in a flexible office"},
    {"heading":"Central N1 location","text":"Work from Midrand with direct access to the main route between Johannesburg and Pretoria.","image":"/images/pillars/warehouses/johannesburg-pretoria-corridor.webp","alt":"Midpoint Business Park location between Johannesburg and Pretoria"},
    {"heading":"On-site amenities","text":"Restaurants, fitness facilities and outdoor spaces make the wider business park convenient throughout the working day.","image":"/images/gallery/gallery-10-restaurant.jpg","alt":"Restaurant at Midpoint Business Park"},
    {"heading":"Direct help from the leasing team","text":"Discuss current suites, rates and occupation dates with the team before arranging a viewing.","image":"/images/pages/contact-banner.jpg","alt":"Contact the Midpoint leasing team"}
  ]$features$::jsonb,
  "considerations" = $considerations$[
    {"heading":"Choose the right suite","text":"Compare the live floor area with your current headcount and expected growth."},
    {"heading":"Confirm your occupation date","text":"Availability differs by unit, so use the date shown on the individual listing page when planning a move."},
    {"heading":"Discuss your workplace needs","text":"Share your parking, meeting-room, access and connectivity requirements with the leasing team during the enquiry."},
    {"heading":"Compare the total solution","text":"Consider the convenience of serviced space alongside the control offered by a conventional office lease."}
  ]$considerations$::jsonb,
  "faqs" = $faqs$[
    {"question":"Where are the OnPoint serviced offices?","answer":"OnPoint is located within Midpoint Business Park in Halfway House, Midrand, with convenient access to the N1 between Johannesburg and Pretoria."},
    {"question":"Which serviced-office suites are available?","answer":"The availability section on this page is generated from the live Blend Listings feed. Open a unit to see its current size, rate and availability."},
    {"question":"Who are serviced offices suited to?","answer":"They are a practical option for smaller teams, project groups and businesses establishing a first or satellite presence in Midrand."},
    {"question":"Can I also consider a conventional office at Midpoint?","answer":"Yes. Midpoint has conventional office vacancies as well as OnPoint suites, and the leasing team can help you compare the available options."},
    {"question":"How do I arrange a viewing?","answer":"Select an available unit and submit an enquiry, or contact the Midpoint leasing team with your team size and preferred occupation date."}
  ]$faqs$::jsonb,
  "faqsHeading" = 'Frequently asked questions about OnPoint',
  "listingsHeading" = 'Available serviced offices at OnPoint',
  "listingsIntro" = 'These are the serviced-office suites currently available through the live Blend Listings feed.',
  "ctaHeading" = 'Find the right OnPoint suite',
  "ctaText" = 'Tell the leasing team what your business needs and arrange a viewing of the available serviced offices.',
  "noIndex" = FALSE,
  "status" = 'PUBLISHED',
  "updatedAt" = NOW()
WHERE "slug" = 'services-offices';


UPDATE "PillarPage" AS live
SET
  "title" = source."title",
  "heroAnswer" = source."heroAnswer",
  "trustStrip" = source."trustStrip",
  "features" = source."features",
  "considerations" = source."considerations",
  "contentHtml" = source."contentHtml",
  "faqs" = source."faqs",
  "faqsHeading" = source."faqsHeading",
  "ctaHeading" = source."ctaHeading",
  "ctaText" = source."ctaText",
  "seoDescription" = source."seoDescription",
  "updatedAt" = NOW()
FROM "PillarPage" AS source
WHERE live."slug" = 'warehouses'
  AND source."slug" = 'warehouses-pillar-draft';

CREATE TEMP TABLE "restore_business_park" AS SELECT * FROM "PillarPage" WITH NO DATA;
INSERT INTO "restore_business_park" (
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
  'Midpoint Business Park â€” Commercial & Industrial Property in Midrand',
  'Midpoint Business Park (developed and owned by Blend Property Group)',
  'Prospective tenants, brokers, and anyone researching Midpoint or Blend Property Group before enquiring about specific space',
  'Awareness â€” researching Midpoint before narrowing to office, warehouse or serviced office space',
  'Precinct and category demand â€” Midpoint Business Park, Blend Property Group Midrand, business park Midrand',
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
<p>Midpoint is a commercial and industrial business estate at 162 Tonetti Street, Halfway House, Midrand, positioned directly on the N1 between Johannesburg and Pretoria. The estate brings together three ways to occupy space â€” premium offices, OnPoint serviced offices, and warehouse facilities â€” inside one secure, amenity-rich environment, rather than requiring a tenant to choose between a single-purpose office park and a single-purpose industrial park.</p>
<p>Originally developed in the 1980s, Midpoint is now in an active renewal phase, combining established infrastructure and location with modern fit-outs and amenities.</p>
<aside><strong>Review before publishing:</strong> Confirm when the current redevelopment phase began and what it covers â€” specific buildings, common areas, or the full estate. A specific date and scope is a stronger trust signal than â€œundergoing renewalâ€ alone.</aside>

<h2>Who Developed Midpoint Business Park?</h2>
<p>Midpoint is owned and developed by Blend Property Group, a South African property company that has specialised in developing and investing in commercial and industrial properties since 2006. Blend Property Groupâ€™s stated focus is on productivity, operational efficiency and long-term staff satisfaction across its developments â€” a positioning that shows up directly in Midpointâ€™s amenity mix and resilience infrastructure, not just in its marketing copy.</p>
<p>For a prospective tenant or broker researching who stands behind a space before committing to a lease, that track record matters: Blend Property Group is not a single-project developer, and Midpoint is one property within a longer operating history.</p>
<aside><strong>Review before publishing:</strong> Confirm how many other properties Blend Property Group currently owns or manages. Even an approximate, dated portfolio count would add useful credibility.</aside>

<h2>Three Ways to Occupy Space at Midpoint</h2>
<p>Midpoint Business Park is organised around three distinct property products, each suited to a different kind of tenant.</p>
<h3>Premium offices</h3>
<p>Premium offices suit corporate teams, professional-services firms and growing enterprises that want dedicated, branded space on a conventional commercial lease. Current office suites range from roughly 266 mÂ² up to just over 1,000 mÂ², with rates from R105/mÂ². The Offices pillar contains live availability and the detailed decision guide.</p>
<h3>OnPoint serviced offices</h3>
<p>OnPoint serviced offices suit smaller teams, project groups and businesses establishing a satellite presence in Midrand without immediately committing to a conventional lease term. The precise furnished-suite services and inclusions should be confirmed with the leasing team and reflected on the dedicated Serviced Offices pillar.</p>
<h3>Warehouse facilities</h3>
<p>Warehouse facilities suit logistics operators, distribution businesses and selected light manufacturers. Current warehouse space ranges from 2,320 mÂ² to 11,443 mÂ², from R109/mÂ², with high eaves, loading infrastructure and generous yard capacity. The Warehouses pillar contains live availability and a detailed operational checklist.</p>
<p>A tenant may be able to change product as its needs evolve, but this should not be presented as a guaranteed pathway until the leasing team confirms how frequently moves between serviced offices, conventional offices and mixed office-and-warehouse facilities are supported in practice.</p>

<h2>On the N1 Between Johannesburg and Pretoria</h2>
<p>Midpointâ€™s single biggest structural advantage is its position: 1,470 metres of direct N1 highway frontage, roughly 25 km from Johannesburg and 31 km from Pretoria, with OR Tambo International Airport approximately 21 km away. Staff, clients and freight can reach Gautengâ€™s two largest business centres without locating entirely inside either one.</p>
<p>This can be valuable for organisations serving customers or managing teams across the Johannesburgâ€“Pretoria corridor, particularly when compared with more congested and higher-rate nodes. Distances alone do not guarantee a suitable commute or logistics route, so prospective occupiers should test travel at the operating times that matter to them. The Location and Access pillar should remain the detailed source for verified routes, distances and typical drive-time ranges.</p>

<h2>Resilience Across the Estate</h2>
<p>Whichever property product a tenant chooses, Midpoint runs on generator-backed power and backup water with N+1 redundancy, protecting day-to-day operations against grid and water disruptions. The exact capacity, coverage and changeover arrangements associated with a particular building or tenant load should still be confirmed during the technical review of a specific unit.</p>
<p>Connectivity and fibre specification can vary by building and fit-out stage. Businesses with critical systems, contact centres, warehouse management platforms or cloud-based workflows should confirm available providers, lead times and redundancy options before occupation.</p>

<h2>Amenities and the Working Day</h2>
<p>Midpoint tenants have access to a broader work environment that includes a gym, padel courts, the on-site Fond restaurant and bar, cafÃ©s, and roughly 1.8 km of walking, running and cycling trails through the landscaped estate grounds, together with corporate accommodation for visiting teams.</p>
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
<p>The estateâ€™s tenant roster spans national and multinational organisations. Public tenant branding currently includes Bidvest, Capitec Bank, the City of Johannesburg, Fresenius Kabi, LG Electronics, Momentum, SANBS and Stellantis, among others.</p>
<p>This list and the total tenant count must be confirmed before the page is published as the canonical description of the estate. Converting the existing logo wall into accessible text is worthwhile because it makes tenant evidence readable by people using assistive technology and crawlable by search engines. One or two named tenant stories would strengthen the proof further by explaining why an organisation selected Midpoint and how it uses the space.</p>

<h2>How to Choose the Right Midpoint Property Product</h2>
<p>Most visitors arrive at this page while researching the estate rather than a specific vacant unit. The first useful decision is whether the requirement is primarily for a conventional office, a flexible serviced office, a warehouse, or a combination of office and operational space.</p>
<p>Teams needing a dedicated identity, private meeting space and a conventional lease should explore the Offices pillar. Smaller or project-based teams looking for a faster, more flexible setup should review OnPoint serviced offices. Logistics, distribution and operational users should start with the Warehouses pillar and compare loading, yard, clear-height, power and office requirements.</p>
<p>Mixed requirements should be discussed directly with the leasing team. A requirement brief covering size, staff numbers, occupation date, vehicle activity, power, parking and lease preferences will help identify the most relevant current or upcoming opportunity.</p>

<h2>Getting Started at Midpoint Business Park</h2>
<p>The next step is to explore current availability in the product that fits the requirement â€” offices, serviced offices, or warehouses â€” or speak directly with the leasing team about a need that does not map neatly onto a single category, such as a combined office-and-warehouse operation or a phased move.</p>
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
    {"question":"What amenities are available at Midpoint?","answer":"The estate environment includes a gym, padel courts, the on-site Fond restaurant and bar, cafÃ©s, walking, running and cycling trails, and corporate accommodation. Check the Amenities pillar for current versus planned status."}
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
);

UPDATE "PillarPage" AS live
SET
  "title" = source."title",
  "heroAnswer" = source."heroAnswer",
  "trustStrip" = source."trustStrip",
  "features" = source."features",
  "considerations" = source."considerations",
  "contentHtml" = source."contentHtml",
  "faqs" = source."faqs",
  "faqsHeading" = source."faqsHeading",
  "ctaHeading" = source."ctaHeading",
  "ctaText" = source."ctaText",
  "seoDescription" = source."seoDescription",
  "updatedAt" = NOW()
FROM "restore_business_park" AS source
WHERE live."slug" = 'business-park-midrand';
