/**
 * The year and month a project is dated, as `2025-06`.
 *
 * `toISOString()` throws on an unparseable date, but every project reaching a
 * view has been through `parseProjectFrontmatter()`, which rejects one whose
 * date `new Date()` cannot read — so there is nothing to guard against here.
 */
export function formatProjectDate(date) {
	if (!date) return '';
	return new Date(date).toISOString().slice(0, 7);
}
