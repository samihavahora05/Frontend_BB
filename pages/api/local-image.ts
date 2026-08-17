import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const filePath = "C:\\Users\\urvashi\\.gemini\\antigravity-ide\\brain\\86ac5cf1-e8d1-442d-9393-64e8c72b13cc\\lms_auth_bg_1782545356066.png";
    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': stat.size
    });
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load image' });
  }
}
