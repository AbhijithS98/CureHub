import multer, {FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const ensureDirectoryExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); 
  }
};

const userProfileStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const dir = "public/userProfilePictures";
    ensureDirectoryExists(dir); 
    cb(null, dir); 
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
  

const doctorProfileStorage = multer.diskStorage({
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

export const uploadUserProfilePicture = multer({
  storage: userProfileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}).single("profilePicture"); 

export const uploadDoctorDocuments = multer({
  storage: doctorProfileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}).fields([
  { name: "idProof", maxCount: 1 },
  { name: "medicalDegree", maxCount: 1 },
  { name: "profilePicture", maxCount: 1 }
]);