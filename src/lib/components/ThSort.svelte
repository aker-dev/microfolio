<script>
	import IconChevronUp from '~icons/carbon/chevron-up';
	import IconChevronDown from '~icons/carbon/chevron-down';

	let {
		handler,
		orderBy,
		children,
		class: className = '',
		sortBy = $bindable(),
		sortOrder = $bindable(),
		...props
	} = $props();

	// Create sort instance for this column
	let sort = handler.createSort(orderBy);

	function handleSort() {
		sort.set();
		// Update external sortBy and sortOrder if bindable props are provided
		if (sortBy !== undefined && sortOrder !== undefined) {
			sortBy = orderBy;
			sortOrder = sort.direction;
		}
	}

	// Watch for external sort changes and apply them
	$effect(() => {
		if (sortBy !== undefined && sortOrder !== undefined) {
			if (sortBy === orderBy) {
				// This column should be sorted
				if (sort.direction !== sortOrder) {
					// Apply the sort until we get the right direction
					const currentDirection = sort.direction;
					if (currentDirection === null) {
						sort.set(); // null -> asc
						if (sortOrder === 'desc') {
							sort.set(); // asc -> desc
						}
					} else if (currentDirection !== sortOrder) {
						sort.set();
					}
				}
			}
		}
	});
</script>

<th class={className} {...props}>
	<button
		onclick={handleSort}
		class="hover:bg-background flex w-full cursor-pointer items-center gap-1 rounded px-1 py-1 text-start {sort.isActive
			? 'bg-background'
			: ''}"
	>
		{@render children()}
		{#if sort.isActive}
			<span class="ml-1">
				{#if sort.direction === 'asc'}
					<IconChevronUp class="size-3" />
				{:else}
					<IconChevronDown class="size-3" />
				{/if}
			</span>
		{/if}
	</button>
</th>
