import axios from "axios";
import { Photo } from "../types";

export const fetchSearchResults = async (
  searchQuery: string,
  page: number
): Promise<Photo[]> => {
  console.log("query", searchQuery, "page", page);
  try {
    const cachedPhotos = getCachedPhotos(searchQuery, page);

    if (cachedPhotos) {
      return cachedPhotos;
    } else {
      console.log("Fetching search results");
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?page=${page}&per_page=20&query=${searchQuery}&client_id=${
          import.meta.env.VITE_UNSPLASH_ACCESS_KEY
        }`
      );
      cachePhotos(searchQuery, page, res.data.results);
      return res.data.results;
    }
  } catch (error) {
    console.error("Error fetching search results", error);
    return [];
  }
};

const getCachedPhotos = (query: string, page: number): Photo[] | null => {
  const cashedPhotos = localStorage.getItem(`${query}-${page}`);
  return cashedPhotos ? JSON.parse(cashedPhotos) : null;
};

const cachePhotos = (query: string, page: number, photos: Photo[]) => {
  localStorage.setItem(`${query}-${page}`, JSON.stringify(photos));
};
