import { Router } from "express";
import { uploadVideo, removeUpload } from "../controllers/UploadController.js";
import {cloudinary, storage}  from "../config/cloudinary.js";
import multer from "multer";

const routerUpload = Router();

const upload = multer({storage:storage}); 

routerUpload.post("/upload", upload.array("videos", 5), uploadVideo); 
routerUpload.delete('/remove/video-of-webmovie/:publicId', removeUpload);


export default routerUpload;