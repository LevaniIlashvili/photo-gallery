import axios from "axios";
import { Photo } from "../types";
import React, { SetStateAction } from "react";

export const fetchSearchResults = async (
  searchQuery: string,
  setContent: React.Dispatch<SetStateAction<Photo[]>>
) => {
  try {
    const cachedPhotos = getCachedPhotos(searchQuery);

    if (cachedPhotos) {
      console.log("Using cached search results");
      setContent(cachedPhotos);
    } else {
      console.log("Fetching search results");
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?page=1&per_page=20&query=${searchQuery}&client_id=${
          import.meta.env.VITE_UNSPLASH_ACCESS_KEY
        }`
      );
      cachePhotos(searchQuery, res.data.results);
      setContent(res.data.results);
    }
  } catch (error) {
    console.error("Error fetching search results", error);
  }
};

const getCachedPhotos = (query: string): Photo[] | null => {
  const cashedPhotos = localStorage.getItem(query);
  return cashedPhotos ? JSON.parse(cashedPhotos) : null;
};

const cachePhotos = (query: string, photos: Photo[]) => {
  localStorage.setItem(query, JSON.stringify(photos));
};
