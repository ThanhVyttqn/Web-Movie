export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 flex items-center justify-center px-4 md:px-8 font-poppins">
      <div className="max-w-md w-full bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl p-8 text-center animate-sectionFadeIn">
        <h1 className="text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500 drop-shadow-md animate-titleFadeIn">
          404
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mt-4">
          Trang không tồn tại
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          aria-label="Quay về trang đăng nhập"
        >
          Quay về đăng nhập
        </Link>
      </div>
    </div>
  );
}