import { GLOBAL_ACTIONS } from "../../../components/Utils/GlobalActions/GlobalActions";

export const PRODUCT_LIST_ACTIONS = {
  changePageNumber: "changePageNumber",
  submitFilters: "submitFilters",
  saveProducts: "saveProducts",
};

export function productListReducer(state, action) {
  switch (action.type) {
    case PRODUCT_LIST_ACTIONS.saveProducts:
      return {
        ...state,
        totalPages: action.totalPages,
        products: action.products,
        isLoading: false,
      };
    case PRODUCT_LIST_ACTIONS.submitFilters:
      return {
        ...state,
        filters: action.filters,
      };
    case PRODUCT_LIST_ACTIONS.changePageNumber:
      return {
        ...state,
        pageNumber: action.pageNumber,
      };
    case GLOBAL_ACTIONS.loader:
      return { ...state, isLoading: action.isLoading };
    case GLOBAL_ACTIONS.serverError:
      return { ...state, isServerError: true };
    default:
      throw new Error();
  }
}

export const saveProductsActionCreator = (products, totalPages) => {
  return {
    type: PRODUCT_LIST_ACTIONS.saveProducts,
    totalPages,
    products,
  };
};

export const submitFiltersActionCreator = (filters) => {
  return {
    type: PRODUCT_LIST_ACTIONS.submitFilters,
    filters,
  };
};

export const changePageNumberActionCreator = (pageNumber) => {
  return {
    type: PRODUCT_LIST_ACTIONS.changePageNumber,
    pageNumber,
  };
};
