// Gộp hai phiên bản MovieDetailUser
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../../services/moviesServices';
import {
  getCommentsByMovie,
  createComment,
  updateComment,
  deleteComment,
} from '../../services/commentService';
import {
  addFavorite,
  deleteFavorite,
  getFavorite,
} from '../../services/favoriteServices';
import { getEpisodesByMovie } from '../../services/episodeServices';
import { UserContext } from '../../context/UserContext';
import Header from '../../components/Header';
import { totalView } from '../../services/viewServices';
import { FaPlay, FaHeart, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function MovieDetailUser() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editId, setEditId] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [view, setView] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const movieRes = await getMovieById(id);
        setMovie(movieRes.data.data);

        const commentRes = await getCommentsByMovie(id);
        setComments(Array.isArray(commentRes.data.data) ? commentRes.data.data : []);

        const episodeRes = await getEpisodesByMovie(id);
        setEpisodes(Array.isArray(episodeRes.data.data) ? episodeRes.data.data : []);

        if (user?._id) {
          const favoriteRes = await getFavorite(user._id);
          const isFavorite = favoriteRes.data?.data?.some((f) => f._id === id);
          setFavorite(isFavorite);
        }

        const viewRes = await totalView(id);
        setView(viewRes.data.totalViews);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu.';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Bạn cần đăng nhập để bình luận.');
      return;
    }
    if (!commentText.trim()) {
      toast.error('Nội dung bình luận không được để trống.');
      return;
    }
    try {
      if (editId) {
        await updateComment(editId, { commentText });
        toast.success('Cập nhật bình luận thành công.');
      } else {
        await createComment({ movieId: id, userId: user._id, commentText });
        toast.success('Thêm bình luận thành công.');
      }
      setCommentText('');
      setEditId(null);
      const commentRes = await getCommentsByMovie(id);
      setComments(Array.isArray(commentRes.data.data) ? commentRes.data.data : []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi gửi bình luận.';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm('Bạn có chắc muốn xóa bình luận này?')) {
      try {
        await deleteComment(commentId);
        setComments(comments.filter((c) => c._id !== commentId));
        toast.success('Xóa bình luận thành công.');
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa bình luận.';
        toast.error(errorMessage);
      }
    }
  };

  const handleEdit = (comment) => {
    setEditId(comment._id);
    setCommentText(comment.commentText);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Bạn cần đăng nhập để yêu thích phim.');
      return;
    }
    try {
      if (favorite) {
        await deleteFavorite(user._id, id);
        setFavorite(false);
        toast.success('Đã xóa khỏi yêu thích.');
      } else {
        await addFavorite(user._id, id);
        setFavorite(true);
        toast.success('Đã thêm vào yêu thích.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật yêu thích.';
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white px-4 py-12">
        <Header />
        <div className="max-w-6xl mx-auto">
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white px-4 py-12 font-poppins">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="bg-gray-900/90 rounded-xl shadow-2xl overflow-hidden p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <img
                  src={movie.imageUrl}
                  alt={`Poster phim ${movie.title}`}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-4xl font-extrabold text-red-400">{movie.title}</h2>
                <p className="italic text-yellow-300">{movie.englishTitle}</p>
                <p><strong>Mô tả:</strong> {movie.description}</p>
                <p><strong>Ngày phát hành:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
                <p><strong>Thể loại:</strong> {movie.category?.map(c => c.name).join(', ')}</p>
                <p><strong>Lượt xem:</strong> {view}</p>
                <button
                  onClick={handleToggleFavorite}
                  className={`mt-2 px-5 py-2 rounded-full font-semibold shadow-md transition ${favorite ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  <FaHeart className="inline mr-2" />
                  {favorite ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/90 rounded-xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-yellow-300 mb-6">Tập phim</h3>
            {episodes.length === 0 ? (
              <p className="text-gray-400">Chưa có tập phim nào.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {episodes.map((ep, index) => (
                  <button
                    key={ep._id}
                    onClick={() => navigate(`/watch/${ep._id}`)}
                    className="bg-gray-700 hover:bg-yellow-500 hover:text-black text-white font-semibold py-2 px-5 rounded-full shadow"
                  >
                    Tập {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-900/90 rounded-xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-yellow-300 mb-6">Bình luận</h3>
            {user && (
              <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder={editId ? 'Chỉnh sửa bình luận...' : 'Viết bình luận...'}
                  rows={4}
                  className="w-full bg-gray-800 rounded-lg p-3 text-white placeholder-gray-400"
                  required
                />
                <div className="flex gap-3 mt-2">
                  <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">
                    {editId ? 'Cập nhật' : 'Gửi'}
                  </button>
                  {editId && (
                    <button type="button" onClick={() => { setEditId(null); setCommentText(''); }} className="bg-gray-600 text-white px-4 py-2 rounded-full font-bold">
                      <FaTimes className="inline mr-2" /> Hủy
                    </button>
                  )}
                </div>
              </form>
            )}
            <div className="space-y-4">
              {comments.map((c) => {
                const isOwner = user && user._id === c.userId?._id;
                return (
                  <div key={c._id} className="bg-gray-800 rounded-lg p-4">
                    <p className="font-bold text-yellow-300">{c.userId?.userName || 'Ẩn danh'}</p>
                    <p className="text-sm text-gray-300 mt-1">{c.commentText}</p>
                    {isOwner && (
                      <div className="flex gap-3 mt-2">
                        <button onClick={() => handleEdit(c)} className="text-blue-400 hover:underline text-sm">
                          <FaEdit className="inline mr-1" /> Sửa
                        </button>
                        <button onClick={() => handleDelete(c._id)} className="text-red-400 hover:underline text-sm">
                          <FaTrash className="inline mr-1" /> Xóa
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
