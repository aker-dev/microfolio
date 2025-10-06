<script>
	import { page } from '$app/state';

	const status = $derived(page.status);
	const errorMessage = $derived(page.error?.message);
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
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
