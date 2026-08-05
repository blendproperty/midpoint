-- Replace the internal review draft that was accidentally published with
-- concise customer-facing OnPoint content. Availability and the headline
-- figures are rendered from live SERVICED_OFFICE vacancy rows.
UPDATE "PillarPage"
SET
  "title" = 'Serviced Offices in Midrand — OnPoint at Midpoint',
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
