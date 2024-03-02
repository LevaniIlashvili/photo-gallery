import React from "react";
import { Photo } from "../../types";

export default function Gallery({
  photos,
  setOpenedPhoto,
}: {
  photos: Photo[];
  setOpenedPhoto: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      {photos.map((photo) => {
        return (
          <img
            className="cursor-pointer"
            key={photo.id}
            src={photo.urls.thumb}
            alt={photo.alt_description}
            onClick={() => setOpenedPhoto(photo.id)}
          />
        );
      })}
    </div>
  );
}
