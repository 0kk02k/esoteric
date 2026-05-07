export interface GeocodingResult {
  lat: number;
  lon: number;
  displayName: string;
}

/**
 * Simple geocoding using Nominatim (OpenStreetMap).
 * Note: For production use, respect their usage policy (User-Agent, rate limits).
 */
export async function geocodeCity(city: string): Promise<GeocodingResult | null> {
  if (!city) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      city
    )}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "ESO-Cyber-Mystik-Platform/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
