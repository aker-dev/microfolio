<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import AkProjectCard from '$lib/components/AkProjectCard.svelte';
	import AkFilters from '$lib/components/AkFilters.svelte';
	import AkBtnClose from '$lib/components/AkBtnClose.svelte';
	import { siteConfig } from '$lib/config.js';
	import { _ } from 'svelte-i18n';

	let { data } = $props();
	let projects = $derived(data.projects);

	let selectedType = $state('all');
	let searchTerm = $state('');
	let filteredProjects = $state([]);
	let handler = $state();

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
			const height = Math.max(600, Math.min(600, windowHeight * 0.5));
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
			iconRetinaUrl: `${base}/marker-icon@2x.png`,
			iconUrl: `${base}/marker-icon.png`,
			shadowUrl: `${base}/marker-shadow.png`
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
					// Create custom icon based on featured status
					const iconOptions = project.featured
						? {
								iconUrl: `${base}/marker-featured.png`,
								iconRetinaUrl: `${base}/marker-featured@2x.png`,
								shadowUrl: `${base}/marker-shadow.png`,
								iconSize: [25, 41],
								iconAnchor: [12, 41],
								popupAnchor: [1, -34],
								shadowSize: [41, 41]
							}
						: undefined; // Use default icons

					// Create custom marker
					const marker = iconOptions
						? L.marker([lat, lng], {
								title: project.title,
								icon: L.icon(iconOptions)
							}).addTo(map)
						: L.marker([lat, lng], {
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
	<title>{siteConfig.title} • {$_('pages.map.title')}</title>
	<meta name="description" content={$_('pages.map.description')} />
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<header>
		<h1 class="text-primary mb-2 text-3xl font-bold">{$_('pages.map.title')}</h1>
		<p class="text-lg">{$_('pages.map.description')}</p>
	</header>

	<AkFilters {projects} bind:searchTerm bind:selectedType bind:filteredProjects bind:handler />

	<!-- Map Container -->
	<div class="border-primary relative overflow-hidden border">
		<div
			bind:this={mapContainer}
			class="w-full"
			style="height: {mapHeight}; max-height: 80vh;"
		></div>

		<!-- Project Card Overlay -->
		{#if selectedProject}
			<div
				class="bg-box/60 absolute inset-0 z-1000 flex items-center justify-center backdrop-blur-sm"
			>
				<div class="relative max-w-sm">
					<AkBtnClose class="absolute -top-2 -right-2" onclick={closeProjectCard} />
					<AkProjectCard project={selectedProject} />
				</div>
			</div>
		{/if}
	</div>
</div>
