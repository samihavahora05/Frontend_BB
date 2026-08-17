import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Candidate video paths
  const videoPaths = [
    "C:\\Users\\Lenovo\\Documents\\Downloads\\Internship.mp4",
    path.join(process.cwd(), "public", "uploads", "Internship.mp4"),
    path.join(process.cwd(), "public", "Internship.mp4"),
  ];

  let targetPath = videoPaths.find(p => fs.existsSync(p));

  if (!targetPath) {
    return res.status(404).send("Video file not found");
  }

  const stat = fs.statSync(targetPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(targetPath, { start, end });
    
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    });
    file.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(targetPath).pipe(res);
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
