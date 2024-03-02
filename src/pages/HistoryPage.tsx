import { useState } from "react";
import { Photo } from "../../types";
import { fetchSearchResults } from "../apiUtils";
import Gallery from "../components/Gallery";

export default function HistoryPage({
  setOpenedPhoto,
}: {
  setOpenedPhoto: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const history: string[] = JSON.parse(
    localStorage.getItem("searchHistory") || "[]"
  );

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
            onClick={() => fetchSearchResults(query, setPhotos)}
          >
            {query}
          </li>
        ))}
        <Gallery photos={photos} setOpenedPhoto={setOpenedPhoto} />
      </ul>
    </div>
  );
}
