import Image from "next/image";

const rows = [
  [
    "/images/gallery/gallery-1.avif",
    "/images/gallery/gallery-2.avif",
    "/images/gallery/gallery-3.avif",
    "/images/gallery/gallery-4.avif",
    "/images/gallery/gallery-2.avif",
  ],
  [
    "/images/gallery/gallery-5.avif",
    "/images/gallery/gallery-6-paddle.jpg",
    "/images/gallery/gallery-8-running.jpg",
    "/images/gallery/gallery-9-gym.jpg",
    "/images/gallery/gallery-10-restaurant.jpg",
  ],
];

export default function GalleryStrip() {
  return (
    <section className="overflow-hidden bg-midpoint-dark px-6 py-16">
      <div className="mx-auto max-w-7xl space-y-4">
        {rows.map((images, rowIndex) => (
          <div key={rowIndex} className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-4">
              {images.map((src, imageIndex) => (
                <div key={`${src}-${imageIndex}`} className="relative h-[220px] w-[300px] shrink-0 overflow-hidden rounded-2xl sm:h-[260px] sm:w-[360px] md:h-[320px] md:w-[440px]">
                  <Image src={src} alt="" fill sizes="(min-width: 768px) 440px, (min-width: 640px) 360px, 300px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
