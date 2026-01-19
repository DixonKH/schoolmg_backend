import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: any, file) => {
    return {
      folder: `school/${req.user?.role}`,
      format: file.mimetype.split("/")[1],
      public_id: `${req.user?.id}`,
      transformation: [
    { width: 300, height: 300, crop: "fill" },
    { quality: "auto", fetch_format: "auto" }
  ],
    };
  },
});

export const upload = multer({ storage });
