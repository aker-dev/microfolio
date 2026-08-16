<script>
	// `priority` for the image that opens a page. Lazy loading is right for
	// everything below the fold, but the browser applies it before it knows what
	// is on screen, so the one image that decides the largest contentful paint
	// ends up waiting its turn like the rest.
	let { src, alt, class: className = '', hasWebP = false, priority = false } = $props();

	let loading = $derived(priority ? 'eager' : 'lazy');
	let fetchpriority = $derived(priority ? 'high' : 'auto');

	const effectiveAlt = $derived(alt || 'Image');

	// Replace extension with .webp for thumbnails
	const webpSrc = $derived(src.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
</script>

{#if hasWebP}
	<picture class={className}>
		<source srcset={webpSrc} type="image/webp" />
		<img {src} alt={effectiveAlt} class={className} {loading} {fetchpriority} />
	</picture>
{:else}
	<img {src} alt={effectiveAlt} class={className} {loading} {fetchpriority} />
{/if}
