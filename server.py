import http.server
import socketserver
import os
import sys

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765

os.chdir(r'D:\lingxi-claw\20260715-19-18-37-585\fate-master')

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(('0.0.0.0', port), Handler) as httpd:
    print('Serving on 0.0.0.0:' + str(port))
    httpd.serve_forever()
