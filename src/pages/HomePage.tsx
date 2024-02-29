import axios from "axios";
import { useEffect, useState } from "react";
import { popularPhotos } from "../../data";
import { Photo } from "../../types";

export default function HomePage() {
  const [photos, setPopularPhotos] = useState<Photo[]>(popularPhotos);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    // const fetchPopularPhotos = async () => {
    //   try {
    //     const res = await axios.get(
    //       `https://api.unsplash.com/photos?page=1&per_page=20&order_by=popular&client_id=${
    //         import.meta.env.VITE_UNSPLASH_ACCESS_KEY
    //       }`
    //     );
    //     setPopularPhotos(res.data);
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
        return setPopularPhotos(popularPhotos);
      }
      try {
        console.log("fetching search results");
        const res = await axios.get(
          `https://api.unsplash.com/search/photos?page=1&per_page=20&query=${searchQuery}&client_id=${
            import.meta.env.VITE_UNSPLASH_ACCESS_KEY
          }`
        );
        setPopularPhotos(res.data.results);
      } catch (error) {
        console.error("Error fetching search results", error);
      }
    };

    const timeoutId = setTimeout(fetchSearchResults, 500);

    setTypingTimeout(timeoutId);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
              key={photo.id}
              src={photo.urls.thumb}
              alt={photo.alt_description}
            />
          );
        })}
      </div>
    </main>
  );
}
