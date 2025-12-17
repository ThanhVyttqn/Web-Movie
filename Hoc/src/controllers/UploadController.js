import { cloudinary } from "../config/cloudinary.js";


export const uploadVideo = async(req, res) =>{
    try {
        const uploadedVideos = req.files.map(file => ({
      url: file.path,           // secure_url
      publicId: file.filename,  // public_id trên Cloudinary
      format: file.format,      // mp4, avi...
      size: file.size,
    }));

    return res.status(200).json({
      message: "Upload thành công",
      datas: uploadedVideos
    });
  } catch (error) {
    return res.status(400).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const removeUpload = async(req , res) => {
    try {
        const rawId = req.params.publicId;
        const publicId = `video-of-webmovie/${rawId}`; 

        console.log("publicId received:", publicId);

        const results = await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
        });

        if (results.result === "not found") {
            throw new Error("Xóa video không thành công");
        }

        return res.status(200).json({
            message: "Xóa video thành công"
        });

    } catch (error) {
        return res.status(400).json({
            name: error.name,
            message: error.message,
        });
    }
};
