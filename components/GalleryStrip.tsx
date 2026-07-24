import Image from "next/image";

const topRow = [
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ceee83d32ff958be63ad9c_MidrandOfficePark-1482-p-1600.avif",
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ceed18608b0ddf4d1d3e33_2011__K7C7044_Gpnt_Business_Park_off_Midrand_HR_2-p-1600.avif",
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ceed66cd08224bfbbeedea_MidrandOfficePark-17-p-1600.avif",
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ceeda7b6bd0e19228fab92_MidrandOfficePark-55-p-1600.avif",
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ceed18608b0ddf4d1d3e33_2011__K7C7044_Gpnt_Business_Park_off_Midrand_HR_2-p-1600.avif",
];

const bottomRow = [
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67cece632c43c1a5ddf96ec5_pexels-sbam-27223663-p-1600.avif",
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a05a0d539c8a4a1a9edebe7_paddle.jpg",
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ced064e093893c8e33c09d_2feaa21357c9d95507e11db182fdb64d.avif",
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a147df47eba794ae380d2fa_running-man.jpg",
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a05a07aa923faece8ab37e1_gym.jpg",
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a05bb3ff467c957c728ea01_restaurant.jpg",
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ced064e093893c8e33c09d_2feaa21357c9d95507e11db182fdb64d.avif",
];

export default function GalleryStrip() {
  return (
    <section className="bg-midpoint-dark px-6 py-12">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
          {topRow.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-7">
          {bottomRow.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
