<script>
	import AkBadge from '$lib/components/AkBadge.svelte';
	let { data } = $props();
	let projects = $derived(data.projects);

	// Filter state
	let selectedType = $state('all');
	let searchTerm = $state('');

	// Get unique project types
	let projectTypes = $derived(['all', ...new Set(projects.map((p) => p.type))]);

	// Filtered projects
	let filteredProjects = $derived(
		projects.filter((project) => {
			const matchesType = selectedType === 'all' || project.type === selectedType;
			const matchesSearch =
				searchTerm === '' ||
				project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
			return matchesType && matchesSearch;
		})
	);
</script>

<div class="space-y-8">
	<div class="flex flex-col space-y-4">
		<h1 class="text-4xl font-bold">Projects</h1>
		<p class="text-lg">Explore our collection of creative works</p>

		<!-- Filters -->
		<div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
			<div class="flex flex-wrap gap-2">
				{#each projectTypes as type}
					<button
						onclick={() => (selectedType = type)}
						class="rounded-full border px-3 py-1 text-sm capitalize {selectedType === type
							? 'border-black bg-black text-white'
							: 'cursor-pointer border-black bg-white text-black hover:bg-black hover:text-white'}"
					>
						{type}
					</button>
				{/each}
			</div>

			<input
				type="text"
				placeholder="Search projects..."
				bind:value={searchTerm}
				class="rounded-lg border border-black px-4 py-2 focus:bg-white focus:outline-none"
			/>
		</div>

		<!-- Results count -->
		<p class="text-sm">
			{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
		</p>
	</div>

	<!-- Mosaic Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		{#each filteredProjects as project}
			<a href="/projects/{project.slug}" class="group 0 block overflow-hidden bg-white">
				<!-- Thumbnail -->
				<div class="aspect-[4/3] overflow-hidden">
					<img
						src={project.thumbnailPath}
						alt={project.title}
						class="h-full w-full object-cover grayscale transition-all hover:grayscale-0"
						loading="lazy"
					/>
				</div>

				<!-- Content -->
				<div class="space-y-3 p-4">
					<div class="flex items-center justify-between">
						<AkBadge>{project.type}</AkBadge>
						{#if project.featured}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="size-5"
							>
								<path
									fill-rule="evenodd"
									d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
					</div>

					<h3 class="text-lg font-semibold">
						{project.title}
					</h3>

					<p class="line-clamp-2 text-sm">
						{project.description}…
					</p>

					<div class="flex items-center justify-between text-xs">
						<span>{project.location}</span>
						<span>{new Date(project.date).toISOString().slice(0, 7)}</span>
					</div>

					<!-- Tags -->
					<!-- {#if project.tags && project.tags.length > 0}
						<div class="flex flex-wrap gap-1">
							{#each project.tags.slice(0, 3) as tag}
								<span class="rounded bg-neutral-50 px-2 py-1 text-xs text-neutral-600">
									{tag}
								</span>
							{/each}
							{#if project.tags.length > 3}
								<span class="rounded bg-neutral-50 px-2 py-1 text-xs text-neutral-600">
									+{project.tags.length - 3}
								</span>
							{/if}
						</div>
					{/if} -->

					<!-- Authors -->
					<!-- {#if project.authors && project.authors.length > 0}
						<div class="text-xs text-neutral-500">
							By {project.authors.map((author) => author.name).join(', ')}
						</div>
					{/if} -->
				</div>
			</a>
		{/each}
	</div>

	<!-- Empty state -->
	{#if filteredProjects.length === 0}
		<div class="py-12 text-center">
			<p class="">No projects found matching your criteria.</p>
		</div>
	{/if}
</div>
