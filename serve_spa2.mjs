import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, resolve, extname } from 'path';
const DIST = resolve('dist');
const PORT = 8791;
const mime = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.webmanifest':'application/manifest+json', '.woff2':'font/woff2', '.woff':'font/woff', '.ttf':'font/ttf', '.map':'application/json', '.md':'text/plain', '.txt':'text/plain' };
const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let p = url.pathname;
  if (p === '/') p = '/index.html';
  const fsPath = join(DIST, decodeURIComponent(p));
  let isFile = false;
  try { isFile = statSync(fsPath).isFile(); } catch {}
  if (isFile) {
    const data = readFileSync(fsPath);
    res.writeHead(200, {'Content-Type': mime[extname(fsPath)] || 'application/octet-stream'});
    res.end(data);
    return;
  }
  const html = readFileSync(join(DIST, 'index.html'));
  res.writeHead(200, {'Content-Type':'text/html'});
  res.end(html);
});
server.listen(PORT, '127.0.0.1', () => console.log('SPA server on http://127.0.0.1:' + PORT));
