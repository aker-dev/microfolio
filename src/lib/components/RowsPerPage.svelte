<script>
	let { handler, class: className = '', ...props } = $props();

	// Get the rows per page store
	let rowsPerPageStore = $derived(handler.getRowsPerPage());
	const options = [5, 10, 20, 50, 100];
</script>

<div class="flex items-center gap-2 {className}" {...props}>
	<span class="text-sm">Show:</span>
	<select
		bind:value={$rowsPerPageStore}
		class="rounded border border-black bg-white px-2 py-1 text-sm focus:outline-none"
	>
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
	<span class="text-sm">entries</span>
</div>
