import React, { useEffect, useState } from "react";
import { AllView, totalView } from "../../services/viewServices";
import AdminHeader from "../../components/AdminHeader";
import { getAllMovies } from "../../services/moviesServices";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F", "#FFBB28", "#FF4444"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800/90 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg border border-gray-700">
        <p className="font-semibold">{label}</p>
        <p>{`Lượt xem: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const AdminPage = () => {
  const [movies, setMovies] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [totalAllViews, setTotalAllViews] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const movieListRes = await getAllMovies();
      const movieList = movieListRes.data.data;

      const movieViews = await Promise.all(
        movieList.map(async (movie) => {
          const viewRes = await totalView(movie._id);
          return {
            ...movie,
            totalViews: viewRes.data.totalViews || 0,
          };
        })
      );

      const total = movieViews.reduce((sum, m) => sum + m.totalViews, 0);
      const movieViewsWithPercent = movieViews.map((movie) => ({
        ...movie,
        percentViews: ((movie.totalViews / total) * 100).toFixed(2),
      }));

      setMovies(movieViewsWithPercent);

      const pie = [];
      let otherViews = 0;
      movieViewsWithPercent.forEach((movie) => {
        const percent = (movie.totalViews / total) * 100;
        if (percent > 5) {
          pie.push({
            name: movie.title,
            value: movie.totalViews,
          });
        } else {
          otherViews += movie.totalViews;
        }
      });
      if (otherViews > 0) {
        pie.push({
          name: "Khác",
          value: otherViews,
        });
      }
      setPieData(pie);
    } catch (err) {
      console.error("Lỗi khi tải danh sách phim:", err);
    }
  };

  const fetchAllViews = async () => {
    try {
      const res = await AllView();
      setTotalAllViews(res.data.totalViews);
    } catch (err) {
      console.error("Lỗi khi lấy tổng view toàn bộ:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchMovies(), fetchAllViews()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white px-4 py-12 font-poppins">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500 animate-titleFadeIn">
            Trang Thống kê
          </h1>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-xl animate-pulse text-gray-400">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              <div className="bg-gray-900/90 backdrop-blur-md p-6 rounded-xl shadow-2xl animate-sectionFadeIn">
                <h2 className="text-xl font-semibold text-yellow-300 mb-4">Tổng lượt xem toàn hệ thống</h2>
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300" aria-label={`Tổng lượt xem: ${totalAllViews}`}>
                  {totalAllViews.toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-900/90 backdrop-blur-md p-6 rounded-xl shadow-2xl animate-sectionFadeIn">
                <h2 className="text-xl md:text-2xl font-bold text-yellow-300 mb-4">Biểu đồ cột</h2>
                <div className="w-full h-[400px]">
                  <ResponsiveContainer>
                    <BarChart data={movies} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                      <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="title"
                        angle={-20}
                        textAnchor="end"
                        interval={0}
                        height={80}
                        tick={{ fill: "#d1d5db", fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: "#d1d5db" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="totalViews" fill="#8884d8" name="Lượt xem" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-900/90 backdrop-blur-md p-6 rounded-xl shadow-2xl animate-sectionFadeIn">
                <h2 className="text-xl md:text-2xl font-bold text-yellow-300 mb-4">Biểu đồ tròn</h2>
                <div className="w-full h-[400px]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(1)}%`
                        }
                        labelLine={{ stroke: "#d1d5db" }}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{
                          color: "#d1d5db",
                          fontSize: 14,
                          paddingTop: 10,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
