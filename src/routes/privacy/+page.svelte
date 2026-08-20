<script>
	import AkSeo from '$lib/components/AkSeo.svelte';
	let { data } = $props();
	let page = $derived(data.page);
</script>

<AkSeo title={page.title} description={page.description} path="/privacy/" />

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

<article class="ak-editorial prose prose-neutral text-primary">
	<!-- Markdown authored in content/privacy.md and converted at build time, not user input -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html page.content}
</article>
