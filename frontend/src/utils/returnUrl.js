import { QUIZ_APP_URL } from '../config/api';

const quizOrigin = new URL(QUIZ_APP_URL).origin;

export const getReturnUrl = (fallbackPath = '/') => {
  const params = new URLSearchParams(window.location.search);
  const returnUrl = params.get('returnUrl');

  if (returnUrl) {
    try {
      const parsed = new URL(returnUrl);
      if (parsed.origin === quizOrigin) return parsed.toString();
    } catch (_error) {
      // ignore invalid returnUrl and use fallback
    }
  }

  return new URL(fallbackPath, QUIZ_APP_URL).toString();
};

export const redirectToReturnUrl = (fallbackPath = '/') => {
  window.location.href = getReturnUrl(fallbackPath);
};
