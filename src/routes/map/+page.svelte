<script>
	import { onMount } from 'svelte';
	import AkProjectSummary from '$lib/components/AkProjectSummary.svelte';
	import AkFilters from '$lib/components/AkFilters.svelte';
	import AkBtnClose from '$lib/components/AkBtnClose.svelte';
	import { siteConfig } from '$lib/config.js';
	import { _ } from 'svelte-i18n';
	import 'maplibre-gl/dist/maplibre-gl.css';
	// MapLibre parses tiles in a worker whose URL it builds at runtime, from a
	// name it assembles rather than a literal. Rollup cannot see through that, so
	// the production build referenced a chunk it had never emitted and the map came
	// up blank with no tile request at all. `?worker&url` makes Vite bundle the
	// worker together with the shared module it imports and hand back its address.
	import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

	let { data } = $props();
	let projects = $derived(data.projects);

	let selectedType = $state('all');
	let searchTerm = $state('');
	let filteredProjects = $state([]);
	let handler = $state();

	// Centre of France, in MapLibre's [longitude, latitude] order
	const DEFAULT_CENTER = [1.888334, 46.603354];
	const DEFAULT_ZOOM = 5;

	let maplibre;
	let mapContainer;
	let map;
	let mapReady = false;
	let markers = [];
	let tooltip;
	let selectedProject = $state(null);
	let mapUnavailable = $state(false);

	onMount(() => {
		let disposed = false;

		// Not an async onMount: Svelte only treats a returned function as the
		// cleanup, and an async callback hands it a promise instead.
		(async () => {
			// Dynamic, because MapLibre reaches for window and this page is prerendered.
			// The whole namespace, not `.default`: v6 dropped the default export that
			// every example still shows, and `.default` is simply undefined.
			maplibre = await import('maplibre-gl');
			if (disposed) return;

			maplibre.config.WORKER_URL = maplibreWorkerUrl;

			try {
				map = new maplibre.Map({
					container: mapContainer,
					style: siteConfig.map.style,
					center: DEFAULT_CENTER,
					zoom: DEFAULT_ZOOM,
					maxZoom: siteConfig.map.maxZoom,
					scrollZoom: false,
					attributionControl: {
						compact: true,
						customAttribution: siteConfig.map.attribution
					}
				});
			} catch (error) {
				// MapLibre draws with WebGL and throws outright where there is none.
				// Leaflet only ever assembled images and had no such floor.
				console.error('The map could not start:', error);
				mapUnavailable = true;
				return;
			}

			map.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-left');
			tooltip = new maplibre.Popup({ closeButton: false, closeOnClick: false, offset: 14 });

			map.on('load', () => {
				mapReady = true;
				updateMarkers();
			});
		})();

		return () => {
			disposed = true;
			markers.forEach((marker) => marker.remove());
			map?.remove();
		};
	});

	// Redraw the markers whenever the filters change the set
	$effect(() => {
		const shown = filteredProjects;
		if (map && mapReady && shown) updateMarkers();
	});

	/**
	 * Project frontmatter records `coordinates: [latitude, longitude]`; MapLibre
	 * wants [longitude, latitude]. This is the one place the two orders meet, and
	 * the only place the swap happens.
	 */
	function toLngLat(coordinates) {
		if (!Array.isArray(coordinates) || coordinates.length !== 2) return null;

		const [lat, lng] = coordinates;
		if (typeof lat !== 'number' || typeof lng !== 'number') return null;
		if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

		return [lng, lat];
	}

	function updateMarkers() {
		markers.forEach((marker) => marker.remove());
		markers = [];
		tooltip?.remove();

		const bounds = new maplibre.LngLatBounds();

		for (const project of filteredProjects) {
			const position = toLngLat(project.coordinates);
			if (!position) continue;

			const marker = new maplibre.Marker({ element: markerFor(project, position) });
			markers.push(marker.setLngLat(position).addTo(map));
			bounds.extend(position);
		}

		if (markers.length > 0) {
			// The map's own maxZoom caps how far this can go
			map.fitBounds(bounds, { padding: 60, duration: 0 });
		} else {
			map.jumpTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
		}
	}

	/**
	 * A real button rather than an image: the Leaflet markers could not be reached
	 * from the keyboard at all. Its looks live in `app.css`, in fixed ink rather
	 * than theme tokens — see the note there.
	 */
	function markerFor(project, position) {
		const element = document.createElement('button');
		element.type = 'button';
		element.className = `ak-marker${project.featured ? ' ak-marker--featured' : ''}`;
		element.setAttribute('aria-label', project.title);

		element.addEventListener('click', (event) => {
			event.stopPropagation();
			selectedProject = project;
		});

		// On focus too, or the title never surfaces for a keyboard visitor
		const showTitle = () => tooltip.setLngLat(position).setText(project.title).addTo(map);
		const hideTitle = () => tooltip.remove();
		element.addEventListener('mouseenter', showTitle);
		element.addEventListener('mouseleave', hideTitle);
		element.addEventListener('focus', showTitle);
		element.addEventListener('blur', hideTitle);

		return element;
	}

	function closeProjectCard() {
		selectedProject = null;
	}

	function handleKeydown(event) {
		if (selectedProject && event.key === 'Escape') closeProjectCard();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>{siteConfig.title} • {$_('pages.map.title')}</title>
	<meta name="description" content={$_('pages.map.description')} />
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<header>
		<h1 class="text-primary mb-2 text-3xl font-bold">{$_('pages.map.title')}</h1>
		<h2 class="text-lg">{$_('pages.map.description')}</h2>
	</header>

	<AkFilters {projects} bind:searchTerm bind:selectedType bind:filteredProjects bind:handler />

	<!-- Map Container -->
	<div class="border-primary relative overflow-hidden border">
		<div bind:this={mapContainer} class="h-150 max-h-[80vh] w-full"></div>

		{#if mapUnavailable}
			<div class="bg-box absolute inset-0 z-1000 flex items-center justify-center p-8 text-center">
				<p>{$_('pages.map.unavailable')}</p>
			</div>
		{/if}

		<!-- Project Card Overlay -->
		{#if selectedProject}
			<!-- The veil only fades the map, it does not capture: while it did, the
			     map was frozen for as long as a card was open — no panning, no
			     zooming, and no reaching another marker without closing first. Only
			     the card and its button take pointer events, so the gutters either
			     side of the card stay part of the map. A click outside therefore
			     pans rather than closes, as on the lightbox. -->
			<div
				class="bg-box/50 pointer-events-none absolute inset-0 z-1000 flex items-center justify-center"
			>
				<!-- A text-first summary rather than AkProjectCard: its 4:3 thumbnail
				     took over the callout, and most of the screen on a phone. -->
				<div class="relative w-full max-w-sm px-4">
					<!-- Centred on the callout's top-right corner, which px-4 puts 1rem in
					     from this wrapper. Inside the card it sat on top of the title. -->
					<AkBtnClose
						class="pointer-events-auto absolute top-0 right-4 z-10 translate-x-1/2 -translate-y-1/2"
						background="bg-background hover:bg-box"
						onclick={closeProjectCard}
					/>
					<AkProjectSummary
						project={selectedProject}
						class="border-primary pointer-events-auto border"
					/>
				</div>
			</div>
		{/if}
	</div>
</div>
