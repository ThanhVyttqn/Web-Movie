import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: 'dqgeh9zmw',
    api_key: '317913369387152',
    api_secret: 'igzTYTH9bQjllI-fmuU3BhFBpZQ' // Click 'View API Keys' above to copy your API secret
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "video-of-webmovie",
    resource_type: 'video',
    format: async () => 'mp4',
  }  
});
export {cloudinary, storage};
