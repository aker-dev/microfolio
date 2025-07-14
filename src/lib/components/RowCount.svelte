<script>
	let { handler, class: className = '', ...props } = $props();

	// Get row information from the DataHandler
	let rowCount = $derived(handler.getRowCount());
</script>

<div class="text-sm text-black {className}" {...props}>
	Showing {$rowCount.start} to {$rowCount.end} of {$rowCount.total} entries
</div>
