import type { Metadata } from "next";
import { DEFAULT_FAQS } from "./utils/default-faqs";
import { pageMetadata } from "@/app/utils/site";

export const metadata: Metadata = pageMetadata(
  "Home",
  "The official chapter of ICpEP.SE (Institute of Computer Engineers of the Philippines — Student Edition) at Cebu Institute of Technology — University.",
);

// Mirrors the default FAQs shown on the page (see sections/faq.tsx) — lets
// AI answer engines and rich search results surface these directly.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: DEFAULT_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
