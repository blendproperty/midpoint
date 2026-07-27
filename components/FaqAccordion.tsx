"use client";

import { useState } from "react";
import { faqs } from "@/lib/faqs";

export default function FaqAccordion() {
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
                  <span className="ml-4 shrink-0 text-2xl text-midpoint-dark">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="pb-5 text-midpoint-grey-400">
                    {faq.answer.map((para, i) => (
                      <p key={i} className={i > 0 ? "mt-3" : undefined}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
