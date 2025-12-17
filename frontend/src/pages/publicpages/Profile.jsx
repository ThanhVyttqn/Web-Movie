import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Header from "../../components/Header";
import { changepassword } from "../../services/authServices";

export default function ProFile() {
  const { user, setUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Validate mật khẩu nếu người dùng có nhập
    if (formData.password || formData.confirmpassword) {
      if (formData.password !== formData.confirmpassword) {
        toast.error("Mật khẩu và xác nhận không khớp.");
        return;
      }

      try {
        const res = await changepassword(
          user._id,
          formData.password,
          formData.confirmpassword,
          token
        );
        toast.success("Cập nhật mật khẩu thành công");
        setUser(res.data.user);
        setIsEditing(false);
        setFormData({ ...formData, password: "", confirmpassword: "" });
        return;
      } catch (err) {
        toast.error("Lỗi đổi mật khẩu: " + (err.response?.data?.message || err.message));
        return;
      }
    }

    // Nếu không đổi mật khẩu, chỉ cập nhật userName/email
    try {
      const res = await axios.put("/edit", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Cập nhật thông tin thành công");
      setUser(res.data.user);
      setIsEditing(false);
    } catch (err) {
      toast.error("Cập nhật thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white px-4 py-12 font-poppins">
        <div className="max-w-2xl mx-auto bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 animate-sectionFadeIn">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500 mb-6">
            Thông tin cá nhân
          </h1>

          {!isEditing ? (
            <>
              <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b border-gray-700 pb-2">
                  <span className="font-semibold text-yellow-300">Tên:</span>{" "}
                  <span className="text-gray-200">{user?.userName || "N/A"}</span>
                </div>
                <div className="border-b border-gray-700 pb-2">
                  <span className="font-semibold text-yellow-300">Email:</span>{" "}
                  <span className="text-gray-200">{user?.email || "N/A"}</span>
                </div>
                <div className="border-b border-gray-700 pb-2">
                  <span className="font-semibold text-yellow-300">Quyền:</span>{" "}
                  <span className="text-gray-200">{user?.role || "N/A"}</span>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Chỉnh sửa
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 mt-4">
              <input
                type="text"
                name="userName"
                placeholder="Tên"
                value={formData.userName}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
              />
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu mới (nếu muốn đổi)"
                value={formData.password}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
              />
              <input
                type="password"
                name="confirmpassword"
                placeholder="Xác nhận mật khẩu mới"
                value={formData.confirmpassword}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
              />

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ ...formData, password: "", confirmpassword: "" });
                  }}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
}
