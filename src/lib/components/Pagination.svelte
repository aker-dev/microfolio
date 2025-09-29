<script>
	import { _ } from 'svelte-i18n';
	let { handler, class: className = '', ...props } = $props();

	// Get pagination info from DataHandler
	let pageNumber = $derived(handler.getPageNumber());
	let pageCount = $derived(handler.getPageCount());
	let pages = $derived(handler.getPages({ ellipsis: true }));

	function goToPage(page) {
		handler.setPage(page);
	}

	function previousPage() {
		handler.setPage('previous');
	}

	function nextPage() {
		handler.setPage('next');
	}
</script>

{#if $pageCount > 1}
	<nav class="flex items-center gap-1 {className}" {...props}>
		<!-- Previous button -->
		<button
			onclick={previousPage}
			disabled={$pageNumber === 1}
			class="border-primary bg-box cursor-pointer rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 {$pageNumber !==
			1
				? 'hover:bg-primary hover:text-box'
				: ''}"
			aria-label={$_('ui.pagination.previous_page')}
		>
			{$_('ui.pagination.previous')}
		</button>

		<!-- Page numbers -->
		{#each $pages as page}
			{#if page === '...'}
				<span class="text-primary px-2 py-1 text-sm">...</span>
			{:else}
				<button
					onclick={() => goToPage(page)}
					class="cursor-pointer rounded border px-3 py-1 text-sm {$pageNumber === page
						? 'border-primary bg-primary text-box'
						: 'border-primary bg-box text-primary hover:bg-primary hover:text-box'}"
					aria-label={$_('ui.pagination.go_to_page') + page}
				>
					{page}
				</button>
			{/if}
		{/each}

		<!-- Next button -->
		<button
			onclick={nextPage}
			disabled={$pageNumber === $pageCount}
			class="border-primary bg-box cursor-pointer rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 {$pageNumber !==
			$pageCount
				? 'hover:bg-primary hover:text-box'
				: ''}"
			aria-label={$_('ui.pagination.next_page')}
		>
			{$_('ui.pagination.next')}
		</button>
	</nav>
{/if}
