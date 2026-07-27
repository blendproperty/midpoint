"use client";

import { useState } from "react";

type Faq = { question: string; answer: string };

type Props = {
  heading: string;
  faqs: Faq[];
};

export default function PageFaqAccordion({ heading, faqs }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold text-midpoint-dark md:text-3xl">{heading}</h2>
        <div className="mt-8 divide-y divide-midpoint-grey-100">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.question} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="font-semibold text-midpoint-dark">{faq.question}</span>
                  <span aria-hidden className="ml-4 shrink-0 text-midpoint-dark">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && <p className="mt-3 text-sm text-midpoint-grey-400">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
