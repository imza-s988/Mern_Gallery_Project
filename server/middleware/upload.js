import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(dirname, "..", "uploads");
if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination:(req, file, cb)=>
        cb(null, uploadDir),
        filename:(req, file, cb)=>{
const ext = path.extname(file.originalname).toLowerCase();
const baseName = path.basename(file.originalname, ext).
replace(/\s+/g, "-")
.replace(/^-+|-+$/g, "")
.toLowerCase()
.slice(0, 40);
cb(null, `${baseName}-${Date.now()}${ext}`);
        },
});
    
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};  
export default multer({ storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },

 });