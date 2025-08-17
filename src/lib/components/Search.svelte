<script>
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
	placeholder="Search..."
	bind:value={searchValue}
	class="rounded-lg border border-primary px-4 py-2 focus:bg-box focus:outline-none {className}"
	{...props}
/>
