<script>
	import '../app.css';
	import AkHeader from '$lib/components/AkHeader.svelte';
	import AkFooter from '$lib/components/AkFooter.svelte';

	let { children } = $props();
</script>

<AkHeader />

<main class="mr-auto ml-auto max-w-6xl pr-4 pb-24 pl-4">
	{@render children()}
</main>

<AkFooter />
