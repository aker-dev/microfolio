<script>
	import { _ } from 'svelte-i18n';
	let { handler, class: className = '', ...props } = $props();

	// Get row information from the DataHandler
	let rowCount = $derived(handler.getRowCount());
</script>

<div class="text-sm text-primary {className}" {...props}>
	{$_('ui.pagination.showing')} {$rowCount.start} {$_('ui.pagination.to')} {$rowCount.end} {$_('ui.pagination.of')} {$rowCount.total} {$_('ui.pagination.entries')}
</div>
