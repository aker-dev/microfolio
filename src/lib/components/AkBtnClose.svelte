<script>
	import Icon from '@iconify/svelte';

	let { onclick = () => {}, class: className = '', ariaLabel = 'Close' } = $props();
</script>

<button
	{onclick}
	class="bg-primary text-box z-100 cursor-pointer rounded-full p-2 {className}"
	aria-label={ariaLabel}
>
	<Icon icon="carbon:close" class="size-6 hover:scale-120" />
</button>
