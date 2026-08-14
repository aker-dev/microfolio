<script>
	import { _ } from 'svelte-i18n';
	import { siteConfig } from '$lib/config.js';
	import AkBtnClose from './AkBtnClose.svelte';
	import AkBtnMetadata from './AkBtnMetadata.svelte';
	import IconChevronLeft from '~icons/carbon/chevron-left';
	import IconChevronRight from '~icons/carbon/chevron-right';

	let { images = [], open = $bindable(false), index = $bindable(0) } = $props();

	// The info panel stays as the visitor left it while they browse from one
	// image to the next; only closing the lightbox resets it.
	let showInfo = $state(false);

	let image = $derived(images[index] ?? null);
	let metadata = $derived(image?.metadata ?? null);
	let hasSeveral = $derived(images.length > 1);

	// The panel's three sections. Field lists sit together so adding an EXIF
	// field is one edit rather than four.
	const CAMERA_FIELDS = ['camera', 'lens', 'focalLength', 'aperture', 'shutterSpeed', 'iso'];
	const CONTEXT_FIELDS = ['dateTime', 'city', 'state', 'country', 'location', 'gps'];

	function hasAny(fields) {
		return fields.some((field) => metadata?.[field]);
	}

	let hasCameraInfo = $derived(hasAny(CAMERA_FIELDS));
	let hasContextInfo = $derived(hasAny(CONTEXT_FIELDS));
	let hasKeywords = $derived(metadata?.keywords?.length > 0);

	function close() {
		open = false;
		showInfo = false;
	}

	function goTo(next) {
		if (images.length === 0) return;
		index = (next + images.length) % images.length;
	}

	function handleKeydown(event) {
		if (!open) return;
		revealControls();

		if (event.key === 'Escape') {
			close();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			goTo(index + 1);
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			goTo(index - 1);
		}
	}

	// The controls step out of the way while the visitor is looking at an image,
	// and any sign of activity brings them straight back.
	const hideDelay = siteConfig.lightbox?.hideControlsDelay ?? 0;
	let controlsVisible = $state(true);
	let hideTimer;

	function revealControls() {
		controlsVisible = true;
		clearTimeout(hideTimer);
		if (hideDelay > 0) {
			hideTimer = setTimeout(() => (controlsVisible = false), hideDelay);
		}
	}

	$effect(() => {
		if (!open) {
			clearTimeout(hideTimer);
			return;
		}
		revealControls();
		return () => clearTimeout(hideTimer);
	});

	// Hidden controls must not swallow clicks meant for the image beneath them.
	// The invisible navigation zones are left alone: they have nothing to hide,
	// and keeping them live means a click still works the instant the pointer
	// movement that preceded it has brought the rest back.
	let controlsClass = $derived(
		`transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`
	);
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open && image}
	<!-- Clicking beside the image deliberately does nothing: closing is the cross
	     or Escape, so a stray click never loses the visitor's place. -->
	<div
		role="dialog"
		aria-modal="true"
		aria-label={$_('ui.image_lightbox')}
		tabindex="-1"
		class="bg-box fixed inset-0 z-10000 flex"
		onmousemove={revealControls}
		ontouchstart={revealControls}
	>
		<!-- Info panel: takes its own column from lg, overlays the image below it -->
		{#if showInfo}
			<aside
				aria-label={$_('ui.image_details')}
				class="bg-box border-primary text-primary absolute inset-y-0 left-0 z-40 w-80 max-w-[85vw] space-y-4 overflow-y-auto border-r p-6 text-sm lg:static lg:max-w-none lg:shrink-0"
			>
				<div>
					<h2 class="text-base font-bold">{metadata?.headline || image.name}</h2>
					{#if metadata?.description}
						<p class="mt-1 italic">{metadata.description}</p>
					{/if}
					{#if metadata?.creditLine}
						<p class="mt-1 text-xs">{$_('ui.credit')} › {metadata.creditLine}</p>
					{/if}
				</div>

				{#if hasCameraInfo}
					<div class="text-xs">
						<h3 class="text-sm font-bold">{$_('ui.metadata.technical_details')}</h3>
						{#if metadata.camera}
							<div>
								<span class="font-bold">{$_('ui.metadata.camera')} ›</span>
								<span>{metadata.camera}</span>
							</div>
						{/if}
						{#if metadata.lens}
							<div>
								<span class="font-bold">{$_('ui.metadata.lens')} ›</span>
								<span>{metadata.lens}</span>
							</div>
						{/if}
						{#if metadata.focalLength}
							<div>
								<span class="font-bold">{$_('ui.metadata.focal_length')} ›</span>
								<span>{metadata.focalLength}</span>
							</div>
						{/if}
						{#if metadata.aperture}
							<div>
								<span class="font-bold">{$_('ui.metadata.aperture')} ›</span>
								<span>{metadata.aperture}</span>
							</div>
						{/if}
						{#if metadata.shutterSpeed}
							<div>
								<span class="font-bold">{$_('ui.metadata.shutter_speed')} ›</span>
								<span>{metadata.shutterSpeed}</span>
							</div>
						{/if}
						{#if metadata.iso}
							<div>
								<span class="font-bold">{$_('ui.metadata.iso')} ›</span>
								<span>{metadata.iso}</span>
							</div>
						{/if}
					</div>
				{/if}

				{#if hasContextInfo}
					<div class="text-xs">
						<h3 class="text-sm font-bold">{$_('ui.metadata.location_date')}</h3>
						{#if metadata.dateTime}
							<div>
								<span class="font-bold">{$_('ui.metadata.date')} ›</span>
								<span>{new Date(metadata.dateTime).toLocaleString()}</span>
							</div>
						{/if}
						{#if metadata.location}
							<div>
								<span class="font-bold">{$_('ui.metadata.location')} ›</span>
								<span>{metadata.location}</span>
							</div>
						{/if}
						{#if metadata.city || metadata.state || metadata.country}
							<div>
								<span class="font-bold">{$_('ui.metadata.address')} ›</span>
								<span
									>{[metadata.city, metadata.state, metadata.country]
										.filter(Boolean)
										.join(', ')}</span
								>
							</div>
						{/if}
						{#if metadata.gps}
							<div>
								<span class="font-bold">{$_('ui.metadata.coordinates')} ›</span>
								<span>
									<a
										href="https://www.openstreetmap.org/?mlat={metadata.gps.latitude}&mlon={metadata
											.gps.longitude}&zoom=15"
										target="_blank"
										rel="noopener noreferrer"
										class="underline hover:no-underline"
									>
										{metadata.gps.latitude.toFixed(6)}, {metadata.gps.longitude.toFixed(6)}
									</a>
								</span>
							</div>
						{/if}
					</div>
				{/if}

				{#if hasKeywords}
					<div class="text-xs">
						<h3 class="mb-1 text-sm font-bold">{$_('ui.metadata.keywords')}</h3>
						<!-- Plain text, not badges: these describe the image, unlike the
						     project tags they used to look identical to, which filter -->
						<p>{metadata.keywords.join(', ')}</p>
					</div>
				{/if}
			</aside>
		{/if}

		<!-- Image area: the image fills what is left, keeping a thin margin so the
		     controls never sit on top of it -->
		<div class="relative flex flex-1 items-center justify-center p-4">
			{#if hasSeveral}
				<button
					type="button"
					onclick={() => goTo(index - 1)}
					class="absolute inset-y-0 left-0 z-20 w-1/4 cursor-pointer"
					aria-label={$_('ui.previous_image')}
				></button>
				<button
					type="button"
					onclick={() => goTo(index + 1)}
					class="absolute inset-y-0 right-0 z-20 w-1/4 cursor-pointer"
					aria-label={$_('ui.next_image')}
				></button>
			{/if}

			<img
				src={image.path}
				alt={metadata?.description || image.name}
				class="max-h-full max-w-full object-contain shadow-2xl"
				fetchpriority="high"
			/>

			<AkBtnMetadata
				class="absolute top-4 right-16 z-30 {controlsClass}"
				ariaLabel={$_('ui.image_details')}
				onclick={() => (showInfo = !showInfo)}
			/>

			<AkBtnClose class="absolute top-4 right-4 z-30 {controlsClass}" onclick={close} />

			{#if hasSeveral}
				<button
					type="button"
					onclick={() => goTo(index - 1)}
					class="border-primary group bg-box text-primary absolute top-1/2 left-4 z-30 -translate-y-1/2 cursor-pointer rounded-full border p-3 {controlsClass}"
					aria-label={$_('ui.previous_image')}
				>
					<IconChevronLeft class="pointer-events-none size-6 group-hover:scale-120" />
				</button>

				<button
					type="button"
					onclick={() => goTo(index + 1)}
					class="border-primary group bg-box text-primary absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer rounded-full border p-3 {controlsClass}"
					aria-label={$_('ui.next_image')}
				>
					<IconChevronRight class="pointer-events-none size-6 group-hover:scale-120" />
				</button>

				<div
					class="bg-box text-primary border-primary absolute bottom-12 left-1/2 z-30 -translate-x-1/2 rounded-full border px-3 py-1 text-sm {controlsClass}"
				>
					{index + 1} / {images.length}
				</div>
			{/if}
		</div>
	</div>
{/if}
