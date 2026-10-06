import DOMPurify from "isomorphic-dompurify";
import { Event } from "../utils/event";

// Event content is written by officers in a rich-text editor, and anyone who can
// post can put a script in it. Strip everything but basic formatting before it
// is rendered as HTML.
const sanitizeContent = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li", "h1", "h2", "h3", "h4", "blockquote", "a", "img", "span"],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt"],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
  });

interface Props {
  title: string;
  description: string;
  details: Event["details"];
  content?: string;
}

export default function EventDetails({
  title,
  description,
  details,
  content,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
      <h2 className="font-rubik text-xl sm:text-2xl font-bold text-primary3 mb-4 pb-2 border-b border-gray-100">
        Details
      </h2>

      <div className="font-raleway text-bodytext text-sm sm:text-base leading-relaxed space-y-4">
        <p>{description}</p>

        {content && (
          <section className="mt-6 space-y-3">
            <h3 className="font-rubik font-semibold text-lg">Content</h3>

            {/<\/?[a-z][\s\S]*>/i.test(content) ? (
              <div
                className="font-raleway text-bodytext leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{ __html: sanitizeContent(content) }}
              />
            ) : (
              <div className="font-raleway whitespace-pre-wrap leading-relaxed">
                {content}
              </div>
            )}
          </section>
        )}
      </div>

      <div className="mt-6 space-y-6">
        {Array.isArray(details) &&
          details.map((section, idx) => (
            <div key={idx}>
              <p className="font-rubik font-semibold text-base">
                {section.title}
              </p>
              <ul className="mt-2 list-disc list-inside font-raleway text-bodytext space-y-1">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}
