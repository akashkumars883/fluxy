// Minimal HTML sanitizer used for client-side rendering of rich blog content.
// Removes script/style/iframe/embed/object tags and strips event-handler attributes
// and javascript: hrefs. This is intentionally small and dependency-free.
export function sanitizeHtml(html) {
  if (!html) return "";

  try {
    if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Remove disallowed tags
      const forbidden = [
        "script",
        "style",
        "iframe",
        "object",
        "embed",
        "link",
      ];
      forbidden.forEach((tag) => {
        const els = doc.getElementsByTagName(tag);
        Array.from(els).forEach((e) => e.remove());
      });

      // Walk elements and strip dangerous attributes
      const walker = doc.createTreeWalker(
        doc.body,
        NodeFilter.SHOW_ELEMENT,
        null,
        false,
      );
      let node = walker.nextNode();
      while (node) {
        const attrs = Array.from(node.attributes || []);
        for (const attr of attrs) {
          const name = (attr.name || "").toLowerCase();
          const val = (attr.value || "").trim().toLowerCase();

          // Remove event handlers (on*) and javascript: hrefs
          if (
            name.startsWith("on") ||
            (name === "href" && val.startsWith("javascript:"))
          ) {
            node.removeAttribute(attr.name);
          }
        }
        node = walker.nextNode();
      }

      return doc.body.innerHTML;
    }
  } catch (e) {
    // Fallthrough to regex fallback
  }

  // Fallback: crude regex-based cleanup (used in non-browser environments)
  let s = String(html);
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
  s = s.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");
  s = s.replace(/on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  s = s.replace(/href\s*=\s*("|')javascript:[^"']*("|')/gi, 'href="#"');
  return s;
}

export default sanitizeHtml;
