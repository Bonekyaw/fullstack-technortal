import multer, { FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/image");
    // const type = file.mimetype.split("/")[0];
    // if (type === "image") {
    //     cb(null, "upload/image");
    // } else {
    //     cb(null, "upload/files");
    // }
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    // To accept the file pass `true`, like so:
    cb(null, true);
  } else {
    // You can always pass an error if something goes wrong:
    cb(
      new Error("Invalid File Type. Only PNG, JPG, JPEG and WEBP are allowed.")
    );
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 7 }, // 7 MB
});

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 7 }, // 7 MB
});

export default upload;
