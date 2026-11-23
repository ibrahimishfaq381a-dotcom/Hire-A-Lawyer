import multer from 'multer';

// ─────────────────────────────────────────────────────────────────────────
// ✅ NEW: Dedicated multer instance for chat image uploads.
// This is a SEPARATE file from the existing "multer.js" middleware so that
// the existing upload flows (lawyer registration image, case study PDF)
// are not touched or modified in any way.
// ─────────────────────────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Reuses the exact same existing upload folder as the rest of the app
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    // Unique filename so multiple chat images never overwrite each other
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalExt = file.originalname.split('.').pop();
    cb(null, `chat-${uniqueSuffix}.${originalExt}`);
  }
});

// Only these image formats are allowed for chat image sharing
const allowedExtensions = /^(jpe?g|png|webp)$/i;
const allowedMimeTypes = /^image\/(jpeg|jpg|png|webp)$/i;

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.split('.').pop();
  const extValid = allowedExtensions.test(ext);
  const mimeValid = allowedMimeTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
  }
};

export const chatImageUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per image
});