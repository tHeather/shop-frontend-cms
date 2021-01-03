import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  HandleErrorMessage,
  HandleUnauthorizedOrForbiddenError,
} from "../../../components/Errors/ErrorHandlers";
import ErrorModal from "../../../components/Errors/ErrorModal";
import { JsonFetch } from "../../../components/fetches/Fetches";
import Loader from "../../../components/loader/Loader";
import { InfoModal } from "../../../components/Messages/Modal";
import { settings } from "../../../settings";

const getTypes = async (setIsLoading, setTypes, history, setSelectedType) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/api/Product/types`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const { types } = await response.json();
        setTypes(types);
        setSelectedType(types[0]);
        setIsLoading(false);
        break;
      case 500:
        history.push("/500");
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

const saveCategory = async (
  setIsLoading,
  history,
  category,
  categoryTypes,
  setIsSaved,
  setErrorsList
) => {
  if (!category || categoryTypes.size < 1) return;
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/api/Category`,
      "POST",
      true,
      {
        title: category,
        types: Array.from(categoryTypes),
      }
    );

    switch (response.status) {
      case 204:
        setIsSaved(true);
        setIsLoading(false);
        break;
      case 400:
        HandleErrorMessage(response, setErrorsList, setIsLoading);
        break;
      case 401:
      case 403:
        HandleUnauthorizedOrForbiddenError(history);
        break;
      case 500:
        history.push("/500");
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

const updateCategory = async (
  setIsLoading,
  history,
  category,
  categoryTypes,
  setIsSaved,
  categoryId,
  setErrorsList,
  setIsCategoryNotFound
) => {
  if (!category || categoryTypes.size < 1) return;
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/api/Category/${categoryId}`,
      "PUT",
      true,
      {
        title: category,
        types: Array.from(categoryTypes),
      }
    );

    switch (response.status) {
      case 204:
        setIsSaved(true);
        setIsLoading(false);
        break;
      case 400:
        HandleErrorMessage(response, setErrorsList, setIsLoading);
        break;
      case 404:
        setIsCategoryNotFound(true);
        setIsLoading(false);
        break;
      case 401:
      case 403:
        HandleUnauthorizedOrForbiddenError(history);
        break;
      case 500:
        history.push("/500");
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

export const SelectType = ({ types, setSelectedType }) => {
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
        onChange={({ target: { value } }) => setSelectedType(value)}
      >
        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </>
  );
};

export const addTypeToCategory = (selectedType, setCategoryTypes) => {
  setCategoryTypes((prevSet) => {
    prevSet.add(selectedType);
    return new Set([...prevSet]);
  });
};

export const removeTypeFromCategory = (selectedType, setCategoryTypes) => {
  setCategoryTypes((prevSet) => {
    prevSet.delete(selectedType);
    return new Set([...prevSet]);
  });
};

export const TypeList = ({
  categoryTypes,
  setCategoryTypes,
  removeTypeFromCategory,
}) => {
  if (categoryTypes.size < 1) return <div>No types here yet.</div>;

  return (
    <ul>
      {Array.from(categoryTypes).map((type) => (
        <li key={type} value={type}>
          <span>{type}</span>
          <button
            onClick={() => removeTypeFromCategory(type, setCategoryTypes)}
          >
            delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default function SaveCategory({
  initCategory = null,
  setSelectedCategory,
}) {
  const [selectedType, setSelectedType] = useState(null);
  const [types, setTypes] = useState([]);

  const [categoryTypes, setCategoryTypes] = useState(
    new Set([...initCategory.types])
  );
  const [categoryTitle, setCategoryTitle] = useState(initCategory.title);

  const [isSaved, setIsSaved] = useState(false);
  const [errorsList, setErrorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  const [isCategoryNotFound, setIsCategoryNotFound] = useState(false);

  useEffect(() => {
    getTypes(setIsLoading, setTypes, history, setSelectedType);
  }, []);

  if (isCategoryNotFound)
    return (
      <InfoModal closeHandler={() => setSelectedCategory(null)} btnText="OK">
        <p>Category not found.</p>
      </InfoModal>
    );

  if (isSaved)
    return (
      <InfoModal closeHandler={() => setIsSaved(false)} btnText="OK">
        <p>Category successfully saved.</p>
      </InfoModal>
    );
  if (isLoading) return <Loader />;

  return (
    <>
      {errorsList.length > 0 && (
        <ErrorModal errorsArray={errorsList} clearErrors={setErrorsList} />
      )}
      <label htmlFor="categoryName">Category name</label>
      <input
        id="categoryName"
        max="30"
        onChange={({ target: { value } }) => setCategoryTitle(value)}
        defaultValue={categoryTitle}
      />
      <SelectType types={types} setSelectedType={setSelectedType} />
      <button onClick={() => addTypeToCategory(selectedType, setCategoryTypes)}>
        Add
      </button>
      <TypeList
        categoryTypes={categoryTypes}
        setCategoryTypes={setCategoryTypes}
        removeTypeFromCategory={removeTypeFromCategory}
      />
      <button
        disabled={!categoryTitle || categoryTypes.size < 1}
        onClick={() => {
          initCategory.id
            ? updateCategory(
                setIsLoading,
                history,
                categoryTitle,
                categoryTypes,
                setIsSaved,
                initCategory.id,
                setErrorsList,
                setIsCategoryNotFound
              )
            : saveCategory(
                setIsLoading,
                history,
                categoryTitle,
                categoryTypes,
                setIsSaved,
                setErrorsList
              );
        }}
      >
        Save
      </button>
    </>
  );
}
