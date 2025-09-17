import ExifReader from 'exifreader';
import { readFile } from 'fs/promises';

/**
 * Format EXIF date string to ISO date string
 * @param {string} exifDate - EXIF date string (format: "YYYY:MM:DD HH:MM:SS")
 * @returns {string|null} ISO date string or null
 */
function formatExifDate(exifDate) {
	if (!exifDate || typeof exifDate !== 'string') return null;
	
	try {
		// EXIF dates are in format "YYYY:MM:DD HH:MM:SS"
		// Convert to ISO format "YYYY-MM-DD HH:MM:SS"
		const isoDateString = exifDate.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
		const date = new Date(isoDateString);
		
		// Check if the date is valid
		if (isNaN(date.getTime())) {
			console.warn('Invalid EXIF date format:', exifDate);
			return null;
		}
		
		return date.toISOString();
	} catch (error) {
		console.warn('Error parsing EXIF date:', exifDate, error);
		return null;
	}
}

/**
 * Extract EXIF and IPTC metadata from an image
 * @param {string} imagePath - Local file path of the image
 * @returns {Promise<Object>} Object containing extracted metadata
 */
export async function extractImageMetadata(imagePath) {
	try {
		// Read image file directly from filesystem
		const buffer = await readFile(imagePath);
		const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

		// Parse metadata with ExifReader
		const metadata = ExifReader.load(arrayBuffer, {
			expanded: true
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
			// Handle arrays (like keywords)
			if (Array.isArray(current)) {
				return current.map(item => {
					if (item && typeof item === 'object' && item.description !== undefined) {
						return item.description;
					}
					return item;
				});
			}
			return current;
		};

		// GPS coordinates helper
		const getGpsCoordinates = () => {
			// In ExifReader expanded mode, GPS data is in metadata.exif with GPS prefix
			const exifData = metadata.exif || {};
			
			const gpsLat = exifData.GPSLatitude;
			const gpsLatRef = exifData.GPSLatitudeRef;
			const gpsLon = exifData.GPSLongitude;
			const gpsLonRef = exifData.GPSLongitudeRef;

			if (gpsLat && gpsLon && gpsLatRef && gpsLonRef) {
				try {
					// ExifReader in expanded mode provides the decimal degrees directly
					let latDD = gpsLat.description || gpsLat;
					let lonDD = gpsLon.description || gpsLon;
					
					// Convert to numbers if they're strings
					if (typeof latDD === 'string') latDD = parseFloat(latDD);
					if (typeof lonDD === 'string') lonDD = parseFloat(lonDD);
					
					// Get reference direction
					const latRef = gpsLatRef.description || gpsLatRef;
					const lonRef = gpsLonRef.description || gpsLonRef;
					
					// Apply direction (negative for South/West)
					if (latRef === 'S') latDD = -latDD;
					if (lonRef === 'W') lonDD = -lonDD;

					if (!isNaN(latDD) && !isNaN(lonDD)) {
						return { latitude: latDD, longitude: lonDD };
					}
				} catch (error) {
					console.warn('Error processing GPS coordinates:', error);
				}
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
			dateTime: formatExifDate(
				getTagValue('exif.DateTime') ||
				getTagValue('exif.DateTimeOriginal') ||
				getTagValue('exif.DateTimeDigitized')
			),
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
		console.warn('Failed to extract metadata from image:', imagePath, error);
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
 * @param {string|array|object} keywords - Keywords in various formats
 * @returns {array|null} Array of keyword strings
 */
function parseKeywords(keywords) {
	if (!keywords) return null;

	// If it's already an array, process each item
	if (Array.isArray(keywords)) {
		return keywords
			.map(item => {
				if (typeof item === 'string') {
					return item;
				} else if (item && typeof item === 'object' && item.description) {
					return item.description;
				} else if (typeof item === 'object') {
					return String(item);
				}
				return item;
			})
			.filter(keyword => keyword && keyword.length > 0);
	}

	// If it's a string, split by comma or semicolon
	if (typeof keywords === 'string') {
		return keywords
			.split(/[,;]/)
			.map((keyword) => keyword.trim())
			.filter((keyword) => keyword.length > 0);
	}

	// If it's an object with description property
	if (keywords && typeof keywords === 'object' && keywords.description) {
		const keywordStr = keywords.description;
		if (typeof keywordStr === 'string') {
			return keywordStr
				.split(/[,;]/)
				.map((keyword) => keyword.trim())
				.filter((keyword) => keyword.length > 0);
		}
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
