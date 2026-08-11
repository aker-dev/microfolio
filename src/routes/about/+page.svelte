<script>
	import { siteConfig } from '$lib/config.js';
	let { data } = $props();
	let page = $derived(data.page);
</script>

<svelte:head>
	<title>{siteConfig.title} • {page.title}</title>
	<meta name="description" content={page.description} />
</svelte:head>

<header class="mb-8">
	<h1 class="text-primary mb-2 text-3xl font-bold">
		{page.title}
	</h1>
	{#if page.description}
		<h2 class="text-lg">
			{page.description}
		</h2>
	{/if}
</header>

<article class="prose prose-neutral text-primary">
	<!-- Markdown authored in content/about.md and converted at build time, not user input -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html page.content}
</article>
