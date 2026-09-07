import fs from 'fs';
import path from 'path';

const pdfDir = 'c:\\Users\\Lenovo\\Documents\\Downloads\\backend_BB_fixed_v5\\storage\\app\\private\\appointment_letters';
const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
files.sort((a, b) => fs.statSync(path.join(pdfDir, b)).mtimeMs - fs.statSync(path.join(pdfDir, a)).mtimeMs);

const latest = path.join(pdfDir, files[0]);
console.log('Inspecting:', latest);

const content = fs.readFileSync(latest, 'latin1');
const matches = content.match(/\/Type\s*\/Page\b/g);
console.log('TOTAL PAGES:', matches ? matches.length : 0);
