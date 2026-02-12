// Centralized base path calculation - same logic as svelte.config.js
export function getBasePath() {
	return process.env.CUSTOM_DOMAIN === 'true'
		? ''
		: process.env.NODE_ENV === 'production'
			? '/microfolio'
			: '';
}
