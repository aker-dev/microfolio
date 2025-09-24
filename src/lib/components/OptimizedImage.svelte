<script>
	let {
		src,
		alt,
		class: className = '',
		hasWebP = false
	} = $props();

	// Replace extension with .webp for thumbnails
	const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
</script>

{#if hasWebP}
	<picture class={className}>
		<source srcset={webpSrc} type="image/webp" />
		<img {src} {alt} class={className} />
	</picture>
{:else}
	<img {src} {alt} class={className} />
{/if}