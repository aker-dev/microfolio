<script>
	import { onMount } from 'svelte';
	import AkProjectCard from '$lib/components/AkProjectCard.svelte';
	import Icon from '@iconify/svelte';

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

	// Map variables
	let mapContainer;
	let map;
	let selectedProject = $state(null);
	let markers = [];
	let windowHeight = $state(0);
	let mapHeight = $state('600px'); // Default height
	let lastBounds = null; // Store last bounds for resize

	// Update map height and invalidate size when window height changes
	$effect(() => {
		if (windowHeight > 0) {
			const height = Math.max(400, Math.min(800, windowHeight * 0.6));
			const newMapHeight = `${height}px`;

			// Only update if height actually changed
			if (newMapHeight !== mapHeight) {
				mapHeight = newMapHeight;

				// Invalidate map size after height change
				if (map) {
					// Store current bounds before height change
					const currentBounds = map.getBounds();
					// Use requestAnimationFrame to ensure DOM has updated
					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							map.invalidateSize(true);
							// Restore bounds after height change
							if (currentBounds) {
								map.fitBounds(currentBounds);
							}
						});
					});
				}
			}
		}
	});

	// Initialize map
	onMount(async () => {
		// Set initial window height
		windowHeight = window.innerHeight;

		// Listen for window resize with debouncing
		let resizeTimeout;
		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				const newHeight = window.innerHeight;
				if (newHeight !== windowHeight) {
					windowHeight = newHeight;
				}
			}, 100);
		};
		window.addEventListener('resize', handleResize);

		// Dynamic import to avoid SSR issues
		const L = await import('leaflet');

		// Fix default marker icons
		delete L.Icon.Default.prototype._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl:
				'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
			iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
		});

		// Create map with greyscale theme
		map = L.map(mapContainer, {
			center: [46.603354, 1.888334], // Center of France
			zoom: 6,
			zoomControl: true,
			scrollWheelZoom: false, // Disable scroll wheel zoom
			doubleClickZoom: true,
			touchZoom: true,
			dragging: true
		});

		// Add greyscale tile layer
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			className: 'map-tiles'
		}).addTo(map);

		// Add custom CSS for greyscale
		const style = document.createElement('style');
		style.textContent = `
			.map-tiles {
				filter: grayscale(100%);
			}
		`;
		document.head.appendChild(style);

		// Test marker
		// const testMarker = L.marker([48.8566, 2.3522]).addTo(map);
		// testMarker.bindPopup('Test marker in Paris');

		// Initial marker update
		setTimeout(() => {
			updateMarkers();
		}, 100);

		return () => {
			// Cleanup
			window.removeEventListener('resize', handleResize);
			if (map) {
				map.remove();
			}
		};
	});

	// Update markers when filtered projects change
	$effect(() => {
		// Access filteredProjects to create dependency
		const projects = filteredProjects;
		if (map && projects) {
			updateMarkers();
		}
	});

	async function updateMarkers() {
		if (!map) return;

		const L = await import('leaflet');

		// Clear existing markers
		markers.forEach((marker) => map.removeLayer(marker));
		markers = [];

		console.log('Updating markers for', filteredProjects.length, 'projects');

		// Add new markers for filtered projects
		filteredProjects.forEach((project) => {
			console.log('Processing project:', project.title, 'coordinates:', project.coordinates);
			if (
				project.coordinates &&
				Array.isArray(project.coordinates) &&
				project.coordinates.length === 2
			) {
				const [lat, lng] = project.coordinates;

				console.log('Creating marker at', lat, lng);

				try {
					// Create custom marker
					const marker = L.marker([lat, lng], {
						title: project.title
					}).addTo(map);

					// Add click handler to show project card
					marker.on('click', () => {
						selectedProject = project;
					});

					// Add tooltip with project title
					marker.bindTooltip(project.title, {
						permanent: false,
						direction: 'top'
					});

					markers.push(marker);
					console.log('Marker created successfully');
				} catch (error) {
					console.error('Error creating marker:', error);
				}
			}
		});

		console.log('Created', markers.length, 'markers');

		// Fit map to show all markers or default view
		if (markers.length > 0) {
			const group = L.featureGroup(markers);
			map.fitBounds(group.getBounds().pad(0.1));
		} else {
			map.setView([46.603354, 1.888334], 6);
		}
	}

	function closeProjectCard() {
		selectedProject = null;
	}
</script>

<svelte:head>
	<title>Projects Map</title>
	<meta name="description" content="Interactive map of projects" />
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<h2 class="text-4xl font-bold">Projects Map</h2>

	<div>
		<!-- Filters -->
		<div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
			<input
				type="text"
				placeholder="Search projects..."
				bind:value={searchTerm}
				class="rounded-lg border border-black px-4 py-2 focus:bg-white focus:outline-none"
			/>
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
		</div>

		<!-- Results count -->
		<p class="mt-2 text-sm">
			{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
		</p>
	</div>

	<!-- Map Container -->
	<div class="relative">
		<div
			bind:this={mapContainer}
			class="w-full border border-black"
			style="height: {mapHeight}"
		></div>

		<!-- Project Card Overlay -->
		{#if selectedProject}
			<div
				class="bg-opacity-50 absolute inset-0 z-1000 flex items-center justify-center bg-black/80"
			>
				<div class="relative max-w-sm">
					<button
						onclick={closeProjectCard}
						class="absolute -top-2 -right-2 z-20 cursor-pointer rounded-full bg-white p-2"
						aria-label="Close project card"
					>
						<Icon icon="carbon:close" class="h-6 w-6" />
					</button>
					<AkProjectCard project={selectedProject} />
				</div>
			</div>
		{/if}
	</div>
</div>
