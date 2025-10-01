<script>
	let { handler, orderBy, children, class: className = '', ...props } = $props();

	// Create sort instance for this column
	let sort = handler.createSort(orderBy);

	function handleSort() {
		sort.set();
	}
</script>

<th class={className} {...props}>
	<button
		onclick={handleSort}
		class="flex w-full items-center gap-1 rounded px-1 py-1 text-start hover:bg-gray-100"
	>
		{@render children()}
		{#if sort.isActive}
			<span class="ml-1 text-xs">
				{sort.direction === 'asc' ? '↑' : '↓'}
			</span>
		{/if}
	</button>
</th>
