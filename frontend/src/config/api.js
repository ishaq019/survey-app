const DEFAULT_API_ORIGIN = 'https://survey-application-tawny.vercel.app';

const resolveApiUrl = () => {
	const configured = import.meta.env.VITE_API_URL || DEFAULT_API_ORIGIN;

	try {
		const parsed = new URL(configured);
		const normalizedPath = parsed.pathname.replace(/\/$/, '');

		if (!normalizedPath || normalizedPath === '/' || normalizedPath === '/app') {
			parsed.pathname = '/api';
		}

		return parsed.toString().replace(/\/$/, '');
	} catch {
		return `${DEFAULT_API_ORIGIN}/api`;
	}
};

export const API_URL = resolveApiUrl();
export const QUIZ_APP_URL = import.meta.env.VITE_QUIZ_APP_URL || 'https://syedishaq.me/Exam';
