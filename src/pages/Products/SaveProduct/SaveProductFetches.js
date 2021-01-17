import { FormDataFetch, JsonFetch } from "../../../components/fetches/Fetches";
import { MakeFormData } from "../../../components/Utils/formDataUtils/FormDataUtils";
import {
  loaderActionCreator,
  serverErrorActionCreator,
  unauthorizedActionCreator,
} from "../../../components/Utils/GlobalActions/GlobalActions";
import { settings } from "../../../settings";
import { initialFormValues } from "./SaveProductFields";
import {
  deleteImageActionCreator,
  getProductActionCreator,
  imageNotFoundActionCreator,
  productNotFoundActionCreator,
  saveProductActionCreator,
  saveProductErrorActionCreator,
} from "./SaveProductReducer";

export const updateProductFetch = async (formValues, productId, dispatch) => {
  dispatch(loaderActionCreator(true));
  try {
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
        dispatch(
          saveProductActionCreator(productWithEmptyPohots, {
            firstImage,
            secondImage,
            thirdImage,
          })
        );
        break;
      case 400:
        const { errors } = await response.json();
        dispatch(saveProductErrorActionCreator(errors, productWithEmptyPohots));
        break;
      case 401:
      case 403:
        dispatch(unauthorizedActionCreator());
        break;
      case 404:
        dispatch(productNotFoundActionCreator());
        break;
      case 500:
        dispatch(serverErrorActionCreator());
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

export const saveProductFetch = async (formValues, dispatch) => {
  dispatch(loaderActionCreator(true));
  try {
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
        dispatch(
          saveProductActionCreator(initialFormValues, {
            firstImage: "",
            secondImage: "",
            thirdImage: "",
          })
        );
        break;
      case 400:
        const { errors } = await response.json();
        dispatch(
          saveProductErrorActionCreator(errors, {
            firstImage: "",
            secondImage: "",
            thirdImage: "",
            ...formValuesWithoutPhoto,
          })
        );
        break;
      case 401:
      case 403:
        dispatch(unauthorizedActionCreator());
        break;
      case 500:
        dispatch(serverErrorActionCreator());
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

export const getProductFetch = async (productId, dispatch) => {
  dispatch(loaderActionCreator(true));
  try {
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

        dispatch(
          getProductActionCreator(
            {
              firstImage: "",
              secondImage: "",
              thirdImage: "",
              discountPrice: discountPrice ? discountPrice : "",
              ...productData,
            },
            { firstImage, secondImage, thirdImage }
          )
        );
        break;
      case 404:
        dispatch(productNotFoundActionCreator());
        break;
      case 500:
        dispatch(serverErrorActionCreator());
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

export const deleteImageFetch = async (image, productId, dispatch) => {
  dispatch(loaderActionCreator(true));
  try {
    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/Product/${productId}/images/${image.imageName}`,
      "DELETE",
      true,
      null
    );

    switch (response.status) {
      case 204:
        dispatch(deleteImageActionCreator(image.fieldName));
        break;
      case 404:
        dispatch(imageNotFoundActionCreator(image.fieldName));
        break;
      case 401:
      case 403:
        dispatch(unauthorizedActionCreator());
        break;
      case 500:
        dispatch(serverErrorActionCreator());
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};
