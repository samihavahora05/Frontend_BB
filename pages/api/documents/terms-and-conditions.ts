import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'public', 'documents', 'terms-and-conditions.pdf');
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Terms and Conditions PDF not found.' });
  }

  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Length': stat.size,
    'Content-Disposition': 'inline; filename="BlueBoxx_Internship_Terms_and_Conditions.pdf"',
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
}
