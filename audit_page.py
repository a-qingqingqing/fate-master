import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
if not m:
    print('未找到script标签')
    exit()
js = m.group(1)

# 1. 检查所有 getElementById 调用
get_elements = re.findall(r"getElementById\('(\w+)'\)", js)
html_ids = set(re.findall(r'id=["\'](\w+)["\']', html))

print('=== JS引用的ID vs HTML中的ID ===')
missing = []
for eid in sorted(set(get_elements)):
    if eid not in html_ids:
        missing.append(eid)
        print(f'  [缺失] {eid}')
    else:
        print(f'  [OK] {eid}')

if missing:
    print(f'\n⚠ 有 {len(missing)} 个ID在HTML中不存在！')
else:
    print(f'\n✓ 所有ID在HTML中都存在')

# 2. 括号平衡
opens = js.count('{') + js.count('(') + js.count('[')
closes = js.count('}') + js.count(')') + js.count(']')
print(f'\n=== 括号平衡 ===')
print(f'  {{: {js.count("{")}  }}: {js.count("}")}')
print(f'  (: {js.count("(")}  ): {js.count(")")}')
print(f'  [: {js.count("[")}  ]: {js.count("]")}')
if js.count('{') == js.count('}') and js.count('(') == js.count(')') and js.count('[') == js.count(']'):
    print('  ✓ 括号平衡')
else:
    print('  ⚠ 括号不平衡！')

# 3. var声明中混入函数调用
print(f'\n=== var声明语法检查 ===')
issues = []
lines = js.split('\n')
for i, line in enumerate(lines):
    stripped = line.strip()
    if 'var ' in stripped:
        var_idx = stripped.index('var ')
        after_var = stripped[var_idx+4:]
        depth = 0
        parts = []
        current = ''
        for ch in after_var:
            if ch == ',' and depth == 0:
                parts.append(current)
                current = ''
            else:
                if ch in '({[':
                    depth += 1
                elif ch in ')}]':
                    depth -= 1
                current += ch
        if current.strip():
            parts.append(current)
        for pi, part in enumerate(parts):
            part = part.strip()
            if re.search(r'\w+\.\w+\s*\(', part) and '=' not in part:
                if pi < len(parts) - 1 or not part.endswith(';'):
                    issues.append(f'  第{i+1}行(JS行): {stripped[:120]}')
                    break

if issues:
    print(f'⚠ 发现 {len(issues)} 个问题:')
    for iss in issues:
        print(iss)
else:
    print('  ✓ 未发现var声明混入表达式的问题')

# 4. 所有函数定义
funcs = re.findall(r'function\s+(\w+)\s*\(', js)
print(f'\n=== 已定义函数 ({len(funcs)}个) ===')
for f in sorted(funcs):
    print(f'  - {f}')

# 5. 事件绑定检查
print(f'\n=== addEventListener绑定的元素ID ===')
event_binds = re.findall(r"getElementById\('(\w+)'\)\.addEventListener", js)
for eb in sorted(set(event_binds)):
    if eb in html_ids:
        print(f'  [OK] {eb}')
    else:
        print(f'  [缺失] {eb} ← HTML中无此ID！')

print('\n=== 检查完成 ===')
