-- Replace promotional and generic decision-guide copy with concise,
-- verifiable estate information. Unit specifications remain sourced from
-- the live Vacancy records populated by Blend Listings.

UPDATE "PillarPage"
SET
  "heroAnswer" = 'Conventional office space at Midpoint in Halfway House, Midrand. Current sizes, rates and availability are shown from the live vacancy schedule below.',
  "trustStrip" = E'Live published availability\nN1 corridor location\nUnit-specific details',
  "features" = $json$[
    {"heading":"Current office options","text":"Published office vacancies cover different sizes and layouts. Open a listing for the information supplied for that specific unit.","image":"https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a16a7cc8af199f89084d8f0_Office-image-p-500.jpg"},
    {"heading":"Midrand location","text":"Midpoint is at 162 Tonetti Street, Halfway House, on the N1 corridor between Johannesburg and Pretoria.","image":"/images/sitemap/aerial.jpg"},
    {"heading":"Conventional or serviced space","text":"Businesses can compare a conventional office with the OnPoint serviced-office suites available on the same estate.","image":"/images/listings/onpoint.jpeg"}
  ]$json$::jsonb,
  "considerations" = $json$[
    {"heading":"Fit-out and layout","text":"Inspect the particular suite and confirm its current layout, condition and any landlord or tenant works."},
    {"heading":"Total occupancy cost","text":"Confirm rental, operating costs, utilities, parking, escalation and VAT for the unit before comparing offers."},
    {"heading":"Power, water and connectivity","text":"Confirm coverage, capacity, service providers and costs for the specific building and intended use."},
    {"heading":"Occupation date","text":"Use the availability date on the live unit page and confirm the handover programme with the leasing team."}
  ]$json$::jsonb,
  "contentHtml" = $copy$
<h2>Office space at Midpoint</h2>
<p>Midpoint has conventional office suites in Halfway House, Midrand. The live listings on this page provide the current floor area, asking rate, availability date and description received from Blend Listings.</p>
<p>Specifications differ between buildings. A viewing is the appropriate place to confirm the layout, finishes, access, parking, power, water, connectivity and any work required before occupation.</p>
<h2>Compare the available units</h2>
<p>Open an individual listing for its current details and dedicated enquiry link. For a smaller team or project office, compare the conventional vacancies with the OnPoint serviced-office options.</p>
  $copy$,
  "faqs" = $json$[
    {"question":"Which offices are currently available?","answer":"The availability section on this page is generated from published Blend Listings records. Open a unit for its current size, rate and availability date."},
    {"question":"What is included in the quoted rate?","answer":"Inclusions can differ by unit. Confirm operating costs, utilities, parking, VAT and any other charges with the leasing team."},
    {"question":"Can I inspect a unit?","answer":"Yes. Use the unit enquiry link or contact the leasing team to arrange a viewing."},
    {"question":"Does Midpoint also have serviced offices?","answer":"Yes. OnPoint serviced-office vacancies are published separately on the serviced offices page."}
  ]$json$::jsonb,
  "faqsHeading" = 'Questions about office space at Midpoint',
  "ctaHeading" = 'Arrange an office viewing',
  "ctaText" = 'Select a published unit or tell the leasing team your required size and occupation date.',
  "updatedAt" = NOW()
WHERE "slug" = 'offices';

UPDATE "PillarPage"
SET
  "title" = 'Warehouse Space at Midpoint in Midrand',
  "heroAnswer" = 'Warehouse and industrial opportunities at Midpoint in Halfway House, Midrand. Current sizes, rates, availability and confirmed unit details are shown below.',
  "trustStrip" = E'Live published availability\nN1 corridor location\nUnit-specific specifications',
  "features" = '[]'::jsonb,
  "considerations" = $json$[
    {"heading":"Loading and yard","text":"Confirm door positions, dock or on-grade access, yard dimensions, turning space and vehicle circulation for the specific unit."},
    {"heading":"Height and floor","text":"Confirm clear height to the lowest obstruction, floor loading and condition against the proposed storage or operational layout."},
    {"heading":"Power and services","text":"Provide an equipment schedule and confirm available electrical capacity, backup coverage, water and connectivity for the intended use."},
    {"heading":"Office and staff areas","text":"Check the office component, reception, kitchens, ablutions, parking and pedestrian routes during the inspection."}
  ]$json$::jsonb,
  "contentHtml" = $copy$
<h2>Start with the operating requirement</h2>
<p>The live listings on this page show the warehouse and industrial units currently published for Midpoint. Each building has its own configuration, so no estate-wide loading, height, yard or power specification should be assumed.</p>
<p>Before a viewing, prepare the required floor area, occupation date, vehicle types, loading method, yard requirement, storage height, office component, power demand, parking and operating hours. The leasing team can then identify relevant units and arrange an inspection.</p>
<h2>Inspect the specific property</h2>
<p>Use the unit page as the starting point and verify measurements, technical services, access, compliance requirements, costs and proposed works before making a commitment.</p>
  $copy$,
  "faqs" = $json$[
    {"question":"Which warehouses are currently available?","answer":"The availability section is generated from published Blend Listings records. Open a unit for its current floor area, rate, date and supplied description."},
    {"question":"Do all warehouses have dock levellers or large yards?","answer":"No blanket specification is published. Loading and yard arrangements must be checked for the particular unit."},
    {"question":"Is backup power available?","answer":"Backup arrangements and supported loads can differ by building and intended use. Confirm the exact capacity during technical review."},
    {"question":"How do I arrange an inspection?","answer":"Use the enquiry link on the relevant unit or contact the Midpoint leasing team with your operational requirements."}
  ]$json$::jsonb,
  "faqsHeading" = 'Questions about warehouse space at Midpoint',
  "ctaHeading" = 'Discuss your warehouse requirement',
  "ctaText" = 'Send the leasing team your size, loading, yard, power, office and occupation requirements to arrange a relevant inspection.',
  "seoDescription" = 'View current warehouse and industrial space at Midpoint in Midrand, with live sizes, rates, availability and unit-specific information.',
  "updatedAt" = NOW()
WHERE "slug" = 'warehouses';

UPDATE "PillarPage"
SET
  "title" = 'Amenities at Midpoint',
  "heroAnswer" = 'Midpoint includes current and planned food, fitness, outdoor and accommodation facilities. Some areas remain under development; confirm operating status and access before visiting.',
  "trustStrip" = E'Fond restaurant and bar\nFitness and padel facilities\nApproximately 1.8 km of trails\nPlanned corporate accommodation',
  "features" = $json$[
    {"heading":"Food and meeting space","text":"Fond restaurant and bar and café facilities form part of the estate offering. Confirm current venues and opening hours before visiting.","image":"/images/gallery/gallery-10-restaurant.jpg"},
    {"heading":"Fitness and padel","text":"Gym and padel facilities form part of Midpoint. Confirm current access, membership or booking arrangements.","image":"/images/gallery/gallery-9-gym.jpg"},
    {"heading":"Estate trails","text":"Walking, running and cycling routes extend for approximately 1.8 km through the estate grounds.","image":"/images/gallery/gallery-8-running.jpg"},
    {"heading":"Corporate accommodation","text":"Corporate accommodation is planned for visiting teams and short stays. Confirm completion and booking availability before making arrangements.","image":"/images/listings/corporate-accommodation.png"}
  ]$json$::jsonb,
  "considerations" = $json$[
    {"heading":"Current versus planned","text":"Some buildings and facilities remain under development. Ask what is operating on the date of your visit."},
    {"heading":"Access and charges","text":"Confirm opening hours, tenant or public access, booking rules and applicable charges directly."},
    {"heading":"Building services","text":"Power, water, security and connectivity requirements must be checked for the particular premises being considered."}
  ]$json$::jsonb,
  "contentHtml" = $copy$
<h2>Facilities within the estate</h2>
<p>Midpoint combines commercial and industrial premises with food, fitness and outdoor facilities. The offering includes Fond restaurant and bar, café space, gym and padel facilities, approximately 1.8 km of estate trails and planned corporate accommodation.</p>
<p>Not every facility or development shown on the website is necessarily complete or operating. Confirm current status, opening hours, access and charges before relying on a facility for staff or visitors.</p>
  $copy$,
  "faqs" = $json$[
    {"question":"Are all the amenities currently operating?","answer":"Some facilities and buildings remain under development. Confirm current operating status with the leasing team before visiting."},
    {"question":"How long are the estate trails?","answer":"The walking, running and cycling routes are described as approximately 1.8 km."},
    {"question":"Is corporate accommodation available?","answer":"Corporate accommodation is planned. Confirm completion, eligibility, rates and booking availability before making travel arrangements."},
    {"question":"Are amenity access and charges included in a lease?","answer":"Access and charges may differ. Confirm the arrangements that apply to the specific premises and facility."}
  ]$json$::jsonb,
  "faqsHeading" = 'Questions about Midpoint amenities',
  "ctaHeading" = 'Visit Midpoint',
  "ctaText" = 'Arrange a site visit and ask the leasing team which facilities are currently operating.',
  "seoDescription" = 'See the current and planned food, fitness, outdoor and accommodation amenities at Midpoint in Midrand.',
  "updatedAt" = NOW()
WHERE "slug" = 'amenities';

UPDATE "PillarPage"
SET
  "title" = 'Midpoint Location and N1 Access',
  "heroAnswer" = 'Midpoint is at 162 Tonetti Street, Halfway House, Midrand, on the N1 corridor between Johannesburg and Pretoria.',
  "trustStrip" = E'162 Tonetti Street, Halfway House\nMidrand location\nN1 corridor access',
  "features" = $json$[
    {"heading":"Halfway House, Midrand","text":"The estate address is 162 Tonetti Street, Halfway House, Midrand, 1685.","image":"/images/sitemap/aerial.jpg"},
    {"heading":"Johannesburg–Pretoria corridor","text":"Midpoint is positioned in Midrand between Johannesburg and Pretoria with frontage to the N1 corridor.","image":"/images/pillars/warehouses/johannesburg-pretoria-corridor.webp"},
    {"heading":"Plan the actual journey","text":"Travel time depends on origin, destination and traffic. Test staff, client and delivery routes at relevant operating times.","image":"/images/location/map-background.avif"}
  ]$json$::jsonb,
  "considerations" = $json$[
    {"heading":"Staff travel","text":"Compare the estate with the actual home locations and working hours of the team."},
    {"heading":"Deliveries and large vehicles","text":"Confirm the entrance, route, access procedures and internal circulation for the specific building."},
    {"heading":"Public transport","text":"If public transport or staff shuttles matter, test the complete journey and final connection to the estate."}
  ]$json$::jsonb,
  "contentHtml" = $copy$
<h2>Getting to Midpoint</h2>
<p>Midpoint is at 162 Tonetti Street, Halfway House, Midrand, 1685. It is positioned on the N1 corridor between Johannesburg and Pretoria.</p>
<p>Distance and journey time depend on the exact origin, destination and time of travel. Businesses should test representative staff, client, supplier and delivery routes rather than relying on a general commute claim.</p>
<h2>Plan a site visit</h2>
<p>Use the map link for directions or contact the leasing team to arrange access. Businesses considering warehouse space should also confirm the vehicle route and internal circulation for the particular building.</p>
  $copy$,
  "faqs" = $json$[
    {"question":"What is Midpoint's address?","answer":"162 Tonetti Street, Halfway House, Midrand, 1685."},
    {"question":"Is Midpoint on the N1 corridor?","answer":"Yes. Midpoint is positioned in Midrand between Johannesburg and Pretoria with frontage to the N1 corridor."},
    {"question":"Are travel times guaranteed?","answer":"No. Journey time depends on traffic, origin, destination and time of travel. Test the routes relevant to your operation."},
    {"question":"Can I arrange a site visit?","answer":"Yes. Contact the Midpoint leasing team to arrange access and inspect a relevant unit."}
  ]$json$::jsonb,
  "faqsHeading" = 'Questions about Midpoint location',
  "ctaHeading" = 'Arrange a site visit',
  "ctaText" = 'Visit 162 Tonetti Street and test the routes relevant to your staff, clients and operations.',
  "seoDescription" = 'Find Midpoint at 162 Tonetti Street, Halfway House, Midrand, on the N1 corridor between Johannesburg and Pretoria.',
  "updatedAt" = NOW()
WHERE "slug" = 'location';

UPDATE "PillarPage"
SET
  "heroAnswer" = 'OnPoint workspace at Midpoint for smaller teams, project offices and businesses establishing a Midrand presence. See the live listings for available suites and rates.',
  "trustStrip" = E'OnPoint at Midpoint\nLive suite availability\nMidrand N1 corridor location',
  "contentHtml" = $copy$
<h2>OnPoint at Midpoint</h2>
<p>OnPoint provides serviced-office workspace within Midpoint in Halfway House, Midrand. It is an option for smaller teams, project offices and businesses establishing a first or satellite presence in the area.</p>
<p>The live listings below show the suites currently published through Blend Listings. Open a unit for its current floor area, asking rate, availability date and supplied description.</p>
<h2>Confirm the package for the selected suite</h2>
<p>Furniture, meeting-room access, reception services, parking, connectivity, lease term and other inclusions may differ. Confirm the complete package and charges for the particular suite during the enquiry and viewing.</p>
  $copy$,
  "features" = $json$[
    {"heading":"Published OnPoint suites","text":"Use the live availability section for current sizes, rates and availability dates.","image":"/images/listings/onpoint.jpeg"},
    {"heading":"Midpoint location","text":"OnPoint is within Midpoint at 162 Tonetti Street, Halfway House, Midrand.","image":"/images/sitemap/aerial.jpg"},
    {"heading":"Compare before committing","text":"Confirm the services, furniture, access, parking, connectivity, term and charges attached to the selected suite.","image":"/images/about/about-footer.jpg"}
  ]$json$::jsonb,
  "considerations" = $json$[
    {"heading":"Team size","text":"Compare the published floor area with current headcount and expected growth."},
    {"heading":"Included services","text":"Confirm furniture, reception, meeting-room, connectivity and other service inclusions for the selected suite."},
    {"heading":"Commercial terms","text":"Confirm the term, notice provisions, deposit, escalation, parking and all additional charges in writing."}
  ]$json$::jsonb,
  "faqs" = $json$[
    {"question":"Which OnPoint suites are available?","answer":"The availability section is generated from published Blend Listings records. Open a unit for its current size, rate and availability date."},
    {"question":"Are all suites furnished?","answer":"Do not assume one furniture standard across every suite. Confirm the furniture and fit-out included with the selected unit."},
    {"question":"Are meeting rooms and reception included?","answer":"Services and charges can differ. Confirm the package for the selected suite with the leasing team."},
    {"question":"How do I arrange a viewing?","answer":"Use the enquiry link on an available suite or contact the Midpoint leasing team."}
  ]$json$::jsonb,
  "faqsHeading" = 'Questions about OnPoint workspace',
  "ctaHeading" = 'Arrange an OnPoint viewing',
  "ctaText" = 'Select a published suite or tell the leasing team your team size and preferred occupation date.',
  "updatedAt" = NOW()
WHERE "slug" = 'services-offices';

UPDATE "PillarPage"
SET
  "title" = 'Midpoint Business Park in Midrand',
  "heroAnswer" = 'Midpoint is a commercial and industrial estate at 162 Tonetti Street, Halfway House, Midrand. It includes conventional offices, OnPoint serviced offices and warehouse space.',
  "trustStrip" = E'162 Tonetti Street, Halfway House\nOffices, serviced offices and warehouses\nOwned by Blend Property Group',
  "features" = $json$[
    {"heading":"Conventional offices","text":"Published office vacancies are shown with current sizes, rates and availability dates from Blend Listings.","image":"/images/listings/2-weaver-avenue.png"},
    {"heading":"OnPoint serviced offices","text":"OnPoint provides workspace for smaller teams, project offices and businesses establishing a Midrand presence.","image":"/images/listings/onpoint.jpeg"},
    {"heading":"Warehouse and industrial space","text":"Published industrial opportunities have unit-specific loading, yard, height and technical information where confirmed.","image":"/images/pillars/warehouses/warehouse-exterior.webp"}
  ]$json$::jsonb,
  "considerations" = $json$[
    {"heading":"Choose the property type","text":"Compare conventional offices, OnPoint workspace and warehouse opportunities against the actual operational requirement."},
    {"heading":"Use live availability","text":"Sizes, rates and dates change. Use the published unit pages rather than general estate copy when shortlisting space."},
    {"heading":"Inspect the unit","text":"Confirm the condition, access, services, costs and any proposed works for the particular premises."}
  ]$json$::jsonb,
  "contentHtml" = $copy$
<h2>What Midpoint is</h2>
<p>Midpoint is a commercial and industrial estate at 162 Tonetti Street, Halfway House, Midrand. It contains conventional offices, OnPoint serviced offices, warehouse and industrial buildings, current redevelopment projects and shared amenity areas.</p>
<p>The estate is owned by Blend Property Group, a South African commercial property company established in 2006. Blend's Johannesburg office is located at Midpoint.</p>
<h2>Find current space</h2>
<p>The vacancy schedule is the source for current published units. Each unit page shows the floor area, asking rate, availability date, supplied description and enquiry route received through Blend Listings.</p>
<p>General estate pages do not replace a property inspection. Confirm unit measurements, technical services, access, costs, condition and proposed works with the leasing team.</p>
  $copy$,
  "faqs" = $json$[
    {"question":"What is Midpoint?","answer":"Midpoint is a commercial and industrial estate at 162 Tonetti Street, Halfway House, Midrand."},
    {"question":"What types of space are available?","answer":"Midpoint has conventional offices, OnPoint serviced offices and warehouse or industrial opportunities. The live vacancy schedule shows currently published units."},
    {"question":"Who owns Midpoint?","answer":"Midpoint is owned by Blend Property Group, a South African commercial property company established in 2006."},
    {"question":"How do I arrange a viewing?","answer":"Open a published unit and submit an enquiry, or contact the Midpoint leasing team with your requirements."}
  ]$json$::jsonb,
  "faqsHeading" = 'Questions about Midpoint',
  "ctaHeading" = 'Find current space at Midpoint',
  "ctaText" = 'Use the live vacancy schedule or contact the leasing team to arrange an inspection.',
  "seoDescription" = 'Learn about Midpoint Business Park at 162 Tonetti Street, Halfway House, Midrand, and view current offices, serviced offices and warehouses.',
  "updatedAt" = NOW()
WHERE "slug" = 'business-park-midrand';

UPDATE "Faq" SET "answer" = 'Midpoint is a commercial and industrial estate at 162 Tonetti Street, Halfway House, Midrand. It contains conventional offices, OnPoint serviced offices and warehouse space and is owned by Blend Property Group.' WHERE "question" = 'What is Midpoint?';
UPDATE "Faq" SET "answer" = 'The estate has conventional offices, OnPoint serviced offices and warehouse or industrial space. Available units, sizes, rates and unit-specific specifications are shown on the live vacancy schedule.' WHERE "question" = 'What types of spaces are available at Midpoint?';
UPDATE "Faq" SET "answer" = 'Use the enquiry form, call +27 11 380 9400 or email boitumelo@blendproperty.co.za. The leasing team can confirm availability and arrange a site visit.' WHERE "question" = 'How do I enquire about leasing?';
UPDATE "Faq" SET "answer" = 'The estate''s current and planned amenities include Fond restaurant and bar, cafés, fitness and padel facilities, trails and corporate accommodation. Some facilities remain under development; confirm current operating status before visiting.' WHERE "question" = 'What amenities are available at Midpoint?';
UPDATE "Faq" SET "answer" = 'Some published opportunities have future availability dates or are under development. Contact the leasing team for the programme, specification and commercial terms of the particular unit.' WHERE "question" = 'Can I secure a space before construction is complete?';
UPDATE "Faq" SET "answer" = 'Midpoint is at 162 Tonetti Street, Halfway House, Midrand, on the N1 corridor between Johannesburg and Pretoria.' WHERE "question" = 'Where is Midpoint located?';
UPDATE "Faq" SET "answer" = 'Midpoint is owned by Blend Property Group, a South African commercial property company established in 2006.' WHERE "question" = 'Who owns Midpoint?';
