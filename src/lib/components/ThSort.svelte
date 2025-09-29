<script>
	let { handler, orderBy, children, class: className = '', ...props } = $props();

	function handleSort() {
		handler.sort(orderBy);
	}

	// Get the current sort state
	let sortState = $derived(handler.getSort());
</script>

<th class={className} {...props}>
	<button
		onclick={handleSort}
		class="flex w-full items-center gap-1 rounded px-1 py-1 text-start hover:bg-gray-100"
	>
		{@render children()}
		{#if $sortState && $sortState.identifier === orderBy}
			<span class="ml-1 text-xs">
				{$sortState.direction === 'asc' ? '↑' : '↓'}
			</span>
		{/if}
	</button>
</th>
