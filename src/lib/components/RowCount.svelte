<script>
	import { _ } from 'svelte-i18n';
	let { handler, class: className = '', ...props } = $props();

	// Access row count directly from table handler
	let rowCount = $derived(handler.rowCount);
</script>

<div class="text-sm text-primary {className}" {...props}>
	{$_('ui.pagination.showing')} {rowCount.start} {$_('ui.pagination.to')} {rowCount.end} {$_('ui.pagination.of')} {rowCount.total} {$_('ui.pagination.entries')}
</div>
