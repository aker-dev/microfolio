<script>
	let { data } = $props();
	let projects = $derived(data.projects);
	
	// Filter state
	let selectedType = $state('all');
	let searchTerm = $state('');
	
	// Get unique project types
	let projectTypes = $derived([
		'all',
		...new Set(projects.map(p => p.type))
	]);
	
	// Filtered projects
	let filteredProjects = $derived(
		projects.filter(project => {
			const matchesType = selectedType === 'all' || project.type === selectedType;
			const matchesSearch = searchTerm === '' || 
				project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
			return matchesType && matchesSearch;
		})
	);
</script>

<div class="space-y-8">
	<div class="flex flex-col space-y-4">
		<h1 class="text-4xl font-bold">Projects</h1>
		<p class="text-lg text-gray-600">Explore our collection of creative works</p>
		
		<!-- Filters -->
		<div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
			<div class="flex gap-2 flex-wrap">
				{#each projectTypes as type}
					<button
						onclick={() => selectedType = type}
						class="px-3 py-1 rounded-full text-sm border transition-colors {selectedType === type 
							? 'bg-black text-white border-black' 
							: 'bg-white text-black border-gray-300 hover:border-black'}"
					>
						{type.charAt(0).toUpperCase() + type.slice(1)}
					</button>
				{/each}
			</div>
			
			<input
				type="text"
				placeholder="Search projects..."
				bind:value={searchTerm}
				class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
			/>
		</div>
		
		<!-- Results count -->
		<p class="text-sm text-gray-500">
			{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
		</p>
	</div>
	
	<!-- Mosaic Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each filteredProjects as project}
			<a 
				href="/projects/{project.slug}"
				class="group block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
			>
				<!-- Thumbnail -->
				<div class="aspect-[4/3] bg-gray-100 overflow-hidden">
					<img
						src={project.thumbnailPath}
						alt={project.title}
						class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						loading="lazy"
					/>
				</div>
				
				<!-- Content -->
				<div class="p-4 space-y-3">
					<div class="flex items-center justify-between">
						<span class="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
							{project.type}
						</span>
						{#if project.featured}
							<span class="text-xs font-medium text-yellow-600">Featured</span>
						{/if}
					</div>
					
					<h3 class="text-lg font-semibold text-gray-900 group-hover:text-black">
						{project.title}
					</h3>
					
					<p class="text-sm text-gray-600 line-clamp-2">
						{project.description}
					</p>
					
					<div class="flex items-center justify-between text-xs text-gray-500">
						<span>{project.location}</span>
						<span>{new Date(project.date).toLocaleDateString()}</span>
					</div>
					
					<!-- Tags -->
					{#if project.tags && project.tags.length > 0}
						<div class="flex flex-wrap gap-1">
							{#each project.tags.slice(0, 3) as tag}
								<span class="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded">
									{tag}
								</span>
							{/each}
							{#if project.tags.length > 3}
								<span class="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded">
									+{project.tags.length - 3}
								</span>
							{/if}
						</div>
					{/if}
					
					<!-- Authors -->
					{#if project.authors && project.authors.length > 0}
						<div class="text-xs text-gray-500">
							By {project.authors.map(author => author.name).join(', ')}
						</div>
					{/if}
				</div>
			</a>
		{/each}
	</div>
	
	<!-- Empty state -->
	{#if filteredProjects.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500">No projects found matching your criteria.</p>
		</div>
	{/if}
</div>
