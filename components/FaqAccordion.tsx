"use client";

import { useState } from "react";

type Faq = { question: string; answer: string };

// Now takes faqs as a prop (fetched server-side from the DB in app/page.tsx)
// instead of importing the old static lib/faqs export directly — this
// component is a client component so it can't call Prisma itself.
export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="FAQ"
      className="bg-gradient-to-br from-white via-white to-midpoint-cyan/50 px-6 py-16"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-semibold text-midpoint-dark md:text-4xl">
          Frequently asked questions
        </h2>

        <div className="mt-8 divide-y divide-midpoint-dark/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-xl font-semibold text-midpoint-dark">{faq.question}</span>
                  <span
                    className={`ml-4 shrink-0 text-2xl text-midpoint-dark transition-transform duration-200 ease-out ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-250 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="pb-5 text-midpoint-grey-400">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
