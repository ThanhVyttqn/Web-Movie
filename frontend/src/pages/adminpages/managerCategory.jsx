import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryServices";
import AdminHeader from "../../components/AdminHeader";

export default function ManagerCategory() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data.data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách thể loại.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Tên thể loại không được để trống");
      return;
    }

    try {
      if (editId) {
        const res = await updateCategory(editId, { name });
        toast.success(res.data.message || "Cập nhật thể loại thành công");
      } else {
        const res = await createCategory({ name });
        toast.success(res.data.message || "Thêm thể loại thành công");
      }

      setName("");
      setEditId(null);
      loadCategories();
    } catch (error) {
      toast.error("Lỗi khi lưu thể loại");
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setName(cat.name);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thể loại này?")) {
      try {
        const res = await deleteCategory(id);
        toast.success(res.data.message || "Xóa thể loại thành công");
        loadCategories();
      } catch (error) {
        toast.error("Lỗi khi xóa thể loại");
      }
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white px-4 py-12 font-poppins">
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500 animate-titleFadeIn">
            Quản lý thể loại
          </h2>

          {/* Form thêm / sửa */}
          <div className="bg-gray-900/90 backdrop-blur-md p-6 rounded-xl shadow-2xl animate-sectionFadeIn">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start mb-6">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên thể loại"
                className="w-full md:w-1/3 bg-gray-800/70 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                {editId ? "Cập nhật" : "Thêm"}
              </button>
            </form>
          </div>

          {/* Bảng danh sách thể loại */}
          <div className="bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl overflow-x-auto animate-sectionFadeIn">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-yellow-300">
                <tr>
                  <th className="p-4 font-semibold">Tên thể loại</th>
                  <th className="p-4 font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center p-4 text-gray-400">
                      Chưa có thể loại nào
                    </td>
                  </tr>
                ) : (
                  categories.map((cat, index) => (
                    <tr
                      key={cat._id}
                      className={`border-t border-gray-700 ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-900/30'} hover:bg-gray-700/50 transition-all duration-200`}
                    >
                      <td className="p-4 text-gray-200">{cat.name}</td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-black px-4 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Xoá
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

      {/* Thông báo */}
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
}
