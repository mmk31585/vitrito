"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export function Carousel({ images }: { images: { image_url: string }[] }) {
  const [emblaRef] = useEmblaCarousel();

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {images.map((image, index) => (
          <div className="relative flex-[0_0_100%]" key={index}>
            <Image
              src={image.image_url}
              alt={`Showcase image ${index + 1}`}
              width={500}
              height={500}
              className="h-48 w-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
