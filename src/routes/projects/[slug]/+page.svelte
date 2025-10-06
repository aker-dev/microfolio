<script>
	import { base } from '$app/paths';
	import { siteConfig } from '$lib/config.js';
	import { _ } from 'svelte-i18n';
	import AkBadge from '$lib/components/AkBadge.svelte';
	import AkBtnClose from '$lib/components/AkBtnClose.svelte';
	import AkBtnMetadata from '$lib/components/AkBtnMetadata.svelte';
	import AkOptimizedImage from '$lib/components/AkOptimizedImage.svelte';
	import IconStarFilled from '~icons/carbon/star-filled';
	import IconDocument from '~icons/carbon/document';
	import IconChevronLeft from '~icons/carbon/chevron-left';
	import IconChevronRight from '~icons/carbon/chevron-right';

	let { data } = $props();
	let project = $derived(data.project);

	// Get server-loaded metadata
	let thumbnailMetadata = $derived(data.project.thumbnailMetadata);
	let imageMetadata = $derived(
		new Map(project.resources?.images?.map((img) => [img.path, img.metadata]) || [])
	);
	let metadataCount = $derived(imageMetadata.size);

	// Image gallery state
	let selectedImage = $state(null);
	let showLightbox = $state(false);
	let currentImageIndex = $state(0);
	let showTechnicalInfo = $state(false);

	function openLightbox(image) {
		selectedImage = image;
		showLightbox = true;
		// Find the index of the selected image
		if (project.resources?.images) {
			currentImageIndex = project.resources.images.findIndex((img) => img.path === image.path);
		}
	}

	function closeLightbox() {
		showLightbox = false;
		selectedImage = null;
		currentImageIndex = 0;
		showTechnicalInfo = false;
	}

	function toggleTechnicalInfo() {
		showTechnicalInfo = !showTechnicalInfo;
	}

	function navigateToImage(index) {
		if (project.resources?.images && index >= 0 && index < project.resources.images.length) {
			currentImageIndex = index;
			selectedImage = project.resources.images[index];
		}
	}

	function nextImage() {
		if (project.resources?.images) {
			const nextIndex = (currentImageIndex + 1) % project.resources.images.length;
			navigateToImage(nextIndex);
		}
	}

	function previousImage() {
		if (project.resources?.images) {
			const prevIndex =
				currentImageIndex === 0 ? project.resources.images.length - 1 : currentImageIndex - 1;
			navigateToImage(prevIndex);
		}
	}

	// Handle keyboard navigation
	function handleKeydown(event) {
		if (!showLightbox) return;

		if (event.key === 'Escape') {
			closeLightbox();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			nextImage();
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			previousImage();
		}
	}

	// No client-side metadata loading needed - data comes from server
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
	<title>{siteConfig.title} • {project.title}</title>
	<meta name="description" content={project.description} />

	<!-- OG metadata -->
	<meta property="og:title" content={project.title} />
	<meta property="og:description" content={project.description} />
	<meta property="og:image" content="{base}/content/projects/{project.slug}/thumbnail.jpg" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteConfig.title} />
</svelte:head>

<div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
	<!-- Main content -->
	<div class="col-span-2 mb-12 max-w-none">
		<!-- Title & Description -->
		<div>
			<h1 class="text-primary mb-2 text-3xl font-bold">{project.title}</h1>
		</div>
		<p class="text-lg">{project.description}</p>

		<!-- Back to projects link -->
		<a href="{base}/projects" class="my-4 block text-sm hover:underline"
			>← {$_('ui.back_to_projects')}</a
		>

		<!-- Main thumbnail -->
		<img
			src="{base}/content/projects/{project.slug}/thumbnail.jpg"
			alt={thumbnailMetadata?.description || project.title}
			class="w-full"
		/>
		<!-- Thumbnail metadata -->
		<div class="text-primary mt-4 text-sm">
			{#if thumbnailMetadata?.headline}
				<p class="font-medium">{thumbnailMetadata.headline}</p>
			{:else}
				<p class="font-medium">thumbnail.jpg</p>
			{/if}
			{#if thumbnailMetadata?.description}
				<p class="italic">{thumbnailMetadata.description}</p>
			{/if}
			{#if thumbnailMetadata?.creditLine}
				<p class="mt-1 text-xs">{$_('ui.credit')} {thumbnailMetadata.creditLine}</p>
			{/if}
		</div>

		<!-- Content -->
		<article class="prose prose-neutral text-primary mt-8">
			{@html project.content}
		</article>
	</div>

	<!-- Sidebar -->
	<aside class="bg-box mb-6 space-y-3 p-6 text-sm lg:sticky lg:top-40 lg:self-start">
		<div class="flex items-center justify-between">
			<AkBadge>{project.type}</AkBadge>

			{#if project.featured}
				<IconStarFilled class="inline-block size-6 pb-1" />
			{/if}
		</div>

		<!-- <h3 class="text-lg font-semibold text-balance">
			{project.title}
		</h3> -->
		<hr />
		<!-- Location & Date -->
		<div>
			<h3 class="text-base font-medium">{$_('ui.project.infos')}</h3>
			<span class="font-medium">{$_('ui.project.location_date')} ›</span>
			<span>{project.location} / </span>
			<span>{new Date(project.date).toISOString().slice(0, 7)}</span>

			<!-- Status -->
			{#if project.status}
				<div>
					<span class="font-medium">{$_('ui.project.status')} › </span>
					<span class="capitalize">{project.status}</span>
				</div>
			{/if}

			<!-- Project Owner -->
			{#if project.owner}
				<div>
					<span class="font-medium">{$_('ui.project.owner')} ›</span>
					<span>{project.owner}</span>
				</div>
			{/if}

			<!-- Surface Area -->
			{#if project.surface_area}
				<div>
					<span class="font-medium">{$_('ui.project.surface_area')} › </span>
					<span>{project.surface_area}</span>
				</div>
			{/if}

			<!-- Cost -->
			{#if project.cost}
				<div>
					<span class="font-medium">{$_('ui.project.cost')} ›</span>
					<span>{project.cost}</span>
				</div>
			{/if}
		</div>
		<!-- Authors -->
		{#if project.authors && project.authors.length > 0}
			<div class="mt-2">
				<h3 class="text-base font-medium">{$_('ui.project.team')}</h3>

				{#each project.authors as author}
					<div>
						<span class="font-medium">{author.name}</span>
						{#if author.role}
							<span> › {author.role}</span>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Tags -->
		{#if project.tags && project.tags.length > 0}
			<div class="mt-2">
				<h3 class="mb-1 text-base font-medium">{$_('ui.project.tags')}</h3>

				<div class="flex flex-wrap gap-2">
					{#each project.tags as tag}
						<AkBadge small>{tag}</AkBadge>
					{/each}
				</div>
			</div>
		{/if}
	</aside>
</div>

<!-- Resources -->
{#if project.resources}
	<!-- Images Gallery -->
	{#if project.resources.images && project.resources.images.length > 0}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-bold">{$_('ui.project.gallery')}</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each project.resources.images as image}
					<div class="group">
						<button
							type="button"
							onclick={() => openLightbox(image)}
							class="block aspect-[4/3] w-full cursor-pointer overflow-hidden"
						>
							<AkOptimizedImage
								src={image.path}
								alt={image.metadata?.description || image.name}
								class="image-hover-effect h-full w-full object-cover"
								hasWebP={image.hasWebP || false}
							/>
						</button>
						<!-- Image metadata -->
						<div class="text-primary mt-2 text-sm">
							{#if image.metadata?.headline}
								<p class="font-medium">{image.metadata.headline}</p>
							{:else}
								<p class="font-medium">{image.name}</p>
							{/if}
							{#if image.metadata?.description}
								<p class="italic">{image.metadata.description}</p>
							{/if}
							{#if image.metadata?.creditLine}
								<p class="mt-1 text-xs">{$_('ui.credit')} {image.metadata.creditLine}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Videos -->
	{#if project.resources.videos && project.resources.videos.length > 0}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-bold">{$_('ui.project.videos')}</h2>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each project.resources.videos as video}
					<div class="overflow-hidden">
						<video controls class="w-full" preload="metadata">
							<source src={video.path} type="video/mp4" />
							<track kind="captions" />
							{$_('ui.video_not_supported')}
						</video>
						<p class="text-primary mt-2 text-sm font-medium">{video.name}</p>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Documents -->
	{#if project.resources.documents && project.resources.documents.length > 0}
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-bold">{$_('ui.project.documents')}</h2>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each project.resources.documents as document}
					<a
						href={document.path}
						target="_blank"
						rel="noopener noreferrer"
						class="bg-box flex items-center gap-3 p-4"
					>
						<div class="flex-shrink-0">
							<IconDocument class="text-primary pointer-events-none h-6 w-6" />
						</div>
						<div class="flex-1">
							<p class="text-primary text-sm font-medium">{document.name}</p>
							<p class="text-primary text-xs">{$_('ui.click_to_download')}</p>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}
{/if}

<!-- Lightbox -->
{#if showLightbox && selectedImage}
	<div
		role="dialog"
		aria-modal="true"
		aria-label={$_('ui.image_lightbox')}
		tabindex="-1"
		class="bg-box/95 fixed inset-0 z-10000 flex items-center justify-center p-4"
		onclick={closeLightbox}
		onkeydown={handleKeydown}
	>
		<div class="relative flex h-full w-full items-center justify-center">
			<!-- Previous image click area -->
			{#if project.resources?.images && project.resources.images.length > 1}
				<button
					type="button"
					onclick={(e) => {
						e.stopPropagation();
						previousImage();
					}}
					class="absolute top-0 left-0 z-20 h-full w-1/4 cursor-pointer"
					aria-label={$_('ui.previous_image')}
				></button>
			{/if}

			<!-- Next image click area -->
			{#if project.resources?.images && project.resources.images.length > 1}
				<button
					type="button"
					onclick={(e) => {
						e.stopPropagation();
						nextImage();
					}}
					class="absolute top-0 right-0 z-20 h-full w-1/4 cursor-pointer"
					aria-label={$_('ui.next_image')}
				></button>
			{/if}

			<!-- Technical info button -->
			{#if selectedImage.metadata && (selectedImage.metadata.camera || selectedImage.metadata.lens || selectedImage.metadata.focalLength || selectedImage.metadata.aperture || selectedImage.metadata.shutterSpeed || selectedImage.metadata.iso || selectedImage.metadata.dateTime || selectedImage.metadata.city || selectedImage.metadata.state || selectedImage.metadata.country || selectedImage.metadata.location || selectedImage.metadata.gps || (selectedImage.metadata.keywords && selectedImage.metadata.keywords.length > 0))}
				<AkBtnMetadata
					class="absolute top-4 right-16 z-30"
					onclick={(e) => {
						e.stopPropagation();
						toggleTechnicalInfo();
					}}
				/>
			{/if}

			<!-- Close button -->
			<AkBtnClose
				class="absolute top-4 right-4"
				onclick={(e) => {
					e.stopPropagation();
					closeLightbox();
				}}
			/>

			<!-- Navigation arrows -->
			{#if project.resources?.images && project.resources.images.length > 1}
				<!-- Previous arrow -->
				<button
					type="button"
					onclick={(e) => {
						e.stopPropagation();
						previousImage();
					}}
					class="border-primary group bg-box text-primary absolute top-1/2 left-4 z-30 -translate-y-1/2 cursor-pointer rounded-full border-1 p-3"
					aria-label={$_('ui.previous_image')}
				>
					<IconChevronLeft class="pointer-events-none size-6 group-hover:scale-120" />
				</button>

				<!-- Next arrow -->
				<button
					type="button"
					onclick={(e) => {
						e.stopPropagation();
						nextImage();
					}}
					class="boder-primary group bg-box text-primary absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer rounded-full border-1 p-3"
					aria-label={$_('ui.next_image')}
				>
					<IconChevronRight class="pointer-events-none size-6 group-hover:scale-120" />
				</button>
			{/if}

			<div class="pointer-events-none flex h-full w-full items-center justify-center">
				<div class="flex max-h-[90vh] max-w-[95vw] flex-col items-center gap-6 lg:flex-row">
					<!-- Image section -->
					<div class="flex flex-col items-center gap-4">
						<div class="relative">
							<img
								src={selectedImage.path}
								alt={selectedImage.name}
								class="max-h-[60vh] max-w-[90vw] object-contain shadow-2xl lg:max-w-[60vw]"
								fetchpriority="high"
							/>

							<!-- Technical info overlay -->
							{#if showTechnicalInfo && selectedImage.metadata && (selectedImage.metadata.camera || selectedImage.metadata.lens || selectedImage.metadata.focalLength || selectedImage.metadata.aperture || selectedImage.metadata.shutterSpeed || selectedImage.metadata.iso || selectedImage.metadata.dateTime || selectedImage.metadata.city || selectedImage.metadata.state || selectedImage.metadata.country || selectedImage.metadata.location || selectedImage.metadata.gps || (selectedImage.metadata.keywords && selectedImage.metadata.keywords.length > 0))}
								{@const metadata = selectedImage.metadata}
								<div
									class="text-primary bg-box/60 pointer-events-auto absolute top-0 right-0 z-30 max-h-[60vh] w-80 space-y-3 overflow-y-auto p-4 text-sm shadow-xl backdrop-blur-sm"
								>
									<!-- Technical details -->
									{#if metadata?.camera || metadata?.lens || metadata?.focalLength || metadata?.aperture || metadata?.shutterSpeed || metadata?.iso}
										<div>
											<h3 class="text-base font-medium">{$_('ui.metadata.technical_details')}</h3>
											{#if metadata.camera}
												<div>
													<span class="font-medium">{$_('ui.metadata.camera')} ›</span>
													<span>{metadata.camera}</span>
												</div>
											{/if}
											{#if metadata.lens}
												<div>
													<span class="font-medium">{$_('ui.metadata.lens')} ›</span>
													<span>{metadata.lens}</span>
												</div>
											{/if}
											{#if metadata.focalLength}
												<div>
													<span class="font-medium">{$_('ui.metadata.focal_length')} ›</span>
													<span>{metadata.focalLength}</span>
												</div>
											{/if}
											{#if metadata.aperture}
												<div>
													<span class="font-medium">{$_('ui.metadata.aperture')} ›</span>
													<span>{metadata.aperture}</span>
												</div>
											{/if}
											{#if metadata.shutterSpeed}
												<div>
													<span class="font-medium">{$_('ui.metadata.shutter_speed')} ›</span>
													<span>{metadata.shutterSpeed}</span>
												</div>
											{/if}
											{#if metadata.iso}
												<div>
													<span class="font-medium">{$_('ui.metadata.iso')} ›</span>
													<span>{metadata.iso}</span>
												</div>
											{/if}
										</div>
									{/if}

									<!-- Location and date -->
									{#if metadata?.dateTime || metadata?.city || metadata?.state || metadata?.country || metadata?.location || metadata?.gps}
										<div>
											<h3 class="text-base font-medium">{$_('ui.metadata.location_date')}</h3>
											{#if metadata.dateTime}
												<div>
													<span class="font-medium">{$_('ui.metadata.date')} ›</span>
													<span>{new Date(metadata.dateTime).toLocaleString()}</span>
												</div>
											{/if}
											{#if metadata.location}
												<div>
													<span class="font-medium">{$_('ui.metadata.location')} ›</span>
													<span>{metadata.location}</span>
												</div>
											{/if}
											{#if metadata.city || metadata.state || metadata.country}
												<div>
													<span class="font-medium">{$_('ui.metadata.address')} ›</span>
													<span
														>{[metadata.city, metadata.state, metadata.country]
															.filter(Boolean)
															.join(', ')}</span
													>
												</div>
											{/if}
											{#if metadata.gps}
												<div>
													<span class="font-medium">{$_('ui.metadata.coordinates')} ›</span>
													<span>
														<a
															href="https://www.openstreetmap.org/?mlat={metadata.gps
																.latitude}&mlon={metadata.gps.longitude}&zoom=15"
															target="_blank"
															rel="noopener noreferrer"
															class="underline hover:no-underline"
														>
															{metadata.gps.latitude.toFixed(6)}, {metadata.gps.longitude.toFixed(
																6
															)}
														</a>
													</span>
												</div>
											{/if}
										</div>
									{/if}

									<!-- Keywords -->
									{#if metadata?.keywords && metadata.keywords.length > 0}
										<div>
											<h3 class="mb-1 text-base font-medium">{$_('ui.metadata.keywords')}</h3>
											<div class="flex flex-wrap gap-1">
												{#each metadata.keywords as keyword}
													<AkBadge small>{keyword}</AkBadge>
												{/each}
											</div>
										</div>
									{/if}
								</div>
							{/if}
						</div>

						<!-- Basic info under image -->
						<div class="text-primary pointer-events-auto max-w-[90vw] text-center lg:max-w-[60vw]">
							{#if selectedImage.metadata?.headline}
								<p class="text-lg font-medium">{selectedImage.metadata.headline}</p>
							{:else}
								<p class="text-lg font-medium">{selectedImage.name}</p>
							{/if}
							{#if selectedImage.metadata?.description}
								<p class="mt-1 text-sm italic">{selectedImage.metadata.description}</p>
							{/if}
							{#if selectedImage.metadata?.creditLine}
								<p class="mt-1 text-xs">{$_('ui.credit')} {selectedImage.metadata.creditLine}</p>
							{/if}
						</div>

						<!-- Image counter -->
						{#if project.resources?.images && project.resources.images.length > 1}
							<div
								class="bg-box text-primary border-primary rounded-full border-1 px-3 py-1 text-sm"
							>
								{currentImageIndex + 1} / {project.resources.images.length}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
