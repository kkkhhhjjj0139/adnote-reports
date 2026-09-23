const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('dist/app.js', 'utf8');
const start = source.indexOf('const fields=');
const end = source.indexOf("$('importButton')", start);
if (start < 0 || end < 0) throw new Error('column detection functions not found');

function detect(headers) {
  const context = { headers };
  vm.createContext(context);
  vm.runInContext(`${source.slice(start, end)}\nresult=fields.map(([key,,aliases])=>findHeaderIndex(headers,aliases,key));`, context);
  return context.result;
}

const expected = [0, 1, 5, 7, 6, 3, 2];
const english = detect(['Date', 'Campaign Name', 'Impression', 'Click', 'Click-through rate', 'Cost', 'Conversion count', 'Sales by conversion']);
const korean = detect(['보고서 일자', '캠페인 이름', '노출수(회)', '클릭수', '클릭률(%)', '총비용(VAT 포함)', '구매 완료 수', '구매 완료 매출액']);
if (JSON.stringify(english) !== JSON.stringify(expected)) throw new Error(`English detection failed: ${english}`);
if (JSON.stringify(korean) !== JSON.stringify(expected)) throw new Error(`Korean detection failed: ${korean}`);

const metrics = source.match(/const metrics=\[(.*?)\];/s)?.[1] || '';
const labels = ['노출수', '클릭수', '클릭률', '광고비', '구매완료수', 'ROAS'];
let position = -1;
for (const label of labels) {
  const next = metrics.indexOf(`'${label}'`, position + 1);
  if (next < 0) throw new Error(`metric order missing ${label}`);
  position = next;
}
if (metrics.includes("'구매완료 매출'")) throw new Error('unexpected revenue card remains');

console.log(JSON.stringify({ english, korean, metrics: labels }));
