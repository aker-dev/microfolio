<script>
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
			class="rounded border border-black bg-white px-3 py-1 text-sm hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
		>
			Previous
		</button>

		<!-- Page numbers -->
		{#each $pages as page}
			{#if page === '...'}
				<span class="px-2 py-1 text-sm text-black">...</span>
			{:else}
				<button
					onclick={() => goToPage(page)}
					class="rounded border px-3 py-1 text-sm {$pageNumber === page
						? 'border-black bg-black text-white'
						: 'border-black bg-white text-black hover:bg-black hover:text-white'}"
				>
					{page}
				</button>
			{/if}
		{/each}

		<!-- Next button -->
		<button
			onclick={nextPage}
			disabled={$pageNumber === $pageCount}
			class="rounded border border-black bg-white px-3 py-1 text-sm hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
		>
			Next
		</button>
	</nav>
{/if}
