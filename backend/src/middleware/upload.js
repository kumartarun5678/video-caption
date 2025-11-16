import multer from "multer";
import path from "path";
import fs from "fs/promises";
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const ensureUploadsDir = async () => {
    try {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
    }
    catch (error) {
        console.error('Error creating uploads directory:', error);
    }
};
ensureUploadsDir();
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['video/mp4', 'video/quicktime'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only MP4 videos are allowed.'));
        }
    },
});
export const uploadSingle = upload.single('video');
export const uploadMultiple = upload.array('videos', 5);