<script>
	// With an href the badge renders as a link, keeping exactly the same styling
	let { children, small = false, href = null, class: className } = $props();

	const base = $derived(
		small
			? 'border-primary bg-box text-primary rounded border px-2 py-1 text-xs'
			: 'border-primary bg-box inline-block rounded-full border px-2 py-1 text-sm capitalize'
	);
</script>

{#if href}
	<a {href} class="{base} hover:bg-primary hover:text-box {className}">
		{@render children()}
	</a>
{:else}
	<span class="{base} {className}">
		{@render children()}
	</span>
{/if}
