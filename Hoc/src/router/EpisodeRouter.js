import express from "express";
import multer from "multer";
import { getAllEpisode, addEpisode, deleteEpisode, updateEpisode, getEpisodeById } from "../controllers/EpisodeController.js";
import { checkAuth } from "../middlewares/CheckAuth.js";
import { storage } from "../config/cloudinary.js"; 

const routerEpisode = express.Router();

// Dùng Cloudinary storage
const upload = multer({ storage });

// API: Lấy tất cả tập phim theo movieId
routerEpisode.get('/:movieId', getAllEpisode);

// API: Lấy tập phim theo ID (xem tập)
routerEpisode.get('/watch/:id', getEpisodeById);

// API: Thêm tập phim mới với video (dùng Cloudinary)
routerEpisode.post('/', upload.single("video"), addEpisode);

// API: Cập nhật tập phim
routerEpisode.put('/:episodeId', updateEpisode);

// API: Xoá tập phim
routerEpisode.delete('/:episodeId', deleteEpisode);

export default routerEpisode;
