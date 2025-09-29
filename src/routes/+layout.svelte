<script>
	import '../app.css';
	import '$lib/i18n.js';
	import { locale } from 'svelte-i18n';
	import AkHeader from '$lib/components/AkHeader.svelte';
	import AkFooter from '$lib/components/AkFooter.svelte';

	let { children } = $props();

	function getTextDirection(currentLocale) {
		// RTL languages: Arabic, Hebrew, Persian, Urdu, etc.
		const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
		return rtlLanguages.includes(currentLocale) ? 'rtl' : 'ltr';
	}

	// Text direction based on locale using $derived
	const textDirection = $derived(getTextDirection($locale));

	// Update document direction and lang when locale changes using $effect
	$effect(() => {
		if (typeof document !== 'undefined' && $locale) {
			console.log('Updating document attributes:', { locale: $locale, direction: textDirection });
			document.documentElement.setAttribute('dir', textDirection);
			document.documentElement.setAttribute('lang', $locale);
		}
	});
</script>

<AkHeader />

<main class="mx-auto max-w-7xl px-4 pb-24">
	{@render children()}
</main>

<AkFooter />
