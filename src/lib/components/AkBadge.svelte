<script>
	let { children, small = false, class: className } = $props();
</script>

{#if !small}
	<span
		class="border-primary bg-box inline-block rounded-full border px-2 py-1 text-sm capitalize {className}"
	>
		{@render children()}
	</span>
{:else}
	<span class="border-primary bg-box text-primary rounded border px-2 py-1 text-xs {className}">
		{@render children()}
	</span>
{/if}
