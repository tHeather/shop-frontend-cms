import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { HandleUnauthorizedOrForbiddenError } from "../../../components/Errors/ErrorHandlers";
import { JsonFetch } from "../../../components/fetches/Fetches";
import Loader from "../../../components/loader/Loader";
import { InfoModal } from "../../../components/Messages/Modal";
import { DisplayImage } from "../../../components/Utils/ImageUtils/ImageUtils";
import { Pagination } from "../../../components/Utils/ListUtils/ListUtils";
import { settings } from "../../../settings";

const getProducts = async (
  search,
  pageNumber,
  setTotalPages,
  setProducts,
  setIsLoading,
  history
) => {
  try {
    setIsLoading(true);
    const searchParam = search ? `&search=${search}` : "";
    const response = await JsonFetch(
      `${settings.baseURL}/api/Product?pageNumber=${pageNumber}${searchParam}`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const { result, totalPages } = await response.json();
        setTotalPages(totalPages);
        setProducts(result);
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

const getSection = async (
  sectionId,
  setSectionName,
  setSectionProducts,
  setIsLoading,
  history
) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/api/Section/${sectionId}`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const { title, products } = await response.json();
        setSectionName(title);
        setSectionProducts(products);
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

const saveSection = async (
  setProducts,
  setSearch,
  setSectionProducts,
  setSectionName,
  sectionId,
  sectionName,
  sectionProducts,
  setIsSaved,
  setisSectionNotFund,
  setIsLoading,
  history
) => {
  if (!sectionName || sectionProducts.length < 1) return;

  try {
    setIsLoading(true);

    const url = `${settings.baseURL}/api/Section${
      sectionId ? `/${sectionId}` : ""
    }`;
    const method = sectionId ? "PUT" : "POST";

    const response = await JsonFetch(url, method, true, {
      title: sectionName,
      ProductIds: sectionProducts.map(({ id }) => id),
    });

    switch (response.status) {
      case 204:
        if (!sectionId) {
          setProducts(null);
          setSearch("");
          setSectionProducts([]);
          setSectionName("");
        }
        setIsSaved(true);
        setIsLoading(false);
        break;
      case 401:
      case 403:
        HandleUnauthorizedOrForbiddenError(history);
        break;
      case 404:
        setisSectionNotFund(true);
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

const addProductToSection = (product, setSectionProducts) => {
  setSectionProducts((prev) => {
    return [
      ...prev.filter((prevProduct) => product.id !== prevProduct.id),
      product,
    ];
  });
};

const removeProductFromSection = (product, setSectionProducts) => {
  setSectionProducts((prev) => {
    return prev.filter((prevProduct) => product.id !== prevProduct.id);
  });
};

const ProductList = ({ products, setSectionProducts, isRemoveMode }) => {
  if (!Array.isArray(products)) return null;

  if (products.length < 1)
    return (
      <p>
        {isRemoveMode
          ? "There are no products in section yet."
          : "There are no product which meet your criteria."}
      </p>
    );

  const handleBtnClick = isRemoveMode
    ? removeProductFromSection
    : addProductToSection;

  return products.map((product) => {
    const {
      id,
      name,
      firstImage,
      price,
      isOnDiscount,
      discountPrice,
    } = product;
    return (
      <article key={id}>
        <DisplayImage src={firstImage} alt={name} />
        <p>{name}</p>
        <p>{price}</p>
        {isOnDiscount && <p>{discountPrice}</p>}
        <button onClick={() => handleBtnClick(product, setSectionProducts)}>
          {isRemoveMode ? "Remove from section" : "Add to section"}
        </button>
      </article>
    );
  });
};

export const ProductSearch = ({ defaultValue, handleChange }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.target[0].blur();
      }}
    >
      <input
        name="search"
        type="text"
        maxLength="150"
        placeholder="Search for a product..."
        onBlur={handleChange}
        defaultValue={defaultValue}
      />
      <button>Submit</button>
    </form>
  );
};

export default function SaveSection({ sectionId, setSelectedSectionId }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [sectionProducts, setSectionProducts] = useState([]);
  const [sectionName, setSectionName] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [isSectionNotFund, setisSectionNotFund] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (!sectionId) return;
    getSection(
      sectionId,
      setSectionName,
      setSectionProducts,
      setIsLoading,
      history
    );
  }, []);

  useEffect(() => {
    getProducts(
      search,
      pageNumber,
      setTotalPages,
      setProducts,
      setIsLoading,
      history
    );
  }, [search, pageNumber]);

  if (isSectionNotFund)
    return (
      <InfoModal
        closeHandler={() => setSelectedSectionId(null)}
        btnText="Back to list"
      >
        <p>Section not found.</p>
      </InfoModal>
    );

  if (isSaved)
    return (
      <InfoModal closeHandler={() => setIsSaved(false)} btnText="OK">
        <p>Section saved successfully.</p>
      </InfoModal>
    );

  if (isLoading) return <Loader />;

  return (
    <>
      <ProductSearch
        handleChange={({ target: { value } }) => setSearch(value)}
        defaultValue={search}
      />
      <ProductList
        products={products}
        setSectionProducts={setSectionProducts}
      />
      <Pagination
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        totalPages={totalPages}
      />

      <button
        onClick={() =>
          saveSection(
            setProducts,
            setSearch,
            setSectionProducts,
            setSectionName,
            sectionId,
            sectionName,
            sectionProducts,
            setIsSaved,
            setisSectionNotFund,
            setIsLoading,
            history
          )
        }
        disabled={!sectionName || sectionProducts.length < 1}
      >
        Save section
      </button>
      <h2>Products in section ({sectionProducts.length})</h2>
      <label htmlFor="sectionName">Section name:</label>
      <input
        id="sectionName"
        onChange={({ target: { value } }) => setSectionName(value)}
        max="150"
        type="text"
        defaultValue={sectionName}
      />
      <ProductList
        products={sectionProducts}
        setSectionProducts={setSectionProducts}
        isRemoveMode={true}
      />
    </>
  );
}
