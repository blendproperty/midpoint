import Link from "next/link";

type PillarCardProps = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  variant?: "dark" | "cyan";
};

export default function PillarCard({
  title,
  description,
  href,
  ctaLabel,
  variant = "dark",
}: PillarCardProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={[
        "flex h-full flex-col justify-between rounded-card p-8",
        isDark ? "bg-midpoint-dark text-white" : "bg-midpoint-cyan text-midpoint-dark",
      ].join(" ")}
    >
      <div>
        <h3 className="text-3xl font-bold">{title}</h3>
        <p className={["mt-4 text-sm", isDark ? "text-white/80" : "text-midpoint-dark/80"].join(" ")}>
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-midpoint-blue px-5 py-2.5 text-sm font-semibold text-white"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
