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

  const history: string[] = JSON.parse(
    localStorage.getItem("searchHistory") || "[]"
  );

  useEffect(() => {
    if (!query) return;

    const handleScroll = async () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight =
        document.documentElement.clientHeight || window.innerHeight;

      if (scrollTop >= scrollHeight - clientHeight) {
        const newPhotos = await fetchSearchResults(query, page + 1);
        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
        setPage((prevPage) => prevPage + 1);
        console.log("Scrolled to bottom");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [query, page]);

  if (!history.length) return <div>No search history</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search History</h1>
      <ul>
        {history.map((query, index) => (
          <li
            key={index}
            className="w-96 cursor-pointer p-2
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
