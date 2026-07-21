import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
if not m:
    print('No script tag')
    exit()

js = m.group(1)

pos = 0
total = 0
missing = 0
while True:
    idx = js.find('parseInt', pos)
    if idx == -1:
        break
    total += 1
    paren_start = js.find('(', idx)
    if paren_start == -1:
        break
    depth = 1
    i = paren_start + 1
    while i < len(js) and depth > 0:
        if js[i] == '(':
            depth += 1
        elif js[i] == ')':
            depth -= 1
        i += 1
    full_call = js[idx:i]
    if ',10' not in full_call:
        missing += 1
        print('[MISSING] ' + full_call[:120])
    pos = i

print('\nTotal: %d parseInt calls' % total)
if missing == 0:
    print('OK - All have radix 10')
else:
    print('WARNING: %d missing radix' % missing)
