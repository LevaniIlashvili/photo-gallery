export interface Photo {
  alt_description: string;
  id: string;
  likes: number;
  urls: {
    thumb: string;
    small: string;
    small_s3: string;
    full: string;
    raw: string;
    regular: string;
  };
  height: number;
  width: number;
}

export interface PhotoDetails extends Photo {
  views: number;
  downloads: number;
}
