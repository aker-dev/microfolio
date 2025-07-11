<script>
	import '../app.css';
	import AkHeader from '$lib/components/AkHeader.svelte';
	import AkFooter from '$lib/components/AkFooter.svelte';

	let { children } = $props();
</script>

<AkHeader />

<main class="prose">
	{@render children()}
</main>

<AkFooter />
