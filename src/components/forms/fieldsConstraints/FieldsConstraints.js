import { string, ref, number, mixed } from "yup";

export const passwordConstraints = string()
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z\d\W]{8,}$/,
    "Password must contain at least: 8 characters, uppercase and lowercase letter, special character and digit."
  )
  .max(30, "Maximum length of password is 30 characters.")
  .required("This field is required.");

export const passwordConfirmationConstraints = string().when("password", {
  is: (val) => (val && val.length > 0 ? true : false),
  then: string()
    .oneOf([ref("password")], "Password does not match.")
    .required("This field is required."),
});

export const productNameConstraints = string()
  .trim()
  .max(75, "Maximum length of name is 75 characters.")
  .required("This field is required.");

export const productTypeConstraints = string()
  .trim()
  .max(40, "Maximum length of type is 40 characters.")
  .required("This field is required.");

export const productManufacturerConstraints = string()
  .trim()
  .max(50, "Maximum length of manufacturer is 50 characters.")
  .required("This field is required.");

export const productQuantityConstraints = number()
  .min(1, "Minimum quantity is 1")
  .max(10000, "Maximum quantity is 10000.")
  .required("This field is required.");

export const productPriceConstraints = number()
  .min(1, "Minimum price is 1")
  .max(1000000, "Maximum price is 1000000.")
  .required("This field is required.");

export const productDescriptionConstraints = string()
  .trim()
  .max(2000, "Maximum length of description is 2000 characters.")
  .required("This field is required.");

export const productDiscountPriceConstraints = number().when("isOnDiscount", {
  is: true,
  then: productPriceConstraints,
});

const FILE_SIZE = 10000000;
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/bmp",
  "image/gif",
  "image/png",
  "image/svg",
];

export const fileValidation = mixed()
  .test("fileSize", "Maximum size of file is 10 mb.", (value) =>
    value ? value.size <= FILE_SIZE : true
  )
  .test(
    "fileFormat",
    "The accepted file formats are jpg, jpeg, bmp, gif, png, svg.",
    (value) => (value ? SUPPORTED_FORMATS.includes(value.type) : true)
  );

const TEXT_SUPPORTED_FORMATS = [
  "application/pdf",
  "application/doc",
  "application/docx",
];

export const textFileValidation = mixed()
  .test("fileSize", "Maximum size of file is 10 mb.", (value) =>
    value ? value.size <= FILE_SIZE : true
  )
  .test(
    "fileFormat",
    "The accepted file formats are pdf, doc , docx",
    (value) => (value ? TEXT_SUPPORTED_FORMATS.includes(value.type) : true)
  );

export const timeRangeValidation = string()
  .matches(
    /^((?:[01]\d:[0-5][0-9]|2[0-3]:[0-5][0-9])(?:\s?)-(?:\s?)(?:[01]\d:[0-5][0-9]|2[0-3]:[0-5][0-9])(?:\s?,\s?)?)+$/,
    "Correct format is hh:mm-hh:mm"
  )
  .max(11, "Maximum length is 11 characters.");

export const phoneNumberValidation = string()
  .matches(
    /\(?([0-9]{3})\)?([ ,-]?)([0-9]{3})\2([0-9]{3})/,
    "Correct format is 123-456-789 or 123 456 789"
  )
  .max(11, "Maximum length is 11 characters.");

export const emailValidation = string()
  .trim()
  .email("Incorrect email address.")
  .max(50, "The maximum length is 50 characters.");

export const footerTextValidation = string()
  .trim()
  .max(250, "The maximum length is 250 characters.");
