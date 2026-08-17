import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Override default body size limit so we can upload larger base64 images
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'media');

const getFileType = (filename: string): 'image' | 'document' | 'video' => {
  const ext = path.extname(filename).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico'].includes(ext)) return 'image';
  if (['.mp4', '.webm', '.ogg', '.mov'].includes(ext)) return 'video';
  return 'document';
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure the directory exists
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  if (req.method === 'GET') {
    try {
      const files = fs.readdirSync(UPLOADS_DIR);
      const mediaFiles = files.map((file) => {
        const filePath = path.join(UPLOADS_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          id: file, // use filename as ID
          name: file,
          type: getFileType(file),
          size: formatBytes(stats.size),
          url: `/uploads/media/${file}`,
          uploadedAt: new Date(stats.birthtime).toLocaleDateString()
        };
      });
      
      // Sort by newest first
      mediaFiles.sort((a, b) => {
        const timeA = fs.statSync(path.join(UPLOADS_DIR, a.name)).birthtime.getTime();
        const timeB = fs.statSync(path.join(UPLOADS_DIR, b.name)).birthtime.getTime();
        return timeB - timeA;
      });
      
      return res.status(200).json(mediaFiles);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to read media files' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, data } = req.body;
      if (!name || !data) {
        return res.status(400).json({ error: 'Missing name or data' });
      }

      const base64Data = data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Ensure unique filename
      let fileName = name.replace(/[^a-zA-Z0-9.\-_]/g, '_'); // Sanitize filename
      let counter = 1;
      const ext = path.extname(fileName);
      const baseName = path.basename(fileName, ext);
      
      while (fs.existsSync(path.join(UPLOADS_DIR, fileName))) {
        fileName = `${baseName}-${counter}${ext}`;
        counter++;
      }

      const filePath = path.join(UPLOADS_DIR, fileName);
      fs.writeFileSync(filePath, buffer);

      return res.status(200).json({ message: 'File uploaded successfully', url: `/uploads/media/${fileName}`, id: fileName });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to upload file' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query; // id is the filename
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing file id' });
      }

      const filePath = path.join(UPLOADS_DIR, id);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to delete file' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
