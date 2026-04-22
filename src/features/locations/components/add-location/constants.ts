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

export type DefaultFacility = { name: string; description: string };

export const DEFAULT_FACILITIES: DefaultFacility[] = [
  {
    name: "Weight Training",
    description: "Full range of free weights and strength machines",
  },
  {
    name: "Cardio Area",
    description: "Treadmills, bikes, ellipticals and rowing machines",
  },
  {
    name: "CrossFit",
    description: "Functional fitness equipment and dedicated CrossFit space",
  },
  {
    name: "Yoga Studio",
    description: "Quiet studio space for yoga and stretching classes",
  },
  {
    name: "Group Classes",
    description: "Scheduled group fitness sessions with instructors",
  },
  { name: "Boxing Area", description: "Heavy bags, speed bags and ring space" },
  {
    name: "Swimming Pool",
    description: "Indoor lap pool for swimming and aqua fitness",
  },
  { name: "Sauna", description: "Steam room and dry sauna for recovery" },
  {
    name: "Locker Rooms",
    description: "Secure lockers with showers and changing areas",
  },
  { name: "Parking", description: "Dedicated on-site parking for members" },
  {
    name: "Juice Bar",
    description: "Fresh juices, smoothies and post-workout snacks",
  },
];

export const COUNTRIES = [
  "Nigeria",
  // "Ghana",
  // "Kenya",
  // "South Africa",
  // "United Kingdom",
  // "United States",
  // "Canada",
  // "Australia",
] as const;

export const NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT (Abuja)",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;
