<script>
	import IconTagGroup from '~icons/carbon/tag-group';
	import { _ } from 'svelte-i18n';

	let { onclick = () => {}, class: className = '', ariaLabel = $_('ui.display_metadata') } = $props();
</script>

<button
	{onclick}
	class="group bg-box text-primary border-primary z-100 cursor-pointer rounded-full border-1 p-2 {className}"
	aria-label={ariaLabel}
>
	<IconTagGroup class="pointer-events-none size-6 group-hover:scale-110" />
</button>
