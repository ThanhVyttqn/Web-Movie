import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { createMovie, updateMovie } from "../../services/moviesServices";
import { getAllCategories } from "../../services/categoryServices";
import { toast } from "react-hot-toast";
import { FaFilm, FaCalendarAlt, FaImage, FaSave, FaTimes } from "react-icons/fa";

const MovieForm = ({ initialData, onSuccess }) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data.data);
      } catch (err) {
        toast.error("Lỗi khi tải thể loại!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        releaseDate: initialData.releaseDate?.slice(0, 10) || "",
        imageUrl: initialData.imageUrl || "",
      });
      setValue("category", initialData.category?.[0]?._id || "");
      setImagePreview(initialData.imageUrl || "");
    } else {
      reset();
      setImagePreview(null);
    }
  }, [initialData, reset, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        category: [data.category],
      };
      if (initialData?._id) {
        await updateMovie(initialData._id, payload);
        toast.success("Cập nhật phim thành công!");
      } else {
        await createMovie(payload);
        toast.success("Thêm phim mới thành công!");
      }
      reset();
      setImagePreview(null);
      onSuccess();
    } catch (err) {
      toast.error("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "rgba(31, 41, 55, 0.7)",
      borderColor: "transparent",
      color: "white",
      padding: "0.5rem",
      borderRadius: "0.5rem",
      boxShadow: "none",
      backdropFilter: "blur(4px)",
      "&:hover": { borderColor: "#eab308" },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgba(31, 41, 55, 0.9)",
      borderRadius: "0.5rem",
      backdropFilter: "blur(4px)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#eab308"
        : state.isFocused
          ? "rgba(31, 41, 55, 0.8)"
          : "transparent",
      color: state.isSelected ? "black" : "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-gray-700 rounded w-full" />
        <div className="h-24 bg-gray-700 rounded w-full" />
        <div className="h-10 bg-gray-700 rounded w-full" />
        <div className="h-10 bg-gray-700 rounded w-full" />
        <div className="h-10 bg-gray-700 rounded w-full" />
        <div className="h-12 bg-gray-700 rounded w-32" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-gray-900/90 backdrop-blur-md p-6 rounded-xl shadow-2xl font-poppins"
    >
      {/* Tiêu đề */}
      <div>
        <label className="block text-sm font-semibold text-yellow-300 mb-2" htmlFor="title">
          Tiêu đề
        </label>
        <div className="relative">
          <input
            {...register("title", { required: "Tiêu đề là bắt buộc" })}
            id="title"
            placeholder="Nhập tiêu đề phim..."
            className={`w-full bg-gray-800/70 text-white rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400 ${errors.title ? "border-red-500" : ""
              }`}
          />
          <FaFilm className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      {/* Mô tả */}
      <div>
        <label className="block text-sm font-semibold text-yellow-300 mb-2">Mô tả</label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full bg-gray-800/70 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
          placeholder="Nhập mô tả phim..."
        />
      </div>

      {/* Ngày phát hành */}
      <div>
        <label className="block text-sm font-semibold text-yellow-300 mb-2">Ngày phát hành</label>
        <div className="relative">
          <input
            type="date"
            {...register("releaseDate", { required: "Ngày phát hành là bắt buộc" })}
            className={`w-full bg-gray-800/70 text-white rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${errors.releaseDate ? "border-red-500" : ""
              }`}
          />
          <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {errors.releaseDate && <p className="text-red-500 text-xs mt-1">{errors.releaseDate.message}</p>}
      </div>

      {/* Thể loại */}
      <div>
        <label className="block text-sm font-semibold text-yellow-300 mb-2">Thể loại</label>
        <Controller
          name="category"
          control={control}
          rules={{ required: "Thể loại là bắt buộc" }}
          render={({ field }) => (
            <Select
              {...field}
              options={categories.map((cat) => ({
                value: cat._id,
                label: cat.name,
              }))}
              value={categories
                .map((cat) => ({
                  value: cat._id,
                  label: cat.name,
                }))
                .find((opt) => opt.value === field.value) || null}
              onChange={(option) => field.onChange(option.value)}
              placeholder="Chọn thể loại..."
              styles={customSelectStyles}
            />
          )}
        />
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
      </div>

      {/* Hình ảnh */}
      <div>
        <label className="block text-sm font-semibold text-yellow-300 mb-2">URL hình ảnh</label>
        <div className="relative">
          <input
            {...register("imageUrl", { required: "URL hình ảnh là bắt buộc" })}
            placeholder="Nhập URL hình ảnh..."
            className={`w-full bg-gray-800/70 text-white rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400 ${errors.imageUrl ? "border-red-500" : ""
              }`}
            onChange={(e) => {
              setImagePreview(e.target.value);
              setValue("imageUrl", e.target.value);
            }}
          />
          <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Xem trước hình ảnh"
              className="w-32 h-48 object-cover rounded-lg shadow-md"
              onError={() => setImagePreview(null)}
            />
          </div>
        )}
      </div>

      {/* Nút submit & huỷ */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-md transition-all duration-300 ${isSubmitting
            ? "bg-gray-600 cursor-not-allowed"
            : initialData?._id
              ? "bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
              : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
            }`}
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
            </svg>
          ) : (
            <FaSave />
          )}
          {isSubmitting ? "Đang xử lý..." : initialData?._id ? "Cập nhật" : "Thêm"}
        </button>

        {initialData?._id && (
          <button
            type="button"
            onClick={() => {
              reset();
              setImagePreview(null);
              onSuccess();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white shadow-md transition"
          >
            <FaTimes /> Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default MovieForm;
