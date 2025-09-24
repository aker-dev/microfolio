<script>
	import { base } from '$app/paths';

	/**
	 * Optimized image component with AVIF/WebP/fallback support
	 * @param src - Source image path (without extension)
	 * @param alt - Alternative text
	 * @param class - CSS classes
	 * @param sizes - Sizes attribute for responsive
	 * @param loading - Loading strategy
	 * @param fetchpriority - Fetch priority
	 * @param isProjectThumbnail - If it's a main project thumbnail
	 * @param isGalleryThumbnail - If it's a gallery thumbnail
	 */
	let {
		src,
		alt,
		class: className = '',
		sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
		loading = 'lazy',
		fetchpriority = 'auto',
		isProjectThumbnail = false,
		isGalleryThumbnail = false
	} = $props();

	// Build optimized image paths using $derived (correct syntax)
	const optimizedPaths = $derived({
		avif: isProjectThumbnail 
			? `${base}/content/projects/${src.split('/').slice(-2, -1)[0]}/thumbnail.avif`
			: isGalleryThumbnail
			? (() => {
				const parts = src.split('/');
				const projectSlug = parts[parts.indexOf('projects') + 1];
				const imageName = parts[parts.length - 1];
				const baseName = imageName.split('.')[0];
				return `${base}/content/projects/${projectSlug}/images/${baseName}_thumb.avif`;
			})()
			: null,
		webp: isProjectThumbnail 
			? `${base}/content/projects/${src.split('/').slice(-2, -1)[0]}/thumbnail.webp`
			: isGalleryThumbnail
			? (() => {
				const parts = src.split('/');
				const projectSlug = parts[parts.indexOf('projects') + 1];
				const imageName = parts[parts.length - 1];
				const baseName = imageName.split('.')[0];
				return `${base}/content/projects/${projectSlug}/images/${baseName}_thumb.webp`;
			})()
			: null,
		jpg: src
	});
</script>

{#if isProjectThumbnail}
	<!-- Optimized image with modern formats -->
	<picture class={className} data-optimized="true">
		<!-- AVIF - Most optimal format -->
		<source srcset={optimizedPaths.avif} type="image/avif" {sizes} />

		<!-- WebP - Modern fallback -->
		<source srcset={optimizedPaths.webp} type="image/webp" {sizes} />

		<!-- JPG - Universal fallback -->
		<img
			src={optimizedPaths.jpg}
			{alt}
			{loading}
			{fetchpriority}
			class={className}
			decoding="async"
		/>
	</picture>
{:else}
	<!-- Standard image without optimization -->
	<img {src} {alt} {loading} {fetchpriority} class={className} decoding="async" data-optimized="false" />
{/if}
