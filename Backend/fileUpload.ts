

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('This is the dir name',__dirname)


import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const fileMimeTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/jpg": "jpg",
};

export const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {

      const dir = path.join(__dirname, 'public','images');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true,
            }); 
        }
      cb(null, dir); 
    },
    filename: (req, file, cb) => {
      const ext =
        fileMimeTypes[file.mimetype as keyof typeof fileMimeTypes] ||
        path.extname(file.originalname);
      const filename = uuidv4() + "." + ext;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});
