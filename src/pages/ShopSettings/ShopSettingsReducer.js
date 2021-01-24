import { GLOBAL_ACTIONS } from "../../components/Utils/GlobalActions/GlobalActions";

const SHOP_SETTINGS_ACTIONS = {
  saveThemes: "saveThemes",
};

export function shopSettingsReducer(state, { type, payload }) {
  switch (type) {
    case SHOP_SETTINGS_ACTIONS.saveThemes:
      return { ...state, themes: payload.themes, isLoading: false };
    case GLOBAL_ACTIONS.setModalMessage:
      return {
        ...state,
        activeModalText: payload.activeModalText,
        activeModalCloseHandlerParams: payload.activeModalCloseHandlerParams,
        isLoading: false,
      };
    case GLOBAL_ACTIONS.setErrorModalMessage:
      return { ...state, errorsList: payload.errorsList, isLoading: false };
    case GLOBAL_ACTIONS.closeErrorModal:
      return { ...state, errorsList: null };
    case GLOBAL_ACTIONS.closeModal:
      return {
        ...state,
        activeModalText: null,
        activeModalCloseHandlerParams: null,
      };
    case GLOBAL_ACTIONS.loader:
      return {
        ...state,
        isLoading: payload.isLoading,
      };
    case GLOBAL_ACTIONS.unauthorized:
      return { ...state, isUnauthorized: true };
    case GLOBAL_ACTIONS.serverError:
      return { ...state, isServerError: true };
    default:
      throw new Error();
  }
}

export const shopSettingsSaveThemesActionCreator = (themes) => {
  return {
    type: SHOP_SETTINGS_ACTIONS.saveThemes,
    payload: { themes },
  };
};

export const shopSettingsSetModalMessageActionCreator = (
  activeModalText,
  activeModalCloseHandlerParams
) => {
  return {
    type: GLOBAL_ACTIONS.setModalMessage,
    payload: { activeModalText, activeModalCloseHandlerParams },
  };
};
