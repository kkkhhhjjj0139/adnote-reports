const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('dist/app.js', 'utf8');
const start = source.indexOf('function changeLabel');
const end = source.indexOf('function renderWeeks', start);
if (start < 0 || end < 0) throw new Error('week comparison function not found');
const context = {};
vm.createContext(context);
vm.runInContext(`${source.slice(start, end)}\nup=changeLabel(120,100,true);down=changeLabel(75,100,true);same=changeLabel(100,100,true);missing=changeLabel(100,0,true);`, context);
if (context.up.text !== '전주 대비 20.0% 증가' || context.up.tone !== 'up') throw new Error('increase label failed');
if (context.down.text !== '전주 대비 25.0% 감소' || context.down.tone !== 'down') throw new Error('decrease label failed');
if (context.same.text !== '전주 대비 변동 없음') throw new Error('same label failed');
if (context.missing.text !== '전주 대비 비교 불가') throw new Error('zero baseline handling failed');
console.log(JSON.stringify({ up: context.up.text, down: context.down.text, same: context.same.text, missing: context.missing.text }));
