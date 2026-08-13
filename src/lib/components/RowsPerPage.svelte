<script>
	import { _ } from 'svelte-i18n';
	// `disabled` is explicit rather than part of ...props, which lands on the
	// wrapping div and would never reach the select
	let { handler, disabled = false, class: className = '', ...props } = $props();

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
		{disabled}
		aria-label={$_('ui.pagination.rows_per_page')}
		value={rowsPerPage}
		onchange={handleChange}
		class="border-primary bg-box cursor-pointer rounded border px-2 py-1 text-sm"
	>
		{#each options as option (option)}
			<option value={option}>{option}</option>
		{/each}
	</select>
	<span class="text-sm">{$_('ui.pagination.entries')}</span>
</div>
