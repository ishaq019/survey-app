import { QUIZ_APP_URL } from '../config/api';

const quizUrl = new URL(QUIZ_APP_URL);
const quizOrigin = quizUrl.origin;
const quizBasePath = quizUrl.pathname.replace(/\/$/, '');

const buildQuizUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${quizOrigin}${quizBasePath}${normalizedPath}`;
};

const isLocalhostUrl = (url) => ['localhost', '127.0.0.1'].includes(url.hostname);

export const getReturnUrl = (fallbackPath = '/') => {
  const params = new URLSearchParams(window.location.search);
  const returnUrl = params.get('returnUrl');

  if (returnUrl) {
    try {
      const parsed = new URL(returnUrl);
      if (parsed.origin === quizOrigin || parsed.origin === window.location.origin || isLocalhostUrl(parsed)) {
        return parsed.toString();
      }
    } catch (_error) {
      // ignore invalid returnUrl and use fallback
    }
  }

  return buildQuizUrl(fallbackPath);
};

export const redirectToReturnUrl = (fallbackPath = '/') => {
  window.location.href = getReturnUrl(fallbackPath);
};
