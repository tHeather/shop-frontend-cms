import { useState } from "react";
import imagePlaceholder from "../../../assets/imagePlaceholder.png";
import { settings } from "../../../settings";
import { isString } from "../StringUtils/StringUtils";

const getExtension = (filename) => {
  const parts = filename.split(".");
  return parts[parts.length - 1];
};

const IMAGE_FORMATS = ["jpg", "jpeg", "bmp", "gif", "png", "svg"];

const isImage = (filename) => {
  const ext = getExtension(filename).toLowerCase();
  return IMAGE_FORMATS.includes(ext);
};

export const DisplayImage = ({ src, alt = "" }) => {
  const [image, setImage] = useState(null);

  if (isString(src) && src.length)
    return <img src={`${settings.backendApiUrl}/${src}`} alt={alt} />;

  if (src instanceof Blob && isImage(src.name)) {
    const reader = new FileReader();
    reader.readAsDataURL(src);
    reader.onload = () => {
      setImage(reader.result);
    };
    return image ? <img src={image} alt={alt} /> : <div>Loading...</div>;
  }

  return <img src={imagePlaceholder} alt={alt} />;
};
