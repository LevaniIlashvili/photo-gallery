import { useEffect, useState } from "react";
import { fetchSearchResults } from "../apiUtils";
import Gallery from "../components/Gallery";
import axios from "axios";
import { Photo } from "../../types";

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
  const [fetching, setFetching] = useState(false);

  const fetchPopularPhotos = async (page: number) => {
    try {
      const res = await axios.get(
        `https://api.unsplash.com/photos?page=${page}&per_page=20&order_by=popular&client_id=${
          import.meta.env.VITE_UNSPLASH_ACCESS_KEY
        }`
      );
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
    if (!query) return;
    let history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    if (history.includes(query)) {
      history = [query, ...history.filter((item: string) => item !== query)];
      localStorage.setItem("searchHistory", JSON.stringify(history));
    } else {
      localStorage.setItem(
        "searchHistory",
        JSON.stringify([
          query,
          ...JSON.parse(localStorage.getItem("searchHistory") || "[]"),
        ])
      );
    }
  };

  useEffect(() => {
    const handleScroll = async () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight =
        document.documentElement.clientHeight || window.innerHeight;

      console.log(
        scrollTop + (scrollHeight - clientHeight) / 3,
        scrollHeight - clientHeight
      );
      if (
        !fetching &&
        scrollTop + (scrollHeight - clientHeight) / 3 >=
          scrollHeight - clientHeight
      ) {
        setFetching(true);
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetching]);

  useEffect(() => {
    if (page === 1) return;
    const fetchAndSetPhotos = async () => {
      if (searchQuery) {
        const newPhotos = await fetchSearchResults(searchQuery, page);
        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      } else {
        const newPhotos = await fetchPopularPhotos(page);
        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      }
      setFetching(false);
    };
    fetchAndSetPhotos();
  }, [page]);

  return (
    <main className="py-10">
      <div className="flex flex-col">
        <input
          type="text"
          name="search"
          placeholder="ძებნა"
          className="max-w-[80vw] w-96 mb-10 ml-6 bg-[#eeeeee] hover:bg-[#e9e9e9] focus:bg-white focus:border-gray-200 border p-2 outline-none rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(() => e.target.value)}
        />
      </div>
      <Gallery photos={photos} setOpenedPhoto={setOpenedPhoto} />
    </main>
  );
}
