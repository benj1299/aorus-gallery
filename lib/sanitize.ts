import sanitizeHtml from 'sanitize-html';

/**
 * Strict allowlist for rich-text HTML rendered via dangerouslySetInnerHTML.
 * Any tag/attribute not listed here is stripped by sanitize-html.
 *
 * Security notes:
 * - Only safe formatting and structural tags are allowed (no span, div, img, iframe, script, etc.)
 * - Only `href` on <a> is allowed; `target` and `rel` are set automatically via transformTags.
 * - `style` and `class` attributes are blocked (not in allowedAttributes).
 * - `on*` event handler attributes are blocked (not in allowedAttributes).
 * - `javascript:` and `data:` URIs are blocked via allowedSchemes whitelist.
 */
const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'blockquote'];

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ['href'],
  },
  allowedSchemes: ['http', 'https'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
  },
};

export function sanitize(html: string): string {
  return sanitizeHtml(html, SANITIZE_OPTIONS);
}

export function sanitizeTranslatable(field: { en: string; fr: string; zh: string }) {
  return { en: sanitize(field.en), fr: sanitize(field.fr), zh: sanitize(field.zh) };
}
