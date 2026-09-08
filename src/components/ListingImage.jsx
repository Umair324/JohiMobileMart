import PhoneArt from "./PhoneArt";
import { isUploadedImage, resolveImageUrl } from "../api/client";

export default function ListingImage({ image, alt = "", className = "", angle = 0 }) {
  if (isUploadedImage(image)) {
    return <img src={resolveImageUrl(image)} alt={alt} className={className} loading="lazy" />;
  }
  return <PhoneArt imageKey={image || "default-1"} className={className} angle={angle} />;
}
