<script>
	import '../app.css';
	import '$lib/i18n.js';
	import { locale } from 'svelte-i18n';
	import AkHeader from '$lib/components/AkHeader.svelte';
	import AkFooter from '$lib/components/AkFooter.svelte';
	import { getTextDirection } from '$lib/utils/locale.js';

	let { children } = $props();

	// Text direction based on locale using $derived
	const textDirection = $derived(getTextDirection($locale));

	// Update document direction and lang when locale changes using $effect
	$effect(() => {
		if (typeof document !== 'undefined' && $locale) {
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
