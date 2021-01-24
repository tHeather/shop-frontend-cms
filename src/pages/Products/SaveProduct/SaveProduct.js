import { Formik } from "formik";
import React, { useEffect, useReducer } from "react";
import {
  StandardField,
  TextArea,
} from "../../../components/forms/fields/Fields";
import Loader from "../../../components/loader/Loader";
import { HandleUnauthorizedOrForbiddenError } from "../../../components/Errors/ErrorHandlers";
import { InfoModal } from "../../../components/Messages/Modal";
import { useHistory } from "react-router-dom";
import { FileUploadField } from "../../../components/forms/fields/Fields";
import { DisplayImage } from "../../../components/Utils/ImageUtils/ImageUtils";
import {
  closeModalActionCreator,
  closeErrorModalActionCreator,
} from "../../../components/Utils/GlobalActions/GlobalActions";
import ErrorModal from "../../../components/Errors/ErrorModal";
import {
  deleteImageFetch,
  getProductFetch,
  saveProductFetch,
  updateProductFetch,
} from "./SaveProductFetches";
import { saveProductReducer } from "./SaveProductReducer";
import { initialFormValues, validationSchema } from "./SaveProductFields";
import {
  StyledSaveProductForm,
  StyledSaveProductFeaturesSection,
  StyledSaveProductImageSection,
  StyledSaveProductImageSectionElement,
  StyledSaveProductSubmitBtn,
  StyledSaveProductImageSectionElementControlsContainer,
} from "./SaveProductStyles";
import { isString } from "../../../components/Utils/StringUtils/StringUtils";
import { StyledDeleteButton } from "../../../components/StyledComponents/Button";
import { StyledPageHeadline } from "../../../components/StyledComponents/PageHeadlineStyles";

const makeImageSectionElements = ({ firstImage, secondImage, thirdImage }) => {
  return [
    {
      image: firstImage,
      fieldName: "firstImage",
      label: "First image of product, which is also thumbnail.",
    },

    {
      image: secondImage,
      fieldName: "secondImage",
      label: "Second image of product.",
    },
    {
      image: thirdImage,
      fieldName: "thirdImage",
      label: "Third image of product.",
    },
  ];
};

const ImageSection = ({ images, productId, dispatch }) => {
  return (
    <StyledSaveProductImageSection>
      <h2>Photos</h2>
      {makeImageSectionElements(images).map(({ image, fieldName, label }) => (
        <StyledSaveProductImageSectionElement key={fieldName}>
          <DisplayImage src={image} />
          <StyledSaveProductImageSectionElementControlsContainer>
            <FileUploadField
              name={fieldName}
              accept="jpg, jpeg, bmp, gif, png, svg"
              label={label}
            />
            {isString(image) && image.length > 0 && (
              <StyledDeleteButton
                type="button"
                onClick={() =>
                  deleteImageFetch(
                    { fieldName, imageName: image },
                    productId,
                    dispatch
                  )
                }
              >
                Delete
              </StyledDeleteButton>
            )}
          </StyledSaveProductImageSectionElementControlsContainer>
        </StyledSaveProductImageSectionElement>
      ))}
    </StyledSaveProductImageSection>
  );
};

const initialState = {
  activeModalText: null,
  formValues: initialFormValues,
  savedImages: { firstImage: "", secondImage: "", thirdImage: "" },
  isLoading: false,
  errorsList: null,
  isUnauthorized: false,
  isProductNotFound: false,
  isServerError: false,
};

export default function SaveProduct({ productId, setSelectedProductId }) {
  const [
    {
      activeModalText,
      formValues,
      savedImages,
      isLoading,
      errorsList,
      isUnauthorized,
      isProductNotFound,
      isServerError,
    },
    dispatch,
  ] = useReducer(saveProductReducer, initialState);
  const history = useHistory();

  useEffect(() => {
    if (!productId) return;
    getProductFetch(productId, dispatch);
  }, []);

  useEffect(() => {
    if (!isUnauthorized) return;
    HandleUnauthorizedOrForbiddenError(history);
  }, [isUnauthorized]);

  useEffect(() => {
    if (!isServerError) return;
    history.push("/500");
  }, [isServerError]);

  useEffect(() => {
    if (!isProductNotFound) return;
    setSelectedProductId(null);
  }, [isProductNotFound]);

  if (isLoading) return <Loader />;

  return (
    <>
      {activeModalText && (
        <InfoModal
          closeHandler={() => dispatch(closeModalActionCreator())}
          btnText="OK"
        >
          <p>{activeModalText}</p>
        </InfoModal>
      )}
      {errorsList && (
        <ErrorModal
          errorsArray={errorsList}
          closeHandler={() => dispatch(closeErrorModalActionCreator())}
        />
      )}
      <StyledPageHeadline>
        {productId ? "Edit product" : "Add new product"}
      </StyledPageHeadline>
      <Formik
        validationSchema={validationSchema}
        initialValues={formValues}
        onSubmit={(values) =>
          productId
            ? updateProductFetch(values, productId, dispatch)
            : saveProductFetch(values, dispatch)
        }
      >
        {({
          isValid,
          values: { isOnDiscount, firstImage, secondImage, thirdImage },
        }) => (
          <StyledSaveProductForm data-testid="saveProductForm">
            <StyledSaveProductFeaturesSection>
              <h2>Features</h2>
              <StandardField name="name" label="Product name" type="text" />
              <StandardField name="type" label="Type of product" type="text" />
              <StandardField
                name="manufacturer"
                label="Manufacturer"
                type="text"
              />
              <StandardField name="quantity" label="Quantity" type="number" />
              <StandardField name="price" label="Price" type="number" />
              <div>
                <StandardField
                  name="isOnDiscount"
                  label="Is on discount"
                  type="checkbox"
                  checked={isOnDiscount}
                />
                {isOnDiscount && (
                  <StandardField
                    name="discountPrice"
                    label="Discount price"
                    type="number"
                  />
                )}
              </div>
              <TextArea
                name="description"
                label="Product description"
                rows="25"
              />
            </StyledSaveProductFeaturesSection>

            <ImageSection
              images={{
                firstImage: firstImage || savedImages.firstImage,
                secondImage: secondImage || savedImages.secondImage,
                thirdImage: thirdImage || savedImages.thirdImage,
              }}
              productId={productId}
              dispatch={dispatch}
            />

            <StyledSaveProductSubmitBtn type="submit" disabled={!isValid}>
              Save
            </StyledSaveProductSubmitBtn>
          </StyledSaveProductForm>
        )}
      </Formik>
    </>
  );
}
