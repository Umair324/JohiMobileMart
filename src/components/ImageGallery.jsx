import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import ListingImage from "./ListingImage";

export default function ImageGallery({ images = [], sold = false }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  const go = (dir) => {
    setActive((prev) => (prev + dir + images.length) % images.length);
  };

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-paper-line bg-paper">
        <ListingImage
          image={images[active]}
          angle={active % 2 === 0 ? 0 : 6}
          className={`h-full w-full object-cover transition-transform duration-300 ${
            zoom ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
          }`}
        />
        <button
          onClick={() => setZoom((z) => !z)}
          aria-label="Toggle image zoom"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm"
        >
          <ZoomIn size={16} className="text-ink" />
        </button>

        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/45">
            <span className="rotate-[-8deg] rounded-tag border-2 border-white px-5 py-1.5 text-xl font-extrabold text-white">
              SOLD
            </span>
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={String(img) + i}
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-tag border-2 ${
                active === i ? "border-bazaar-500" : "border-transparent"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <ListingImage image={img} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
