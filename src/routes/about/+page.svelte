<script>
	let { data } = $props();
	let page = $derived(data.page);
</script>

<svelte:head>
	<title>{page.title}</title>
	<meta name="description" content={page.description} />
</svelte:head>

<header class="mb-8">
	<h2 class="mb-4 text-4xl font-bold text-black">
		{page.title}
	</h2>
	{#if page.description}
		<p class="text-xl">
			{page.description}
		</p>
	{/if}
</header>

<article class="prose prose-neutral max-w-none bg-white p-6 text-black">
	{@html page.content}
</article>
