import { GLOBAL_ACTIONS } from "../../../components/Utils/GlobalActions/GlobalActions";

const SAVE_CATEGORY_ACTIONS = {
  getTypes: "getTypes",
  categoryNotFound: "categoryNotFound",
  setCategoryTitle: "setCategoryTitle",
  setSelectedType: "setSelectedType",
  addTypeToCategory: "addTypeToCategory",
  removeTypeFromCategory: "removeTypeFromCategory",
};

export default function saveCategoryReducer(state, { type, payload }) {
  switch (type) {
    case SAVE_CATEGORY_ACTIONS.removeTypeFromCategory:
      const typesDeleteOperation = new Set([...state.categoryTypes]);
      typesDeleteOperation.delete(payload.selectedType);
      return { ...state, categoryTypes: typesDeleteOperation };
    case SAVE_CATEGORY_ACTIONS.addTypeToCategory:
      const typesAddOperation = new Set([...state.categoryTypes]);
      typesAddOperation.add(payload.selectedType);
      return { ...state, categoryTypes: typesAddOperation };
    case SAVE_CATEGORY_ACTIONS.setSelectedType:
      return { ...state, selectedType: payload.selectedType };
    case SAVE_CATEGORY_ACTIONS.setCategoryTitle:
      return { ...state, categoryTitle: payload.categoryTitle };
    case SAVE_CATEGORY_ACTIONS.getTypes:
      return {
        ...state,
        types: payload.types,
        selectedType: payload.selectedType,
        isLoading: false,
      };
    case SAVE_CATEGORY_ACTIONS.categoryNotFound:
      return {
        ...state,
        isCategoryNotFound: true,
        activeModalText: payload.activeModalText,
        isLoading: false,
      };
    case GLOBAL_ACTIONS.setErrorModalMessage:
      return { ...state, errorsList: payload.errorsList, isLoading: false };
    case GLOBAL_ACTIONS.closeErrorModal:
      return { ...state, errorsList: [] };
    case GLOBAL_ACTIONS.setModalMessage:
      return {
        ...state,
        activeModalText: payload.activeModalText,
        isLoading: false,
      };
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

export const removeTypeFromCategoryActionCreator = (selectedType) => {
  return {
    type: SAVE_CATEGORY_ACTIONS.removeTypeFromCategory,
    payload: { selectedType },
  };
};

export const addTypeToCategoryActionCreator = (selectedType) => {
  return {
    type: SAVE_CATEGORY_ACTIONS.addTypeToCategory,
    payload: { selectedType },
  };
};

export const setSelectedTypeActionCreator = (selectedType) => {
  return {
    type: SAVE_CATEGORY_ACTIONS.setSelectedType,
    payload: { selectedType },
  };
};

export const setCategoryTitleActionCreator = (categoryTitle) => {
  return {
    type: SAVE_CATEGORY_ACTIONS.setCategoryTitle,
    payload: { categoryTitle },
  };
};

export const getTypesActionCreator = (types) => {
  return {
    type: SAVE_CATEGORY_ACTIONS.getTypes,
    payload: { types, selectedType: types[0] },
  };
};

export const categoryNotFoundActionCreator = (activeModalText) => {
  return {
    type: SAVE_CATEGORY_ACTIONS.categoryNotFound,
    payload: { activeModalText },
  };
};
