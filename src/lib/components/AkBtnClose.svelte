<script>
	import IconClose from '$lib/icons/IconClose.svelte';
	import { _ } from 'svelte-i18n';

	let {
		onclick = () => {},
		class: className = '',
		// A prop rather than something to override through `class`: two background
		// utilities on the same element are decided by their order in the stylesheet,
		// not by the order of the attribute, so an override there is a coin toss.
		background = 'bg-box',
		ariaLabel = $_('ui.close')
	} = $props();
</script>

<button
	{onclick}
	class="group text-primary border-primary z-100 cursor-pointer rounded-full border p-2 {background} {className}"
	aria-label={ariaLabel}
>
	<IconClose class="pointer-events-none size-6 group-hover:scale-120" />
</button>
