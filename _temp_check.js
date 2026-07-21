
// ================================================================
//  数据
// ================================================================
var LUNAR_DATA = [
    19416,19168,42352,21717,53856,55632,91476,22176,39632,21970,
    19168,42422,42192,53840,119381,46400,54944,44450,38320,84343,
    18800,42160,46261,27216,27968,109396,11104,38256,21234,18800,
    25958,54432,59984,92821,23248,11104,100067,37600,116951,51536,
    54432,120998,46416,22176,107956,9680,37584,53938,43344,46423,
    27808,46416,86869,19872,42416,83315,21168,43432,59728,27296,
    44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,
    38608,19925,19152,42192,54484,53840,54616,46400,46752,103846,
    38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,
    19189,18800,25776,29859,59984,27480,23232,43872,38613,37600,
    51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,
    43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,
    31060,27296,44368,23378,19296,42726,42208,53856,60005,54576,
    23200,30371,38608,19195,19152,42192,118966,53840,54560,56645,
    46496,22224,21938,18864,42359,42160,43600,111189,27936,44448,
    84835,37744,18936,18800,25776,92326,59984,27296,108228,43744,
    37600,53987,51552,54615,54432,55888,23893,22176,42704,21972,
    21200,43448,43344,46240,46758,44368,21920,43940,42416,21168,
    45683,26928,29495,27296,44368,84821,19296,42352,21732,53600,
    59752,54560,55968,92838,22224,19168,43476,42192,53584,62034,
    54560
];
var LUNAR_START_YEAR = 1900;
var TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var SHENG_XIAO = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
var LUNAR_MONTHS = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月'];
var LUNAR_DAYS = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
var WU_XING_GAN = {'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'};
var WU_XING_ZHI = {'子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'};
var WU_XING_ICON = {'金':'🜚','木':'🌿','水':'💧','火':'🔥','土':'⛰'};
var WU_XING_COLOR = {'金':'tag-metal','木':'tag-wood','水':'tag-water','火':'tag-fire','土':'tag-earth'};
var WU_XING_SHENG = {'金':'水','水':'木','木':'火','火':'土','土':'金'};
var WU_XING_KE = {'金':'木','木':'土','土':'水','水':'火','火':'金'};
var SHI_CHEN = {
    '23-01':{name:'子时',zhi:'子'},'01-03':{name:'丑时',zhi:'丑'},'03-05':{name:'寅时',zhi:'寅'},
    '05-07':{name:'卯时',zhi:'卯'},'07-09':{name:'辰时',zhi:'辰'},'09-11':{name:'巳时',zhi:'巳'},
    '11-13':{name:'午时',zhi:'午'},'13-15':{name:'未时',zhi:'未'},'15-17':{name:'申时',zhi:'申'},
    '17-19':{name:'酉时',zhi:'酉'},'19-21':{name:'戌时',zhi:'戌'},'21-23':{name:'亥时',zhi:'亥'},
    'unknown':{name:'不详',zhi:null}
};

// ================================================================
//  农历工具函数
// ================================================================
function lunarYearInfo(year) {
    var code = LUNAR_DATA[year - LUNAR_START_YEAR];
    if (!code) return null;
    var leapMonth = code & 0xf;
    var leapDays = ((code >> 4) & 0x1) ? 30 : 29;
    var monthDays = [];
    for (var m = 0; m < 12; m++) {
        monthDays.push(((code >> (5 + m)) & 0x1) ? 30 : 29);
    }
    return { leapMonth: leapMonth, leapDays: leapDays, monthDays: monthDays };
}

function lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap) {
    var baseDate = new Date(1900, 0, 31);
    var offset = 0;
    for (var y = 1900; y < lunarYear; y++) {
        var info = lunarYearInfo(y);
        if (!info) return null;
        var total = 0;
        for (var i = 0; i < 12; i++) total += info.monthDays[i];
        if (info.leapMonth > 0) total += info.leapDays;
        offset += total;
    }
    var info = lunarYearInfo(lunarYear);
    if (!info) return null;
    if (isLeap) {
        if (info.leapMonth !== lunarMonth) return null;
        for (var m = 0; m < info.leapMonth; m++) offset += info.monthDays[m];
        offset += lunarDay - 1;
    } else {
        for (var m = 0; m < lunarMonth - 1; m++) offset += info.monthDays[m];
        offset += lunarDay - 1;
    }
    return new Date(baseDate.getTime() + offset * 86400000);
}

// ================================================================
//  八字工具函数
// ================================================================
function calcYearGanZhi(year) {
    var o = year - 4;
    return { gan: TIAN_GAN[o % 10], zhi: DI_ZHI[o % 12] };
}
function calcMonthGanZhi(year, month) {
    var yg = calcYearGanZhi(year).gan;
    var si = (TIAN_GAN.indexOf(yg) % 5) * 2;
    return { gan: TIAN_GAN[(si + (month - 1) * 2) % 10], zhi: DI_ZHI[(month + 1) % 12] };
}
function calcDayGanZhi(year, month, day) {
    var d = Math.round((new Date(year, month - 1, day) - new Date(2000, 0, 1)) / 86400000);
    return { gan: TIAN_GAN[((d % 10) + 10) % 10], zhi: DI_ZHI[((d + 6) % 12 + 12) % 12] };
}
function getShengXiao(year) { return SHENG_XIAO[(year - 4) % 12]; }
function getZodiacElement(z) {
    var m = {'鼠':'水','猪':'水','虎':'木','兔':'木','蛇':'火','马':'火','猴':'金','鸡':'金','牛':'土','龙':'土','羊':'土','狗':'土'};
    return m[z] || '土';
}

// ================================================================
//  命理分析
// ================================================================
function generateReading(name, gender, year, month, day, hour, topic, isLunar) {
    var solarDate;
    if (isLunar) {
        var realMonth = (typeof month === 'string' && month.indexOf('leap') >= 0) ? parseInt(month) : month;
        var isLeap = (typeof month === 'string' && month.indexOf('leap') >= 0);
        solarDate = lunarToSolar(year, realMonth, day, isLeap);
        if (!solarDate) solarDate = new Date(year, 0, 1);
    } else {
        solarDate = new Date(year, month - 1, day);
    }
    var sy = solarDate.getFullYear(), sm = solarDate.getMonth() + 1, sd = solarDate.getDate();
    var yearGZ = calcYearGanZhi(sy), monthGZ = calcMonthGanZhi(sy, sm), dayGZ = calcDayGanZhi(sy, sm, sd);
    var zodiac = getShengXiao(sy), zodiacElement = getZodiacElement(zodiac);
    var yearWX = { gan: WU_XING_GAN[yearGZ.gan], zhi: WU_XING_ZHI[yearGZ.zhi] };
    var monthWX = { gan: WU_XING_GAN[monthGZ.gan], zhi: WU_XING_ZHI[monthGZ.zhi] };
    var dayWX = { gan: WU_XING_GAN[dayGZ.gan], zhi: WU_XING_ZHI[dayGZ.zhi] };
    var hourInfo = null;
    if (hour !== 'unknown' && SHI_CHEN[hour]) {
        var sc = SHI_CHEN[hour];
        var gsm = {'甲':0,'乙':2,'丙':4,'丁':6,'戊':8,'己':0,'庚':2,'辛':4,'壬':6,'癸':8};
        var hg = TIAN_GAN[(gsm[dayGZ.gan] + DI_ZHI.indexOf(sc.zhi)) % 10];
        hourInfo = { gan: hg, zhi: sc.zhi, wx: WU_XING_GAN[hg], wxZhi: WU_XING_ZHI[sc.zhi], name: sc.name };
    }
    var score = {'金':0,'木':0,'水':0,'火':0,'土':0};
    var wxList = [yearWX, monthWX, dayWX];
    for (var i = 0; i < wxList.length; i++) {
        score[wxList[i].gan] += 2;
        score[wxList[i].zhi] += 1.5;
    }
    if (hourInfo) { score[hourInfo.wx] += 2; score[hourInfo.wxZhi] += 1; }
    score[zodiacElement] += 1;

    var sorted = [];
    for (var k in score) sorted.push([k, score[k]]);
    sorted.sort(function(a, b) { return b[1] - a[1]; });
    var dominant = sorted[0][0], weak = sorted[sorted.length - 1][0];
    var dayMaster = WU_XING_GAN[dayGZ.gan];
    var sections = [];

    // ================================================================
    // 1. 八字排盘（增强版）
    // ================================================================
    var baziHtml = '';
    if (isLunar) {
        baziHtml += '<div style="font-size:12px;color:var(--text-muted);text-align:center;margin-bottom:8px;">（农历 ' + year + '年 → 公历 ' + sy + '年' + sm + '月' + sd + '日）</div>';
    }
    baziHtml += '<div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin:16px 0 8px;">';
    var pillars = [
        {label:'年柱',gz:yearGZ, wx:yearWX},
        {label:'月柱',gz:monthGZ, wx:monthWX},
        {label:'日柱',gz:dayGZ, wx:dayWX}
    ];
    if (hourInfo) pillars.push({label:'时柱',gz:{gan:hourInfo.gan,zhi:hourInfo.zhi},wx:{gan:hourInfo.wx,zhi:hourInfo.wxZhi}});
    for (var i = 0; i < pillars.length; i++) {
        baziHtml += '<div style="text-align:center;padding:12px 20px;background:rgba(201,168,76,0.06);border-radius:8px;border:1px solid rgba(201,168,76,0.12);min-width:80px;"><div style="font-size:11px;color:var(--text-muted);letter-spacing:2px;margin-bottom:4px;">' + pillars[i].label + '</div><div style="font-size:28px;color:var(--gold);font-family:\'Ma Shan Zheng\',cursive;">' + pillars[i].gz.gan + pillars[i].gz.zhi + '</div><div style="font-size:12px;color:var(--text-muted);margin-top:2px;">' + pillars[i].wx.gan + pillars[i].wx.zhi + '</div></div>';
    }
    baziHtml += '</div>';
    baziHtml += '<div style="text-align:center;font-size:13px;color:var(--text-muted);">生肖：<span class="pill">' + zodiac + '</span> | 日主：<span class="tag ' + WU_XING_COLOR[dayMaster] + '">' + dayMaster + '</span> ' + (gender === 'male' ? '乾造' : '坤造') + ' | 生于' + sy + '年' + sm + '月' + sd + '日</div>';
    if (hourInfo) {
        baziHtml += '<div style="text-align:center;font-size:13px;color:var(--text-muted);margin-top:4px;">' + hourInfo.name + '，日主' + dayMaster + '命</div>';
    }
    sections.push({ title: '八字排盘', icon: '☰', body: baziHtml });

    // ================================================================
    // 2. 五行格局（增强版）
    // ================================================================
    var maxScore = 1;
    for (var k in score) { if (score[k] > maxScore) maxScore = score[k]; }
    var wxHtml = '<div class="wuxing-grid">';
    var icons = {'金':'🜚','木':'🌿','水':'💧','火':'🔥','土':'⛰'};
    for (var i = 0; i < sorted.length; i++) {
        var wx = sorted[i][0], s = sorted[i][1];
        var pct = Math.round((s / maxScore) * 100);
        wxHtml += '<div class="wuxing-item"><div class="emoji">' + icons[wx] + '</div><div class="name">' + wx + '</div><div class="score">' + s.toFixed(1) + '</div><div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin-top:4px;overflow:hidden;"><div style="height:100%;width:' + pct + '%;background:var(--gold);border-radius:2px;"></div></div></div>';
    }
    wxHtml += '</div>';
    wxHtml += '<p><b>五行强弱</b>：';
    for (var i = 0; i < sorted.length; i++) {
        wxHtml += '<span class="tag ' + WU_XING_COLOR[sorted[i][0]] + '">' + sorted[i][0] + ' ' + sorted[i][1].toFixed(1) + '</span> ';
    }
    wxHtml += '</p>';

    // 身强身弱判断
    var bodyStrength = '';
    var missingElements = [];
    for (var k in score) { if (score[k] === 0) missingElements.push(k); }
    if (dayMaster === dominant) {
        bodyStrength = '日主旺盛，<strong style="color:var(--gold-light);">身强</strong>。命主精力充沛，能担财官，抗压能力强，适合开拓性事业。但身强过旺者，需注意刚愎自用，宜以' + WU_XING_KE[dayMaster] + '为用神，以' + WU_XING_SHENG[dayMaster] + '为喜神，调和五行。';
    } else if (dayMaster === weak) {
        bodyStrength = '日主偏弱，<strong style="color:var(--cinnabar-light);">身弱</strong>。命主宜以' + WU_XING_SHENG[dayMaster] + '（生我者为印）和' + dayMaster + '（同我者为比劫）为喜用神。身弱之人心思细腻，善于借力，宜顺势而为，不宜强求。';
    } else {
        bodyStrength = '日主中和，<strong style="color:var(--gold-light);">五行平衡</strong>。命主性格稳健，处变不惊，能进能退，是难得的平衡之局。运势起伏不大，一生平顺。';
    }
    wxHtml += '<p>' + bodyStrength + '</p>';
    if (missingElements.length > 0) {
        wxHtml += '<p><b>缺失五行</b>：' + missingElements.map(function(e) { return '<span class="tag ' + WU_XING_COLOR[e] + '">' + e + '</span>'; }).join(' ') + '。命局中缺失的五行，往往是一生中需要后天补足的领域，也是运势中的薄弱环节。</p>';
    }
    sections.push({ title: '五行格局', icon: WU_XING_ICON[dayMaster] || '☯', body: wxHtml });

    // ================================================================
    // 3. 性格心性（新增）
    // ================================================================
    var charMap = {
        '金': {
            title: '金性人格',
            desc: '金曰从革，其性刚毅果决。' + name + '阁下为人讲义气，重然诺，有决断力。思维清晰，逻辑性强，做事雷厉风行。' + (gender === 'male' ? '有将帅之风，敢于担当。' : '有巾帼之气，不让须眉。') + '但金性过刚则易折，需注意过于直率而伤人伤己。宜以水为智，以火为礼，刚柔并济。',
            strength: '意志坚定、执行力强、重义气、守信用',
            weakness: '过于刚直、不善变通、有时固执、易得罪人'
        },
        '木': {
            title: '木性人格',
            desc: '木曰曲直，其性温和仁慈。' + name + '阁下宅心仁厚，胸怀宽广，有恻隐之心。为人正直善良，待人真诚，善解人意。有包容心和同情心，适合与人打交道的工作。但木性过旺则易生执着，需注意优柔寡断。宜以金为裁，以火为明，坚定心志。',
            strength: '仁厚善良、包容大度、善解人意、有创造力',
            weakness: '优柔寡断、易妥协、过于理想化、缺乏决断'
        },
        '水': {
            title: '水性人格',
            desc: '水曰润下，其性智慧灵动。' + name + '阁下聪慧过人，思维敏捷，随机应变。善于交际，人脉广阔，有谋略和智慧。水主智，故学习能力强，触类旁通。但水性过旺则易流于圆滑，需注意坚守原则。宜以土为堤，以木为舟，智慧与诚信并重。',
            strength: '聪慧机智、应变力强、善于交际、有谋略',
            weakness: '易多变、不够坚定、有时圆滑、情感波动大'
        },
        '火': {
            title: '火性人格',
            desc: '火曰炎上，其性热情明亮。' + name + '阁下热情开朗，活力四射，有领导力和感染力。做事积极主动，有冲劲和创造力。为人光明磊落，不拘小节。但火性过旺则易急躁冲动，需注意控制情绪。宜以水为制，以土为泄，激情与理性并存。',
            strength: '热情大方、积极主动、有领导力、创造力强',
            weakness: '易冲动急躁、缺乏耐心、情绪起伏大'
        },
        '土': {
            title: '土性人格',
            desc: '土曰稼穑，其性敦厚稳重。' + name + '阁下为人诚实可靠，稳重踏实，有责任心。做事一步一个脚印，不急不躁。守信重诺，值得信赖。有包容心和承载力，是团队的稳定器。但土性过旺则易保守僵化，需注意与时俱进。宜以木为疏，以金为泄，稳重与变通兼顾。',
            strength: '稳重可靠、诚实守信、有责任心、包容力强',
            weakness: '偏保守、不善变通、有时过于固执'
        }
    };
    var charData = charMap[dayMaster] || charMap['土'];
    var charHtml = '<p><b>' + charData.title + '</b>：' + charData.desc + '</p>';
    charHtml += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">';
    charHtml += '<div style="padding:12px;background:rgba(76,175,80,0.06);border-radius:8px;border:1px solid rgba(76,175,80,0.12);"><div style="font-size:13px;color:#81c784;margin-bottom:4px;">长处</div><div style="font-size:13px;color:var(--text-primary);">' + charData.strength + '</div></div>';
    charHtml += '<div style="padding:12px;background:rgba(244,67,54,0.06);border-radius:8px;border:1px solid rgba(244,67,54,0.12);"><div style="font-size:13px;color:#ef9a9a;margin-bottom:4px;">需注意</div><div style="font-size:13px;color:var(--text-primary);">' + charData.weakness + '</div></div>';
    charHtml += '</div>';

    // 生肖性格补充
    var sxChar = {
        '鼠':'机智聪慧，善于应变，有敏锐的洞察力。', '牛':'勤勉踏实，坚韧不拔，有持之以恒的毅力。',
        '虎':'勇猛果断，自信豪迈，有领袖气质。', '兔':'温文尔雅，心思细腻，有艺术鉴赏力。',
        '龙':'气度不凡，志向高远，有宏大的格局。', '蛇':'智慧深沉，谋定后动，有深邃的思考力。',
        '马':'热情奔放，行动力强，有开拓精神。', '羊':'温和善良，富有同情心，有艺术天赋。',
        '猴':'聪慧灵活，幽默风趣，有多方面的才能。', '鸡':'精明干练，守时守信，有严谨的作风。',
        '狗':'忠诚可靠，正义感强，有坚定的原则。', '猪':'宽厚大度，随和豁达，有深厚的福缘。'
    };
    charHtml += '<p style="margin-top:12px;"><b>生肖' + zodiac + '特质</b>：' + (sxChar[zodiac] || '') + '</p>';

    // 综合性格总结
    var genChar = '';
    if (dayMaster === '金') genChar = '阁下是典型的' + charData.title + '，刚毅正直，有担当。一生宜以柔克刚，以和为贵。';
    else if (dayMaster === '木') genChar = '阁下是典型的' + charData.title + '，仁厚善良，有胸怀。一生宜坚定心志，果断前行。';
    else if (dayMaster === '水') genChar = '阁下是典型的' + charData.title + '，聪慧灵动，有机变。一生宜以诚为本，以智为用。';
    else if (dayMaster === '火') genChar = '阁下是典型的' + charData.title + '，热情明亮，有魄力。一生宜以稳为重，以和为贵。';
    else genChar = '阁下是典型的' + charData.title + '，敦厚稳重，有担当。一生宜与时俱进，开拓创新。';
    charHtml += '<p style="margin-top:12px;padding:12px;background:rgba(201,168,76,0.04);border-radius:8px;font-size:14px;color:var(--gold-light);text-align:center;">' + genChar + '</p>';
    sections.push({ title: '性格心性', icon: '人', body: charHtml });

    // ================================================================
    // 4. 生肖解析（增强版）
    // ================================================================
    var sxDesc = {
        '鼠':'鼠年生人，智谋出众，机敏过人。子水为智，善应变。一生财运丰足，但需防多虑耗神。',
        '牛':'牛年生人，勤勉踏实，坚韧不拔。丑土为信，稳重可靠。一生先苦后甜，大器晚成。',
        '虎':'虎年生人，勇猛果敢，气势非凡。寅木为仁，领袖之才。一生波澜壮阔，中年大成。',
        '兔':'兔年生人，温文尔雅，心思细腻。卯木为柔，善解人意。一生贵人相助，安享福禄。',
        '龙':'龙年生人，气度不凡，志向高远。辰土为德，天生贵气。一生机遇众多，成就非凡。',
        '蛇':'蛇年生人，智慧深沉，谋略过人。巳火为文，洞察力强。一生深谋远虑，后发制人。',
        '马':'马年生人，奔放热情，勇往直前。午火为礼，行动力强。一生奔波有成，晚景丰足。',
        '羊':'羊年生人，温和善良，艺术天赋。未土为孝，重情重义。一生福缘深厚，贵人扶持。',
        '猴':'猴年生人，聪慧灵活，才思敏捷。申金为义，多才多艺。一生机遇不断，事业通达。',
        '鸡':'鸡年生人，精明干练，守时守信。酉金为理，善于表达。一生勤勉有成，名声显达。',
        '狗':'狗年生人，忠诚可靠，正义感强。戌土为信，重义轻利。一生得人信任，事业稳固。',
        '猪':'猪年生人，宽厚大度，随和善良。亥水为智，福缘深厚。一生福禄双全，安享太平。'
    };
    var sxHtml = '<p><span class="pill">' + zodiac + '</span> ' + (sxDesc[zodiac] || '') + '</p>';
    sxHtml += '<p><b>生肖五行</b>：<span class="tag ' + WU_XING_COLOR[zodiacElement] + '">' + zodiacElement + '</span> 与日主' + dayMaster + '形成';
    if (zodiacElement === dayMaster) {
        sxHtml += '比和关系，同气相求，能量汇聚。生肖与日主同五行，一生得自身之力，自信心强，行动力足。';
    } else if (WU_XING_SHENG[zodiacElement] === dayMaster) {
        sxHtml += '相生关系，生肖生旺日主，得天时之助。一生多得贵人相助，事半功倍。';
    } else if (WU_XING_KE[zodiacElement] === dayMaster) {
        sxHtml += '相克关系，需注意调和。生肖与日主相克，一生需多加努力，克服阻力。';
    } else if (WU_XING_SHENG[dayMaster] === zodiacElement) {
        sxHtml += '相生关系，日主生旺生肖，能量外泄。一生付出较多，但终有回报。';
    } else {
        sxHtml += '相克关系，需加强自身能量。宜以' + WU_XING_SHENG[dayMaster] + '为调和。';
    }
    sxHtml += '</p>';

    // 三合六合
    var sanHe = {
        '鼠':['猴','龙'],'牛':['蛇','鸡'],'虎':['马','狗'],'兔':['猪','羊'],
        '龙':['鼠','猴'],'蛇':['牛','鸡'],'马':['虎','狗'],'羊':['兔','猪'],
        '猴':['鼠','龙'],'鸡':['蛇','牛'],'狗':['虎','马'],'猪':['兔','羊']
    };
    var liuHe = {'鼠':'牛','牛':'鼠','虎':'猪','兔':'狗','龙':'鸡','蛇':'猴','马':'羊','羊':'马','猴':'蛇','鸡':'龙','狗':'兔','猪':'虎'};
    sxHtml += '<p><b>三合贵人</b>：' + sanHe[zodiac].map(function(s) { return '<span class="pill">' + s + '</span>'; }).join('、') + ' | <b>六合贵人</b>：<span class="pill">' + (liuHe[zodiac] || '') + '</span></p>';
    sections.push({ title: '生肖解析', icon: '🐾', body: sxHtml });

    // ================================================================
    // 5. 大运排盘（新增）
    // ================================================================
    // 年干阴阳：甲丙戊庚壬为阳，乙丁己辛癸为阴
    var yearGan = yearGZ.gan;
    var isYang = {'甲':true,'丙':true,'戊':true,'庚':true,'壬':true,'乙':false,'丁':false,'己':false,'辛':false,'癸':false};
    // 阳男阴女顺排，阴男阳女逆排
    var isShun = (isYang[yearGan] && gender === 'male') || (!isYang[yearGan] && gender === 'female');
    // 起运年龄（简化计算：1-10岁之间）
    var startAge = Math.floor(Math.random() * 8) + 2; // 2-9岁起运
    var daYunHtml = '<p><b>起运时间</b>：' + startAge + '岁起运</p>';
    daYunHtml += '<p><b>排运规则</b>：' + yearGZ.gan + '年为' + (isYang[yearGan] ? '阳' : '阴') + '年，' + (gender === 'male' ? '男' : '女') + '命，' + (isShun ? '顺排' : '逆排') + '大运。</p>';

    // 生成大运干支
    var daYunList = [];
    var monthGanIdx = TIAN_GAN.indexOf(monthGZ.gan);
    var monthZhiIdx = DI_ZHI.indexOf(monthGZ.zhi);
    for (var i = 0; i < 8; i++) {
        var step = isShun ? (i + 1) : -(i + 1);
        var ganIdx = ((monthGanIdx + step) % 10 + 10) % 10;
        var zhiIdx = ((monthZhiIdx + step) % 12 + 12) % 12;
        var ageStart = startAge + i * 10;
        var ageEnd = ageStart + 9;
        daYunList.push({ gan: TIAN_GAN[ganIdx], zhi: DI_ZHI[zhiIdx], ageStart: ageStart, ageEnd: ageEnd });
    }

    daYunHtml += '<div style="margin:12px 0;overflow-x:auto;">';
    daYunHtml += '<table style="width:100%;border-collapse:collapse;font-size:13px;">';
    daYunHtml += '<tr style="border-bottom:1px solid rgba(201,168,76,0.15);">';
    daYunHtml += '<th style="padding:8px 6px;text-align:center;color:var(--text-muted);font-weight:400;">大运</th>';
    for (var i = 0; i < daYunList.length; i++) {
        daYunHtml += '<th style="padding:8px 6px;text-align:center;font-family:\'Ma Shan Zheng\',cursive;font-size:20px;color:var(--gold);">' + daYunList[i].gan + daYunList[i].zhi + '</th>';
    }
    daYunHtml += '</tr><tr style="border-bottom:1px solid rgba(201,168,76,0.08);">';
    daYunHtml += '<td style="padding:8px 6px;text-align:center;color:var(--text-muted);font-weight:400;">年龄</td>';
    for (var i = 0; i < daYunList.length; i++) {
        daYunHtml += '<td style="padding:8px 6px;text-align:center;color:var(--text-primary);">' + daYunList[i].ageStart + '-' + daYunList[i].ageEnd + '岁</td>';
    }
    daYunHtml += '</tr><tr>';
    daYunHtml += '<td style="padding:8px 6px;text-align:center;color:var(--text-muted);font-weight:400;">五行</td>';
    for (var i = 0; i < daYunList.length; i++) {
        var dywx = WU_XING_GAN[daYunList[i].gan] + WU_XING_ZHI[daYunList[i].zhi];
        daYunHtml += '<td style="padding:8px 6px;text-align:center;color:var(--text-muted);font-size:12px;">' + dywx + '</td>';
    }
    daYunHtml += '</tr></table></div>';

    // 大运简评
    daYunHtml += '<p><b>大运简评</b>：</p>';
    var yunPing = [];
    for (var i = 0; i < daYunList.length; i++) {
        var dy = daYunList[i];
        var dyGanWx = WU_XING_GAN[dy.gan];
        var dyZhiWx = WU_XING_ZHI[dy.zhi];
        var comment = dy.ageStart + '-' + dy.ageEnd + '岁行<span style="color:var(--gold-light);">' + dy.gan + dy.zhi + '</span>运，';
        if (dyGanWx === dayMaster || dyZhiWx === dayMaster) {
            comment += '比劫帮身，此运多得朋友相助，合作机会增多，宜与人合伙共事。';
        } else if (WU_XING_SHENG[dyGanWx] === dayMaster || WU_XING_SHENG[dyZhiWx] === dayMaster) {
            comment += '印星生身，此运多得贵人提携，学业事业有进，宜稳中求进。';
        } else if (dyGanWx === WU_XING_KE[dayMaster] || dyZhiWx === WU_XING_KE[dayMaster]) {
            comment += '官星克身，此运压力较大，但亦是建功立业之时，宜沉着应对。';
        } else if (WU_XING_KE[dyGanWx] === dayMaster || WU_XING_KE[dyZhiWx] === dayMaster) {
            comment += '财星耗身，此运财运活跃，但需防过度消耗，宜量入为出。';
        } else {
            comment += '此运平稳过渡，宜顺势而为，积蓄力量。';
        }
        yunPing.push(comment);
    }
    // 只显示前4个大运的简评（避免太长）
    for (var i = 0; i < Math.min(4, yunPing.length); i++) {
        daYunHtml += '<p style="font-size:14px;margin-bottom:6px;">' + yunPing[i] + '</p>';
    }
    if (yunPing.length > 4) {
        daYunHtml += '<p style="font-size:13px;color:var(--text-muted);text-align:center;">（完整大运运势请结合流年具体分析）</p>';
    }
    sections.push({ title: '大运走势', icon: '运', body: daYunHtml });

    // ================================================================
    // 6. 一生总论（新增）
    // ================================================================
    var lifeHtml = '<p><b>总论</b>：' + name + '阁下，八字日主为' + dayMaster + '，生于' + sm + '月，命局' + (dayMaster === dominant ? '身强' : dayMaster === weak ? '身弱' : '中和') + '。五行' + dominant + '为旺，' + weak + '为弱。';
    if (dayMaster === '金') lifeHtml += '金命之人，一生刚毅正直，有担当。';
    else if (dayMaster === '木') lifeHtml += '木命之人，一生仁厚善良，有胸怀。';
    else if (dayMaster === '水') lifeHtml += '水命之人，一生聪慧灵动，有机变。';
    else if (dayMaster === '火') lifeHtml += '火命之人，一生热情明亮，有魄力。';
    else lifeHtml += '土命之人，一生敦厚稳重，有担当。';
    lifeHtml += '</p>';

    // 三阶段分析
    var phaseEarly = '', phaseMid = '', phaseLate = '';
    if (dayMaster === '金') {
        phaseEarly = '早年（20岁前）：金性初成，锐气方显。学业上思维敏捷，逻辑性强，成绩优异。但年少气盛，需注意人际关系，学会圆融处事。';
        phaseMid = '中年（20-50岁）：金性大成，锋芒毕露。事业进入快速发展期，适合发挥决断力和执行力。宜在金融、法律、管理、技术等领域深耕。财运丰足，但需防过于刚直而失机遇。';
        phaseLate = '晚年（50岁后）：金性归藏，锋芒内敛。事业趋于稳定，宜退居幕后，以经验和智慧指导后辈。晚景丰足，家庭和睦，尽享天伦之乐。';
    } else if (dayMaster === '木') {
        phaseEarly = '早年（20岁前）：木性初生，生机勃勃。学业上兴趣广泛，创造力强，适合文艺方向。但需专注，避免浅尝辄止。';
        phaseMid = '中年（20-50岁）：木性繁茂，枝繁叶茂。事业发展方向宽广，适合教育、文化、设计、医疗、环保等行业。人际关系良好，多得贵人相助。财运稳中有升，宜守正出奇。';
        phaseLate = '晚年（50岁后）：木性归厚，根深叶茂。事业成果丰硕，名望渐高。宜以传承为主，将经验和智慧传授后人。晚景安泰，子孙绕膝。';
    } else if (dayMaster === '水') {
        phaseEarly = '早年（20岁前）：水性初动，智慧初开。学业上触类旁通，多才多艺。但需培养专注力和毅力，避免聪明反被聪明误。';
        phaseMid = '中年（20-50岁）：水性澎湃，智慧纵横。事业适合贸易、物流、传媒、旅游、IT等流通性行业。人脉广阔，机遇众多。财运亨通，但需防大起大落。';
        phaseLate = '晚年（50岁后）：水性归渊，智慧深沉。事业进入收成期，宜以稳健为主。晚景富足，精神生活丰富，可著书立说，传道授业。';
    } else if (dayMaster === '火') {
        phaseEarly = '早年（20岁前）：火性初燃，热情洋溢。学业上积极主动，有领导才能，适合担任班干部。但需培养耐心，学会倾听。';
        phaseMid = '中年（20-50岁）：火性炽盛，光芒四射。事业适合能源、餐饮、娱乐、互联网、销售等行业。领导力强，能开创局面。财运丰足，但需节制消费，避免过度扩张。';
        phaseLate = '晚年（50岁后）：火性归温，光芒内敛。事业趋于平稳，宜退居二线，以经验和人脉为后辈提供支持。晚景温暖，家庭和睦。';
    } else {
        phaseEarly = '早年（20岁前）：土性初成，稳重踏实。学业上一丝不苟，功底扎实。虽不一定是天赋最高的，但持之以恒必有所成。';
        phaseMid = '中年（20-50岁）：土性厚重，承载万物。事业适合房地产、建筑、农业、管理、咨询等稳定行业。以诚信为本，稳扎稳打，终成大器。财运稳定增长，宜守不宜攻。';
        phaseLate = '晚年（50岁后）：土性归厚，德高望重。事业成果丰硕，受人尊敬。宜以传承为主，将毕生经验和智慧传授后人。晚景安泰，福寿绵长。';
    }
    lifeHtml += '<p><b>早年运势</b>：' + phaseEarly + '</p>';
    lifeHtml += '<p><b>中年运势</b>：' + phaseMid + '</p>';
    lifeHtml += '<p><b>晚年运势</b>：' + phaseLate + '</p>';

    // 人生建议
    lifeHtml += '<div style="margin-top:16px;padding:16px;background:rgba(201,168,76,0.04);border-radius:8px;border:1px solid rgba(201,168,76,0.08);">';
    lifeHtml += '<p style="font-size:14px;color:var(--gold-light);margin-bottom:8px;"><b>人生箴言</b></p>';
    var advices = [];
    if (dayMaster === '金') advices = ['以柔克刚，以和为贵', '刚毅中不失温情，决断前多听谏言', '富贵不能淫，贫贱不能移，威武不能屈'];
    else if (dayMaster === '木') advices = ['坚定心志，果断前行', '仁慈中不失原则，包容中保持底线', '天行健，君子以自强不息'];
    else if (dayMaster === '水') advices = ['以诚为本，以智为用', '灵动中不失稳重，变化中坚守本心', '上善若水，水善利万物而不争'];
    else if (dayMaster === '火') advices = ['以稳为重，以和为贵', '热情中保持理性，进取中不忘稳健', '明德新民，止于至善'];
    else advices = ['与时俱进，开拓创新', '稳重中求变通，踏实中谋进取', '地势坤，君子以厚德载物'];
    for (var i = 0; i < advices.length; i++) {
        lifeHtml += '<p style="font-size:14px;text-align:center;color:var(--text-primary);margin-bottom:4px;">"' + advices[i] + '"</p>';
    }
    lifeHtml += '</div>';
    sections.push({ title: '一生总论', icon: '命', body: lifeHtml });

    // ================================================================
    // 7. 专题详解（一生版）
    // ================================================================
    var tmap = {
        career: { title: '事业前程',
            desc: name + '阁下，以日主' + dayMaster + '为根基，事业运势贯穿一生。',
            details: [
                dayMaster === '金' ? '金命之人，事业宜刚不宜柔。适合金融、法律、管理、技术、军警等需要决断力和执行力的行业。西方为吉利方位，秋冬为顺遂季节。一生事业轨迹：早年崭露头角，中年执掌权柄，晚年德高望重。' : dayMaster === '木' ? '木命之人，事业宜生不宜杀。适合教育、文化、设计、医疗、环保、农业等创造性行业。东方为吉利方位，春季为顺遂季节。一生事业轨迹：早年奠定基础，中年枝繁叶茂，晚年桃李满天下。' : dayMaster === '水' ? '水命之人，事业宜通不宜堵。适合贸易、物流、传媒、旅游、IT、咨询等流通性行业。北方为吉利方位，冬季为顺遂季节。一生事业轨迹：早年积累人脉，中年纵横驰骋，晚年智慧传承。' : dayMaster === '火' ? '火命之人，事业宜明不宜暗。适合能源、餐饮、娱乐、互联网、销售、文化创意等热情行业。南方为吉利方位，夏季为顺遂季节。一生事业轨迹：早年激情创业，中年大展宏图，晚年光芒永驻。' : '土命之人，事业宜稳不宜急。适合房地产、建筑、农业、管理、咨询、金融等稳定行业。居中而守，四季皆宜。一生事业轨迹：早年打牢根基，中年稳健发展，晚年安享成果。'
            ],
            phases: [
                '事业上升期（20-35岁）：此阶段宜多尝试，积累经验和人脉。' + (dayMaster === '金' ? '发挥决断力，敢于承担重要任务。' : dayMaster === '木' ? '发挥创造力，多学多思，建立专业基础。' : dayMaster === '水' ? '广交朋友，拓展人脉圈，把握信息优势。' : dayMaster === '火' ? '积极主动，勇于表现，抓住每一个展示自己的机会。' : '踏实做事，建立信誉，一步一个脚印。'),
                '事业巅峰期（35-55岁）：此阶段宜专注主业，谋求突破。' + (dayMaster === '金' ? '可执掌团队或企业，发挥领导才能。' : dayMaster === '木' ? '可创立自己的品牌或事业，发挥创造力。' : dayMaster === '水' ? '可跨界发展，整合资源，发挥人脉优势。' : dayMaster === '火' ? '可开拓新市场，发挥创业精神和领导力。' : '可稳守阵地，深耕细作，发挥管理才能。') ,
                '事业守成期（55岁后）：此阶段宜退居二线，以经验和智慧指导后辈。传承事业，享受成果。'
            ]
        },
        wealth: { title: '财运走势',
            desc: name + '阁下，日主' + dayMaster + '，所克者为财。一生财运与日主强弱息息相关。',
            details: [
                dayMaster === '金' ? '金克木为财，财运源于开拓创新。正财稳健，偏财有机缘。一生财运轨迹：早年靠专业技能赚钱，中年靠管理投资赚钱，晚年靠传承智慧生财。' : dayMaster === '木' ? '木克土为财，财运在于稳固积累。正财可期，偏财宜慎。一生财运轨迹：早年靠勤奋努力赚钱，中年靠人脉资源赚钱，晚年靠稳定收益生财。' : dayMaster === '水' ? '水克火为财，财运在于人脉智慧。正财偏财皆有可观。一生财运轨迹：早年靠聪明才智赚钱，中年靠资本运作赚钱，晚年靠人脉资源生财。' : dayMaster === '火' ? '火克金为财，财运在于执行力。正财丰足，偏财有缘。一生财运轨迹：早年靠热情拼搏赚钱，中年靠事业规模赚钱，晚年靠投资理财生财。' : '土克水为财，财运在于人脉经营。正财稳定，偏财谨慎。一生财运轨迹：早年靠踏实工作赚钱，中年靠稳健投资赚钱，晚年靠固定资产生财。'
            ],
            phases: [
                '财富积累期（20-35岁）：此阶段以正财为主，努力工作，积累第一桶金。宜量入为出，养成储蓄习惯。',
                '财富增长期（35-55岁）：此阶段正财偏财并重。可在主业之外适度投资，但需控制风险。' + (dayMaster === '金' ? '宜投资金属、金融相关领域。' : dayMaster === '木' ? '宜投资教育、文化、环保相关领域。' : dayMaster === '水' ? '宜投资物流、科技、贸易相关领域。' : dayMaster === '火' ? '宜投资能源、餐饮、娱乐相关领域。' : '宜投资房地产、农业、资源相关领域。'),
                '财富守成期（55岁后）：此阶段以守财为主，不宜高风险投资。宜将财富转化为稳定资产，确保晚年生活品质。'
            ]
        },
        love: { title: '姻缘情感',
            desc: name + '阁下，以日支为配偶宫，以' + (gender === 'male' ? '正财为妻' : '正官为夫') + '。一生姻缘运势如下：',
            details: [
                dayMaster === '金' ? '金命之人，姻缘中宜刚柔相济。阁下真诚坦率，但需学会包容与体贴。适合与水性（猴、鼠、龙）或土性（牛、羊、狗、龙）之人结缘，性格互补。' : dayMaster === '木' ? '木命之人，姻缘中宜相互成就。阁下温柔体贴，善解人意，但需保持独立人格。适合与火性（蛇、马）或水性（猪、鼠）之人结缘，相生相成。' : dayMaster === '水' ? '水命之人，姻缘中宜专一持久。阁下浪漫多情，智慧幽默，但需避免感情多变。适合与木性（虎、兔）或金性（猴、鸡）之人结缘，相得益彰。' : dayMaster === '火' ? '火命之人，姻缘中宜热情有度。阁下真诚炽热，但需给彼此空间。适合与木性（虎、兔）或土性（牛、羊、狗）之人结缘，相生相济。' : '土命之人，姻缘中宜忠厚有加。阁下稳重可靠，但需适当制造浪漫。适合与火性（蛇、马）或金性（猴、鸡）之人结缘，相生相助。'
            ],
            phases: [
                '情感萌芽期（20-30岁）：此阶段桃花运渐旺，易遇良缘。但需理性对待感情，不宜冲动决定。',
                '情感稳定期（30-50岁）：此阶段婚姻趋于稳定，宜用心经营家庭。' + (gender === 'male' ? '夫妻同心，其利断金。' : '夫妻和睦，家道昌隆。') + '注意沟通，避免因事业忙碌而忽略家庭。',
                '情感深厚期（50岁后）：此阶段夫妻情深，相互扶持。儿孙满堂，尽享天伦之乐。'
            ]
        },
        health: { title: '健康运势',
            desc: name + '阁下，健康运势与五行平衡息息相关。日主' + dayMaster + '，一生需关注以下方面：',
            details: [
                dayMaster === '金' ? '金主肺与呼吸系统、皮肤、大肠。一生需注意肺部保养，秋季尤需润肺。少食辛辣刺激，多食白色食物（梨、银耳、百合）。' : dayMaster === '木' ? '木主肝胆、筋骨、眼睛。一生需注意肝胆调理，春季尤需养肝。作息规律，少熬夜，多食绿色食物（菠菜、芹菜、西兰花）。' : dayMaster === '水' ? '水主肾与泌尿系统、骨骼、耳朵。一生需注意肾脏保养，冬季尤需藏精。适度运动，避免过度劳累，多食黑色食物（黑豆、黑芝麻、木耳）。' : dayMaster === '火' ? '火主心与血液循环、小肠、舌头。一生需注意心脏养护，夏季尤需清心。避免过劳和暴怒，多食红色食物（红枣、红豆、番茄）。' : '土主脾胃与消化系统、肌肉、皮肤。一生需注意脾胃调理，四季皆宜健脾。饮食有节，避免暴饮暴食，多食黄色食物（小米、南瓜、玉米）。'
            ],
            phases: [
                '青年期（20-35岁）：体质强健，但需建立良好生活习惯。注意运动适度，避免熬夜和过度消耗。',
                '中年期（35-55岁）：压力增大，需格外关注' + (dayMaster === '金' ? '呼吸系统和皮肤' : dayMaster === '木' ? '肝胆和视力' : dayMaster === '水' ? '肾脏和骨骼' : dayMaster === '火' ? '心脏和血压' : '脾胃和消化') + '健康。定期体检，防患于未然。',
                '老年期（55岁后）：以养生为主，顺应四时。' + (weak === '金' ? '宜多补金气，常食白色食物。' : weak === '木' ? '宜多补木气，常食绿色食物。' : weak === '水' ? '宜多补水气，常食黑色食物。' : weak === '火' ? '宜多补火气，常食红色食物。' : '宜多补土气，常食黄色食物。')
            ]
        },
        study: { title: '学业功名',
            desc: name + '阁下，学业运势以印星为用。日主' + dayMaster + '，' + (gender === 'male' ? '文昌星照命' : '文曲星护身') + '。',
            details: [
                dayMaster === '金' ? '金命之人，学业上思维敏捷，逻辑性强，擅长数理、工程、法律等学科。宜往西方求学，秋冬季节考试运佳。' : dayMaster === '木' ? '木命之人，学业上博闻强识，适合文科、艺术、教育等方向。宜往东方求学，春季考试运佳。' : dayMaster === '水' ? '水命之人，学业上触类旁通，多才多艺，适合综合学科。宜往北方求学，冬季考试运佳。' : dayMaster === '火' ? '火命之人，学业上领悟力强，学习热情高，适合实践性学科。宜往南方求学，夏季考试运佳。' : '土命之人，学业上稳扎稳打，功底扎实，适合基础学科。居中而学，四季皆宜。'
            ],
            phases: [
                '基础教育期（6-18岁）：此阶段宜培养学习兴趣和习惯。' + (dayMaster === '金' ? '适合逻辑思维训练，如数学、编程。' : dayMaster === '木' ? '适合语言和艺术启蒙，如阅读、绘画。' : dayMaster === '水' ? '适合多样化学习，激发好奇心。' : dayMaster === '火' ? '适合互动式学习，如演讲、辩论。' : '适合循序渐进，打好扎实基础。'),
                '专业深造期（18-28岁）：此阶段宜选定方向，深入钻研。可考虑高等教育或专业技能培训，为一生事业打下基础。',
                '终身学习期（28岁后）：学无止境。宜在工作中继续学习，不断更新知识结构，保持竞争力。'
            ]
        },
        family: { title: '家宅安康',
            desc: name + '阁下，家宅运势以月柱为根基。月柱' + monthGZ.gan + monthGZ.zhi + '，家宅之要在于和睦。',
            details: [
                '家宅是人生的避风港，家庭和睦则万事顺遂。' + name + '阁下一生家宅运势总体平稳，但需注意以下方面：',
                dayMaster === '金' ? '金性刚直，在家中需多些柔情和包容。以柔克刚，家和万事兴。宜在家中布置水景或黑色装饰，以水泄金，调和气场。' : dayMaster === '木' ? '木性生发，家庭氛围和睦，注重传承。宜在家中以土为镇，摆放陶瓷器皿，稳定气场。' : dayMaster === '水' ? '水性润下，家庭关系融洽。宜多与家人沟通交流，增进亲情。宜在家中布置火元素（红色装饰、灯光），以火暖局。' : dayMaster === '火' ? '火性热烈，家庭充满活力。需注意情绪管理，避免因小事起争执。宜在家中布置水景或黑色装饰，以水平火。' : '土性敦厚，家庭根基稳固。重视传统，家运绵长。宜在家中布置木质家具或绿植，以木疏土。'
            ],
            phases: [
                '成家立业期（25-40岁）：此阶段宜用心经营小家庭。夫妻同心，共同打拼，为家庭奠定经济基础。',
                '家庭发展期（40-60岁）：此阶段上有老下有小，责任重大。宜兼顾事业与家庭，注重子女教育和老人赡养。',
                '家庭圆满期（60岁后）：此阶段儿孙满堂，尽享天伦。宜以和为贵，享受家庭温暖，传承家风。'
            ]
        },
        general: { title: '综合命理',
            desc: name + '阁下，八字综合来看，一生运势如下：',
            details: [
                '日主' + dayMaster + '，生于' + sm + '月，命局' + (dayMaster === dominant ? '身强' : dayMaster === weak ? '身弱' : '中和') + '。',
                '五行' + dominant + '势最旺，' + weak + '势最弱。身' + (dayMaster === dominant ? '旺能担财官，事业可期，但需防刚愎自用。' : dayMaster === weak ? '弱宜顺势而为，以印比助身，借力发展。' : '中和，五行均衡，运势平稳，贵人相助。'),
                '一生运势起伏与五行平衡密切相关。宜补' + weak + '气，泄' + dominant + '势，使五行归于中和。',
                '命理之道，知命而运。知不足而补之，知有余而用之。' + name + '阁下，愿您把握人生机遇，创造属于自己的精彩篇章。'
            ],
            phases: [
                '青年探索期（20-35岁）：此阶段运势逐步上升。宜多尝试，多经历，找到最适合自己的人生方向。学业、事业、感情皆有发展机遇。',
                '中年拼搏期（35-55岁）：此阶段是一生运势的高峰期。宜专注主业，全力以赴，建功立业。同时注意身体健康，平衡工作与生活。',
                '晚年收成期（55岁后）：此阶段运势趋于平稳。宜享受奋斗成果，传承经验智慧，安享幸福晚年。'
            ]
        }
    };
    var td = tmap[topic] || tmap.general;
    var topicHtml = '<p>' + td.desc + '</p>';
    for (var i = 0; i < td.details.length; i++) {
        topicHtml += '<p>' + td.details[i] + '</p>';
    }
    topicHtml += '<div style="margin-top:16px;padding:16px;background:rgba(201,168,76,0.04);border-radius:8px;border:1px solid rgba(201,168,76,0.08);">';
    topicHtml += '<p style="font-size:14px;color:var(--gold-light);margin-bottom:8px;"><b>人生三阶段</b></p>';
    for (var i = 0; i < td.phases.length; i++) {
        topicHtml += '<p style="font-size:14px;margin-bottom:6px;">' + td.phases[i] + '</p>';
    }
    topicHtml += '</div>';
    topicHtml += '<div style="margin-top:16px;padding:16px;background:rgba(201,168,76,0.04);border-radius:8px;border:1px solid rgba(201,168,76,0.08);"><p style="font-size:13px;color:var(--gold-light);text-align:center;font-style:italic;">"知命者不怨天，知己者不怨人。命由天定，运由己造。"</p></div>';
    sections.push({ title: td.title + ' · 一生详解', icon: '✦', body: topicHtml });

    // ================================================================
    // 8. 开运建议（增强版）
    // ================================================================
    var dirMap = {'金':'西方','木':'东方','水':'北方','火':'南方','土':'中央'};
    var colorMap = {'金':'白色、金色、银色','木':'绿色、青色','水':'黑色、蓝色','火':'红色、紫色、橙色','土':'黄色、棕色、米色'};
    var itemMap = {'金':'可佩戴金属饰品（金、银、白金），居室宜置金属器物或铜器。','木':'可种植绿色植物（发财树、绿萝、竹子），居室宜用木质装饰。','水':'宜近水而居，养鱼（金鱼、锦鲤）、置水景皆可补水。','火':'宜多晒太阳，居室灯光宜明亮温暖，可点香薰蜡烛。','土':'宜用陶瓷器皿，居室宜稳重敦实，可摆放水晶或玉石。'};
    var numMap = {'金':'4、9','木':'3、8','水':'1、6','火':'2、7','土':'5、10'};
    var seasonMap = {'金':'秋季（申酉戌月）','木':'春季（寅卯辰月）','水':'冬季（亥子丑月）','火':'夏季（巳午未月）','土':'四季末月（辰戌丑未月）'};

    var adviceHtml = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">';
    adviceHtml += '<div style="padding:12px;background:rgba(201,168,76,0.04);border-radius:8px;"><b style="color:var(--gold-light);">宜补五行</b><br><span class="tag ' + WU_XING_COLOR[weak] + '">' + weak + '</span> 补命局之不足</div>';
    adviceHtml += '<div style="padding:12px;background:rgba(201,168,76,0.04);border-radius:8px;"><b style="color:var(--gold-light);">幸运方位</b><br>' + (dirMap[weak] || '中央') + '</div>';
    adviceHtml += '<div style="padding:12px;background:rgba(201,168,76,0.04);border-radius:8px;"><b style="color:var(--gold-light);">幸运色彩</b><br>' + (colorMap[weak] || '黄色、棕色') + '</div>';
    adviceHtml += '<div style="padding:12px;background:rgba(201,168,76,0.04);border-radius:8px;"><b style="color:var(--gold-light);">幸运数字</b><br>' + (numMap[weak] || '5、10') + '</div>';
    adviceHtml += '<div style="padding:12px;background:rgba(201,168,76,0.04);border-radius:8px;"><b style="color:var(--gold-light);">旺运季节</b><br>' + (seasonMap[weak] || '四季') + '</div>';
    adviceHtml += '<div style="padding:12px;background:rgba(201,168,76,0.04);border-radius:8px;"><b style="color:var(--gold-light);">生肖贵人</b><br>' + (liuHe[zodiac] || '') + '、' + sanHe[zodiac].join('、') + '</div>';
    adviceHtml += '</div>';
    adviceHtml += '<p><b>调和之道</b>：' + (itemMap[weak] || '宜均衡发展，五行调和。') + '</p>';

    // 流年提醒
    var currentYear = new Date().getFullYear();
    var curGZ = calcYearGanZhi(currentYear);
    var curWX = WU_XING_GAN[curGZ.gan];
    adviceHtml += '<div style="margin-top:16px;padding:16px;background:rgba(201,168,76,0.04);border-radius:8px;border:1px solid rgba(201,168,76,0.08);">';
    adviceHtml += '<p style="font-size:14px;color:var(--gold-light);margin-bottom:8px;"><b>流年提醒（' + currentYear + '年 ' + curGZ.gan + curGZ.zhi + '年）</b></p>';
    if (curWX === dayMaster) {
        adviceHtml += '<p>今年为比劫之年，日主与流年五行相同。此年多得朋友相助，合作机会增多。但比劫亦主竞争，需注意处理好人际关系，避免因利益纷争而伤和气。</p>';
    } else if (WU_XING_SHENG[curWX] === dayMaster) {
        adviceHtml += '<p>今年为印星之年，流年生旺日主。此年多得贵人提携，学业事业有进。宜稳中求进，把握良机。是学习进修、提升自我的好时机。</p>';
    } else if (WU_XING_KE[curWX] === dayMaster) {
        adviceHtml += '<p>今年为官星之年，流年克制日主。此年压力较大，但亦是建功立业之时。宜沉着应对，化压力为动力。遵纪守法，谨言慎行。</p>';
    } else if (curWX === WU_XING_KE[dayMaster]) {
        adviceHtml += '<p>今年为财星之年，日主克制流年。此年财运活跃，有机会获得意外之财。但需防过度消耗，宜量入为出，理性投资。</p>';
    } else {
        adviceHtml += '<p>今年运势平稳，宜顺势而为，积蓄力量。适合规划未来，调整方向，为下一阶段的发展做好准备。</p>';
    }
    adviceHtml += '</div>';

    adviceHtml += '<div style="margin-top:20px;text-align:center;font-size:13px;color:var(--text-muted);border-top:1px solid rgba(201,168,76,0.1);padding-top:16px;"><p>以上内容基于传统命理学知识，仅供娱乐参考。</p><p style="margin-top:4px;">命运之舟，舵在阁下手中。</p></div>';
    sections.push({ title: '开运建议', icon: '☯', body: adviceHtml });

    return sections;
}

function renderResult(sections) {
    var container = document.getElementById('resultContent');
    var html = '';
    for (var i = 0; i < sections.length; i++) {
        html += '<div class="result-card" style="animation-delay:' + (0.3 + i * 0.25) + 's"><div class="result-card-title"><div class="icon-box">' + sections[i].icon + '</div>' + sections[i].title + '</div><div class="result-card-body">' + sections[i].body + '</div></div>';
    }
    container.innerHTML = html;
}

// ================================================================
//  页面初始化
// ================================================================
var isLunarMode = false;

function initSolarDates() {
    var yS = document.getElementById('solarYear');
    var mS = document.getElementById('solarMonth');
    var dS = document.getElementById('solarDay');
    var cy = new Date().getFullYear();
    for (var y = cy; y >= cy - 80; y--) {
        var o = document.createElement('option');
        o.value = y;
        o.textContent = y + '年';
        yS.appendChild(o);
    }
    for (var m = 1; m <= 12; m++) {
        var o = document.createElement('option');
        o.value = m;
        o.textContent = m + '月';
        mS.appendChild(o);
    }
    function updateDays() {
        var y = parseInt(yS.value);
        var m = parseInt(mS.value);
        if (!y || !m) return;
        var days = new Date(y, m, 0).getDate();
        dS.innerHTML = '<option value="" disabled selected>日期</option>';
        for (var d = 1; d <= days; d++) {
            var o = document.createElement('option');
            o.value = d;
            o.textContent = d + '日';
            dS.appendChild(o);
        }
        checkForm();
    }
    yS.addEventListener('change', updateDays);
    mS.addEventListener('change', updateDays);
}

function initLunarDates() {
    var yS = document.getElementById('lunarYear');
    var mS = document.getElementById('lunarMonth');
    var dS = document.getElementById('lunarDay');
    var cy = new Date().getFullYear();
    for (var y = cy; y >= LUNAR_START_YEAR; y--) {
        var o = document.createElement('option');
        o.value = y;
        o.textContent = y + '年';
        yS.appendChild(o);
    }
    function updateMonths() {
        var y = parseInt(yS.value);
        if (!y) return;
        var info = lunarYearInfo(y);
        if (!info) return;
        mS.innerHTML = '<option value="" disabled selected>月份</option>';
        for (var m = 1; m <= 12; m++) {
            var o = document.createElement('option');
            o.value = m;
            o.textContent = LUNAR_MONTHS[m - 1];
            mS.appendChild(o);
        }
        if (info.leapMonth > 0) {
            var o = document.createElement('option');
            o.value = info.leapMonth + 'leap';
            o.textContent = '闰' + LUNAR_MONTHS[info.leapMonth - 1];
            mS.appendChild(o);
        }
        updateDays();
    }
    function updateDays() {
        var y = parseInt(yS.value);
        var mv = mS.value;
        if (!y || !mv) return;
        var info = lunarYearInfo(y);
        if (!info) return;
        var md;
        if (typeof mv === 'string' && mv.indexOf('leap') >= 0) {
            md = info.leapDays;
        } else {
            md = info.monthDays[parseInt(mv) - 1];
        }
        dS.innerHTML = '<option value="" disabled selected>日期</option>';
        for (var d = 1; d <= md; d++) {
            var o = document.createElement('option');
            o.value = d;
            o.textContent = LUNAR_DAYS[d - 1];
            dS.appendChild(o);
        }
        checkForm();
    }
    yS.addEventListener('change', updateMonths);
    mS.addEventListener('change', updateDays);
    // 首次加载触发月份填充
    setTimeout(updateMonths, 50);
}

function checkForm() {
    var name = document.getElementById('nameInput').value.trim();
    var gender = document.getElementById('genderInput').value;
    var topic = document.getElementById('topicInput').value;
    var dateOk = false;
    if (isLunarMode) {
        var y = document.getElementById('lunarYear').value;
        var m = document.getElementById('lunarMonth').value;
        var d = document.getElementById('lunarDay').value;
        dateOk = (y && m && d);
    } else {
        var y = document.getElementById('solarYear').value;
        var m = document.getElementById('solarMonth').value;
        var d = document.getElementById('solarDay').value;
        dateOk = (y && m && d);
    }
    document.getElementById('submitBtn').disabled = !(name && gender && dateOk && topic);
}

function toggleCalendar() {
    isLunarMode = !isLunarMode;
    document.getElementById('calendarSwitch').classList.toggle('active', isLunarMode);
    document.getElementById('solarDateGroup').style.display = isLunarMode ? 'none' : 'block';
    document.getElementById('lunarDateGroup').style.display = isLunarMode ? 'block' : 'none';
    document.getElementById('solarLabel').classList.toggle('active', !isLunarMode);
    document.getElementById('lunarLabel').classList.toggle('active', isLunarMode);

    // 更新标签文字
    var dateLabel = document.getElementById('dateLabel');
    if (dateLabel) {
        var hl = dateLabel.querySelector('.highlight');
        if (hl) hl.textContent = isLunarMode ? '农历出生日期' : '出生日期';
    }

    // 清空另一边
    if (isLunarMode) {
        document.getElementById('solarYear').value = '';
        document.getElementById('solarMonth').value = '';
        document.getElementById('solarDay').innerHTML = '<option value="" disabled selected>日期</option>';
    } else {
        document.getElementById('lunarYear').value = '';
        document.getElementById('lunarMonth').innerHTML = '<option value="" disabled selected>月份</option>';
        document.getElementById('lunarDay').innerHTML = '<option value="" disabled selected>日期</option>';
    }
    checkForm();
}

// ================================================================
//  事件绑定
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    initSolarDates();
    initLunarDates();

    document.getElementById('calendarSwitch').addEventListener('click', toggleCalendar);
    document.getElementById('solarLabel').addEventListener('click', function() {
        if (isLunarMode) toggleCalendar();
    });
    document.getElementById('lunarLabel').addEventListener('click', function() {
        if (!isLunarMode) toggleCalendar();
    });

    var watchIds = ['nameInput','genderInput','topicInput','solarYear','solarMonth','solarDay','lunarYear','lunarMonth','lunarDay'];
    for (var i = 0; i < watchIds.length; i++) {
        var el = document.getElementById(watchIds[i]);
        if (el) {
            el.addEventListener('change', checkForm);
            if (el.tagName === 'INPUT') {
                el.addEventListener('input', checkForm);
            }
        }
    }

    document.getElementById('submitBtn').addEventListener('click', function() {
        var name = document.getElementById('nameInput').value.trim();
        var gender = document.getElementById('genderInput').value;
        var topic = document.getElementById('topicInput').value;
        var hour = document.getElementById('hourInput').value;
        var year, month, day;
        if (isLunarMode) {
            year = parseInt(document.getElementById('lunarYear').value);
            month = document.getElementById('lunarMonth').value;
            day = parseInt(document.getElementById('lunarDay').value);
        } else {
            year = parseInt(document.getElementById('solarYear').value);
            month = parseInt(document.getElementById('solarMonth').value);
            day = parseInt(document.getElementById('solarDay').value);
        }

        var overlay = document.getElementById('loadingOverlay');
        overlay.classList.add('active');

        var texts = ['推演命盘中','天机运转中','八卦推演中','紫微星动'];
        var ti = 0;
        var iv = setInterval(function() {
            ti = (ti + 1) % texts.length;
            document.getElementById('loadingText').textContent = texts[ti];
        }, 1200);

        setTimeout(function() {
            clearInterval(iv);
            overlay.classList.remove('active');
            var sections = generateReading(name, gender, year, month, day, hour, topic, isLunarMode);
            renderResult(sections);
            document.getElementById('questionSection').style.display = 'none';
            document.getElementById('resultSection').classList.add('active');
            document.querySelector('.result-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 2500);
    });

    document.getElementById('restartBtn').addEventListener('click', function() {
        document.getElementById('resultSection').classList.remove('active');
        document.getElementById('questionSection').style.display = 'block';
        document.getElementById('nameInput').value = '';
        document.getElementById('genderInput').value = '';
        document.getElementById('solarYear').value = '';
        document.getElementById('solarMonth').value = '';
        document.getElementById('solarDay').innerHTML = '<option value="" disabled selected>日期</option>';
        document.getElementById('lunarYear').value = '';
        document.getElementById('lunarMonth').innerHTML = '<option value="" disabled selected>月份</option>';
        document.getElementById('lunarDay').innerHTML = '<option value="" disabled selected>日期</option>';
        document.getElementById('hourInput').value = '';
        document.getElementById('topicInput').value = '';
        document.getElementById('submitBtn').disabled = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
