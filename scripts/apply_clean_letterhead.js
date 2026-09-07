import fs from 'fs';
import path from 'path';

const cleanBgSrc = 'C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\6e693337-20d3-44e2-a4f2-e110f3f41864\\.user_uploaded\\media_1788779705786.png';
const backend = 'c:\\Users\\Lenovo\\Documents\\Downloads\\backend_BB_fixed_v5';

const destDirs = [
  path.join(backend, 'public', 'images'),
  path.join(backend, 'storage', 'app'),
  path.join(backend, 'resources', 'views', 'pdf')
];

for (const d of destDirs) {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
  fs.copyFileSync(cleanBgSrc, path.join(d, 'letterhead_bg.png'));
  console.log('Copied clean letterhead background to', path.join(d, 'letterhead_bg.png'));
}
