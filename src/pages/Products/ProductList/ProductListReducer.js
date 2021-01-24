import { GLOBAL_ACTIONS } from "../../../components/Utils/GlobalActions/GlobalActions";

const PRODUCT_LIST_ACTIONS = {
  changePageNumber: "changePageNumber",
  submitFilters: "submitFilters",
  saveProducts: "saveProducts",
};

export function productListReducer(state, { type, payload }) {
  switch (type) {
    case PRODUCT_LIST_ACTIONS.saveProducts:
      return {
        ...state,
        totalPages: payload.totalPages,
        products: payload.products,
        isLoading: false,
      };
    case PRODUCT_LIST_ACTIONS.submitFilters:
      return {
        ...state,
        filters: payload.filters,
      };
    case PRODUCT_LIST_ACTIONS.changePageNumber:
      return {
        ...state,
        pageNumber: payload.pageNumber,
      };
    case GLOBAL_ACTIONS.loader:
      return { ...state, isLoading: payload.isLoading };
    case GLOBAL_ACTIONS.serverError:
      return { ...state, isServerError: true };
    default:
      throw new Error();
  }
}

export const saveProductsActionCreator = (products, totalPages) => {
  return {
    type: PRODUCT_LIST_ACTIONS.saveProducts,
    payload: { totalPages, products },
  };
};

export const submitFiltersActionCreator = (filters) => {
  return {
    type: PRODUCT_LIST_ACTIONS.submitFilters,
    payload: { filters },
  };
};

export const changePageNumberActionCreator = (pageNumber) => {
  return {
    type: PRODUCT_LIST_ACTIONS.changePageNumber,
    payload: { pageNumber },
  };
};
