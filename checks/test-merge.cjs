const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('dist/app.js', 'utf8');
const start = source.indexOf('function collapseRows');
const end = source.indexOf("$('confirmImport')", start);
if (start < 0 || end < 0) throw new Error('merge functions not found');

const row = (date, campaign, spend, revenue, purchases, clicks, impressions) =>
  ({ date, campaign, spend, revenue, purchases, clicks, impressions });
const context = {
  existing: [
    row('2026-09-01', '파워링크', 10000, 40000, 2, 20, 1000),
    row('2026-09-01', '쇼핑검색', 20000, 100000, 4, 40, 2000),
  ],
  incoming: [
    row('2026-09-01', '파워링크', 12000, 60000, 3, 24, 1200),
    row('2026-09-02', '파워링크', 15000, 90000, 4, 30, 1500),
  ],
};
vm.createContext(context);
vm.runInContext(`${source.slice(start, end)}\nresult = mergeRows(existing, incoming);`, context);

if (context.result.added !== 1 || context.result.updated !== 1) throw new Error('add/update counts are wrong');
if (context.result.rows.length !== 3) throw new Error('overlap was duplicated');
const updated = context.result.rows.find(r => r.date === '2026-09-01' && r.campaign === '파워링크');
if (updated.spend !== 12000 || updated.revenue !== 60000) throw new Error('overlap was not replaced');
const totalSpend = context.result.rows.reduce((sum, r) => sum + r.spend, 0);
if (totalSpend !== 47000) throw new Error('stored totals are wrong');

console.log(JSON.stringify({ rows: context.result.rows.length, added: context.result.added, updated: context.result.updated, totalSpend }));
