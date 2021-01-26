import { GLOBAL_ACTIONS } from "../../../components/Utils/GlobalActions/GlobalActions";

const SAVE_PRODUCT_ACTIONS = {
  saveProduct: "saveProduct",
  getProduct: "getProduct",
  error: "error",
  productNotFound: "productNotFound",
  deleteImage: "deleteImage",
  imageNotFound: "imageNotFound",
};

export function saveProductReducer(state, { type, payload }) {
  switch (type) {
    case SAVE_PRODUCT_ACTIONS.saveProduct:
      return {
        ...state,
        formValues: payload.formValues,
        savedImages: payload.savedImages,
        activeModalText: "Product data successfully saved.",
        isLoading: false,
      };
    case SAVE_PRODUCT_ACTIONS.productNotFound:
      return { ...state, isProductNotFound: true };
    case SAVE_PRODUCT_ACTIONS.getProduct:
      return {
        ...state,
        formValues: payload.formValues,
        savedImages: payload.savedImages,
        isLoading: false,
      };
    case SAVE_PRODUCT_ACTIONS.deleteImage:
      return {
        ...state,
        activeModalText: "Image successfully deleted.",
        savedImages: { ...state.savedImages, [payload.deletedImage]: null },
        isLoading: false,
      };
    case SAVE_PRODUCT_ACTIONS.imageNotFound:
      return {
        ...state,
        activeModalText: "Image not found.",
        savedImages: { ...state.savedImages, [payload.notFoundImage]: null },
        isLoading: false,
      };
    case SAVE_PRODUCT_ACTIONS.error:
      return {
        ...state,
        errorsList: payload.errorsList,
        formValues: payload.formValues,
        isLoading: false,
      };
    case GLOBAL_ACTIONS.closeErrorModal:
      return { ...state, errorsList: null };
    case GLOBAL_ACTIONS.closeModal:
      return { ...state, activeModalText: null };
    case GLOBAL_ACTIONS.loader:
      return { ...state, isLoading: payload.isLoading };
    case GLOBAL_ACTIONS.unauthorized:
      return { ...state, isUnauthorized: true };
    case GLOBAL_ACTIONS.serverError:
      return { ...state, isServerError: true };
    default:
      throw new Error();
  }
}

export const getProductActionCreator = (formValues, savedImages) => {
  return {
    type: SAVE_PRODUCT_ACTIONS.getProduct,
    payload: { formValues, savedImages },
  };
};

export const saveProductActionCreator = (formValues, savedImages) => {
  return {
    type: SAVE_PRODUCT_ACTIONS.saveProduct,
    payload: { formValues, savedImages },
  };
};

export const productNotFoundActionCreator = () => {
  return {
    type: SAVE_PRODUCT_ACTIONS.productNotFound,
    payload: null,
  };
};

export const saveProductErrorActionCreator = (errorsList, formValues) => {
  return {
    type: SAVE_PRODUCT_ACTIONS.error,
    payload: { errorsList, formValues },
  };
};

export const deleteImageActionCreator = (deletedImage) => {
  return {
    type: SAVE_PRODUCT_ACTIONS.deleteImage,
    payload: { deletedImage },
  };
};

export const imageNotFoundActionCreator = (notFoundImage) => {
  return {
    type: SAVE_PRODUCT_ACTIONS.imageNotFound,
    payload: { notFoundImage },
  };
};
