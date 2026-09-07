import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('vendor') && !file.includes('.git') && !file.includes('node_modules')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.php')) results.push(file);
    }
  });
  return results;
}

const backendDir = 'c:\\Users\\Lenovo\\Documents\\Downloads\\backend_BB_fixed_v5';
const files = walk(backendDir);
let count = 0;

for (const file of files) {
  const buf = fs.readFileSync(file);
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    fs.writeFileSync(file, buf.slice(3));
    console.log('Removed BOM from:', file);
    count++;
  }
}

console.log('Cleaned', count, 'files.');
