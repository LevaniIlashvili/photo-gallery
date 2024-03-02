import { useEffect, useState } from "react";
import { popularPhotos } from "../../data";
import { Photo } from "../../types";
import { fetchSearchResults } from "../apiUtils";
import Gallery from "../components/Gallery";

type Timeout = ReturnType<typeof setTimeout>;

export default function HomePage({
  setOpenedPhoto,
}: {
  setOpenedPhoto: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [photos, setPhotos] = useState<Photo[]>(popularPhotos);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<Timeout | null>(null);

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

    if (!searchQuery) {
      return setPhotos(popularPhotos);
    }

    updateHistory(searchQuery);

    const timeoutId = setTimeout(
      fetchSearchResults.bind(null, searchQuery, setPhotos),
      700
    );

    setTypingTimeout(timeoutId);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const updateHistory = (query: string) => {
    localStorage.setItem(
      "searchHistory",
      JSON.stringify([
        query,
        ...JSON.parse(localStorage.getItem("searchHistory") || "[]"),
      ])
    );
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
      <Gallery photos={photos} setOpenedPhoto={setOpenedPhoto} />
    </main>
  );
}
