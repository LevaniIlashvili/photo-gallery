import React from "react";
import { Photo } from "../../types";
import Masonry from "react-masonry-css";

export default function Gallery({
  photos,
  setOpenedPhoto,
}: {
  photos: Photo[];
  setOpenedPhoto: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <Masonry
      className="my-masonry-grid"
      breakpointCols={{
        default: 3,
        1100: 3,
        700: 2,
        500: 1,
      }}
      columnClassName="my-masonry-grid_column"
    >
      {photos.map((photo) => (
        <img
          key={photo.id}
          src={photo.urls.regular}
          alt={photo.alt_description}
          onClick={() => setOpenedPhoto(photo.id)}
          className="hover:opacity-85 transition-opacity duration-300 ease-in-out"
        />
      ))}
    </Masonry>
  );
}
