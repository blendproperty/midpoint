type Faq = { question: string; answer: string };

type Props = {
  heading: string;
  faqs: Faq[];
};

export default function PageFaqAccordion({ heading, faqs }: Props) {
  return (
    <section id="faqs" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold text-midpoint-dark md:text-3xl">{heading}</h2>
        <div className="mt-8 divide-y divide-midpoint-grey-100">
          {faqs.map((faq, i) => (
            <details key={faq.question} className="group py-4" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between text-left [&::-webkit-details-marker]:hidden">
                <span className="font-semibold text-midpoint-dark">{faq.question}</span>
                <span aria-hidden className="ml-4 shrink-0 text-midpoint-dark">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="mt-3 text-sm text-midpoint-grey-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
