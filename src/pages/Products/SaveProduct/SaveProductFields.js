import {
  productNameConstraints,
  productTypeConstraints,
  productManufacturerConstraints,
  productQuantityConstraints,
  productPriceConstraints,
  productDiscountPriceConstraints,
  fileValidation,
} from "../../../components/forms/fieldsConstraints/FieldsConstraints";
import { boolean } from "yup";
import { object } from "yup";

export const validationSchema = object().shape({
  name: productNameConstraints,
  type: productTypeConstraints,
  manufacturer: productManufacturerConstraints,
  quantity: productQuantityConstraints,
  price: productPriceConstraints,
  isOnDiscount: boolean(),
  discountPrice: productDiscountPriceConstraints,
  firstImage: fileValidation,
  secondImage: fileValidation,
  thirdImage: fileValidation,
});

export const initialFormValues = {
  name: "",
  type: "",
  manufacturer: "",
  quantity: "",
  price: "",
  description: "",
  isOnDiscount: false,
  discountPrice: "",
  firstImage: "",
  secondImage: "",
  thirdImage: "",
};
