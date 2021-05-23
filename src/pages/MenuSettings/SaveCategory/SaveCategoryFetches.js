import { JsonFetch } from "../../../components/fetches/Fetches";
import { settings } from "../../../settings";
import {
  loaderActionCreator,
  serverErrorActionCreator,
  setErororModalMessageActionCreator,
  setModalMessageActionCreator,
  unauthorizedActionCreator,
} from "../../../components/Utils/GlobalActions/GlobalActions";
import {
  categoryNotFoundActionCreator,
  getTypesActionCreator,
} from "./SaveCategoryReducer";

export const getTypes = async (dispatch) => {
  try {
    dispatch(loaderActionCreator(true));
    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/Product/types`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const { types } = await response.json();
        dispatch(getTypesActionCreator(types));
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

export const saveCategory = async (dispatch, category, categoryTypes) => {
  if (!category || categoryTypes.size < 1) return;
  try {
    dispatch(loaderActionCreator(true));
    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/Category`,
      "POST",
      true,
      {
        title: category,
        types: Array.from(categoryTypes),
      }
    );

    switch (response.status) {
      case 204:
        dispatch(setModalMessageActionCreator("Category successfully saved."));
        break;
      case 400:
        const { errors } = await response.json();
        dispatch(setErororModalMessageActionCreator(errors));
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

export const updateCategory = async (
  dispatch,
  category,
  categoryTypes,
  categoryId
) => {
  if (!category || categoryTypes.size < 1) return;
  try {
    dispatch(loaderActionCreator(true));
    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/Category/${categoryId}`,
      "PUT",
      true,
      {
        title: category,
        types: Array.from(categoryTypes),
      }
    );

    switch (response.status) {
      case 204:
        dispatch(setModalMessageActionCreator("Category successfully saved."));
        break;
      case 400:
        const { errors } = await response.json();
        dispatch(setErororModalMessageActionCreator(errors));
        break;
      case 404:
        dispatch(categoryNotFoundActionCreator("Category not found."));
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
