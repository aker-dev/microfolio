<script>
	let {
		src,
		alt,
		class: className = '',
		hasWebP = false
	} = $props();

	const effectiveAlt = $derived(alt || 'Image');

	// Replace extension with .webp for thumbnails
	const webpSrc = $derived(src.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
</script>

{#if hasWebP}
	<picture class={className}>
		<source srcset={webpSrc} type="image/webp" />
		<img {src} alt={effectiveAlt} class={className} loading="lazy" />
	</picture>
{:else}
	<img {src} alt={effectiveAlt} class={className} loading="lazy" />
{/if}