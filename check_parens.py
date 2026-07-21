import re

with open(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

match = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
js = match.group(1)
lines = js.split('\n')

depth = 0
for i, line in enumerate(lines):
    stripped = line.strip()
    for c in stripped:
        if c == '(':
            depth += 1
        elif c == ')':
            depth -= 1
    
    if depth != 0 and i > 5:
        # Check if it recovers
        check_depth = depth
        for j in range(i+1, min(i+15, len(lines))):
            for c in lines[j]:
                if c == '(':
                    check_depth += 1
                elif c == ')':
                    check_depth -= 1
            if check_depth == 0:
                break
        if check_depth != 0:
            print(f"Line {i+1}: depth={depth}, UNCLOSED! -> {stripped[:100]}")

print(f"\nFinal depth: {depth}")

# Also check the new_gen.txt
with open(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\new_gen.txt', 'r', encoding='utf-8') as f:
    new_gen = f.read()
d = 0
for c in new_gen:
    if c == '(': d += 1
    elif c == ')': d -= 1
print(f"\nnew_gen.txt paren depth: {d}")
