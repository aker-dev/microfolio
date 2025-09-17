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
			focalLength: formatFocalLength(getTagValue('exif.FocalLength')),
			aperture: formatAperture(getTagValue('exif.FNumber')),
			shutterSpeed: formatShutterSpeed(getTagValue('exif.ExposureTime')),
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
 * Format focal length for display
 * @param {any} focalLength - Focal length value from EXIF
 * @returns {string|null} Formatted focal length
 */
function formatFocalLength(focalLength) {
	if (!focalLength) return null;
	
	// Extract numeric value from ExifReader object or string
	let value = focalLength;
	if (typeof focalLength === 'object' && focalLength.description) {
		value = focalLength.description;
	}
	
	// If it's a string, extract the number
	if (typeof value === 'string') {
		const match = value.match(/(\d+(?:\.\d+)?)/);
		if (match) {
			value = parseFloat(match[1]);
		} else {
			return value; // Return as-is if we can't parse it
		}
	}
	
	// If it's a number, format it
	if (typeof value === 'number' && !isNaN(value)) {
		return `${value}mm`;
	}
	
	return null;
}

/**
 * Format aperture for display
 * @param {any} fNumber - F-number value from EXIF
 * @returns {string|null} Formatted aperture
 */
function formatAperture(fNumber) {
	if (!fNumber) return null;
	
	// Extract numeric value from ExifReader object or string
	let value = fNumber;
	if (typeof fNumber === 'object' && fNumber.description) {
		value = fNumber.description;
	}
	
	// If it's a string, extract the number
	if (typeof value === 'string') {
		const match = value.match(/(\d+(?:\.\d+)?)/);
		if (match) {
			value = parseFloat(match[1]);
		}
	}
	
	// If it's a number, format it
	if (typeof value === 'number' && !isNaN(value)) {
		return `f/${value}`;
	}
	
	return null;
}

/**
 * Format shutter speed for display
 * @param {any} exposureTime - Exposure time value from EXIF
 * @returns {string|null} Formatted shutter speed
 */
function formatShutterSpeed(exposureTime) {
	if (!exposureTime) return null;
	
	// Extract value from ExifReader object if needed
	let value = exposureTime;
	if (typeof exposureTime === 'object' && exposureTime.description) {
		value = exposureTime.description;
	}
	
	// Handle string values
	if (typeof value === 'string') {
		// Check if it's already a proper fraction like "1/80"
		const fractionMatch = value.match(/^1\/(\d+)$/);
		if (fractionMatch) {
			return `${value}s`;
		}
		
		// Check if it's a general fraction like "3/10"
		const generalFractionMatch = value.match(/^(\d+)\/(\d+)$/);
		if (generalFractionMatch) {
			const numerator = parseInt(generalFractionMatch[1]);
			const denominator = parseInt(generalFractionMatch[2]);
			const decimalValue = numerator / denominator;
			
			if (decimalValue >= 1) {
				return `${decimalValue}s`;
			} else {
				return `${value}s`;
			}
		}
		
		// Try to parse as decimal number
		const numericValue = parseFloat(value);
		if (!isNaN(numericValue)) {
			value = numericValue;
		} else {
			return null;
		}
	}
	
	// Handle numeric values
	if (typeof value === 'number' && !isNaN(value)) {
		if (value >= 1) {
			return `${value}s`;
		} else {
			const fraction = Math.round(1 / value);
			return `1/${fraction}s`;
		}
	}
	
	return null;
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
