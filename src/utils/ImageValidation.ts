import { Express } from "express";

export const validateImage = (file?: Express.Multer.File, required = true): string | undefined => {
  if (required && file===undefined) {
    return "File is required.";
  }
  if (file && !file.mimetype.startsWith("image/")) {
    return "Only image files are allowed.";
  }
};
