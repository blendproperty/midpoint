const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cheerio = require('cheerio');

// 1.0.1 omits dist/data; supply the reviewed, pinned official vocabulary offline.
const vocabulary = fs.readFileSync(path.join(__dirname, 'vocabulary.json'));
const expectedHash = fs.readFileSync(path.join(__dirname, 'vocabulary.sha256'), 'utf8').trim();
assert.equal(crypto.createHash('sha256').update(vocabulary).digest('hex'), expectedHash);
const dataDir = path.join(path.dirname(require.resolve('schemacraft-validator')), 'data');
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, 'schemaorg-current-https.jsonld'), vocabulary);
const { validateMarkup } = require('schemacraft-validator');

function validateHtml(html) {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');
  assert.ok(scripts.length, 'No JSON-LD found');
  const nodes = [];
  scripts.each((_, script) => {
    const block = JSON.parse($(script).html());
    assert.ok(block && !Array.isArray(block), 'Expected a Schema.org object');
    assert.ok(['https://schema.org', 'https://schema.org/', 'http://schema.org'].includes(block['@context']), 'Unsupported JSON-LD context; review before extending this adapter');
    // Preserve semantics: these sites use a single default graph, never named graphs.
    if (block['@graph']) {
      assert.deepEqual(Object.keys(block).sort(), ['@context', '@graph']);
      assert.ok(Array.isArray(block['@graph']));
      nodes.push(...block['@graph']);
    } else {
      const node = { ...block };
      delete node['@context'];
      nodes.push(node);
    }
  });
  const typesById = new Map();
  const definitions = new Set(nodes);
  const walk = (value, visit, depth = 0) => {
    assert.ok(depth < 100, 'Schema nesting exceeds adapter limit');
    if (!value || typeof value !== 'object') return;
    if (value['@context']) assert.ok(['https://schema.org', 'https://schema.org/', 'http://schema.org'].includes(value['@context']), 'Unsupported nested context');
    visit(value);
    for (const child of Object.values(value)) walk(child, visit, depth + 1);
  };
  walk(nodes, node => {
    if (node['@type']) definitions.add(node);
    if (node['@id'] && node['@type']) typesById.set(node['@id'], node['@type']);
  });
  // Upstream also misses deeply nested references; reuse only a declared local type.
  walk(nodes, node => {
    if (Object.keys(node).length === 1 && node['@id'] && typesById.has(node['@id'])) node['@type'] = typesById.get(node['@id']);
  });
  // Validate each declared definition separately: upstream's shared visited-ID
  // cache can otherwise skip a full definition after seeing a typed reference.
  const results = [...definitions].map(node => validateMarkup(`<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...node }).replace(/</g, '\\u003c')}</script>`));
  const errors = results.flatMap(r => r.errors);
  const warnings = results.flatMap(r => r.warnings);
  assert.ok(results.some(r => r.summary.totalEntities), 'No schema entities extracted');
  return { errors, warnings, summary: { validatedDefinitions: definitions.size, errorCount: errors.length, warningCount: warnings.length } };
}

function sitemapUrls(xml, origin) {
  const $ = cheerio.load(xml, { xmlMode: true });
  assert.equal($('sitemapindex').length, 0, 'Sitemap indexes need explicit review');
  const urls = $('urlset > url > loc').map((_, el) => $(el).text().trim()).get();
  assert.ok(urls.length && urls.length <= 500, 'Missing or unexpectedly large public sitemap');
  assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URL');
  for (const value of urls) {
    const url = new URL(value);
    assert.ok(url.origin === origin && !url.search && !url.hash && !url.username && !url.password, 'Unexpected sitemap URL');
    assert.ok(!/\/(admin|api|book|pay|walk-in)(\/|$)/.test(url.pathname), 'Private route in public sitemap');
  }
  return urls;
}

async function get(url) {
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `HTTP error for ${url}`);
  return response.text();
}

async function main() {
  const origin = process.argv[2];
  assert.ok(['https://stor24.co.za', 'https://www.mid-point.co.za'].includes(origin), 'Usage: node tools/schema-validator/check.cjs <public site origin> [report.json]');
  const urls = sitemapUrls(await get(origin + '/sitemap.xml'), origin);
  const pages = [];
  for (const url of urls) {
    try {
      const result = validateHtml(await get(url));
      pages.push({ url, summary: result.summary, errors: result.errors, warnings: result.warnings });
    } catch (error) {
      pages.push({ url, errors: [{ message: error.message }], warnings: [] });
    }
  }
  const report = { at: new Date().toISOString(), validator: 'schemacraft-validator@1.0.1 with pinned vocabulary/default-graph adapter', origin, pages };
  const output = process.argv[3] || 'output/schema-validation.json';
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  const failed = pages.filter(p => p.errors.length || p.warnings.length);
  console.log(JSON.stringify({ pages: pages.length, failed: failed.length, report: output, findings: failed }, null, 2));
  process.exitCode = failed.length ? 1 : 0;
}

module.exports = { validateHtml, sitemapUrls };
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
