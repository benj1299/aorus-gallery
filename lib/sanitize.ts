import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = ['p', 'strong', 'em', 'a', 'br', 'ul', 'ol', 'li', 'h2', 'h3', 'span'];
const ALLOWED_ATTRS = { a: ['href', 'target', 'rel'] };

export function sanitize(html: string): string {
  return sanitizeHtml(html, { allowedTags: ALLOWED_TAGS, allowedAttributes: ALLOWED_ATTRS });
}

export function sanitizeTranslatable(field: { en: string; fr: string; zh: string }) {
  return { en: sanitize(field.en), fr: sanitize(field.fr), zh: sanitize(field.zh) };
}
