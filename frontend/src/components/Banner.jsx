import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import IconPlay from '../assets/img/IconPlay.png';
import { getAllMovies } from '../services/moviesServices';

const Banner = () => {
  const [randomMovie, setRandomMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRandomMovie = async () => {
    try {
      setIsLoading(true);
      const res = await getAllMovies();
      const movies = res.data.data;
      if (movies.length > 0) {
        const randomIndex = Math.floor(Math.random() * movies.length);
        setRandomMovie(movies[randomIndex]);
      }
    } catch (err) {
      console.error('Không thể lấy dữ liệu phim', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomMovie();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="w-5 h-5 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="w-5 h-5 text-yellow-400" />);
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="w-full h-[500px] bg-gray-900/90 flex items-center justify-center font-poppins">
        <div className="text-white text-lg animate-pulse">Đang tải...</div>
      </div>
    );
  }

  if (!randomMovie) return null;

  return (
    <div
      className="relative w-full h-[500px] md:h-[600px] bg-cover bg-center font-poppins"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.2)), url(${randomMovie.imageUrl})`,
      }}
    >
      <div className="absolute inset-0 z-10 flex items-center justify-between h-full px-4 md:px-12 max-w-7xl mx-auto">
        <div className="w-full md:w-1/2 space-y-6 animate-sectionFadeIn">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500 drop-shadow-md">
            {randomMovie.title}
          </h2>
          <div className="flex items-center space-x-2" aria-label={`Điểm đánh giá: ${randomMovie.rating || 4.5} trên 5`}>
            {renderStars(randomMovie.rating || 4.5)}
            <span className="text-sm text-gray-300 ml-2">({randomMovie.rating || 4.5}/5)</span>
          </div>
          <p className="text-base md:text-lg text-gray-200 line-clamp-4 max-w-md leading-relaxed">
            {randomMovie.description}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(`/comment/${randomMovie._id}`)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Xem phim
            </button>
            <button
              onClick={() => navigate(`/movie/${randomMovie._id}`)}
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Chi tiết
            </button>
          </div>
        </div>

        <div className="hidden md:block w-1/2">
          <div className="relative w-[350px] h-[500px] mx-auto transform hover:scale-[1.03] hover:rotate-0 transition-all duration-500">
            <img
              src={randomMovie.imageUrl}
              alt={`Poster phim ${randomMovie.title}`}
              className="w-full h-full object-cover rounded-xl shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl opacity-0 hover:opacity-100 transition duration-300">
              <img src={IconPlay} alt="play" className="w-14 h-14" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;