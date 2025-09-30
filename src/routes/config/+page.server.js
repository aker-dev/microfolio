import { dev } from '$app/environment';
import { error, fail } from '@sveltejs/kit';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const CONFIG_PATH = join(process.cwd(), 'src/lib/config.js');

export async function load() {
	if (!dev) {
		throw error(404, 'Not found');
	}

	// Read and parse config.js
	const content = await readFile(CONFIG_PATH, 'utf-8');

	// Extract config object (simple regex parsing)
	const siteConfigMatch = content.match(/export const siteConfig = ({[\s\S]*?});/);
	if (!siteConfigMatch) {
		throw error(500, 'Could not parse config.js');
	}

	// Use eval to parse the object (safe in dev environment)
	const siteConfig = eval(`(${siteConfigMatch[1]})`);

	return {
		config: siteConfig
	};
}

export const actions = {
	save: async ({ request }) => {
		if (!dev) {
			return fail(403, { message: 'Not allowed in production' });
		}

		const data = await request.formData();
		const configJson = data.get('config');

		try {
			const config = JSON.parse(configJson);

			// Generate new config.js content
			const newContent = `export const siteConfig = ${JSON.stringify(config, null, '\t')
				.replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys
				.replace(/: "([^"]+)"/g, ": '$1'") // Use single quotes for strings
			};
`;

			await writeFile(CONFIG_PATH, newContent, 'utf-8');

			return { success: true };
		} catch (err) {
			return fail(400, { message: err.message });
		}
	}
};
