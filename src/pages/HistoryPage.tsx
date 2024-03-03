import { useEffect, useState } from "react";
import { Photo } from "../../types";
import { fetchSearchResults } from "../apiUtils";
import Gallery from "../components/Gallery";

export default function HistoryPage({
  setOpenedPhoto,
}: {
  setOpenedPhoto: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [fetching, setFetching] = useState(false);

  const history: string[] = JSON.parse(
    localStorage.getItem("searchHistory") || "[]"
  );

  useEffect(() => {
    const handleScroll = async () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight =
        document.documentElement.clientHeight || window.innerHeight;

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
      if (query) {
        const newPhotos = await fetchSearchResults(query, page);
        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      }
      setFetching(false);
    };
    fetchAndSetPhotos();
  }, [page]);

  if (!history.length) return <div>No search history</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search History</h1>
      <ul>
        {history.map((query, index) => (
          <li
            key={index}
            className="max-w-[80vw] w-96 cursor-pointer p-2
          hover:bg-gray-200 rounded-md transition-colors duration-200 ease-in-out
          "
            onClick={async () => {
              setPhotos(await fetchSearchResults(query, page));
              setQuery(query);
            }}
          >
            {query}
          </li>
        ))}
        <Gallery photos={photos} setOpenedPhoto={setOpenedPhoto} />
      </ul>
    </div>
  );
}
