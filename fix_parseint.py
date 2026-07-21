import re

with open(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\index.html', 'r', encoding='utf-8') as f:
    c = f.read()

count = 0
result = ''
i = 0
while i < len(c):
    if c[i:i+9] == 'parseInt(':
        depth = 1
        j = i + 9
        while j < len(c) and depth > 0:
            if c[j] == '(':
                depth += 1
            elif c[j] == ')':
                depth -= 1
            j += 1
        inner = c[i+9:j-1]
        if ',' not in inner:
            result += 'parseInt(' + inner + ', 10)'
            count += 1
        else:
            result += c[i:j]
        i = j
    else:
        result += c[i]
        i += 1

with open(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master\index.html', 'w', encoding='utf-8') as f:
    f.write(result)

print(f'Fixed {count} parseInt calls')
