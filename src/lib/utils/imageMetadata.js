import exifr from 'exifr';

/**
 * Extract EXIF and IPTC metadata from an image
 * @param {string} imageUrl - URL of the image
 * @returns {Promise<Object>} Object containing extracted metadata
 */
export async function extractImageMetadata(imageUrl) {
	try {
		const metadata = await exifr.parse(imageUrl, {
			exif: true,
			iptc: true,
			xmp: true,
			icc: false,
			jfif: false,
			ihdr: false,
			tiff: true,
			gps: true
		});

		if (!metadata) {
			return null;
		}

		// Extract relevant IPTC/EXIF fields for credits and licensing
		const result = {
			// Credit information
			credit: metadata.Credit || null,
			source: metadata.Source || null,

			// Description and keywords
			description: metadata.ImageDescription || metadata.Description || metadata.Caption || null,
			headline: metadata.Headline || null,
			keywords: parseKeywords(metadata.Keywords || metadata.Subject),

			// Technical metadata
			camera: metadata.Make && metadata.Model ? `${metadata.Make} ${metadata.Model}` : null,
			lens: metadata.LensModel || null,
			focalLength: metadata.FocalLength ? `${metadata.FocalLength}mm` : null,
			aperture: metadata.FNumber ? `f/${metadata.FNumber}` : null,
			shutterSpeed: metadata.ExposureTime ? formatShutterSpeed(metadata.ExposureTime) : null,
			iso: metadata.ISO || null,

			// Date and location
			dateTime: metadata.DateTime || metadata.DateTimeOriginal || null,
			gps:
				metadata.latitude && metadata.longitude
					? {
							latitude: metadata.latitude,
							longitude: metadata.longitude
						}
					: null,

			// City and location from IPTC
			city: metadata.City || null,
			state: metadata['Province-State'] || metadata.State || null,
			country: metadata['Country-Primary Location Name'] || metadata.Country || null,
			location: metadata['Sub-location'] || metadata.Location || null,

			// Raw metadata for advanced display
			raw: metadata
		};

		return result;
	} catch (error) {
		console.warn('Failed to extract metadata from image:', imageUrl, error);
		return null;
	}
}

/**
 * Format shutter speed for display
 * @param {number} exposureTime - Exposure time in seconds
 * @returns {string} Formatted shutter speed
 */
function formatShutterSpeed(exposureTime) {
	if (exposureTime >= 1) {
		return `${exposureTime}s`;
	} else {
		const fraction = Math.round(1 / exposureTime);
		return `1/${fraction}s`;
	}
}

/**
 * Parse keywords from various formats
 * @param {string|array} keywords - Keywords in various formats
 * @returns {array|null} Array of keyword strings
 */
function parseKeywords(keywords) {
	if (!keywords) return null;

	// If it's already an array, return it
	if (Array.isArray(keywords)) {
		return keywords;
	}

	// If it's a string, split by comma or semicolon
	if (typeof keywords === 'string') {
		return keywords
			.split(/[,;]/)
			.map((keyword) => keyword.trim())
			.filter((keyword) => keyword.length > 0);
	}

	return null;
}

/**
 * Generate a credit line from metadata
 * @param {Object} metadata - Extracted metadata
 * @returns {string|null} Formatted credit line
 */
export function formatCreditLine(metadata) {
	if (!metadata) return null;

	const parts = [];

	if (metadata.byline) {
		parts.push(metadata.byline);
	} else if (metadata.credit) {
		parts.push(metadata.credit);
	}

	if (metadata.source) {
		parts.push(metadata.source);
	}

	return parts.length > 0 ? parts.join(' / ') : null;
}
