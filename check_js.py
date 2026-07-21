import re
import subprocess

# Read the HTML
with open(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

match = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
js = match.group(1)

# Save JS to a temp file for Node to check
with open(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\_temp_check.js', 'w', encoding='utf-8') as f:
    f.write(js)

# Use Node to check syntax
result = subprocess.run(
    ['node', '--check', r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\_temp_check.js'],
    capture_output=True, text=True
)
print("stdout:", result.stdout)
print("stderr:", result.stderr)
print("returncode:", result.returncode)

# Also check balanced brackets
braces = 0
parens = 0
brackets = 0
for c in js:
    if c == '{': braces += 1
    elif c == '}': braces -= 1
    elif c == '(': parens += 1
    elif c == ')': parens -= 1
    elif c == '[': brackets += 1
    elif c == ']': brackets -= 1

print(f"\nBraces: {braces}, Parens: {parens}, Brackets: {brackets}")
