import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { HandleUnauthorizedOrForbiddenError } from "../../../components/Errors/ErrorHandlers";
import { JsonFetch } from "../../../components/fetches/Fetches";
import Loader from "../../../components/loader/Loader";
import { InfoModal } from "../../../components/Messages/Modal";
import { settings } from "../../../settings";
import SaveCategory from "../SaveCategory/SaveCategory";

const deleteCategory = async (
  id,
  setIsLoading,
  history,
  setIsDeleted,
  setIsCategoryNotFound
) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/api/Category/${id}`,
      "DELETE",
      true,
      null
    );

    switch (response.status) {
      case 204:
        setIsDeleted(true);
        setIsLoading(false);
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

const getCategories = async (setIsLoading, setCategories, history) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/api/Category`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const categories = await response.json();
        setCategories(categories);
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

export const DisplayCategories = ({
  categories,
  setSelectedCategory,
  setIsLoading,
  history,
  setIsDeleted,
  setIsCategoryNotFound,
}) => {
  if (!Array.isArray(categories) || categories.length < 1)
    return <div>No categories here yet.</div>;

  return categories.map((category) => {
    const { id, title, types } = category;
    return (
      <article key={id}>
        <span>{title}</span>
        <ul>
          {types.map((type) => (
            <li key={type}>{type}</li>
          ))}
        </ul>
        <button onClick={() => setSelectedCategory(category)}>Edit</button>
        <button
          onClick={() =>
            deleteCategory(
              id,
              setIsLoading,
              history,
              setIsDeleted,
              setIsCategoryNotFound
            )
          }
        >
          Delete
        </button>
      </article>
    );
  });
};

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const history = useHistory();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryNotFound, setIsCategoryNotFound] = useState(false);

  useEffect(() => {
    getCategories(setIsLoading, setCategories, history);
  }, []);

  if (isCategoryNotFound)
    return (
      <InfoModal
        closeHandler={() => {
          setIsCategoryNotFound(false);
          getCategories(setIsLoading, setCategories, history);
        }}
        btnText="OK"
      >
        <p>Category not found.</p>
      </InfoModal>
    );

  if (isDeleted)
    return (
      <InfoModal
        closeHandler={() => {
          setIsDeleted(false);
          getCategories(setIsLoading, setCategories, history);
        }}
        btnText="OK"
      >
        <p>Successfully deleted</p>
      </InfoModal>
    );

  if (isLoading) return <Loader />;

  if (selectedCategory) {
    return (
      <>
        <button
          onClick={() => {
            setSelectedCategory(null);
            getCategories(setIsLoading, setCategories, history);
          }}
        >
          Back to list
        </button>
        <SaveCategory
          initCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </>
    );
  }

  return (
    <>
      <button onClick={setSelectedCategory}>Add new category</button>
      <DisplayCategories
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        setIsLoading={setIsLoading}
        setCategories={setCategories}
        history={history}
        setIsDeleted={setIsDeleted}
        setIsCategoryNotFound={setIsCategoryNotFound}
      />
    </>
  );
}
