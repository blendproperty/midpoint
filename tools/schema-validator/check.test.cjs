const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateHtml, sitemapUrls } = require('./check.cjs');
const script = node => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...node })}</script>`;

test('default-graph references across scripts resolve without hiding invalid properties/ranges', () => {
  const html = script({ '@type': 'WebPage', isPartOf: { '@id': 'https://example.com/#site' } }) + script({ '@id': 'https://example.com/#site', '@type': 'WebSite', name: 'Example' });
  assert.deepEqual(validateHtml(html).errors, []);
  assert.deepEqual(validateHtml(html + script({ '@type': 'ItemList', itemListElement: { '@type': 'ListItem', item: { '@type': 'WebPage', isPartOf: { '@id': 'https://example.com/#site' } } } })).errors, []);
  assert.ok(validateHtml(script({ '@type': 'MadeUpType' })).errors.length);
  assert.ok(validateHtml(script({ '@type': 'WebPage', madeUpProperty: true })).errors.length);
  assert.ok(validateHtml(script({ '@type': 'WebPage', publisher: { '@type': 'Product' } })).errors.length);
  assert.ok(validateHtml(script({ '@type': 'SelfStorage', branchOf: { '@type': 'Organization' } })).warnings.length);
  const graph = { '@graph': [{ '@type': 'WebPage', about: { '@id': '#store' } }, { '@id': '#store', '@type': 'SelfStorage', branchOf: { '@type': 'Organization' } }] };
  assert.ok(validateHtml(script(graph)).warnings.some(w => w.property === 'branchOf'));
  assert.ok(validateHtml(script({ '@graph': [{ '@type': 'WebPage', about: { '@id': '#store' } }, { '@id': '#store', '@type': 'SelfStorage', madeUpProperty: true }] })).errors.length);
});

test('missing/malformed schema and unsupported contexts fail closed', () => {
  assert.throws(() => validateHtml('<html>No markup</html>'));
  assert.throws(() => validateHtml('<script type="application/ld+json">{bad}</script>'));
  assert.throws(() => validateHtml(script({ '@context': 'https://other.test', '@type': 'WebPage' })));
  assert.throws(() => validateHtml(script({ '@graph': [] })));
});

test('public sitemap discovery rejects offsite, private and query URLs', () => {
  const xml = url => `<urlset><url><loc>${url}</loc></url></urlset>`;
  assert.deepEqual(sitemapUrls(xml('https://stor24.co.za/contact'), 'https://stor24.co.za'), ['https://stor24.co.za/contact']);
  for (const url of ['https://elsewhere.test/', 'https://stor24.co.za/book', 'https://stor24.co.za/micro-warehousing/book', 'https://stor24.co.za/?email=x']) assert.throws(() => sitemapUrls(xml(url), 'https://stor24.co.za'));
  assert.throws(() => sitemapUrls('<sitemapindex/>', 'https://stor24.co.za'));
});
