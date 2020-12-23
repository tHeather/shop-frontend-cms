import imagePlaceholder from "../../../assets/imagePlaceholder.png";
import { settings } from "../../../settings";

export const DisplayImage = ({ src, alt = "" }) => {
  return (
    <img
      src={src ? `${settings.baseURL}/${src}` : imagePlaceholder}
      alt={alt}
    />
  );
};
