import re

with open(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

match = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
js = match.group(1)
lines = js.split('\n')

# Find lines 440-460
for i in range(439, min(460, len(lines))):
    print(f"=== Line {i+1} ===")
    print(lines[i])
    print()
