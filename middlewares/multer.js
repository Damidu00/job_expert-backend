// import multer from "multer";

// const storage = multer.memoryStorage();
// export const singleUpload = multer({storage}).single("file");


import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory as buffers

const upload = multer({ storage });

// Create separate upload handlers for different file types
const singleUpload = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]);

export { singleUpload };
