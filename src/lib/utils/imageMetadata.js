import ExifReader from 'exifreader';
import { readFile } from 'fs/promises';

/**
 * Extract EXIF and IPTC metadata from an image
 * @param {string} imageUrl - URL or file path of the image
 * @returns {Promise<Object>} Object containing extracted metadata
 */
export async function extractImageMetadata(imageUrl) {
	try {
		let arrayBuffer;

		// Check if this is a local file path (for server-side rendering)
		if (imageUrl.startsWith('/') || imageUrl.includes(':\\')) {
			// Local file path - read directly from filesystem
			const buffer = await readFile(imageUrl);
			arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
		} else {
			// URL - fetch via HTTP
			const response = await fetch(imageUrl);
			if (!response.ok) {
				throw new Error(`Failed to fetch image: ${response.status}`);
			}
			arrayBuffer = await response.arrayBuffer();
		}

		// Parse metadata with ExifReader
		const metadata = ExifReader.load(arrayBuffer, {
			expanded: true,
			includeUnknown: false
		});

		if (!metadata) {
			return null;
		}

		// Helper function to safely get tag value with UTF-8 encoding
		const getTagValue = (tagPath) => {
			const keys = tagPath.split('.');
			let current = metadata;
			for (const key of keys) {
				if (!current || !current[key]) return null;
				current = current[key];
			}
			if (current && typeof current === 'object' && current.description !== undefined) {
				// Ensure UTF-8 encoding for text values
				const value = current.description;
				if (typeof value === 'string') {
					try {
						// Try to decode as UTF-8 if it looks like encoded text
						return decodeURIComponent(escape(value));
					} catch {
						return value;
					}
				}
				return value;
			}
			return current;
		};

		// GPS coordinates helper
		const getGpsCoordinates = () => {
			const gpsLat = getTagValue('gps.GPSLatitude');
			const gpsLatRef = getTagValue('gps.GPSLatitudeRef');
			const gpsLon = getTagValue('gps.GPSLongitude');
			const gpsLonRef = getTagValue('gps.GPSLongitudeRef');

			if (gpsLat && gpsLon) {
				const lat = gpsLatRef === 'S' ? -gpsLat : gpsLat;
				const lon = gpsLonRef === 'W' ? -gpsLon : gpsLon;
				return { latitude: lat, longitude: lon };
			}
			return null;
		};

		// Extract relevant IPTC/EXIF fields for credits and licensing
		const result = {
			// Credit information
			credit: getTagValue('iptc.Credit') || getTagValue('exif.Artist') || null,
			source: getTagValue('iptc.Source') || null,

			// Description and keywords
			description:
				getTagValue('exif.ImageDescription') ||
				getTagValue('iptc.Caption-Abstract') ||
				getTagValue('iptc.Description') ||
				null,
			headline: getTagValue('iptc.Headline') || null,
			keywords: parseKeywords(getTagValue('iptc.Keywords') || getTagValue('iptc.Subject')),

			// Technical metadata
			camera:
				getTagValue('exif.Make') && getTagValue('exif.Model')
					? `${getTagValue('exif.Make')} ${getTagValue('exif.Model')}`
					: null,
			lens: getTagValue('exif.LensModel') || null,
			focalLength: getTagValue('exif.FocalLength') ? `${getTagValue('exif.FocalLength')}mm` : null,
			aperture: getTagValue('exif.FNumber') ? `f/${getTagValue('exif.FNumber')}` : null,
			shutterSpeed: getTagValue('exif.ExposureTime')
				? formatShutterSpeed(getTagValue('exif.ExposureTime'))
				: null,
			iso: getTagValue('exif.ISOSpeedRatings') || getTagValue('exif.ISO') || null,

			// Date and location
			dateTime:
				getTagValue('exif.DateTime') ||
				getTagValue('exif.DateTimeOriginal') ||
				getTagValue('exif.DateTimeDigitized') ||
				null,
			gps: getGpsCoordinates(),

			// City and location from IPTC
			city: getTagValue('iptc.City') || null,
			state: getTagValue('iptc.Province-State') || null,
			country: getTagValue('iptc.Country-PrimaryLocationName') || null,
			location: getTagValue('iptc.Sub-location') || null,

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

	if (metadata.credit) {
		parts.push(metadata.credit);
	}

	if (metadata.source) {
		parts.push(metadata.source);
	}

	return parts.length > 0 ? parts.join(' / ') : null;
}
