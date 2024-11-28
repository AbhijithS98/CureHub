import multer from "multer";
import path from "path";
import fs from "fs";
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};
const userProfileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "public/userProfilePictures";
        ensureDirectoryExists(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});
const doctorProfileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/doctorDocuments");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only images are allowed!"), false);
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
