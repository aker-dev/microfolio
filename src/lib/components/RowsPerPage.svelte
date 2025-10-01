<script>
	import { _ } from 'svelte-i18n';
	let { handler, class: className = '', ...props } = $props();

	// Access rowsPerPage directly from table handler
	let rowsPerPage = $derived(handler.rowsPerPage);
	const options = [5, 10, 20, 50, 100];

	function handleChange(e) {
		handler.setRowsPerPage(Number(e.target.value));
	}
</script>

<div class="flex items-center gap-2 {className}" {...props}>
	<span class="text-sm">{$_('ui.pagination.show')}</span>
	<select
		value={rowsPerPage}
		onchange={handleChange}
		class="rounded border border-primary bg-box px-2 py-1 text-sm focus:outline-none"
	>
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
	<span class="text-sm">{$_('ui.pagination.entries')}</span>
</div>
