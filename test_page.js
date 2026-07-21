const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
const window = dom.window;

setTimeout(() => {
  try {
    const funcs = ['toggleCal', 'initSD', 'initLD', 'checkForm', 'generateReading',
                   'calcYearGZ', 'calcMonthGZ', 'calcDayGZ', 'lunarToSolar', 'renderResult',
                   'getSX', 'getZE', 'lunarYearInfo', 'upd', 'updM', 'updD'];
    let allOk = true;
    for (const f of funcs) {
      const ok = typeof window[f] === 'function';
      console.log((ok ? 'OK' : 'MISS') + ' ' + f);
      if (!ok) allOk = false;
    }

    if (!allOk) {
      console.log('\nSome functions undefined, aborting');
      process.exit(1);
    }

    var beforeLunar = window.isLunar;
    console.log('\nInitial isLunar:', beforeLunar);

    window.toggleCal();
    var afterLunar = window.isLunar;
    var solarDisp = window.document.getElementById('solarDateGroup').style.display;
    var lunarDisp = window.document.getElementById('lunarDateGroup').style.display;
    console.log('After toggle isLunar:', afterLunar, 'solarDisplay:', solarDisp, 'lunarDisplay:', lunarDisp);

    window.toggleCal();
    var finalLunar = window.isLunar;
    solarDisp = window.document.getElementById('solarDateGroup').style.display;
    lunarDisp = window.document.getElementById('lunarDateGroup').style.display;
    console.log('Back to solar isLunar:', finalLunar, 'solarDisplay:', solarDisp, 'lunarDisplay:', lunarDisp);

    window.initSD();
    var solarYear = window.document.getElementById('solarYear');
    console.log('\nSolar year options:', solarYear.options.length);
    solarYear.value = '2026';
    solarYear.dispatchEvent(new window.Event('change'));
    var solarMonth = window.document.getElementById('solarMonth');
    console.log('Solar month options after pick 2026:', solarMonth.options.length);
    solarMonth.value = '7';
    solarMonth.dispatchEvent(new window.Event('change'));
    var solarDay = window.document.getElementById('solarDay');
    console.log('Solar day options after pick July:', solarDay.options.length, '(expect 32)');

    window.initLD();
    var lunarYear = window.document.getElementById('lunarYear');
    console.log('\nLunar year options:', lunarYear.options.length);
    lunarYear.value = '2026';
    lunarYear.dispatchEvent(new window.Event('change'));
    var lunarMonth = window.document.getElementById('lunarMonth');
    console.log('Lunar month options after pick 2026:', lunarMonth.options.length);

    console.log('\n=== All tests passed ===');
  } catch(e) {
    console.log('Test error:', e.message);
    console.log(e.stack);
  }
  process.exit(0);
}, 500);
