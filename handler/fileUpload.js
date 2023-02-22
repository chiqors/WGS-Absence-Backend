import multer from 'multer';
import fs from 'fs';

export const avatarUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (!fs.existsSync(`public/uploads/${req.body.username}`)) {
                fs.mkdirSync(`public/uploads/${req.body.username}`, { recursive: true });
            }
            cb(null, `public/uploads/${req.body.username}/`);
        },
        filename: (req, file, cb) => {
            cb(null, 'profile_picture.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            // accept a file
            cb(null, true);
        } else {
            // reject a file
            cb(null, false);
        }
    },
    limits: {
        // 5 MB
        fileSize: 1024 * 1024 * 5
    },
    preservePath: true,
});