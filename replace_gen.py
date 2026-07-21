import re

# Read the HTML file
with open(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the script tag
match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if not match:
    print("No script tag found")
    exit(1)

js = match.group(1)
script_start = match.start(1)
script_end = match.end(1)

# Find the generateReading function boundaries
gen_start = js.find('function generateReading')
gen_end = js.find('function renderResult', gen_start)

if gen_start == -1 or gen_end == -1:
    print("Could not find function boundaries")
    exit(1)

# Read the new function
with open(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\new_gen.txt', 'r', encoding='utf-8') as f:
    new_func = f.read()

# Replace in JS
new_js = js[:gen_start] + new_func + '\n' + js[gen_end:]
new_content = content[:script_start] + new_js + content[script_end:]

with open(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Replaced {gen_end - gen_start} chars with {len(new_func)} chars")
print("Done!")
