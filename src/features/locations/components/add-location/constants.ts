export const LOCATION_MEDIA_UPLOAD_FOLDER = "gym-locations";

export const STEPS = [
  "Basic Information",
  "Facilities",
  "Gallery",
  "Payment",
] as const;

/** MIME types allowed for location gallery (JPG, PNG, GIF, WebP). */
export const GALLERY_ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

/** HTML `accept` for the gallery file input. */
export const GALLERY_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp";

export function isAllowedGalleryImageFile(file: File): boolean {
  if (GALLERY_ALLOWED_IMAGE_TYPES.has(file.type)) return true;
  return /\.(jpe?g|png|gif|webp)$/i.test(file.name);
}

export const DEFAULT_FACILITIES = [
  "Weight Training",
  "Cardio Area",
  "CrossFit",
  "Yoga Studio",
  "Group Classes",
  "Boxing Area",
  "Swimming Pool",
  "Sauna",
  "Locker Rooms",
  "Parking",
  "Juice Bar",
] as const;
