<script>
	import { siteConfig } from '$lib/config.js';
	import { absoluteUrl } from '$lib/utils/seo.js';

	/**
	 * Every head tag a page needs to be indexed and to survive being shared.
	 * Written once here rather than copied into six routes, where ten tags apiece
	 * would have to be kept in step by hand.
	 *
	 * @property {string} title        page title, without the site name
	 * @property {string} description  one sentence, shown in results and previews
	 * @property {string} path         route path with no base — `/projects/foo/`
	 * @property {string} [image]      sharing image path, no base either
	 * @property {string} [imageAlt]   what the image shows
	 * @property {'website'|'article'} [type]
	 */
	let {
		title,
		description = siteConfig.description,
		path,
		image = siteConfig.ogImage,
		imageAlt = '',
		type = 'website'
	} = $props();

	let fullTitle = $derived(`${siteConfig.title} • ${title}`);
	let canonical = $derived(absoluteUrl(path));
	// Absolute, or the networks discard it
	let imageUrl = $derived(image ? absoluteUrl(image) : '');
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={siteConfig.title} />
	<meta property="og:locale" content={siteConfig.locale} />

	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
		<meta property="og:image:alt" content={imageAlt || title} />
		<!-- Only a page carrying an image earns the large card; without one X falls
		     back to a summary, which is the honest rendering -->
		<meta name="twitter:card" content="summary_large_image" />
	{:else}
		<meta name="twitter:card" content="summary" />
	{/if}
</svelte:head>
