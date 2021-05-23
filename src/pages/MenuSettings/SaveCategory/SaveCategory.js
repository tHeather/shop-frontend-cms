import React, { useEffect, useReducer } from "react";
import { useServerErrorsHandler } from "../../../components/Errors/ErrorHandlers";
import ErrorModal from "../../../components/Errors/ErrorModal";
import Loader from "../../../components/loader/Loader";
import { InfoModal } from "../../../components/Messages/Modal";
import {
  closeErrorModalActionCreator,
  setModalMessageActionCreator,
} from "../../../components/Utils/GlobalActions/GlobalActions";
import { getTypes, saveCategory, updateCategory } from "./SaveCategoryFetches";
import saveCategoryReducer, {
  setCategoryTitleActionCreator,
  setSelectedTypeActionCreator,
  removeTypeFromCategoryActionCreator,
  addTypeToCategoryActionCreator,
} from "./SaveCategoryReducer";

export const SelectType = ({ types, dispatch }) => {
  if (types.length < 1)
    return (
      <div>
        First you need to add some products to be able to divide their types
        into categories.
      </div>
    );

  return (
    <>
      <label htmlFor="type">Type</label>
      <select
        id="type"
        defaultValue={types[0]}
        onChange={({ target: { value } }) =>
          dispatch(setSelectedTypeActionCreator(value))
        }
      >
        {types.map((type, index) => (
          <option key={`${type}${index}`} value={type}>
            {type}
          </option>
        ))}
      </select>
    </>
  );
};

export const TypeList = ({ categoryTypes, dispatch }) => {
  if (categoryTypes.size < 1) return <div>No types here yet.</div>;

  return (
    <ul>
      {Array.from(categoryTypes).map((type, index) => (
        <li key={`${type}${index}`}>
          <span>{type}</span>
          <button
            onClick={() => dispatch(removeTypeFromCategoryActionCreator(type))}
          >
            delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default function SaveCategory({
  initCategory = { id: null, title: "", types: [] },
  setSelectedCategory,
}) {
  const [
    {
      isLoading,
      errorsList,
      isUnauthorized,
      isServerError,
      activeModalText,
      isCategoryNotFound,
      types,
      categoryTitle,
      selectedType,
      categoryTypes,
    },
    dispatch,
  ] = useReducer(saveCategoryReducer, {
    isLoading: false,
    errorsList: [],
    isUnauthorized: false,
    isServerError: false,
    activeModalText: "",
    isCategoryNotFound: false,
    types: [],
    categoryTitle: initCategory.title,
    selectedType: "",
    categoryTypes: new Set(initCategory.types),
  });

  useEffect(() => {
    getTypes(dispatch);
  }, []);

  useServerErrorsHandler(isUnauthorized, isServerError);

  if (isLoading) return <Loader />;

  return (
    <>
      {activeModalText && (
        <InfoModal
          closeHandler={() =>
            isCategoryNotFound
              ? setSelectedCategory(null)
              : dispatch(setModalMessageActionCreator(""))
          }
          btnText="OK"
        >
          <p>{activeModalText}</p>
        </InfoModal>
      )}
      {errorsList.length > 0 && (
        <ErrorModal
          errorsArray={errorsList}
          closeHandler={() => dispatch(closeErrorModalActionCreator())}
        />
      )}
      <label htmlFor="categoryName">Category name</label>
      <input
        id="categoryName"
        max="30"
        onChange={({ target: { value } }) =>
          dispatch(setCategoryTitleActionCreator(value))
        }
        defaultValue={categoryTitle}
      />
      <SelectType types={types} dispatch={dispatch} />
      <button
        onClick={() => dispatch(addTypeToCategoryActionCreator(selectedType))}
      >
        Add
      </button>
      <TypeList categoryTypes={categoryTypes} dispatch={dispatch} />
      <button
        disabled={!categoryTitle || categoryTypes.size < 1}
        onClick={() => {
          initCategory.id
            ? updateCategory(
                dispatch,
                categoryTitle,
                categoryTypes,
                initCategory.id
              )
            : saveCategory(dispatch, categoryTitle, categoryTypes);
        }}
      >
        Save
      </button>
    </>
  );
}
