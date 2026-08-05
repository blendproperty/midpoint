type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

// Keep this wrapper server-rendered. The previous IntersectionObserver added
// state, effects and hydration for every section on every public page.
export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  return (
    <div className={className} style={delay ? { animationDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
