import { useEffect, useState } from "react";
// import { popularPhotos } from "../../data";
import { Photo } from "../../types";
import { fetchSearchResults } from "../apiUtils";
import Gallery from "../components/Gallery";
import axios from "axios";

type Timeout = ReturnType<typeof setTimeout>;

export default function HomePage({
  setOpenedPhoto,
}: {
  setOpenedPhoto: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [popularPhotos, setPopularPhotos] = useState<Photo[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<Timeout | null>(null);
  const [page, setPage] = useState(1);

  const fetchPopularPhotos = async (page: number) => {
    try {
      const res = await axios.get(
        `https://api.unsplash.com/photos?page=${page}&per_page=20&order_by=popular&client_id=${
          import.meta.env.VITE_UNSPLASH_ACCESS_KEY
        }`
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching popular photos", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAndSetPopularPhotos = async () => {
      const popularPhotos = await fetchPopularPhotos(1);
      setPopularPhotos(popularPhotos);
      setPhotos(popularPhotos);
    };

    fetchAndSetPopularPhotos();
  }, []);

  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (!searchQuery) {
      return setPhotos(popularPhotos);
    }

    const timeoutId = setTimeout(async () => {
      updateHistory(searchQuery);
      setPhotos(await fetchSearchResults(searchQuery, 1));
      setPage(1);
    }, 700);

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

  useEffect(() => {
    const handleScroll = async () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight =
        document.documentElement.clientHeight || window.innerHeight;

      console.log("query in handleScroll", searchQuery);

      if (scrollTop >= scrollHeight - clientHeight) {
        if (searchQuery) {
          const newPhotos = await fetchSearchResults(searchQuery, page + 1);
          setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
          setPage((prevPage) => prevPage + 1);
        } else {
          const newPhotos = await fetchPopularPhotos(page + 1);
          setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
          setPage((prevPage) => prevPage + 1);
        }
        console.log("Scrolled to bottom");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [searchQuery, page]);

  return (
    <main className="py-10">
      <div className="flex flex-col">
        <input
          type="text"
          name="search"
          placeholder="ძებნა"
          className="w-96 mb-10 ml-6 bg-[#eeeeee] hover:bg-[#e9e9e9] focus:bg-white focus:border-gray-200 border p-2 outline-none rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(() => e.target.value)}
        />
      </div>
      <Gallery photos={photos} setOpenedPhoto={setOpenedPhoto} />
    </main>
  );
}
