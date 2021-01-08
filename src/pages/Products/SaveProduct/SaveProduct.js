import { Form, Formik } from "formik";
import { object } from "yup";
import React, { useEffect, useState } from "react";
import ErrorModal from "../../../components/Errors/ErrorModal";
import {
  StandardField,
  TextArea,
} from "../../../components/forms/fields/Fields";
import {
  productNameConstraints,
  productTypeConstraints,
  productManufacturerConstraints,
  productQuantityConstraints,
  productPriceConstraints,
  productDiscountPriceConstraints,
} from "../../../components/forms/fieldsConstraints/FieldsConstraints";
import Loader from "../../../components/loader/Loader";
import { boolean } from "yup";
import { JsonFetch, FormDataFetch } from "../../../components/fetches/Fetches";
import { settings } from "../../../settings";
import {
  HandleErrorMessage,
  HandleUnauthorizedOrForbiddenError,
} from "../../../components/Errors/ErrorHandlers";
import { InfoModal } from "../../../components/Messages/Modal";
import { useHistory } from "react-router-dom";
import { FileUploadField } from "../../../components/forms/fields/Fields";
import { DisplayImage } from "../../../components/Utils/ImageUtils/ImageUtils";
import { fileValidation } from "../../../components/forms/fieldsConstraints/FieldsConstraints";
import { MakeFormData } from "../../../components/Utils/formDataUtils/FormDataUtils";

const updateProduct = async (
  formValues,
  setIsLoading,
  setFormValues,
  setSavedImages,
  setErrorsList,
  setIsProductSaved,
  setIsProductNotFund,
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
      `${settings.backendApiUrl}/api/Product/${productId}`,
      "PUT",
      MakeFormData(productData)
    );

    switch (response.status) {
      case 200:
        const { firstImage, secondImage, thirdImage } = await response.json();
        setIsProductSaved(true);
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
        setIsProductNotFund(true);
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
  setIsProductSaved,
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
      `${settings.backendApiUrl}/api/Product`,
      "POST",
      MakeFormData(productData)
    );

    switch (response.status) {
      case 201:
        setIsProductSaved(true);
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
  setIsProductNotFund,
  history
) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/Product/${productId}`,
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
        setIsProductNotFund(true);
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

const deleteImage = async (
  image,
  productId,
  setSavedImages,
  setIsImageDeleted,
  setIsImageNotFund,
  setIsLoading,
  history
) => {
  try {
    setIsLoading(true);

    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/Product/${productId}/images/${image.name}`,
      "DELETE",
      true,
      null
    );

    switch (response.status) {
      case 204:
        setIsImageDeleted(true);
        setSavedImages((prev) => {
          return { ...prev, [image.field]: null };
        });
        setIsLoading(false);
        break;
      case 404:
        setIsImageNotFund(true);
        setSavedImages((prev) => {
          return { ...prev, [image.field]: null };
        });
        setIsLoading(false);
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

const SavedImages = ({
  images,
  productId,
  setSavedImages,
  setIsImageDeleted,
  setIsImageNotFund,
  setIsLoading,
  history,
}) => {
  if (!images) return null;

  const { firstImage, secondImage, thirdImage } = images;
  return (
    <>
      <div>Current(saved) product images</div>
      <div>First image</div>
      <DisplayImage src={firstImage} />
      <button
        type="button"
        data-testid="deleteFirstImageBtn"
        disabled={!firstImage}
        onClick={() =>
          deleteImage(
            { field: "firstImage", name: firstImage },
            productId,
            setSavedImages,
            setIsImageDeleted,
            setIsImageNotFund,
            setIsLoading,
            history
          )
        }
      >
        Delete
      </button>
      <div>Second image</div>
      <DisplayImage src={secondImage} />
      <button
        type="button"
        disabled={!secondImage}
        onClick={() =>
          deleteImage(
            { field: "secondImage", name: secondImage },
            productId,
            setSavedImages,
            setIsImageDeleted,
            setIsImageNotFund,
            setIsLoading,
            history
          )
        }
      >
        Delete
      </button>
      <div>Third image</div>
      <DisplayImage src={thirdImage} />
      <button
        type="button"
        disabled={!thirdImage}
        onClick={() =>
          deleteImage(
            { field: "thirdImage", name: thirdImage },
            productId,
            setSavedImages,
            setIsImageDeleted,
            setIsImageNotFund,
            setIsLoading,
            history
          )
        }
      >
        Delete
      </button>
    </>
  );
};

export default function SaveProduct({ productId = "", setSelectedProductId }) {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [savedImages, setSavedImages] = useState(null);

  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [isImageNotFund, setIsImageNotFund] = useState(false);

  const [isProductSaved, setIsProductSaved] = useState(false);
  const [isProductNotFund, setIsProductNotFund] = useState(false);

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
      setIsProductNotFund,
      history
    );
  }, []);

  if (isProductNotFund)
    return (
      <InfoModal
        closeHandler={() => setSelectedProductId(null)}
        btnText="Back to list"
      >
        <p>Product not found.</p>
      </InfoModal>
    );

  if (isProductSaved)
    return (
      <InfoModal closeHandler={() => setIsProductSaved(false)} btnText="OK">
        <p>Product data successfully saved.</p>
      </InfoModal>
    );

  if (isImageNotFund)
    return (
      <InfoModal closeHandler={() => setIsImageNotFund(false)} btnText="OK">
        <p>Image not found.</p>
      </InfoModal>
    );

  if (isImageDeleted)
    return (
      <InfoModal closeHandler={() => setIsImageDeleted(false)} btnText="OK">
        <p>Image successfully deleted.</p>
      </InfoModal>
    );

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
                setIsProductSaved,
                setIsProductNotFund,
                productId,
                history
              )
            : saveProduct(
                values,
                setIsLoading,
                setFormValues,
                setIsProductSaved,
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

            <SavedImages
              images={savedImages}
              productId={productId}
              setSavedImages={setSavedImages}
              setIsImageDeleted={setIsImageDeleted}
              setIsImageNotFund={setIsImageNotFund}
              setIsLoading={setIsLoading}
              history={history}
            />

            <FileUploadField
              name="firstImage"
              accept="jpg, jpeg, bmp, gif, png, svg"
              label="First image of product, which is also thumbnail."
            />

            <FileUploadField
              name="secondImage"
              accept="jpg, jpeg, bmp, gif, png, svg"
              label="Second image of product."
            />

            <FileUploadField
              name="thirdImage"
              accept="jpg, jpeg, bmp, gif, png, svg"
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
