/** GET/PATCH `/api/gym-owner/gym-profile` — gym-level profile (cover images are per location). */
export type GymOwnerProfile = {
  gymName: string | null;
  businessRegistrationNumber: string | null;
  description: string | null;
  gymEmail: string | null;
  gymPhone: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  twitterX: string | null;
  logoUrl: string | null;
};

export type GymOwnerProfilePatchPayload = Partial<{
  gymName: string;
  businessRegistrationNumber: string;
  description: string;
  gymEmail: string;
  gymPhone: string;
  website: string;
  instagram: string;
  facebook: string;
  twitterX: string;
  logoUrl: string;
}>;

export type GymLocation = {
  id: string;
  locationName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  images: string[];
  coverImage?: string | null;
  isHeadquarters: boolean;
  isActive: boolean;
  paymentAccount: {
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    accountType: string;
  };
  createdAt: string;
  updatedAt: string;
  metrics: {
    totalMembers: number;
    activeMembers: number;
    totalTrainers: number;
    activeTrainers: number;
    monthlyRevenue: number;
    todaysCheckIns: number;
  };
};

export type LocationDetailsResponse = {
  location: {
    id: string;
    locationName: string;
    email: string;
    phone: string;
    address: {
      city: string;
      state: string;
      street: string;
      country: string;
      zipCode: string;
    };
    images: string[];
    coverImage?: string | null;
    isHeadquarters: boolean;
    isActive: boolean;
    paymentAccount: {
      accountName: string;
      accountNumber: string;
      routingNumber: string;
      bankName: string;
      accountType: string;
    };
    createdAt: string;
    updatedAt: string;
    fullAddress: string;
  };
  metrics: {
    totalMembers: number;
    activeMembers: number;
    totalTrainers: number;
    activeTrainers: number;
    totalClasses: number;
    activeClasses: number;
    monthlyRevenue: number;
    todaysCheckIns: number;
    averageAttendance: number;
    subscriptionPlan: string;
  };
};

export type PaymentAccount = {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  accountType: "checking" | "savings";
};

/** Matches `GymLocation.address` / backend create DTO (nested address, not flat fields). */
export type LocationAddressPayload = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

/** URLs returned from `useUpload` — sent as JSON on create location (no raw files). */
export type CreateLocationMediaPayload = {
  coverImageUrl?: string;
  galleryImageUrls?: string[];
  galleryVideoUrls?: string[];
};

/**
 * Single JSON body for `POST /api/gym-owner/locations` (axios serializes the object; do not stringify).
 */
export type CreateLocationPayload = {
  locationName: string;
  address: LocationAddressPayload;
  phone: string;
  email: string;
  isHeadquarters: boolean;
  paymentAccount: PaymentAccount;
  facilities: string[];
  /** Present when the user added cover / gallery / video; values are CDN URLs from `/api/upload/*`. */
  media?: CreateLocationMediaPayload;
};

export type Facility = {
  id: string;
  locationId: string;
  name: string;
  description?: string;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateFacilityPayload = {
  name: string;
  description?: string;
  image?: File;
};

export type UpdateFacilityPayload = {
  name?: string;
  description?: string;
  image?: File;
};

/** `dayOfWeek` 0–6 (Sun–Sat, same as `Date.getDay()`). GET may return `[]` if unset. */
export type LocationOperatingHoursDay = {
  dayOfWeek: number;
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
};

export type PutLocationOperatingHoursPayload = {
  operatingHours: LocationOperatingHoursDay[];
};
