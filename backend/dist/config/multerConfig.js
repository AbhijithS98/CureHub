import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
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
export const uploadDoctorDocuments = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}).fields([
    { name: "idProof", maxCount: 1 },
    { name: "medicalDegree", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 }
]);
