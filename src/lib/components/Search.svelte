<script>
	import { _ } from 'svelte-i18n';
	let { handler, class: className = '', ...props } = $props();

	let searchValue = $state('');

	$effect(() => {
		if (searchValue === '') {
			handler.clearFilter('search');
		} else {
			handler.filter('search', searchValue);
		}
	});
</script>

<input
	type="text"
	placeholder={$_('ui.search_placeholder')}
	bind:value={searchValue}
	class="border-primary focus:bg-box rounded-lg border px-4 py-2 focus:outline-none {className}"
	{...props}
/>
