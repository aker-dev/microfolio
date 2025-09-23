<script>
	import IconTagGroup from '~icons/carbon/tag-group';

	let { onclick = () => {}, class: className = '', ariaLabel = 'Display metadata' } = $props();
</script>

<button
	{onclick}
	class="bg-box text-primary border-primary z-100 cursor-pointer rounded-full border-1 p-2 {className}"
	aria-label={ariaLabel}
>
	<IconTagGroup class="pointer-events-none size-6 hover:scale-110" />
</button>
