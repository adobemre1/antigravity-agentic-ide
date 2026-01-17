import { GOOGLE_MAPS_API_KEY } from '@/config';

/**
 * Returns a URL for a static Google Map image for the given address.
 * The caller can use this URL directly in an <img> tag.
 */
export function getStaticMap(address: string): string {
  const encoded = encodeURIComponent(address);
  return `https://maps.googleapis.com/maps/api/staticmap?center=${encoded}&zoom=14&size=600x300&key=${GOOGLE_MAPS_API_KEY}`;
}
