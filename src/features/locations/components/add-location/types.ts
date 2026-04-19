export type GalleryItem = {
  id: string;
  url: string;
  kind: "image" | "video";
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
    routingNumber: string;
    bankName: string;
    accountType: "checking" | "savings";
  };
};

export const initialForm: FormState = {
  locationName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "United States",
  phone: "",
  email: "",
  isHeadquarters: false,
  coverImage: null,
  paymentAccount: {
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    bankName: "",
    accountType: "checking",
  },
};
