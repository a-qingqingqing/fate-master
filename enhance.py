import re

with open(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\index.html', 'r', encoding='utf-8') as f:
    c = f.read()

changes = 0

# ============================================================
# 1. 添加纳音五行数据
# ============================================================
nayin_data = """
var NAYIN = {
    '甲子':'海中金','乙丑':'海中金','丙寅':'炉中火','丁卯':'炉中火','戊辰':'大林木','己巳':'大林木',
    '庚午':'路旁土','辛未':'路旁土','壬申':'剑锋金','癸酉':'剑锋金','甲戌':'山头火','乙亥':'山头火',
    '丙子':'涧下水','丁丑':'涧下水','戊寅':'城头土','己卯':'城头土','庚辰':'白蜡金','辛巳':'白蜡金',
    '壬午':'杨柳木','癸未':'杨柳木','甲申':'泉中水','乙酉':'泉中水','丙戌':'屋上土','丁亥':'屋上土',
    '戊子':'霹雳火','己丑':'霹雳火','庚寅':'松柏木','辛卯':'松柏木','壬辰':'长流水','癸巳':'长流水',
    '甲午':'沙中金','乙未':'沙中金','丙申':'山下火','丁酉':'山下火','戊戌':'平地木','己亥':'平地木',
    '庚子':'壁上土','辛丑':'壁上土','壬寅':'金箔金','癸卯':'金箔金','甲辰':'覆灯火','乙巳':'覆灯火',
    '丙午':'天河水','丁未':'天河水','戊申':'大驿土','己酉':'大驿土','庚戌':'钗钏金','辛亥':'钗钏金',
    '壬子':'桑柘木','癸丑':'桑柘木','甲寅':'大溪水','乙卯':'大溪水','丙辰':'沙中土','丁巳':'沙中土',
    '戊午':'天上火','己未':'天上火','庚申':'石榴木','辛酉':'石榴木','壬戌':'大海水','癸亥':'大海水'
};

var DI_ZHI_CANG = {
    '子':['癸'],'丑':['己','癸','辛'],'寅':['甲','丙','戊'],'卯':['乙'],
    '辰':['戊','乙','癸'],'巳':['丙','庚','戊'],'午':['丁','己'],'未':['己','丁','乙'],
    '申':['庚','壬','戊'],'酉':['辛'],'戌':['戊','辛','丁'],'亥':['壬','甲']
};

var SHI_SHEN_GAN = {
    '比肩':['甲','丙','戊','庚','壬'],'劫财':['乙','丁','己','辛','癸'],
    '食神':['丙','戊','庚','壬','甲'],'伤官':['丁','己','辛','癸','乙'],
    '偏财':['戊','庚','壬','甲','丙'],'正财':['己','辛','癸','乙','丁'],
    '偏官':['庚','壬','甲','丙','戊'],'正官':['辛','癸','乙','丁','己'],
    '偏印':['壬','甲','丙','戊','庚'],'正印':['癸','乙','丁','己','辛']
};
"""

# Insert after "return m[z] || '土';" and before the generateReading function
old = "return m[z] || '土';\n}\n\n// ================================================================\n//  命理分析"
new = "return m[z] || '土';\n}\n" + nayin_data + "\n// ================================================================\n//  命理分析"
if old in c:
    c = c.replace(old, new)
    changes += 1
    print(f"Change 1: Added 纳音/藏干/十神 data")
else:
    print("WARNING: Could not find insertion point for 纳音 data")

# ============================================================
# 2. 在八字排盘中添加纳音五行显示
# ============================================================
# Find the pillars section and add 纳音
old_pillar = "baziHtml += '<div style=\"text-align:center;font-size:13px;color:var(--text-muted);\">生肖：<span class=\"pill\">' + zodiac + '</span> | 日主：<span class=\"tag ' + WU_XING_COLOR[dayMaster] + '\">' + dayMaster + '</span> ' + (gender === 'male' ? '乾造' : '坤造') + ' | 生于' + sy + '年' + sm + '月' + sd + '日</div>';"
new_pillar = "baziHtml += '<div style=\"text-align:center;font-size:13px;color:var(--text-muted);\">生肖：<span class=\"pill\">' + zodiac + '</span> | 日主：<span class=\"tag ' + WU_XING_COLOR[dayMaster] + '\">' + dayMaster + '</span> ' + (gender === 'male' ? '乾造' : '坤造') + ' | 生于' + sy + '年' + sm + '月' + sd + '日</div>';\n" 
new_pillar += "    baziHtml += '<div style=\"text-align:center;font-size:13px;color:var(--text-muted);margin-top:4px;\">年柱纳音：<span class=\"pill\">' + NAYIN[yearGZ.gan + yearGZ.zhi] + '</span> 月柱纳音：<span class=\"pill\">' + NAYIN[monthGZ.gan + monthGZ.zhi] + '</span> 日柱纳音：<span class=\"pill\">' + NAYIN[dayGZ.gan + dayGZ.zhi] + '</span></div>';"
if old_pillar in c:
    c = c.replace(old_pillar, new_pillar)
    changes += 1
    print(f"Change 2: Added 纳音 display in 八字排盘")
else:
    print("WARNING: Could not find 八字排盘 纳音 insertion point")

# ============================================================
# 3. 在开运建议中添加未来三年流年运势
# ============================================================
# Find the 流年提醒 section and extend it
old_liunian = "adviceHtml += '<div style=\"margin-top:16px;padding:16px;background:rgba(201,168,76,0.04);border-radius:8px;border:1px solid rgba(201,168,76,0.08);\">';\n    adviceHtml += '<p style=\"font-size:14px;color:var(--gold-light);margin-bottom:8px;\"><b>流年提醒（' + currentYear + '年 ' + curGZ.gan + curGZ.zhi + '年）</b></p>';"

# We need to find the full流年 block and replace it with an extended version
liunian_start = c.find("adviceHtml += '<div style=\"margin-top:16px;padding:16px;background:rgba(201,168,76,0.04);border-radius:8px;border:1px solid rgba(201,168,76,0.08);\">';")
liunian_end = c.find("adviceHtml += '</div>';", liunian_start)
if liunian_start >= 0 and liunian_end >= 0:
    # Find the end of this div (the next '</div>' after the one we found)
    liunian_end = c.find("adviceHtml += '</div>';", liunian_end + 10)
    
    old_block = c[liunian_start:liunian_end + 23]  # include the '</div>'; part
    
    new_block = """    adviceHtml += '<div style="margin-top:16px;padding:16px;background:rgba(201,168,76,0.04);border-radius:8px;border:1px solid rgba(201,168,76,0.08);">';
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
    // 未来三年流年
    for (var fy = 1; fy <= 3; fy++) {
        var ny = currentYear + fy;
        var ngz = calcYearGanZhi(ny);
        var nwx = WU_XING_GAN[ngz.gan];
        var nNayin = NAYIN[ngz.gan + ngz.zhi] || '';
        adviceHtml += '<div style="margin-top:12px;padding:10px 14px;background:rgba(61,50,42,0.3);border-radius:6px;border:1px solid rgba(201,168,76,0.06);">';
        adviceHtml += '<p style="font-size:13px;color:var(--gold-light);margin-bottom:4px;"><b>' + ny + '年 ' + ngz.gan + ngz.zhi + '年（' + nNayin + '）</b></p>';
        if (nwx === dayMaster) {
            adviceHtml += '<p style="font-size:13px;">比劫之年。此年社交活跃，人脉拓展，宜与人合作共事。但竞争亦多，需防小人争利。</p>';
        } else if (WU_XING_SHENG[nwx] === dayMaster) {
            adviceHtml += '<p style="font-size:13px;">印星之年。此年贵人运强，宜学习进修、提升自我。事业上有望获得上级赏识和提携。</p>';
        } else if (WU_XING_KE[nwx] === dayMaster) {
            adviceHtml += '<p style="font-size:13px;">官星之年。此年压力与机遇并存，宜谨言慎行，遵纪守法。若能沉着应对，可获晋升之机。</p>';
        } else if (nwx === WU_XING_KE[dayMaster]) {
            adviceHtml += '<p style="font-size:13px;">财星之年。此年财运亨通，正财偏财皆有收获。但需防因财致祸，宜理性投资，量入为出。</p>';
        } else {
            adviceHtml += '<p style="font-size:13px;">此年运势平稳过渡，宜稳扎稳打，不宜冒进。适合调整规划，积蓄力量。</p>';
        }
        // 纳音补充
        var nayinWX = '';
        if (nNayin.indexOf('金') >= 0) nayinWX = '金';
        else if (nNayin.indexOf('木') >= 0) nayinWX = '木';
        else if (nNayin.indexOf('水') >= 0) nayinWX = '水';
        else if (nNayin.indexOf('火') >= 0) nayinWX = '火';
        else if (nNayin.indexOf('土') >= 0) nayinWX = '土';
        if (nayinWX) {
            adviceHtml += '<p style="font-size:12px;color:var(--text-muted);">纳音' + nNayin + '，' + (nayinWX === weak ? '五行补' + weak + '气，对命主有利。' : '') + '</p>';
        }
        adviceHtml += '</div>';
    }
    adviceHtml += '</div>';"""
    
    c = c.replace(old_block, new_block)
    changes += 1
    print(f"Change 3: Extended 流年提醒 with 未来三年运势")
else:
    print("WARNING: Could not find 流年提醒 section")

# ============================================================
# 4. 在地支藏干中添加补充说明
# ============================================================
# 在五行格局中添加地支藏干分析
old_wuxing_end = "sections.push({ title: '五行格局', icon: WU_XING_ICON[dayMaster] || '☯', body: wxHtml });"
# Insert 藏干 analysis before this line
canggan_block = """
    // 地支藏干分析
    var cangHtml = '<p><b>地支藏干</b>：每个地支中藏有天干，对命局有微妙影响。</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">';
    var pillars2 = [
        {label:'年柱', zhi: yearGZ.zhi},
        {label:'月柱', zhi: monthGZ.zhi},
        {label:'日柱', zhi: dayGZ.zhi}
    ];
    if (hourInfo) pillars2.push({label:'时柱', zhi: hourInfo.zhi});
    for (var pi = 0; pi < pillars2.length; pi++) {
        var p = pillars2[pi];
        var cangs = DI_ZHI_CANG[p.zhi] || [];
        cangHtml += '<div style="padding:8px 12px;background:rgba(61,50,42,0.3);border-radius:6px;"><span style="color:var(--gold-dark);font-size:13px;">' + p.label + '</span> <span style="color:var(--gold-light);font-size:16px;">' + p.zhi + '</span> → ';
        for (var ci = 0; ci < cangs.length; ci++) {
            var cw = WU_XING_GAN[cangs[ci]] || '';
            cangHtml += '<span class="tag ' + (WU_XING_COLOR[cw] || '') + '" style="font-size:11px;">' + cangs[ci] + cw + '</span> ';
        }
        cangHtml += '</div>';
    }
    cangHtml += '</div>';
    cangHtml += '<p style="font-size:13px;color:var(--text-muted);margin-top:8px;">藏干影响命局的深层能量，' + dayGZ.zhi + '中藏' + (DI_ZHI_CANG[dayGZ.zhi] || []).join('、') + '，对日主' + dayMaster + '有直接影响。</p>';
    sections.push({ title: '地支藏干', icon: '藏', body: cangHtml });
"""

# Insert before the 性格心性 section
old_char_section = "sections.push({ title: '性格心性'"
c = c.replace(old_char_section, canggan_block + "\n    " + old_char_section)
changes += 1
print(f"Change 4: Added 地支藏干 section")

# ============================================================
# 5. 修复大运排盘中的随机数问题（起运年龄改为基于年份计算）
# ============================================================
old_startage = "var startAge = Math.floor(Math.random() * 8) + 2; // 2-9岁起运"
new_startage = "var startAge = ((sy * 7 + sm * 13 + sd * 17) % 8) + 2; // 基于日期的确定性起运年龄"
if old_startage in c:
    c = c.replace(old_startage, new_startage)
    changes += 1
    print(f"Change 5: Fixed 起运年龄 (random -> deterministic)")
else:
    print("WARNING: Could not find 起运年龄 line")

# ============================================================
# 写入
# ============================================================
with open(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print(f"\nTotal changes: {changes}")
