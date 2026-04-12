import DOMPurify from 'dompurify';

/**
 * Sanitizes input strings to prevent XSS attacks.
 * Should be used before displaying user-generated content or saving to DB.
 */
export const sanitize = (content) => {
  if (typeof content !== 'string') return content;
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href']
  });
};

/**
 * Validates email format with regex.
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Prevents rapid repeated clicks (Simple Throttling).
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
