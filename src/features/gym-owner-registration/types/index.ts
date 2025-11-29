export type StepOnePayload = {
  gymName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type StepOneResponse = {
  sessionId: string;
  message: string;
  emailSent: boolean;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type VerifyEmailResponse = {
  message: string;
  sessionId: string;
  verified: boolean;
};

export type ResendVerificationPayload = {
  email: string;
};

export type SessionStatusResponse = {
  sessionId: string;
  currentStep: number;
  emailVerified: boolean;
  completedSteps: number[];
};

export type BrandingPayload = {
  sessionId: string;
  primaryColor: string;
  secondaryColor?: string;
  logo: File;
};

export type DocumentsPayload = {
  sessionId: string;
  taxIdDocument: File;
  governmentId: File;
  addressProof: File;
  addressProofDate: string;
  additionalDocuments?: File[];
};

export type LocationPayload = {
  locationName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
};

export type LocationsPayload = {
  sessionId: string;
  hasMultipleLocations: boolean;
  locations: LocationPayload[];
};

export type PaymentAccountDetails = {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  accountType: "checking" | "savings";
};

export type PaymentAccountPayload = {
  locationIdentifier: string;
  paymentAccount: PaymentAccountDetails;
};

export type PaymentAccountsPayload = {
  sessionId: string;
  paymentAccounts: PaymentAccountPayload[];
};

export type CompleteRegistrationPayload = {
  sessionId: string;
};

export type GenericMessageResponse = {
  message: string;
};

export type ApplicationStatusResponse = {
  sessionId: string;
  status: string;
  subscriptionTrialEndsOn?: string;
};
