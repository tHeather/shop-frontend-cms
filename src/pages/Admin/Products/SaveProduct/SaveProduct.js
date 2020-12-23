import { Form, Formik } from "formik";
import { object } from "yup";
import React, { useEffect, useState } from "react";
import ErrorModal from "../../../../components/Errors/ErrorModal";
import {
  StandardField,
  TextArea,
} from "../../../../components/forms/fields/Fields";
import {
  productNameConstraints,
  productTypeConstraints,
  productManufacturerConstraints,
  productQuantityConstraints,
  productPriceConstraints,
  productDiscountPriceConstraints,
} from "../../../../components/forms/fieldsConstraints/FieldsConstraints";
import Loader from "../../../../components/loader/Loader";
import { boolean } from "yup";
import {
  JsonFetch,
  FormDataFetch,
} from "../../../../components/fetches/Fetches";
import { settings } from "../../../../settings";
import {
  HandleErrorMessage,
  HandleUnauthorizedOrForbiddenError,
} from "../../../../components/Errors/ErrorHandlers";
import Modal from "../../../../components/Messages/Modal";
import { useHistory } from "react-router-dom";
import { FileUploadField } from "../../../../components/forms/fields/Fields";
import { DisplayImage } from "../../../../components/Utils/ImageUtils/ImageUtils";
import { fileValidation } from "../../../../components/forms/fieldsConstraints/FieldsConstraints";
import { MakeFormData } from "../../../../components/Utils/formDataUtils/FormDataUtils";

const updateProduct = async (
  formValues,
  setIsLoading,
  setFormValues,
  setSavedImages,
  setErrorsList,
  setIsSaved,
  setisNotFund,
  productId,
  history
) => {
  try {
    setIsLoading(true);

    const { discountPrice, ...productData } = formValues;
    if (formValues.isOnDiscount) productData.discountPrice = discountPrice;

    const productWithEmptyPohots = {
      ...formValues,
      firstImage: "",
      secondImage: "",
      thirdImage: "",
    };

    const response = await FormDataFetch(
      `${settings.baseURL}/api/Product/${productId}`,
      "PUT",
      MakeFormData(productData)
    );

    switch (response.status) {
      case 200:
        const { firstImage, secondImage, thirdImage } = await response.json();
        setIsSaved(true);
        setFormValues(productWithEmptyPohots);
        setSavedImages({ firstImage, secondImage, thirdImage });
        setIsLoading(false);
        break;
      case 400:
        setFormValues(productWithEmptyPohots);
        HandleErrorMessage(response, setErrorsList, setIsLoading);
        break;
      case 401:
      case 403:
        HandleUnauthorizedOrForbiddenError(history);
        break;
      case 404:
        setisNotFund(true);
        setIsLoading(false);
        break;
      case 500:
        history.push("/500");
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

const saveProduct = async (
  formValues,
  setIsLoading,
  setFormValues,
  setIsSaved,
  setErrorsList,
  history
) => {
  try {
    setIsLoading(true);

    const { discountPrice, ...productData } = formValues;
    if (formValues.isOnDiscount) productData.discountPrice = discountPrice;
    const {
      firstImage,
      secondImage,
      thirdImage,
      ...formValuesWithoutPhoto
    } = formValues;

    const response = await FormDataFetch(
      `${settings.baseURL}/api/Product`,
      "POST",
      MakeFormData(productData)
    );

    switch (response.status) {
      case 201:
        setIsSaved(true);
        setIsLoading(false);
        setFormValues(initialFormValues);
        break;
      case 400:
        setFormValues({
          firstImage: "",
          secondImage: "",
          thirdImage: "",
          ...formValuesWithoutPhoto,
        });
        HandleErrorMessage(response, setErrorsList, setIsLoading);
        break;
      case 401:
      case 403:
        HandleUnauthorizedOrForbiddenError(history);
        break;
      case 500:
        history.push("/500");
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

const getProduct = async (
  productId,
  setFormValues,
  setSavedImages,
  setIsLoading,
  setisNotFund,
  history
) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/api/Product/${productId}`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const {
          firstImage,
          secondImage,
          thirdImage,
          id,
          discountPrice,
          ...productData
        } = await response.json();
        setFormValues({
          firstImage: "",
          secondImage: "",
          thirdImage: "",
          discountPrice: discountPrice ? discountPrice : "",
          ...productData,
        });
        setSavedImages({ firstImage, secondImage, thirdImage });
        setIsLoading(false);
        break;
      case 404:
        setisNotFund(true);
        setIsLoading(false);
        break;
      case 500:
        history.push("/500");
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

const validationSchema = object().shape({
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

const initialFormValues = {
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

const SuccessModal = ({ setIsSaved }) => {
  return (
    <Modal>
      <p>Product data successfully saved.</p>
      <button onClick={() => setIsSaved(false)}>OK</button>
    </Modal>
  );
};

const NotFoundModal = ({ setSelectedProductId }) => {
  return (
    <Modal>
      <p>Product not found.</p>
      <button onClick={() => setSelectedProductId(null)}>Back to list</button>
    </Modal>
  );
};

const SavedImages = ({ images }) => {
  if (!images) return null;

  const { firstImage, secondImage, thirdImage } = images;
  return (
    <>
      <div>Current(saved) product images</div>
      <div>First image</div>
      <DisplayImage src={firstImage} />
      <div>Second image</div>
      <DisplayImage src={secondImage} />
      <div>Third image</div>
      <DisplayImage src={thirdImage} />
    </>
  );
};

export default function SaveProduct({ productId = "", setSelectedProductId }) {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [savedImages, setSavedImages] = useState(null);

  const [isSaved, setIsSaved] = useState(false);
  const [isNotFund, setisNotFund] = useState(false);

  const [errorsList, setErrorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (!productId) return;
    getProduct(
      productId,
      setFormValues,
      setSavedImages,
      setIsLoading,
      setisNotFund,
      history
    );
  }, []);

  if (isNotFund)
    return <NotFoundModal setSelectedProductId={setSelectedProductId} />;
  if (isSaved) return <SuccessModal setIsSaved={setIsSaved} />;
  if (isLoading) return <Loader />;

  return (
    <>
      {errorsList.length > 0 && (
        <ErrorModal errorsArray={errorsList} clearErrors={setErrorsList} />
      )}
      <Formik
        validationSchema={validationSchema}
        initialValues={formValues}
        onSubmit={(values) =>
          productId
            ? updateProduct(
                values,
                setIsLoading,
                setFormValues,
                setSavedImages,
                setErrorsList,
                setIsSaved,
                setisNotFund,
                productId,
                history
              )
            : saveProduct(
                values,
                setIsLoading,
                setFormValues,
                setIsSaved,
                setErrorsList,
                history
              )
        }
      >
        {({ isValid, values: { isOnDiscount } }) => (
          <Form data-testid="saveProductForm">
            <StandardField name="name" label="Product name" type="text" />
            <StandardField name="type" label="Type of product" type="text" />
            <StandardField
              name="manufacturer"
              label="Manufacturer"
              type="text"
            />
            <StandardField name="quantity" label="Quantity" type="number" />
            <StandardField name="price" label="Price" type="number" />
            <TextArea name="description" label="Product description" rows="8" />
            <StandardField
              name="isOnDiscount"
              label="Is on discount"
              type="checkbox"
              checked={isOnDiscount}
            />
            <StandardField
              name="discountPrice"
              label="Discount price"
              type="number"
              hidden={!isOnDiscount}
            />

            <SavedImages images={savedImages} />

            <FileUploadField
              name="firstImage"
              accept=".jpg, .jpeg, .png, .pdf"
              label="First image of product, which is also thumbnail."
            />

            <FileUploadField
              name="secondImage"
              accept=".jpg, .jpeg, .png, .pdf"
              label="Second image of product."
            />

            <FileUploadField
              name="thirdImage"
              accept=".jpg, .jpeg, .png, .pdf"
              label="Third image of product."
            />

            <button type="submit" disabled={!isValid}>
              Save
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}
