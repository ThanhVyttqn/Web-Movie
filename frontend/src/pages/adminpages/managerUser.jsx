import { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../../services/userServices";
import AdminHeader from "../../components/AdminHeader";
import { toast, Toaster } from "react-hot-toast";
import { FaSearch, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    userName: "",
    email: "",
    role: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data.data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách người dùng.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await deleteUser(email);
        toast.success("Xóa người dùng thành công.");
        fetchUsers();
      } catch (error) {
        toast.error("Lỗi khi xóa người dùng.");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditData({
      userName: user.userName,
      email: user.email,
      role: user.role,
    });
  };

  const handleUpdate = async () => {
    try {
      await updateUserRole(editingId, editData);
      toast.success("Cập nhật người dùng thành công.");
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      toast.error("Lỗi khi cập nhật: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white px-4 py-12 font-poppins">
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500 animate-titleFadeIn">
            Quản lý người dùng
          </h2>

          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Tìm kiếm tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/70 backdrop-blur-sm text-white rounded-full px-5 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 placeholder-gray-400"
              aria-label="Tìm kiếm người dùng"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden animate-sectionFadeIn">
            <div className="overflow-x-auto max-h-[60vh] scroll-container">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Tên</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Vai trò</th>
                    <th className="px-6 py-4 text-left font-semibold">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="border-t border-gray-800 animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-3/4" /></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-2/3" /></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-1/2" /></td>
                        <td className="px-6 py-4"><div className="h-8 bg-gray-700 rounded w-32" /></td>
                      </tr>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                        Không tìm thấy người dùng phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, index) => (
                      <tr
                        key={u._id}
                        className={`border-t border-gray-800 ${index % 2 === 0 ? "bg-gray-800/30" : "bg-gray-900/30"
                          } hover:bg-gray-700/50 transition-all duration-200`}
                      >
                        <td className="px-6 py-4">
                          {editingId === u._id ? (
                            <input
                              value={editData.userName}
                              onChange={(e) =>
                                setEditData({ ...editData, userName: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded bg-gray-700/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              aria-label="Chỉnh sửa tên người dùng"
                            />
                          ) : (
                            u.userName
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-300">{u.email}</td>
                        <td className="px-6 py-4">
                          {editingId === u._id ? (
                            <select
                              value={editData.role}
                              onChange={(e) =>
                                setEditData({ ...editData, role: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded bg-gray-700/70 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              aria-label="Chọn vai trò người dùng"
                            >
                              <option value="admin">Admin</option>
                              <option value="member">Member</option>
                            </select>
                          ) : (
                            u.role.charAt(0).toUpperCase() + u.role.slice(1)
                          )}
                        </td>
                        <td className="px-6 py-4 space-x-3">
                          {editingId === u._id ? (
                            <>
                              <button
                                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                                onClick={handleUpdate}
                                aria-label={`Lưu thay đổi cho ${u.userName}`}
                              >
                                <FaSave /> Lưu
                              </button>
                              <button
                                className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                                onClick={() => setEditingId(null)}
                                aria-label="Hủy chỉnh sửa"
                              >
                                <FaTimes /> Hủy
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                                onClick={() => handleDelete(u.email)}
                                aria-label={`Xóa người dùng ${u.userName}`}
                              >
                                <FaTrash /> Xóa
                              </button>
                              <button
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                                onClick={() => handleEdit(u)}
                                aria-label={`Sửa thông tin người dùng ${u.userName}`}
                              >
                                <FaEdit /> Sửa
                              </button>
                            </>
                          )}
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

      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

export default UserManager;
