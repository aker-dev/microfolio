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
		<p class="text-lg">
			{page.description}
		</p>
	{/if}
</header>

<article class="prose prose-neutral text-primary">
	{@html page.content}
</article>
