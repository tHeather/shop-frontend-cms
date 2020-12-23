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
  .max(10000, "Maximum quantity is 10000.")
  .required("This field is required.");

export const productPriceConstraints = number()
  .max(1000000, "Maximum price is 1000000.")
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
];

export const fileValidation = mixed()
  .test("fileSize", "Maximum size of file is 10 mb.", (value) =>
    value ? value.size <= FILE_SIZE : true
  )
  .test(
    "fileFormat",
    "The accepted file formats are jpg, jpeg, bmp, gif, png.",
    (value) => (value ? SUPPORTED_FORMATS.includes(value.type) : true)
  );
