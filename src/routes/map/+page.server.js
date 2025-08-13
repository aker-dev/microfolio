import { loadProjects } from '$lib/projects.js';

export async function load() {
	const projects = await loadProjects();
	
	return {
		projects
	};
}