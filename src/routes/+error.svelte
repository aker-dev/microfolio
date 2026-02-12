<script>
	import { page } from '$app/state';
	import { onMount, onDestroy } from 'svelte';
	import { ghostCursor } from 'cursor-effects';

	const status = $derived(page.status);
	const errorMessage = $derived(page.error?.message);

	let cursorEffect;

	onMount(() => {
		cursorEffect = ghostCursor();
	});

	onDestroy(() => {
		if (cursorEffect) {
			cursorEffect.destroy();
		}
	});
</script>

<div class="flex min-h-[70vh] flex-col items-center justify-center text-center select-none">
	<h1 class="mb-4 text-6xl font-bold">{status}</h1>
	<p class="text-xl">
		{#if status === 404}
			Page Not Found
		{:else if status >= 500}
			An error occurred
		{:else}
			{errorMessage || 'An error occurred'}
		{/if}
	</p>
</div>
