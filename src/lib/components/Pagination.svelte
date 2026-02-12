<script>
	import { _ } from 'svelte-i18n';
	let { handler, class: className = '', ...props } = $props();

	// Access pagination info directly from table handler
	let currentPage = $derived(handler.currentPage);
	let pageCount = $derived(handler.pageCount);
	let pages = $derived(handler.pagesWithEllipsis);

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

{#if pageCount > 1}
	<nav class="flex items-center gap-1 {className}" {...props}>
		<!-- Previous button -->
		<button
			onclick={previousPage}
			disabled={currentPage === 1}
			class="border-primary bg-box cursor-pointer rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 {currentPage !==
			1
				? 'hover:bg-primary hover:text-box'
				: ''}"
			aria-label={$_('ui.pagination.previous_page')}
		>
			{$_('ui.pagination.previous')}
		</button>

		<!-- Page numbers -->
		{#each pages as page}
			{#if page === null || page === '...'}
				<span class="text-primary px-2 py-1 text-sm">…</span>
			{:else}
				<button
					onclick={() => goToPage(page)}
					class="cursor-pointer rounded border px-3 py-1 text-sm {currentPage === page
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
			disabled={currentPage === pageCount}
			class="border-primary bg-box cursor-pointer rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 {currentPage !==
			pageCount
				? 'hover:bg-primary hover:text-box'
				: ''}"
			aria-label={$_('ui.pagination.next_page')}
		>
			{$_('ui.pagination.next')}
		</button>
	</nav>
{/if}
