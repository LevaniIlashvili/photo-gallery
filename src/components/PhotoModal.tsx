import { useEffect, useState } from "react";
import { PhotoDetails } from "../../types";
import axios from "axios";

export default function PhotoModal({
  photoId,
  setOpenedPhoto,
}: {
  photoId: string;
  setOpenedPhoto: (id: string | null) => void;
}) {
  const [photo, setPhoto] = useState<PhotoDetails | null>(null);
  console.log(photo);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await axios.get(
          `https://api.unsplash.com/photos/${photoId}?client_id=${
            import.meta.env.VITE_UNSPLASH_ACCESS_KEY
          }`
        );
        setPhoto(res.data);
      } catch (error) {
        console.error("Error fetching photo", error);
      }
    };

    fetchPhoto();
  }, [photoId]);

  useEffect(() => {
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [photo]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-8"
      onClick={() => setOpenedPhoto(null)}
    >
      <div
        className="bg-white h-screen max-w-fit rounded-md flex items-center justify-center gap-4 p-10 max-md:flex-col max-md:p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          className={`${
            photo.width > photo.height ? "max-w-2xl" : "max-w-sm"
          } w-[90%]`}
          src={photo?.urls.regular}
          alt={photo?.alt_description}
        />
        <div className="max-md:flex gap-4">
          <div className="flex flex-col max-md:items-center">
            <span className="text-gray-500">views</span>
            <span>{photo.views.toLocaleString()}</span>
          </div>
          <div className="flex flex-col max-md:items-center">
            <span className="text-gray-500">likes</span>
            <span>{photo.likes.toLocaleString()}</span>
          </div>
          <div className="flex flex-col max-md:items-center">
            <span className="text-gray-500">downloads</span>
            <span>{photo.downloads.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
