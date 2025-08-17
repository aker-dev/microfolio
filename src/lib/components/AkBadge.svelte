<script>
	let { children, small = false, class: className } = $props();
</script>

{#if !small}
	<span
		class="inline-block rounded-full border border-primary bg-box px-2 py-1 text-sm capitalize {className}"
	>
		{@render children()}
	</span>
{:else}
	<span class="rounded border border-primary bg-box px-2 py-1 text-xs text-primary {className}">
		{@render children()}
	</span>
{/if}
