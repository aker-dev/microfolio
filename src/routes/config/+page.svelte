<script>
	import { enhance } from '$app/forms';

	export let data;

	let config = structuredClone(data.config);
	let saving = false;
	let saveMessage = '';

	function handleSave() {
		saving = true;
		saveMessage = '';
	}

	function addNavItem() {
		config.navigation = [...config.navigation, { name: '', href: '' }];
	}

	function removeNavItem(index) {
		config.navigation = config.navigation.filter((_, i) => i !== index);
	}
</script>

<svelte:head>
	<title>Config Editor - Development Only</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<h1 class="text-3xl font-bold mb-2">Configuration Editor</h1>
	<p class="text-gray-600 mb-8">Development mode only</p>

	<form
		method="POST"
		action="?/save"
		use:enhance={() => {
			handleSave();
			return async ({ result }) => {
				saving = false;
				if (result.type === 'success') {
					saveMessage = '✓ Configuration saved successfully';
					setTimeout(() => (saveMessage = ''), 3000);
				} else {
					saveMessage = `✗ Error: ${result.data?.message || 'Unknown error'}`;
				}
			};
		}}
	>
		<input type="hidden" name="config" value={JSON.stringify(config)} />

		<!-- Site Metadata -->
		<section class="mb-8 p-6 border rounded-lg">
			<h2 class="text-xl font-semibold mb-4">Site Metadata</h2>

			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium mb-1">Title</label>
					<input
						type="text"
						bind:value={config.title}
						class="w-full px-3 py-2 border rounded"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium mb-1">Description</label>
					<input
						type="text"
						bind:value={config.description}
						class="w-full px-3 py-2 border rounded"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium mb-1">Author</label>
						<input
							type="text"
							bind:value={config.author}
							class="w-full px-3 py-2 border rounded"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium mb-1">Version</label>
						<input
							type="text"
							bind:value={config.version}
							class="w-full px-3 py-2 border rounded"
						/>
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium mb-1">Locale</label>
					<select bind:value={config.locale} class="w-full px-3 py-2 border rounded">
						<option value="en">English</option>
						<option value="fr">Français</option>
						<option value="es">Español</option>
						<option value="it">Italiano</option>
						<option value="de">Deutsch</option>
						<option value="ja">日本語</option>
						<option value="ar">العربية</option>
					</select>
				</div>
			</div>
		</section>

		<!-- Social Links -->
		<section class="mb-8 p-6 border rounded-lg">
			<h2 class="text-xl font-semibold mb-4">Social Links</h2>

			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium mb-1">GitHub</label>
					<input
						type="url"
						bind:value={config.socialLinks.github}
						class="w-full px-3 py-2 border rounded"
						placeholder="https://github.com/username"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium mb-1">LinkedIn</label>
					<input
						type="url"
						bind:value={config.socialLinks.linkedin}
						class="w-full px-3 py-2 border rounded"
						placeholder="https://linkedin.com/in/username"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium mb-1">Instagram</label>
					<input
						type="url"
						bind:value={config.socialLinks.instagram}
						class="w-full px-3 py-2 border rounded"
						placeholder="https://instagram.com/username"
					/>
				</div>
			</div>
		</section>

		<!-- Navigation -->
		<section class="mb-8 p-6 border rounded-lg">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-semibold">Navigation</h2>
				<button
					type="button"
					on:click={addNavItem}
					class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
				>
					+ Add Item
				</button>
			</div>

			<div class="space-y-3">
				{#each config.navigation as nav, i}
					<div class="flex gap-2">
						<input
							type="text"
							bind:value={nav.name}
							placeholder="nav.key"
							class="flex-1 px-3 py-2 border rounded"
						/>
						<input
							type="text"
							bind:value={nav.href}
							placeholder="/path"
							class="flex-1 px-3 py-2 border rounded"
						/>
						<button
							type="button"
							on:click={() => removeNavItem(i)}
							class="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
						>
							×
						</button>
					</div>
				{/each}
			</div>
		</section>

		<!-- Actions -->
		<div class="flex gap-4 items-center">
			<button
				type="submit"
				disabled={saving}
				class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
			>
				{saving ? 'Saving...' : 'Save Configuration'}
			</button>

			{#if saveMessage}
				<span class={saveMessage.startsWith('✓') ? 'text-green-600' : 'text-red-600'}>
					{saveMessage}
				</span>
			{/if}
		</div>
	</form>
</div>

<style>
	:global(body) {
		font-family: system-ui, -apple-system, sans-serif;
	}
</style>
