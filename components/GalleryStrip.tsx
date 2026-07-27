import Image from "next/image";

const topRow = [
  {
    src: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ceee83d32ff958be63ad9c_MidrandOfficePark-1482-p-1600.avif",
    width: 320,
  },
  {
    src: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ceed18608b0ddf4d1d3e33_2011__K7C7044_Gpnt_Business_Park_off_Midrand_HR_2-p-1600.avif",
    width: 640,
  },
  {
    src: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ceed66cd08224bfbbeedea_MidrandOfficePark-17-p-1600.avif",
    width: 480,
  },
  {
    src: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ceeda7b6bd0e19228fab92_MidrandOfficePark-55-p-1600.avif",
    width: 420,
  },
];

const bottomRow = [
  {
    src: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67cece632c43c1a5ddf96ec5_pexels-sbam-27223663-p-1600.avif",
    width: 560,
  },
  {
    src: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ced064e093893c8e33c09d_2feaa21357c9d95507e11db182fdb64d.avif",
    width: 440,
  },
  {
    src: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a147df47eba794ae380d2fa_running-man.jpg",
    width: 460,
  },
  {
    src: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a05a07aa923faece8ab37e1_gym.jpg",
    width: 420,
  },
];

function Row({ images }: { images: { src: string; width: number }[] }) {
  return (
    <div className="flex gap-1 overflow-hidden">
      {images.map((img, i) => (
        <div
          key={i}
          className="relative h-[220px] shrink-0 sm:h-[280px] md:h-[340px]"
          style={{ width: img.width }}
        >
          <Image src={img.src} alt="" fill className="object-cover" sizes="640px" />
        </div>
      ))}
    </div>
  );
}

export default function GalleryStrip() {
  return (
    <section className="bg-midpoint-dark py-2">
      <div className="space-y-1">
        <Row images={topRow} />
        <Row images={bottomRow} />
      </div>
    </section>
  );
}
