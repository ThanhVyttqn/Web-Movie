import { increaseView } from "../../services/viewServices";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEpisodeById } from "../../services/episodeServices";
import Header from "../../components/Header";
import { toast } from "react-hot-toast";

export default function Watch() {
  const { episodeId } = useParams();
  const [view, setView] = useState(null);
  const [episodes, setEpisode] = useState(null);

  useEffect(() => {
    async function fetchEpisode() {
      try {
        const res = await getEpisodeById(episodeId);
        const resView = await increaseView(episodeId);
        setEpisode(res.data.data);
        setView(resView.data.views);
      } catch (error) {
        console.error("Lỗi khi tải tập phim:", error);
        toast.error(error.response?.data?.message || "Lỗi khi tải tập phim.");
      }
    }
    fetchEpisode();
  }, [episodeId]);

  if (!episodes) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 flex items-center justify-center font-poppins">
      <div className="bg-gray-900/90 backdrop-blur-md p-6 rounded-xl text-gray-400 text-lg animate-pulse">
        Đang tải tập phim...
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white px-4 md:px-12 py-12 font-poppins">
        <div className="max-w-7xl mx-auto bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl p-6 animate-sectionFadeIn">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500 drop-shadow-md animate-titleFadeIn">
            {episodes.title}
          </h2>
          {view !== null && (
            <p className="text-gray-400 mb-4">
              {view} lượt xem
            </p>
          )}
          <video
            width="100%"
            controls
            className="w-full max-h-[80vh] rounded-lg border border-gray-800 hover:shadow-lg transition-all duration-300 object-contain"
            aria-label={`Video tập phim ${episodes.title}`}
          >
            <source src={episodes.videoUrl} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
          <p className="text-gray-200 mt-4">
            {episodes.description || "Không có mô tả."}
          </p>
        </div>
      </div>
    </>
  );
}
