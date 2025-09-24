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
	<h2 class="text-primary mb-4 text-4xl font-bold">
		{page.title}
	</h2>
	{#if page.description}
		<p class="text-xl">
			{page.description}
		</p>
	{/if}
</header>

<article class="prose prose-neutral bg-box text-primary max-w-none p-6">
	{@html page.content}
</article>
