import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AdminHeader() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const { data } = await axios.get('/logout');
            localStorage.removeItem("user");
            setUser && setUser(null);
            toast.success(data.message || 'Đăng xuất thành công');
            navigate('/login');
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra khi đăng xuất');
        }
    };

    return (
        <header className="bg-gradient-to-r from-blue-950 via-purple-950 to-blue-950 text-white px-4 py-4 md:py-6 flex justify-between items-center shadow-2xl sticky top-0 z-50 font-poppins">
            <div className="flex items-center space-x-4 md:space-x-8">
                <Link to="/movieList" className="flex items-center space-x-2">
                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2zM8 2v4M16 2v4M4 10h16M4 14h16" />
                    </svg>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500">
                        MovieFlix
                    </h1>
                </Link>

                <nav className="hidden md:flex space-x-8">
                    <Link to="/adminpage" className="nav-link">Thống Kê</Link>
                    <Link to="/managerMovie" className="nav-link">Quản lí phim</Link>
                    <Link to="/managerUser" className="nav-link">Quản lí người dùng</Link>
                    <Link to="/managerCategory" className="nav-link">Quản lí thể loại</Link>
                </nav>
            </div>

            <button
                className="md:hidden text-white focus:outline-none"
                onClick={() => setIsMenuOpen(prev => !prev)}
                aria-label="Toggle navigation menu"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'} />
                </svg>
            </button>

            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-gray-900 text-white p-4 md:hidden animate-dropdownFadeIn">
                    <nav className="flex flex-col space-y-4">
                        <Link to="/managerMovie" className="nav-link" onClick={() => setIsMenuOpen(false)}>Quản lí phim</Link>
                        <Link to="/managerUser" className="nav-link" onClick={() => setIsMenuOpen(false)}>Quản lí người dùng</Link>
                        <Link to="/managerCategory" className="nav-link" onClick={() => setIsMenuOpen(false)}>Quản lí thể loại</Link>
                        <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>Hồ Sơ</Link>
                        <Link to="/adminpage" className="nav-link" onClick={() => setIsMenuOpen(false)}>Thống Kê</Link>
                        {user && (
                            <>
                                <Link
                                    to="/movieList"
                                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                    aria-label="Trang chủ"
                                >
                                    Trang chủ
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                                    aria-label="Đăng xuất"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            )}

            <div className="hidden md:flex items-center space-x-4">
                {!user ? (
                    <>
                        <Link
                            to="/login"
                            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                            aria-label="Đăng nhập"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to="/register"
                            className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                            aria-label="Đăng ký"
                        >
                            Đăng ký
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            to="/movieList"
                            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Trang chủ
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Đăng xuất
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
