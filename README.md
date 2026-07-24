# Midpoint — Next.js rebuild (Phase 1 scaffold)

## What's here
- Next.js 15 (App Router) + Tailwind CSS
- Shared `Nav` / `Footer` components (content ported from live site)
- `PillarCard` component — a true CSS Grid card row (4 equal columns,
  equal height) that structurally can't suffer the shared-class corruption
  bug hit in Webflow tonight
- `/insights` page fully wired as a working example
- `/` homepage stub — needs remaining sections ported

## Before running
1. `npm install`
2. Replace placeholder colors in `tailwind.config.ts` with exact hex values
   from Webflow's Style Manager (Site Settings -> Style Guide, or click each
   swatch used by `u-surface-cyan_black`, `mid-cyan-block`, `Button 5`, etc.
   to copy its hex)
3. Confirm the actual font family/weights used (Site Settings -> Fonts) and
   update `--font-primary` in `app/globals.css`
4. `npm run dev` to preview at localhost:3000

## Next steps (see full scope doc)
- Port remaining pillar pages: /offices, /warehouses, /amenities,
  /business-park-midrand (new), /location (new), /serviced-offices (new)
- Wire the listings API (listings.blendproperty.co.za) into the inventory
  sections — need API docs/auth from Brett
- Port homepage sections: hero carousel, amenities grid, tenant logos, FAQ
  accordion, contact form + map embed
- JSON-LD schema per page (several already scripted this session)
- sitemap.xml / robots.txt
- Deploy to Vercel, connect GoDaddy DNS at cutover
