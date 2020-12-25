import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { HandleUnauthorizedOrForbiddenError } from "../../../components/Errors/ErrorHandlers";
import { JsonFetch } from "../../../components/fetches/Fetches";
import Loader from "../../../components/loader/Loader";
import { Modal } from "../../../components/Messages/Modal";
import { settings } from "../../../settings";
import SaveCategory from "../SaveCategory/SaveCategory";

const deleteCategory = async (id, setIsLoading, history, setIsDeleted) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/category/${id}`,
      "DELETE",
      true,
      null
    );

    switch (response.status) {
      case 204:
        setIsDeleted(true);
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
      `${settings.baseURL}/category`,
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
}) => {
  if (!Array.isArray(categories) || categories.length < 1)
    return <div>No categories here yet.</div>;

  return categories.map((category) => {
    const { id, name, types } = category;
    return (
      <article key={id}>
        <span>{name}</span>
        <ul>
          {types.map((type) => (
            <li key={type}>{type}</li>
          ))}
        </ul>
        <button onClick={() => setSelectedCategory(category)}>Edit</button>
        <button
          onClick={() =>
            deleteCategory(id, setIsLoading, history, setIsDeleted)
          }
        >
          Delete
        </button>
      </article>
    );
  });
};

const DeleteModal = ({
  setIsDeleted,
  setIsLoading,
  setCategories,
  history,
}) => {
  return (
    <Modal>
      <p>Successfully deleted</p>
      <button
        onClick={() => {
          setIsDeleted(false);
          getCategories(setIsLoading, setCategories, history);
        }}
      >
        OK
      </button>
    </Modal>
  );
};

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const history = useHistory();
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    getCategories(setIsLoading, setCategories, history);
  }, []);

  if (isDeleted)
    return (
      <DeleteModal
        setIsDeleted={setIsDeleted}
        setIsLoading={setIsLoading}
        setCategories={setCategories}
        history={history}
      />
    );

  if (isLoading) return <Loader />;

  if (selectedCategory) {
    const { name, types } = selectedCategory;
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
        <SaveCategory initCategory={name} initCategoryTypes={types} />
      </>
    );
  }

  return (
    <>
      <button onClick={() => setSelectedCategory({ name: "", types: null })}>
        Add new category
      </button>
      <DisplayCategories
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        setIsLoading={setIsLoading}
        setCategories={setCategories}
        history={history}
        setIsDeleted={setIsDeleted}
      />
    </>
  );
}
