<script>
	import { _ } from 'svelte-i18n';

	let {
		onclick = () => {},
		class: className = '',
		ariaLabel = $_('ui.display_metadata')
	} = $props();
</script>

<button
	{onclick}
	class="group bg-box text-primary border-primary z-100 cursor-pointer rounded-full border p-2 {className}"
	aria-label={ariaLabel}
>
	<!-- A bare "i": the button is already a circle, so a circled icon would nest
	     one ring inside another. The label is on the button, so this is decorative. -->
	<span
		aria-hidden="true"
		class="pointer-events-none flex size-6 items-center justify-center text-lg leading-none font-bold group-hover:scale-110"
	>
		i
	</span>
</button>
