-- Create the full Warehouse pillar page as a reviewable draft without
-- replacing the currently published /warehouses page. Once approved in the
-- CMS, its content can be copied to the live record and the temporary draft
-- removed.

INSERT INTO "Media" ("id", "filename", "url", "mimeType", "size", "alt", "createdAt")
VALUES
  ('warehouse_media_01', 'warehouse-exterior.webp', '/images/pillars/warehouses/warehouse-exterior.webp', 'image/webp', 105658, 'Modern warehouse exterior with multiple roller shutter doors and a large concrete yard in Midrand', NOW()),
  ('warehouse_media_02', 'midrand-logistics-location.webp', '/images/pillars/warehouses/midrand-logistics-location.webp', 'image/webp', 235522, 'Aerial view of modern warehouses beside a major Gauteng highway and logistics corridor', NOW()),
  ('warehouse_media_03', 'integrated-warehouse-offices.webp', '/images/pillars/warehouses/integrated-warehouse-offices.webp', 'image/webp', 153688, 'Glass-fronted offices integrated with a high-volume warehouse and pallet racking', NOW()),
  ('warehouse_media_04', 'backup-power-generator.webp', '/images/pillars/warehouses/backup-power-generator.webp', 'image/webp', 121762, 'Backup generator installed beside a modern industrial warehouse', NOW()),
  ('warehouse_media_05', 'johannesburg-pretoria-corridor.webp', '/images/pillars/warehouses/johannesburg-pretoria-corridor.webp', 'image/webp', 54256, 'Route illustration showing Midrand positioned between Johannesburg and Pretoria', NOW()),
  ('warehouse_media_06', 'warehouse-site-inspection.webp', '/images/pillars/warehouses/warehouse-site-inspection.webp', 'image/webp', 120948, 'Leasing and operations professionals inspecting a warehouse facility', NOW()),
  ('warehouse_media_07', 'dock-leveller-loading-access.webp', '/images/pillars/warehouses/dock-leveller-loading-access.webp', 'image/webp', 195718, 'Dock leveller providing direct loading access into a racked warehouse', NOW()),
  ('warehouse_media_08', 'high-eaves-racking.webp', '/images/pillars/warehouses/high-eaves-racking.webp', 'image/webp', 331762, 'High-eaves warehouse interior fitted with tall pallet racking and clear aisles', NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "PillarPage" (
  "id", "slug", "title", "primaryEntity", "primaryAudience", "decisionStage",
  "primarySearchIntent", "primaryConversion", "heroAnswer", "heroImage",
  "trustStrip", "contentHtml", "faqs", "faqsHeading", "features",
  "considerations", "relatedSector", "listingsHeading", "listingsIntro",
  "showReadyToMove", "ctaHeading", "ctaText", "exploreLinks", "expertName",
  "expertRole", "expertBio", "reviewOwner", "lastReviewedAt", "nextReviewAt",
  "status", "passwordProtected", "seoTitle", "seoDescription", "focusKeyword",
  "ogTitle", "ogDescription", "ogImage", "noIndex", "createdAt", "updatedAt"
)
VALUES (
  'warehouse_pillar_draft_20260730',
  'warehouses-pillar-draft',
  'Warehouses to Rent in Midrand',
  'Warehouse space in Midrand',
  'Business owners, operations directors, logistics teams, tenant representatives and commercial property brokers',
  'Comparing warehouse locations and specifications before shortlisting or leasing',
  'Commercial investigation and warehouse leasing',
  'Review live warehouse availability or arrange a site inspection',
  'Midpoint offers warehouse space to rent in Midrand for logistics, distribution, storage and adaptable industrial operations. The estate combines access to the Johannesburg–Pretoria corridor with practical loading, yard, power and office configurations. Available buildings vary, so tenants should compare each unit against their vehicle movements, storage system, power demand, staffing and future growth plans.',
  '/images/pillars/warehouses/warehouse-exterior.webp',
  E'Midrand location between Johannesburg and Pretoria\nLive warehouse availability\nIntegrated offices and operational space\nDirect leasing support',
  $content$
<h2>Warehouses to Rent in Midrand: Start With the Operation, Not the Building</h2>
<p>A warehouse search is most effective when it begins with the way the business actually works. Floor area matters, but the same number of square metres can perform very differently depending on clear height, column spacing, door positions, yard depth, office allocation, power capacity and vehicle circulation. A building that looks economical on a rate-per-square-metre comparison can become expensive if stock flow is inefficient, trucks cannot turn comfortably, office space is poorly balanced or future expansion requires another move.</p>
<p>Midpoint is a commercial and industrial estate in Halfway House, Midrand. Its position between Johannesburg and Pretoria makes it relevant to businesses serving customers, suppliers and staff across Gauteng. The estate includes warehouse opportunities of different sizes and configurations, together with offices, shared amenities and a leasing team that can explain current availability. This guide is designed to help occupiers and brokers assess those options methodically rather than relying on a brochure headline.</p>
<p>The first step is to document the operational brief. Record current and projected stock volumes, inbound and outbound vehicle types, dispatch frequency, picking method, racking requirements, handling equipment, power demand, staff numbers, office needs and any unusual compliance requirements. Separate essential requirements from preferences. That distinction makes it easier to shortlist viable properties and prevents attractive but unsuitable space from consuming the search process.</p>

<h2>Why Midrand Works as a Warehouse Location</h2>
<p>Midrand sits on the main commercial corridor between Johannesburg and Pretoria. For many occupiers, that centrality can reduce the compromise between access to customers in the south, suppliers or public-sector functions in the north, and staff travelling from different parts of Gauteng. Location should still be tested against the company’s real delivery data: map frequent destinations, collection points, employee origins and peak travel periods before making a final decision.</p>
<p>Highway proximity is useful only when the complete route works. A proper inspection should consider the distance from the interchange, road restrictions, congestion at operational times, access-control procedures and the ease with which heavy vehicles enter and leave the property. Tenants should test the route using the largest vehicle expected to visit regularly. The same exercise should be repeated during the hours when dispatch and receiving activity will be highest.</p>
<p>Midpoint combines industrial and commercial space within one connected estate. That can help businesses whose warehouse, administration, sales and management teams need to remain close to each other. Integrated office components shorten the distance between operational decisions and the warehouse floor, while nearby meeting and amenity spaces can support staff, visiting suppliers and clients without requiring every interaction to take place inside the operational area.</p>

<h2>Calculate the Warehouse Area Your Business Actually Needs</h2>
<p>Start with usable operating capacity, not only gross lettable area. Estimate storage positions by product category, stock-turn profile and racking method. Add receiving, staging, quality-control, picking, packing, dispatch, returns and waste-handling zones. Allow for safe pedestrian routes, forklift aisles, charging areas, fire equipment and maintenance access. The result is a working space plan that can be tested against each building.</p>
<p>Clear height can materially change capacity. A higher warehouse may support additional pallet levels, but only if the racking system, slab, fire design, handling equipment and operational controls support that use. Ask for the height to the lowest obstruction rather than relying on a headline eaves measurement. Sprinklers, lighting, structural members and services may influence the height available across different parts of the floor.</p>
<p>Column spacing also affects layout efficiency. A racking consultant or operations planner should overlay the proposed storage system on an accurate plan before the lease is concluded. Small changes in aisle width or rack orientation can alter capacity and travel distance substantially. If the business uses shelving, bulk stacking, production cells or unusual equipment, those requirements should be modelled rather than converted into a generic pallet calculation.</p>
<p>Growth allowance must be intentional. Paying for large amounts of unused space from day one may be inefficient, but choosing a building with no expansion path can force an early relocation. Compare realistic growth scenarios, seasonal peaks and the possibility of mezzanines, higher-density storage or adjacent space. The right allowance depends on the lease term, capital investment in fit-out and the cost of interrupting operations later.</p>

<h2>Loading Doors, Dock Levellers and Yard Circulation</h2>
<p>Loading infrastructure should match the vehicles and handling process used by the business. On-grade roller shutter doors suit vehicles or operations where goods move directly across ground level. Dock levellers can improve the transfer between a raised warehouse floor and delivery vehicles. Some occupiers need both. Count the required doors, examine their dimensions and positions, and confirm whether inbound and outbound flows can operate simultaneously.</p>
<p>Door count alone does not prove loading capacity. Trucks need approach space, turning room and a clear path that does not conflict with parked cars, fire routes or other tenants. Inspect the yard with a dimensioned plan and, where necessary, a vehicle-swept-path assessment. Consider queuing during peak receiving periods and where drivers will wait, report or complete paperwork.</p>
<p>Weather protection can matter for sensitive products and high-frequency loading. Canopies, dock shelters and the orientation of doors influence working conditions during rain, wind and heat. Lighting, security visibility and pedestrian separation should also be considered for early-morning or evening movements. These details influence safety and throughput long after the lease negotiation is complete.</p>
<p>The loading area should be evaluated together with the internal staging zone. A well-designed yard cannot solve congestion immediately inside the door. Confirm that goods can be checked, sorted and moved without blocking access or creating unsafe interaction between people and equipment. Businesses with returns, cross-docking or high dispatch volumes may need larger staging areas than a conventional storage operation.</p>

<h2>Power, Resilience and Business Continuity</h2>
<p>Power requirements vary widely between warehouse users. Basic lighting and charging demand is different from refrigeration, processing, laboratory, workshop or light-manufacturing demand. Prepare an equipment schedule showing rated load, expected simultaneous use, starting currents and planned additions. The landlord or technical team can then confirm the supply associated with a specific building and whether upgrades are feasible.</p>
<p>Backup power should be assessed against critical operations rather than treated as a simple yes-or-no feature. Establish which systems must continue during an interruption: security, access control, networks, selected lighting, refrigeration, conveyors, charging or production equipment. Confirm the backup system’s capacity, changeover arrangement, fuel management and maintenance responsibility. A generator visible on site does not automatically mean every tenant load is supported.</p>
<p>Connectivity and data resilience are part of the same continuity plan. Warehouse management systems, scanning, dispatch documents, cameras and customer platforms may depend on reliable connectivity. Confirm available service providers, entry points and the process for installing redundant links where required. Review mobile coverage in offices, yards and deep inside the warehouse.</p>
<p>Tenants should document recovery procedures alongside property specifications. Identify manual workarounds, priority equipment and the maximum interruption each process can tolerate. This allows the property decision to be assessed as one part of a broader continuity strategy instead of expecting the building alone to remove every operational risk.</p>

<h2>Integrated Offices, Staff Facilities and the Working Day</h2>
<p>Warehouse operations usually need more than storage space. Receiving staff, supervisors, finance, customer service, sales, management and visiting drivers may all require different environments. Review the quantity and position of offices, meeting rooms, ablutions, kitchens, change areas and rest spaces. An excessive office component increases occupancy cost, while too little office space can create noisy or improvised work areas.</p>
<p>Visibility between the office and warehouse can improve communication and supervision, but glazing, access points and pedestrian routes must suit safety and security requirements. Consider where visitors arrive, how they reach reception and whether they need to cross operational zones. Staff and customer parking should be separated from heavy-vehicle activity wherever practical.</p>
<p>Midpoint’s wider work environment includes on-site and nearby amenities that can support the people based at the estate. Restaurants, fitness facilities and outdoor spaces are relevant when assessing recruitment, staff retention, informal meetings and the everyday experience of teams who spend long shifts at the property. They do not replace sound warehouse specifications, but they form part of the complete occupancy decision.</p>
<p>Public transport connections, commuting patterns and shift times should be examined for the actual workforce. A central regional location can be valuable, but each occupier’s staffing profile is different. Include key employees in the location assessment and test travel at the hours when shifts begin and end.</p>

<h2>Security, Access Control and Operational Risk</h2>
<p>Security requirements depend on product value, operating hours, insurance conditions and the number of vehicles and visitors entering the site. Review estate access control, the boundary, lighting, camera coverage, guard procedures and the security measures attached to the individual building. Clarify where the landlord’s responsibility ends and where tenant-specific systems must begin.</p>
<p>Goods movement requires a practical chain of control. Consider driver identification, seal checks, visitor records, secure waiting areas and the location of receiving documentation. High-value or regulated stock may require cages, restricted rooms, alarm zones or additional surveillance. These measures should be included in the fit-out plan and budget rather than added reactively after occupation.</p>
<p>Fire and life-safety compliance must be evaluated for the intended use and storage profile. Product type, stacking height, packaging and operational processes can influence requirements. Tenants should obtain professional advice and relevant approvals where necessary. Existing building systems should not be assumed to cover a materially different use without confirmation.</p>

<h2>Understand the Complete Occupancy Cost</h2>
<p>Base rental is only one component of the property cost. Build a comparison that includes operating costs, rates or recoveries where applicable, utilities, parking, security contributions, insurance requirements and value-added tax. Add once-off expenses such as professional fees, deposits, relocation, racking, office alterations, connectivity, signage and equipment installation.</p>
<p>Operational differences should also be given a financial value. A building that improves storage density, reduces forklift travel, shortens delivery routes or avoids an additional shift may justify a different rental level. Conversely, a low asking rental can be offset by poor layout, excessive office space, power upgrades or inefficient transport. Compare scenarios over the expected lease term rather than only the first month.</p>
<p>Confirm how utilities are measured and billed, which maintenance obligations sit with each party and how reinstatement will work at the end of the lease. Review escalation, renewal rights, access dates, beneficial occupation and any conditions linked to landlord works. Commercial and legal advisers should review the final lease and schedules.</p>

<h2>A Practical Warehouse Shortlisting Process</h2>
<p>Create a weighted scorecard before inspecting properties. Essential criteria might include location, minimum clear height, yard dimensions, door configuration, power, fire compliance and budget. Secondary criteria may include office finishes, signage visibility, nearby amenities or expansion options. Weighting prevents a visually impressive feature from distracting the team from an operational requirement.</p>
<p>During the first inspection, record dimensions, take notes against the scorecard and photograph areas requiring follow-up. Walk the route from the estate entrance to the loading doors. Inspect the warehouse floor, lowest roof obstructions, columns, offices, ablutions, yard, parking and service areas. Ask which information is confirmed and which remains subject to technical verification.</p>
<p>For shortlisted buildings, conduct a second inspection with the relevant specialists. That may include operations, racking, fire, electrical, IT, security, finance and legal representatives. Test a draft layout, list landlord and tenant works, establish a programme and identify approvals. The objective is to remove expensive uncertainty before commitments are signed.</p>
<p>Midpoint’s leasing team can provide current availability, available specifications and access for inspections. Because live inventory changes, this guide should be used together with the current vacancy schedule rather than as a promise that a particular size or configuration remains available.</p>

<h2>What to Prepare Before Contacting the Leasing Team</h2>
<p>A concise requirement brief makes the leasing discussion faster and more useful. Include the preferred occupation date, target lease term, current and future area, warehouse-to-office ratio, required clear height, racking or stacking method, vehicle types, daily vehicle count, door and dock needs, yard requirement, power demand, parking, staff numbers, operating hours and any specialised use.</p>
<p>Also disclose constraints that could affect suitability, such as hazardous materials, food handling, refrigeration, high water use, emissions, noise, heavy machinery or unusual floor loads. Early clarity helps the team identify realistic options and the professional approvals that may be required.</p>
<p>If the exact requirement is still developing, begin with ranges and priorities. A leasing conversation and initial site visit can help refine the brief. The goal is not to force the business into a generic warehouse, but to understand which available or upcoming Midpoint opportunity best supports the operation.</p>
$content$,
  $faqs$[
    {"question":"What warehouse space is available to rent at Midpoint?","answer":"Availability changes as leases are concluded and new opportunities are prepared. The live vacancy section on this page shows currently published Warehouse-sector listings. Contact the Midpoint leasing team for the latest schedule, specifications, asking rentals and inspection access."},
    {"question":"Where is Midpoint located?","answer":"Midpoint is in Halfway House, Midrand, on the commercial corridor between Johannesburg and Pretoria. Tenants should test the complete route to their customers, suppliers and workforce at relevant operating times."},
    {"question":"What businesses could consider a Midpoint warehouse?","answer":"Depending on the specifications of the available building, Midpoint may suit storage, distribution, logistics, adaptable industrial and selected light-manufacturing operations. Suitability must be confirmed against the tenant's use, equipment, approvals and technical requirements."},
    {"question":"Do the warehouses include office space?","answer":"Several warehouse opportunities include an integrated office component. The office-to-warehouse ratio differs by building, so occupiers should compare the available layout with their administration, management, meeting and staff-facility requirements."},
    {"question":"Are dock levellers and roller shutter doors available?","answer":"Loading configurations vary. Some opportunities may include on-grade roller shutter access, dock levellers or a combination. Door dimensions, quantities, approach space and yard circulation should be confirmed for the specific property."},
    {"question":"How should a tenant calculate the warehouse size required?","answer":"Calculate storage positions and then add receiving, staging, picking, packing, dispatch, returns, equipment, safe aisles, staff facilities and offices. Test the result on a dimensioned plan because clear height, columns and door positions affect usable capacity."},
    {"question":"Is backup power available?","answer":"Resilience arrangements depend on the particular building and the loads that need support. Confirm the supply, backup capacity, changeover arrangement and which tenant systems will remain operational before relying on backup power in a continuity plan."},
    {"question":"Can large trucks access the warehouse yards?","answer":"Vehicle access must be assessed for each building. Confirm gate routes, yard depth, turning circles, queuing, dock approach and conflicts with parking or pedestrians using the largest vehicle expected to visit regularly."},
    {"question":"What should be checked during a warehouse inspection?","answer":"Inspect the route, yard, loading doors, floor, clear height, columns, office component, power, fire systems, security, parking and service areas. Bring operational and technical specialists back for a detailed second inspection before committing."},
    {"question":"What costs should be compared besides rental?","answer":"Include operating costs, recoveries, utilities, parking, security contributions, insurance requirements and VAT where applicable. Add fit-out, racking, relocation, connectivity, deposits, professional fees and eventual reinstatement costs."},
    {"question":"Does Midpoint have amenities for warehouse teams?","answer":"Midpoint combines industrial and commercial premises with amenities and outdoor spaces that support the wider working day. Review the current amenities page and assess how those facilities fit the needs and shift patterns of your team."},
    {"question":"How do I arrange a warehouse viewing?","answer":"Use the enquiry form or contact the Midpoint leasing team. Share your occupation date, area range, vehicle profile, clear-height, loading, yard, office, power and parking requirements so the team can identify the most relevant options."}
  ]$faqs$::jsonb,
  'Frequently asked questions about warehouse space in Midrand',
  $features$[
    {"heading":"A connected Midrand logistics position","text":"Assess a central Gauteng location against your real customer, supplier and staff routes. Midpoint sits between Johannesburg and Pretoria with access to the wider regional network.","image":"/images/pillars/warehouses/midrand-logistics-location.webp","alt":"Aerial view of modern warehouses beside a major Gauteng highway and logistics corridor"},
    {"heading":"Integrated warehouse and office environments","text":"Keep operational, administration and management teams connected. Compare each building's office-to-warehouse ratio with the way your people work.","image":"/images/pillars/warehouses/integrated-warehouse-offices.webp","alt":"Glass-fronted offices integrated with a high-volume warehouse and pallet racking"},
    {"heading":"Resilience planned around critical loads","text":"Confirm supply and backup arrangements against the equipment and systems your operation cannot afford to lose during an interruption.","image":"/images/pillars/warehouses/backup-power-generator.webp","alt":"Backup generator installed beside a modern industrial warehouse"},
    {"heading":"Between Johannesburg and Pretoria","text":"Map deliveries, collections and staff travel across the corridor. Centrality is most valuable when it works for the routes and operating times that matter to your business.","image":"/images/pillars/warehouses/johannesburg-pretoria-corridor.webp","alt":"Route illustration showing Midrand positioned between Johannesburg and Pretoria"},
    {"heading":"A requirement-led leasing process","text":"Inspect with a clear operational brief, then bring the right technical specialists back to verify layouts, services, compliance and planned works.","image":"/images/pillars/warehouses/warehouse-site-inspection.webp","alt":"Leasing and operations professionals inspecting a warehouse facility"},
    {"heading":"Loading infrastructure matched to vehicle flow","text":"Evaluate dock levellers, on-grade access, door positions, staging areas and yard circulation as one complete goods-movement system.","image":"/images/pillars/warehouses/dock-leveller-loading-access.webp","alt":"Dock leveller providing direct loading access into a racked warehouse"},
    {"heading":"Vertical capacity and efficient storage","text":"Clear height can unlock additional storage capacity when racking, slabs, fire systems and handling equipment are designed to support it.","image":"/images/pillars/warehouses/high-eaves-racking.webp","alt":"High-eaves warehouse interior fitted with tall pallet racking and clear aisles"}
  ]$features$::jsonb,
  $considerations$[
    {"heading":"Usable capacity","text":"Test racking, staging, aisles, columns and clear height on an accurate plan instead of comparing gross area alone."},
    {"heading":"Vehicle circulation","text":"Confirm gate access, turning space, queuing, loading approach and pedestrian separation for the largest regular vehicle."},
    {"heading":"Power and continuity","text":"Match supply and backup capacity to a documented equipment schedule and the systems that must continue operating."},
    {"heading":"Complete occupancy cost","text":"Compare rental together with recoveries, utilities, fit-out, racking, relocation, professional fees and reinstatement."},
    {"heading":"People and offices","text":"Balance operational space with offices, parking, staff facilities, commuting patterns and access to amenities."},
    {"heading":"Compliance and approvals","text":"Verify fire, safety, environmental and use-specific requirements with the appropriate professional advisers."}
  ]$considerations$::jsonb,
  'WAREHOUSE',
  'Current warehouse availability at Midpoint',
  'Review live warehouse opportunities currently published for Midpoint. Confirm final areas, specifications, rates and availability with the leasing team.',
  TRUE,
  'Discuss your warehouse requirement with the Midpoint leasing team',
  'Share your size, loading, yard, power, office, parking and occupation requirements. We will help you identify the most relevant available or upcoming warehouse opportunities and arrange a site inspection.',
  $links$[
    {"label":"View current vacancies","href":"/vacancies"},
    {"label":"Explore offices at Midpoint","href":"/offices"},
    {"label":"Amenities and the working day","href":"/amenities"},
    {"label":"About Midpoint and Blend Property Group","href":"/about-us"},
    {"label":"Download the availability report","href":"/availability-report"},
    {"label":"Contact the leasing team","href":"/contact-us"}
  ]$links$::jsonb,
  'Boitumelo',
  'Leasing Manager, Midpoint',
  'Boitumelo supports businesses and commercial property brokers evaluating office and warehouse opportunities at Midpoint, including requirements, availability and property inspections.',
  'Boitumelo',
  NOW(),
  NOW() + INTERVAL '6 months',
  'DRAFT',
  FALSE,
  'Warehouses to Rent in Midrand | Midpoint',
  'Compare warehouses to rent in Midrand at Midpoint: location, clear height, loading, yards, power and live availability. Arrange a site inspection.',
  'warehouse space Midrand',
  'Warehouses to Rent in Midrand | Midpoint',
  'A practical guide to warehouse space in Midrand, including location, storage capacity, loading, yards, power, costs and current availability.',
  '/images/pillars/warehouses/warehouse-exterior.webp',
  TRUE,
  NOW(),
  NOW()
)
ON CONFLICT ("slug") DO NOTHING;

