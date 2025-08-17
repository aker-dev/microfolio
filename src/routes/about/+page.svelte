<script>
	let { data } = $props();
	let page = $derived(data.page);
</script>

<svelte:head>
	<title>{page.title}</title>
	<meta name="description" content={page.description} />
</svelte:head>

<header class="mb-8">
	<h2 class="mb-4 text-4xl font-bold text-primary">
		{page.title}
	</h2>
	{#if page.description}
		<p class="text-xl">
			{page.description}
		</p>
	{/if}
</header>

<article class="prose prose-neutral max-w-none bg-box p-6 text-primary">
	{@html page.content}
</article>
