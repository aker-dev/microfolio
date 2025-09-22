import { loadProjects } from '$lib/utils/projects.js';

export async function load() {
	const projects = await loadProjects();

	return {
		projects
	};
}
