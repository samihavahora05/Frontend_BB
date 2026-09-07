import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

const pagesDir = path.join(process.cwd(), 'pages');
const files = walk(pagesDir);
let issues = [];

files.forEach(f => {
  const rel = path.relative(pagesDir, f);
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const match = line.match(/from\s+['"](\.\.[^'"]+)['"]/);
    if (match) {
      const impPath = match[1];
      const targetAbs = path.resolve(path.dirname(f), impPath);
      let exists = fs.existsSync(targetAbs) || 
                   fs.existsSync(targetAbs + '.ts') || 
                   fs.existsSync(targetAbs + '.tsx') || 
                   fs.existsSync(targetAbs + '.js') || 
                   fs.existsSync(targetAbs + '.jsx') || 
                   fs.existsSync(path.join(targetAbs, 'index.ts')) || 
                   fs.existsSync(path.join(targetAbs, 'index.tsx'));
      if (!exists) {
        issues.push({ file: rel, fullPath: f, lineNum: idx + 1, oldImport: impPath });
      }
    }
  });
});

console.log('Broken relative imports found:', issues.length);
issues.forEach(i => console.log(`${i.file} [line ${i.lineNum}]: ${i.oldImport}`));

// Auto fix if it just needs an extra ../
issues.forEach(i => {
  const corrected = '../' + i.oldImport;
  const targetAbs = path.resolve(path.dirname(i.fullPath), corrected);
  let exists = fs.existsSync(targetAbs) || 
               fs.existsSync(targetAbs + '.ts') || 
               fs.existsSync(targetAbs + '.tsx') || 
               fs.existsSync(path.join(targetAbs, 'index.ts')) || 
               fs.existsSync(path.join(targetAbs, 'index.tsx'));
  if (exists) {
    let content = fs.readFileSync(i.fullPath, 'utf8');
    content = content.replace(new RegExp(`(['"])${i.oldImport.replace(/\./g, '\\.')}(['"])`, 'g'), `$1${corrected}$2`);
    fs.writeFileSync(i.fullPath, content, 'utf8');
    console.log(`FIXED: ${i.file} -> ${corrected}`);
  }
});
