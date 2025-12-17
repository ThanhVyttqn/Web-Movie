import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { getAllMovies, deleteMovie } from "../../services/moviesServices";
import MovieForm from "./movieForm";
import { Link } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const res = await getAllMovies();
      setMovies(res.data.data);
    } catch (err) {
      toast.error("Không tìm thấy danh sách phim");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa?");
    if (!confirmDelete) return;

    try {
      await deleteMovie(id);
      toast.success("Đã xóa thành công!");
      fetchMovies();
    } catch (err) {
      toast.error("Lỗi khi xóa!");
    }
  };

  const handleSuccess = () => {
    setEditingMovie(null);
    setShowForm(false);
    fetchMovies();
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white px-4 py-12 font-poppins">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500 animate-titleFadeIn">
            Quản lý phim
          </h1>

          <div className="bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl p-6 space-y-6 animate-sectionFadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-yellow-300">
                {editingMovie ? "Chỉnh sửa phim" : "Thêm phim mới"}
              </h2>
              <button
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold shadow-md transition-all duration-300 ${editingMovie || showForm
                  ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                  : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                  } text-white`}
                onClick={() => {
                  if (editingMovie) {
                    setEditingMovie(null);
                  } else {
                    setShowForm((prev) => !prev);
                  }
                }}
              >
                {editingMovie ? (
                  <>
                    <FaTimes /> Hủy chỉnh sửa
                  </>
                ) : showForm ? (
                  <>
                    <FaTimes /> Đóng
                  </>
                ) : (
                  <>
                    <FaPlus /> Thêm phim
                  </>
                )}
              </button>
            </div>

            {(showForm || editingMovie) && (
              <div className="border-t border-gray-800 pt-6 transition-all duration-300">
                <MovieForm initialData={editingMovie} onSuccess={handleSuccess} />
              </div>
            )}
          </div>

          <div className="relative max-w-md mx-auto animate-sectionFadeIn">
            <input
              type="text"
              placeholder="Tìm kiếm phim theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/70 backdrop-blur-sm text-white rounded-full px-5 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 placeholder-gray-400"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl animate-sectionFadeIn">
            <div className="overflow-x-auto">
              <div className="max-h-[600px] overflow-y-auto">
                <table className="min-w-full table-auto text-sm">

                  <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Ảnh</th>
                      <th className="px-6 py-4 text-left font-semibold">Tên phim</th>
                      <th className="px-6 py-4 text-left font-semibold">Mô tả</th>
                      <th className="px-6 py-4 text-left font-semibold">Thể loại</th>
                      <th className="px-6 py-4 text-left font-semibold">Ngày phát hành</th>
                      <th className="px-6 py-4 text-left font-semibold">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-t border-gray-800 animate-pulse">
                          <td className="px-6 py-4"><div className="w-20 h-28 bg-gray-700 rounded" /></td>
                          <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-3/4" /></td>
                          <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-full" /></td>
                          <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-2/3" /></td>
                          <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-1/2" /></td>
                          <td className="px-6 py-4"><div className="h-8 bg-gray-700 rounded w-32" /></td>
                        </tr>
                      ))
                    ) : filteredMovies.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                          Không có phim nào
                        </td>
                      </tr>
                    ) : (
                      filteredMovies.map((movie, index) => (
                        <tr
                          key={movie._id}
                          className={`border-t border-gray-800 ${index % 2 === 0 ? "bg-gray-800/30" : "bg-gray-900/30"
                            } hover:bg-gray-700/50 transition-all duration-200`}
                        >
                          <td className="px-6 py-4">
                            <Link to={`/commentadmin/${movie._id}`}>
                              <div className="relative group w-20 h-28 overflow-hidden rounded">
                                <img
                                  src={movie.imageUrl}
                                  alt={`Poster phim ${movie.title}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                              </div>
                            </Link>
                          </td>
                          <td className="px-6 py-4 font-semibold text-white">{movie.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                            {movie.description || "Không có mô tả"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {movie.category?.length > 0
                              ? movie.category.map((c) => c.name).join(", ")
                              : "Không rõ"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {movie.releaseDate
                              ? new Date(movie.releaseDate).toLocaleDateString()
                              : "Không rõ"}
                          </td>
                          <td className="px-6 py-4 space-x-3">
                            <button
                              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                              onClick={() => {
                                setEditingMovie(movie);
                                setShowForm(false);
                              }}
                            >
                              <FaEdit /> Sửa
                            </button>
                            <button
                              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                              onClick={() => handleDelete(movie._id)}
                            >
                              <FaTrash /> Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Thông báo */}
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

export default MovieList;
