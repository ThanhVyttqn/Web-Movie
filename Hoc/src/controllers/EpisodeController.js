import EpisodeModel from "../models/EpisodeModel.js";
import MovieModels from "../models/MovieModels.js";
import { cloudinary } from "../config/cloudinary.js";

export const getAllEpisode = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const episodes = await EpisodeModel.find({ movieId });
    return res.status(200).json({
      message: "Các tập phim của bộ phim",
      data: episodes,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addEpisode = async (req, res) => {
  try {
    const { movieId, title, episodeNumber } = req.body;

    const movie = await MovieModels.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Phim không tồn tại" });

    if (!req.file) {
      return res.status(400).json({ message: "Thiếu file video" });
    }

    const { path: videoUrl, filename: publicId } = req.file;
    console.log('videoUrl:', videoUrl); // nên là đường dẫn đầy đủ
    console.log('publicId:', publicId); 
    const episode = new EpisodeModel({
      movieId,
      title,
      episodeNumber,
      videoUrl,
      publicId,
    });
    

    await episode.save();

    return res.status(201).json({
      message: "Thêm tập phim thành công",
      data: episode,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateEpisode = async (req, res) => {
  try {
    const { episodeId } = req.params;
    const { title, episodeNumber, videoUrl } = req.body;

    const updated = await EpisodeModel.findByIdAndUpdate(
      episodeId,
      { title, episodeNumber, videoUrl },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy tập phim" });
    }

    return res.status(200).json({ message: "Cập nhật thành công", data: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEpisode = async (req, res) => {
  try {
    const { episodeId } = req.params;

    // Xoá trong MongoDB
    const episode = await EpisodeModel.findByIdAndDelete(episodeId);
    if (!episode) {
      return res.status(404).json({ message: "Không tìm thấy tập phim để xoá" });
    }
    if (episode.publicId) {
      const result = await cloudinary.uploader.destroy(episode.publicId, {
        resource_type: "video",
      });
      console.log("Kết quả xoá Cloudinary:", result);
    }

    return res.status(200).json({ message: "Xoá tập phim thành công" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getEpisodeById = async (req, res) => {
  try {
    const episode = await EpisodeModel.findById(req.params.id);
    if (!episode) {
      return res.status(404).json({ message: "Không tìm thấy tập phim" });
    }
    return res.status(200).json({ message: "Lấy tập phim thành công", data: episode });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
