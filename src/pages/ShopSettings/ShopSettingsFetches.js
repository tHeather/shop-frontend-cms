import { FormDataFetch, JsonFetch } from "../../components/fetches/Fetches";
import { MakeFormData } from "../../components/Utils/formDataUtils/FormDataUtils";
import {
  loaderActionCreator,
  serverErrorActionCreator,
  setErororModalMessageActionCreator,
  unauthorizedActionCreator,
} from "../../components/Utils/GlobalActions/GlobalActions";
import { settings } from "../../settings";
import {
  shopSettingsSaveThemesActionCreator,
  shopSettingsSetModalMessageActionCreator,
} from "./ShopSettingsReducer";

export const updateSettings = async (settingsValues, dispatch) => {
  try {
    dispatch(loaderActionCreator(true));
    const response = await FormDataFetch(
      `${settings.backendApiUrl}/api/ShopSettings`,
      "PUT",
      MakeFormData(settingsValues)
    );

    switch (response.status) {
      case 200:
        const settingData = await response.json();
        dispatch(
          shopSettingsSetModalMessageActionCreator(
            "Settings saved successfully.",
            settingData
          )
        );
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

export const getThemes = async (dispatch) => {
  dispatch(loaderActionCreator(true));
  try {
    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/ShopSettings/themes`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const themes = await response.json();
        dispatch(shopSettingsSaveThemesActionCreator(themes));
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

export const deleteLogo = async (dispatch) => {
  try {
    dispatch(loaderActionCreator(true));
    const response = await FormDataFetch(
      `${settings.backendApiUrl}/api/ShopSettings/logo`,
      "DELETE",
      true,
      false
    );

    switch (response.status) {
      case 204:
        dispatch(
          shopSettingsSetModalMessageActionCreator(
            "Logo deleted successfully.",
            (prev) => {
              return { ...prev, logo: "" };
            }
          )
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

export const deleteRegulations = async (dispatch) => {
  try {
    dispatch(loaderActionCreator(true));
    const response = await FormDataFetch(
      `${settings.backendApiUrl}/api/ShopSettings/regulations`,
      "DELETE",
      true,
      false
    );

    switch (response.status) {
      case 204:
        dispatch(
          shopSettingsSetModalMessageActionCreator(
            "Regulations deleted successfully.",
            (prev) => {
              return { ...prev, regulations: null };
            }
          )
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
