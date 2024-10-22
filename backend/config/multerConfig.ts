import multer, {FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";


const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "public/doctorDocuments");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
  
});

const fileFilter = (req: Request, file: Express.Multer.File, cb:FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!") as any, false);
  }
};

export const multerUploadDoctorProfile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});