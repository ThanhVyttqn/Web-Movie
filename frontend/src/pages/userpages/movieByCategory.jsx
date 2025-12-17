import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllMovies } from "../../services/moviesServices";
import Header from "../../components/Header";
import { toast, Toaster } from "react-hot-toast";

const CategoryPage = () => {
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMoviesByCategory = async () => {
      setLoading(true);
      try {
        const res = await getAllMovies();
        const filtered = res.data.data.filter((movie) =>
          movie.category.some((c) => c._id === id)
        );
        setMovies(filtered);
        toast.success("Tải phim theo thể loại thành công!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Lỗi khi tải phim theo thể loại!";
        toast.error(errorMessage);
        console.error("Lỗi khi tải phim theo thể loại:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByCategory();
  }, [id]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white px-4 md:px-12 py-12 font-poppins">
        <div className="max-w-7xl mx-auto bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl p-6 animate-sectionFadeIn">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500 drop-shadow-md animate-titleFadeIn">
            Phim
          </h2>

          {loading ? (
            <div className="text-center bg-gray-900/90 backdrop-blur-md p-4 rounded-xl animate-pulse">
              <p className="text-gray-400 text-lg">Đang tải phim...</p>
            </div>
          ) : movies.length === 0 ? (
            <p className="text-center text-gray-400 text-lg animate-sectionFadeIn">
              Không có phim nào trong thể loại này.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-gridFadeIn">
              {movies.map((movie) => (
                <Link
                  key={movie._id}
                  to={`/comment/${movie._id}`}
                  className="bg-gray-900/90 backdrop-blur-md p-4 rounded-lg shadow-xl hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 flex flex-col focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  aria-label={`Xem chi tiết phim ${movie.title}`}
                >
                  <img
                    src={movie.imageUrl}
                    alt={`Poster phim ${movie.title}`}
                    className="w-full h-48 md:h-56 object-cover rounded-lg mb-4"
                    aria-label={`Poster phim ${movie.title}`}
                  />
                  <h3 className="font-semibold text-lg md:text-xl text-gray-200">{movie.title}</h3>
                  <p className="text-gray-300 mt-2 line-clamp-2">{movie.description || "Không có mô tả."}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

export default CategoryPage;