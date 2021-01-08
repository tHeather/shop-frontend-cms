import imagePlaceholder from "../../../assets/imagePlaceholder.png";
import { settings } from "../../../settings";

export const DisplayImage = ({ src, alt = "" }) => {
  return (
    <img
      src={src ? `${settings.backendApiUrl}/${src}` : imagePlaceholder}
      alt={alt}
    />
  );
};
