import * as yup from "yup";

// Step 1: Signup schema
export const signupSchema = yup.object({
  gymName: yup.string().required("Gym name is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

// OTP schema
export const otpSchema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d+$/, "OTP must contain only digits"),
});

// Step 2: Branding schema
export const brandingSchema = yup.object({
  primaryColor: yup.string().required("Primary color is required"),
  secondaryColor: yup.string().optional(),
  logo: yup
    .mixed<File>()
    .required("Logo is required")
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value) return false;
      return value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "File must be an image", (value) => {
      if (!value) return false;
      return [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "image/webp",
      ].includes(value.type);
    }),
});

// Step 3: Documents schema
export const documentsSchema = yup.object({
  taxIdDocument: yup
    .mixed<File>()
    .required("Tax ID document is required")
    .test("fileSize", "File size must be less than 10MB", (value) => {
      if (!value) return false;
      return value.size <= 10 * 1024 * 1024;
    })
    .test("fileType", "File must be PNG, JPG, or PDF", (value) => {
      if (!value) return false;
      return [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ].includes(value.type);
    }),
  governmentId: yup
    .mixed<File>()
    .required("Government ID is required")
    .test("fileSize", "File size must be less than 10MB", (value) => {
      if (!value) return false;
      return value.size <= 10 * 1024 * 1024;
    })
    .test("fileType", "File must be PNG, JPG, or PDF", (value) => {
      if (!value) return false;
      return [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ].includes(value.type);
    }),
  addressProof: yup
    .mixed<File>()
    .required("Address proof is required")
    .test("fileSize", "File size must be less than 10MB", (value) => {
      if (!value) return false;
      return value.size <= 10 * 1024 * 1024;
    })
    .test("fileType", "File must be PNG, JPG, or PDF", (value) => {
      if (!value) return false;
      return [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ].includes(value.type);
    }),
  addressProofDate: yup.string().required("Address proof date is required"),
  additionalDocuments: yup.array().of(
    yup
      .mixed<File>()
      .required("Additional documents are required")
      .test("fileSize", "File size must be less than 10MB", (value) => {
        if (!value) return true;
        return value.size <= 10 * 1024 * 1024;
      })
      .test("fileType", "File must be PNG, JPG, or PDF", (value) => {
        if (!value) return true;
        return [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "application/pdf",
        ].includes(value.type);
      })
  ),
});

export const locationSchema = yup.object({
  locationName: yup.string().required("Location name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State/Region is required"),
  zipCode: yup.string().required("Zip code is required"),
  country: yup.string().required("Country is required"),
  phone: yup.string().required("Phone is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  isHeadquarters: yup.boolean().required("Headquarters status is required"),
});

export const locationsSchema = yup.object({
  locations: yup
    .array()
    .of(locationSchema)
    .min(1, "At least one location is required")
    .required("Locations are required"),
});

// Type exports
export type SignupFormValues = yup.InferType<typeof signupSchema>;
export type OtpFormValues = yup.InferType<typeof otpSchema>;
export type BrandingFormValues = yup.InferType<typeof brandingSchema>;
export type DocumentsFormValues = yup.InferType<typeof documentsSchema>;
export type LocationsFormValues = yup.InferType<typeof locationsSchema>;
