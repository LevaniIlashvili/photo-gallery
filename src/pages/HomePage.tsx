import axios from "axios";
import { useEffect, useState } from "react";
import { popularPhotos } from "../../data";
import { Photo } from "../../types";
import PhotoModal from "../components/PhotoModal";

type Timeout = ReturnType<typeof setTimeout>;

export default function HomePage() {
  const [photos, setPhotos] = useState<Photo[]>(popularPhotos);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<Timeout | null>(null);
  const [openedPhoto, setOpenedPhoto] = useState<string | null>(null);

  useEffect(() => {
    // const fetchPopularPhotos = async () => {
    //   try {
    //     const res = await axios.get(
    //       `https://api.unsplash.com/photos?page=1&per_page=20&order_by=popular&client_id=${
    //         import.meta.env.VITE_UNSPLASH_ACCESS_KEY
    //       }`
    //     );
    //     setPhotos(res.data);
    //     console.log(res.data);
    //   } catch (error) {
    //     console.error("Error fetching popular photos", error);
    //   }
    // };
    // fetchPopularPhotos();
  }, []);

  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const fetchSearchResults = async () => {
      if (!searchQuery) {
        return setPhotos(popularPhotos);
      }
      try {
        const cachedPhotos = getCachedPhotos(searchQuery);

        if (cachedPhotos) {
          console.log("Using cached search results");
          setPhotos(cachedPhotos);
        } else {
          console.log("Fetching search results");
          const res = await axios.get(
            `https://api.unsplash.com/search/photos?page=1&per_page=20&query=${searchQuery}&client_id=${
              import.meta.env.VITE_UNSPLASH_ACCESS_KEY
            }`
          );
          cachePhotos(searchQuery, res.data.results);
          setPhotos(res.data.results);
        }
      } catch (error) {
        console.error("Error fetching search results", error);
      }
    };

    const timeoutId = setTimeout(fetchSearchResults, 700);

    setTypingTimeout(timeoutId);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const getCachedPhotos = (query: string): Photo[] | null => {
    const cashedPhotos = localStorage.getItem(query);
    return cashedPhotos ? JSON.parse(cashedPhotos) : null;
  };

  const cachePhotos = (query: string, photos: Photo[]) => {
    localStorage.setItem(query, JSON.stringify(photos));
  };

  return (
    <main className="py-10">
      <div className="flex flex-col">
        <input
          type="text"
          name="search"
          placeholder="ძებნა"
          className="w-96 mb-10 ml-6 bg-[#eeeeee] hover:bg-[#e9e9e9] focus:bg-white focus:border-gray-200 border p-2 outline-none rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {photos.map((photo) => {
          // console.log(photo);
          return (
            <img
              className="cursor-pointer"
              key={photo.id}
              src={photo.urls.thumb}
              alt={photo.alt_description}
              onClick={() => setOpenedPhoto(photo.id)}
            />
          );
        })}
      </div>
      {openedPhoto && (
        <PhotoModal photoId={openedPhoto} setOpenedPhoto={setOpenedPhoto} />
      )}
    </main>
  );
}
