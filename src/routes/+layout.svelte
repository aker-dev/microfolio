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

	// The whole page is prerendered, so its controls exist and are clickable
	// before Svelte attaches their listeners — a click landing in that window is
	// silently lost. This marks the point where the tree is interactive, which
	// the end-to-end tests wait for; it is also a hook for hiding things until
	// then if we ever need to.
	$effect(() => {
		document.documentElement.dataset.hydrated = 'true';
	});
</script>

<AkHeader />

<main class="mx-auto max-w-7xl px-4 pb-24">
	{@render children()}
</main>

<AkFooter />
