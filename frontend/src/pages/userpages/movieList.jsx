import { useEffect, useState, useContext } from "react";
import { getAllMovies, searchMovies } from "../../services/moviesServices";
import { addFavorite } from "../../services/favoriteServices";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Banner from "../../components/Banner";
import { FaPlay, FaHeart, FaInfoCircle } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import ChatBot from "../../components/ChatBot";
import { toast } from "react-hot-toast";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [favoritesIds, setFavoritesIds] = useState(new Set());
  const [error, setError] = useState("");
  const [loadingFavs, setLoadingFavs] = useState(new Set());
  const [selectedMovie, setSelectedMovie] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q");
  const { user } = useContext(UserContext);

  const fetchMovies = async () => {
    setError("");
    try {
      let res;
      if (query) {
        res = await searchMovies(query);
      } else {
        res = await getAllMovies();
      }
      setMovies(res.data.data);

      if (user?._id) {
        const favoriteRes = await fetch(`/api/favorites/user/${user._id}`);
        const favoriteData = await favoriteRes.json();
        const favIds = new Set(favoriteData.data.map((m) => m._id));
        setFavoritesIds(favIds);
      } else {
        setFavoritesIds(new Set());
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [query, user]);

  const handleAddFavorite = async (movieId) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để thích phim.");
      return;
    }
    if (loadingFavs.has(movieId)) {
      return;
    }
    try {
      setLoadingFavs(new Set(loadingFavs).add(movieId));
      await addFavorite(user._id, movieId);
      setFavoritesIds(new Set(favoritesIds).add(movieId));
      toast.success("Thêm phim yêu thích thành công!");
    } catch (err) {
      console.error("Lỗi khi thêm yêu thích:", err);
      toast.error(err.response?.data?.message || "Lỗi khi thêm phim yêu thích.");
    } finally {
      const newLoading = new Set(loadingFavs);
      newLoading.delete(movieId);
      setLoadingFavs(newLoading);
    }
  };

  return (
    <>
      <Header />
      <Banner />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white px-4 md:px-12 py-12 font-poppins">
        <div className="max-w-7xl mx-auto animate-sectionFadeIn">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500 drop-shadow-md animate-titleFadeIn">
            Danh sách phim
          </h2>

          {error && (
            <div className="bg-red-900/90 backdrop-blur-md border border-red-500/50 text-red-300 p-4 rounded-xl mb-8 text-center max-w-md mx-auto animate-sectionFadeIn">
              {error}
              <button
                onClick={fetchMovies}
                className="mt-2 ml-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                aria-label="Thử lại"
              >
                Thử lại
              </button>
            </div>
          )}

          {movies.length === 0 && !error ? (
            <p className="text-center text-gray-400 text-lg animate-sectionFadeIn">
              Không tìm thấy phim nào phù hợp.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 animate-gridFadeIn">
              {movies.map((movie) => (
                <div
                  key={movie._id}
                  className="relative group rounded-xl overflow-hidden shadow-xl bg-gray-900/90 hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-300"
                >
                  <img
                    src={movie.imageUrl}
                    alt={`Poster phim ${movie.title}`}
                    className="w-full h-48 md:h-56 object-cover transition duration-300 group-hover:brightness-75"
                    aria-label={`Poster phim ${movie.title}`}
                  />
                  <div className="absolute inset-0 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 bg-black/80 backdrop-blur-md">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-200 line-clamp-2">{movie.title}</h3>
                      {movie.englishTitle && (
                        <p className="text-sm text-yellow-300 italic line-clamp-1">{movie.englishTitle}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => navigate(`/comment/${movie._id}`)}
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-2 rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        aria-label={`Xem phim ${movie.title}`}
                      >
                        <FaPlay /> Xem ngay
                      </button>
                      <button
                        onClick={() => setSelectedMovie(movie)}
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-2 rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        aria-label={`Xem chi tiết ${movie.title}`}
                      >
                        <FaInfoCircle /> Chi tiết
                      </button>
                      <button
                        onClick={() => handleAddFavorite(movie._id)}
                        className={`flex items-center justify-center gap-2 w-full ${favoritesIds.has(movie._id)
                          ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
                          : 'bg-gray-700 hover:bg-gray-600'
                          } text-white font-semibold py-2 rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                        disabled={loadingFavs.has(movie._id)}
                        aria-label={favoritesIds.has(movie._id) ? `Đã thích phim ${movie.title}` : `Thích phim ${movie.title}`}
                      >
                        {loadingFavs.has(movie._id) ? (
                          <svg className="w-5 h-5 animate-spin text-yellow-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 2.135 5.824 5 7.938l1-2.647z" />
                          </svg>
                        ) : (
                          <FaHeart className={favoritesIds.has(movie._id) ? 'text-red-500' : 'text-gray-300'} />
                        )}
                        {favoritesIds.has(movie._id) ? 'Đã thích' : 'Thích'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3 text-xs font-semibold">
                      {movie.rating && (
                        <span className="bg-gradient-to-r from-yellow-600 to-orange-600 text-black px-2.5 py-1 rounded-full">
                          IMDb {movie.rating}
                        </span>
                      )}
                      {movie.age && (
                        <span className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-2.5 py-1 rounded-full">
                          T{movie.age}
                        </span>
                      )}
                      {movie.year && (
                        <span className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 px-2.5 py-1 rounded-full">
                          {movie.year}
                        </span>
                      )}
                      {movie.season && (
                        <span className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 px-2.5 py-1 rounded-full">
                          Phần {movie.season}
                        </span>
                      )}
                      {movie.episode && (
                        <span className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 px-2.5 py-1 rounded-full">
                          Tập {movie.episode}
                        </span>
                      )}
                      <span className="text-xs text-white/80 mt-1 line-clamp-1">
                        {(movie.category && movie.category.length > 0)
                          ? movie.category.map((cat) => cat.name).join(" · ")
                          : "Thể loại chưa rõ"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 group-hover:hidden">
                    <h3 className="text-sm font-semibold text-center text-gray-200 truncate">{movie.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedMovie && (
            <div
              className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 animate-sectionFadeIn"
              onClick={() => setSelectedMovie(null)}
            >
              <div
                className="bg-gray-900/90 backdrop-blur-md p-6 rounded-xl max-w-lg w-full relative max-h-[90vh] overflow-y-auto border border-yellow-500/50 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-white text-xl font-bold bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all duration-300"
                  onClick={() => setSelectedMovie(null)}
                  aria-label="Đóng popup chi tiết phim"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold text-gray-200 mb-4">{selectedMovie.title}</h2>
                {selectedMovie.englishTitle && (
                  <p className="italic text-yellow-300 mb-4">{selectedMovie.englishTitle}</p>
                )}
                <img
                  src={selectedMovie.imageUrl}
                  alt={`Poster phim ${selectedMovie.title}`}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                  aria-label={`Poster phim ${selectedMovie.title}`}
                />
                <div className="space-y-2 text-gray-200">
                  <p>
                    <strong className="text-yellow-300">Mô tả:</strong>{" "}
                    {selectedMovie.description || "Không có mô tả."}
                  </p>
                  <p>
                    <strong className="text-yellow-300">Ngày phát hành:</strong>{" "}
                    {selectedMovie.releaseDate
                      ? new Date(selectedMovie.releaseDate).toLocaleDateString()
                      : "Không rõ"}
                  </p>
                  <p>
                    <strong className="text-yellow-300">Thể loại:</strong>{" "}
                    {selectedMovie.category?.map((c) => c.name).join(", ") || "Không rõ"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ChatBot />
    </>
  );
};

export default MovieList;