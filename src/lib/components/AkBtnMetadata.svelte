<script>
	import Icon from '@iconify/svelte';

	let { onclick = () => {}, class: className = '', ariaLabel = 'Display metadata' } = $props();
</script>

<button
	{onclick}
	class="bg-box text-primary border-primary z-100 cursor-pointer rounded-full border-1 p-2 {className}"
	aria-label={ariaLabel}
>
	<Icon icon="carbon:tag-group" class="pointer-events-none size-6 hover:scale-110" />
</button>
