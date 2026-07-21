import re

with open(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find script
match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if not match:
    print("ERROR: No script tag found!")
    exit(1)

js = match.group(1)
print(f"=== 基础统计 ===")
print(f"HTML大小: {len(content)} 字符")
print(f"JS大小: {len(js)} 字符, {len(js.split(chr(10)))} 行")

# Bracket balance
for name, o, c in [('{}', '{', '}'), ('()', '(', ')'), ('[]', '[', ']')]:
    opens = js.count(o)
    closes = js.count(c)
    diff = opens - closes
    status = "OK" if diff == 0 else f"WARNING: diff={diff}"
    print(f"  {name}: open={opens}, close={closes} -> {status}")

# Check DOMContentLoaded
if 'DOMContentLoaded' not in js:
    print("\nERROR: No DOMContentLoaded listener!")

# Check IDs
ids_in_js = set(re.findall(r"getElementById\('([^']+)'", js))
ids_in_html = set(re.findall(r'id="([^"]+)"', content))
missing = ids_in_js - ids_in_html
if missing:
    print(f"\nWARNING: JS引用了HTML中不存在的ID: {missing}")

# Check for undefined variables (var/let/const)
var_names = set(re.findall(r'(?:var|let|const)\s+(\w+)', js))
# Check function declarations
func_names = set(re.findall(r'function\s+(\w+)', js))
# Check if variables used before declared
print(f"\n定义的变量数: {len(var_names)}")
print(f"定义的函数数: {len(func_names)}")

# Check HTML structure
print(f"\n=== HTML结构检查 ===")
for tag in ['div', 'span', 'p', 'select', 'option', 'button', 'h1', 'h2']:
    opens = len(re.findall(f'<{tag}[\\s>]', content))
    closes = content.count(f'</{tag}>')
    if opens != closes:
        print(f"  {tag}: {opens} opens, {closes} closes (diff={opens-closes})")

# Check for potential JS issues
print(f"\n=== 潜在JS问题 ===")
# Check for console.log
if 'console.log' in js:
    print("  INFO: 包含console.log语句")

# Check for potential NaN issues
if 'parseInt' in js:
    # Ensure all parseInt have radix
    pi_calls = re.findall(r'parseInt\s*\(', js)
    radix_calls = re.findall(r'parseInt\s*\([^,]+,\s*\d+', js)
    if len(pi_calls) != len(radix_calls):
        print(f"  WARNING: parseInt调用({len(pi_calls)})中部分缺少进制参数({len(radix_calls)}有进制)")

# Check event listeners
if 'addEventListener' not in js:
    print("  ERROR: No event listeners!")

# Check for onclick in HTML
onclicks = re.findall(r'onclick\s*=', content)
if onclicks:
    print(f"  INFO: HTML中有{len(onclicks)}个onclick属性")

# Check CSS
print(f"\n=== CSS检查 ===")
style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if style_match:
    css = style_match.group(1)
    print(f"  CSS大小: {len(css)} 字符")
    # Check for missing closing braces
    opens = css.count('{')
    closes = css.count('}')
    if opens != closes:
        print(f"  WARNING: CSS大括号不平衡! open={opens}, close={closes}")

# Check Google Fonts
if 'fonts.googleapis.com' not in content:
    print("  WARNING: 未加载Google Fonts")

# Check viewport
if 'viewport' not in content:
    print("  WARNING: 缺少viewport meta标签")

print(f"\n=== 检查完成 ===")
