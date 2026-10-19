"use client";

import { useEffect, useRef, useState } from "react";

export default function LocationMap() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) { setVisible(true); return; }
    // Native iframe lazy loading still fetched 462 KiB before this map was visible.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "200px" });
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} className="mt-16">
      <a href="https://www.google.com/maps/search/?api=1&query=162%20Tonetti%20Street%2C%20Halfway%20House%2C%20Midrand" target="_blank" rel="noopener noreferrer" className="mb-3 inline-block text-sm font-semibold text-white underline">View Midpoint on Google Maps</a>
      <div className="relative h-72 w-full overflow-hidden rounded-card bg-midpoint-dark md:h-96">
      {visible && <iframe
        title="Google map showcasing office location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3586.0622489060165!2d28.121084777120107!3d-25.998778177203732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e956e055e9b7cb9%3A0x6612fda1aab019bf!2s162%20Tonetti%20St%2C%20Halfway%20House%2C%20Midrand%2C%201685%2C%20South%20Africa!5e0!3m2!1sen!2suk!4v1741856151377!5m2!1sen!2suk"
        width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
      />}
      {/* Overlays preserve map interaction without breaking WebGL compositing. */}
      <div className="pointer-events-none absolute inset-0 bg-white mix-blend-saturation" />
      <div className="pointer-events-none absolute inset-0 bg-midpoint-dark/35" />
      </div>
    </div>
  );
}
