export type GalleryItem = {
  id: string;
  url: string;
};

export type FacilityItem = {
  name: string;
  description: string;
};

export type FormState = {
  locationName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  isHeadquarters: boolean;
  coverImage: File | null;
  paymentAccount: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string;
  };
};

export const initialForm: FormState = {
  locationName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "Nigeria",
  phone: "",
  email: "",
  isHeadquarters: false,
  coverImage: null,
  paymentAccount: {
    accountName: "",
    accountNumber: "",
    bankName: "",
    bankCode: "",
  },
};
