import { v2 as cloudinary } from 'cloudinary';
import { CLOUD_NAME, API_KEY, API_SECRET } from '../constants/index.js';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(file, {
    folder: 'contacts',
    resource_type: 'image',
  });
  return result.secure_url;
};
