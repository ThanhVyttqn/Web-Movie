import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCommentsByMovie,
  createComment,
  deleteComment,
  updateComment,
} from "../../services/commentService";
import {
  getEpisodesByMovie,
  createEpisode,
  deleteEpisode,
} from "../../services/episodeServices";
import { getMovieById } from "../../services/moviesServices";
import AdminHeader from "../../components/AdminHeader";
import { toast, Toaster } from "react-hot-toast";

function AddComment({ movieId, onCommentAdded }) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComment({ movieId, commentText });
      setCommentText("");
      onCommentAdded();
      toast.success("Thêm bình luận thành công!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi thêm bình luận!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="w-full bg-gray-800/70 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        placeholder="Nhập bình luận..."
        required
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold transition"
      >
        Thêm bình luận
      </button>
    </form>
  );
}

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [episodes, setEpisodes] = useState([]);
  const [editEpisodeId, setEditEpisodeId] = useState(null);
  const [episodeForm, setEpisodeForm] = useState({
    title: "",
    episodeNumber: "",
    videoUrl: "",
  });

  const fetchData = async () => {
    try {
      const movieRes = await getMovieById(id);
      setMovie(movieRes.data.data);

      const commentRes = await getCommentsByMovie(id);
      setComments(Array.isArray(commentRes.data.data) ? commentRes.data.data : []);

      const episodeRes = await getEpisodesByMovie(id);
      setEpisodes(Array.isArray(episodeRes.data.data) ? episodeRes.data.data : []);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu phim hoặc bình luận.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDeleteComment = async (cmtId) => {
    try {
      await deleteComment(cmtId);
      toast.success("Xoá bình luận thành công!");
      fetchData();
    } catch (error) {
      toast.error("Lỗi khi xoá bình luận.");
    }
  };

  const handleEditComment = (comment) => {
    setEditId(comment._id);
    setCommentText(comment.commentText);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    try {
      await updateComment(editId, { commentText });
      toast.success("Cập nhật bình luận thành công!");
      setEditId(null);
      setCommentText("");
      fetchData();
    } catch (error) {
      toast.error("Lỗi khi cập nhật bình luận.");
    }
  };

  const handleEpisodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("movieId", id);
      formData.append("title", episodeForm.title);
      formData.append("episodeNumber", episodeForm.episodeNumber);
      if (episodeForm.videoUrl) {
        formData.append("video", episodeForm.videoUrl);
      }

      if (editEpisodeId) {
        toast.info("Chỉnh sửa video chưa hỗ trợ.");
      } else {
        await createEpisode(formData);
        toast.success("Thêm tập phim thành công!");
      }

      setEpisodeForm({ title: "", episodeNumber: "", videoUrl: "" });
      setEditEpisodeId(null);
      fetchData();
    } catch (error) {
      toast.error("Lỗi xử lý tập phim.");
    }
  };

  const handleEpisodeDelete = async (epId) => {
    try {
      await deleteEpisode(epId);
      toast.success("Xoá tập phim thành công!");
      fetchData();
    } catch (error) {
      toast.error("Lỗi khi xoá tập phim.");
    }
  };

  const handleEpisodeEdit = (ep) => {
    setEditEpisodeId(ep._id);
    setEpisodeForm({
      title: ep.title,
      episodeNumber: ep.episodeNumber,
      videoUrl: ep.videoUrl,
    });
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-xl animate-pulse">Đang tải...</p>
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white px-4 py-12 font-poppins">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Movie Info */}
          <div className="bg-gray-900/90 p-6 rounded-xl shadow-2xl">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={movie.imageUrl}
                alt={movie.title}
                className="w-full md:w-1/3 h-60 object-cover rounded-lg shadow"
              />
              <div className="md:w-2/3 space-y-3">
                <h2 className="text-3xl font-bold text-yellow-300">{movie.title}</h2>
                <p><b>Mô tả:</b> {movie.description || "Không có mô tả"}</p>
                <p><b>Ngày phát hành:</b> {movie.releaseDate?.slice(0, 10) || "Không rõ"}</p>
                <p><b>Thể loại:</b> {Array.isArray(movie.category) ? movie.category.map(c => c.name).join(", ") : "Không rõ"}</p>
              </div>
            </div>
          </div>

          {/* Episodes */}
          <div className="bg-gray-900/90 p-6 rounded-xl shadow-2xl">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">Danh sách tập phim</h3>
            {episodes.length === 0 ? (
              <p className="text-gray-400">Chưa có tập phim nào.</p>
            ) : (
              <ul className="space-y-3">
                {episodes.map((ep) => (
                  <li key={ep._id} className="bg-gray-800/30 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-white font-semibold">Tập {ep.episodeNumber}: {ep.title}</span>
                    <div className="space-x-3 text-sm">
                      
                      <button onClick={() => handleEpisodeDelete(ep._id)} className="text-red-500 hover:underline">Xoá</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Episode Form */}
            <form onSubmit={handleEpisodeSubmit} className="mt-6 space-y-3">
              <input
                type="text"
                value={episodeForm.title}
                onChange={(e) => setEpisodeForm({ ...episodeForm, title: e.target.value })}
                placeholder="Tiêu đề tập"
                required
                className="w-full bg-gray-800 text-white rounded px-4 py-2"
              />
              <input
                type="number"
                value={episodeForm.episodeNumber}
                onChange={(e) => setEpisodeForm({ ...episodeForm, episodeNumber: e.target.value })}
                placeholder="Số tập"
                required
                className="w-full bg-gray-800 text-white rounded px-4 py-2"
              />
              <div className="relative">
                <label
                  htmlFor="videoUpload"
                  className="inline-block cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {episodeForm.videoUrl?.name || "Chọn tệp video"}
                </label>
                <input
                  id="videoUpload"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setEpisodeForm({ ...episodeForm, videoUrl: e.target.files[0] })}
                  className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer"
                  required={!editEpisodeId}
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                  {editEpisodeId ? "Cập nhật tập phim" : "Thêm tập phim"}
                </button>
                {editEpisodeId && (
                  <button type="button" onClick={() => {
                    setEditEpisodeId(null);
                    setEpisodeForm({ title: "", episodeNumber: "", videoUrl: "" });
                  }} className="bg-gray-600 text-white px-4 py-2 rounded">Huỷ</button>
                )}
              </div>
            </form>
          </div>

          {/* Comments */}
          <div className="bg-gray-900/90 p-6 rounded-xl shadow-2xl">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">Bình luận</h3>

            {!editId ? (
              <AddComment movieId={id} onCommentAdded={fetchData} />
            ) : (
              <form onSubmit={handleUpdateComment} className="space-y-3 mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                  className="w-full bg-gray-800 text-white rounded px-4 py-2"
                />
                <div className="flex gap-3">
                  <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded">Cập nhật</button>
                  <button type="button" onClick={() => { setEditId(null); setCommentText(""); }} className="bg-gray-600 text-white px-4 py-2 rounded">Huỷ</button>
                </div>
              </form>
            )}

            {comments.length === 0 ? (
              <p className="text-gray-400">Chưa có bình luận nào.</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="border-b border-gray-700 py-3">
                  <p className="font-semibold">{c.userId?.userName || "Ẩn danh"}</p>
                  <p>{c.commentText}</p>
                  <div className="text-sm mt-1 space-x-3">
                    <button onClick={() => handleEditComment(c)} className="text-yellow-400 hover:underline">Sửa</button>
                    <button onClick={() => handleDeleteComment(c._id)} className="text-red-500 hover:underline">Xoá</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

export default MovieDetail;
