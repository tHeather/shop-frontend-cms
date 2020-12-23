import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { HandleUnauthorizedOrForbiddenError } from "../../../../components/Errors/ErrorHandlers";
import { JsonFetch } from "../../../../components/fetches/Fetches";
import Loader from "../../../../components/loader/Loader";
import Modal from "../../../../components/Messages/Modal";
import { settings } from "../../../../settings";

const getTypes = async (setIsLoading, setTypes, history, setSelectedType) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/product/types`,
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
  setIsSaved
) => {
  if (!category || categoryTypes.size < 1) return;
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/category`,
      "POST",
      true,
      {
        name: category,
        types: Array.from(categoryTypes),
      }
    );

    switch (response.status) {
      case 204:
        setIsSaved(true);
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

const SavedModal = ({ setIsSaved }) => {
  return (
    <Modal>
      <p>Category successfully saved.</p>
      <button onClick={() => setIsSaved(false)}>OK</button>
    </Modal>
  );
};

export default function SaveCategory({
  initCategoryTypes = null,
  initCategory = "",
}) {
  const [selectedType, setSelectedType] = useState(null);
  const [types, setTypes] = useState([]);

  const [categoryTypes, setCategoryTypes] = useState(
    initCategoryTypes ? new Set([...initCategoryTypes]) : new Set()
  );
  const [category, setCategory] = useState(initCategory);

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    getTypes(setIsLoading, setTypes, history, setSelectedType);
  }, []);

  if (isSaved) return <SavedModal setIsSaved={setIsSaved} />;
  if (isLoading) return <Loader />;

  return (
    <>
      <label htmlFor="categoryName">Category name</label>
      <input
        id="categoryName"
        max="30"
        onChange={({ target: { value } }) => setCategory(value)}
        defaultValue={category}
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
        disabled={!category || categoryTypes.size < 1}
        onClick={() =>
          saveCategory(
            setIsLoading,
            history,
            category,
            categoryTypes,
            setIsSaved
          )
        }
      >
        Save
      </button>
    </>
  );
}
