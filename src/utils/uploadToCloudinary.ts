import cloudinary from "../config/cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) reject(error);
        else if (result) resolve(result.secure_url);
        else reject(new Error("Cloudinary upload failed"));
      }
    );

    uploadStream.end(fileBuffer);
  });
};
