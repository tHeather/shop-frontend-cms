import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { filterType, sortType } from "../../../components/constants/constants";
import { JsonFetch } from "../../../components/fetches/Fetches";
import Loader from "../../../components/loader/Loader";
import { DisplayImage } from "../../../components/Utils/ImageUtils/ImageUtils";
import { Pagination } from "../../../components/Utils/ListUtils/ListUtils";
import { MakeQueryString } from "../../../components/Utils/QueryStringUtils/QueryStringUtils";
import { settings } from "../../../settings";
import EditProduct from "../EditProduct/EditProduct";

const getProducts = async (
  searchParams,
  setTotalPages,
  setIsLoading,
  setProducts,
  history
) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/api/Product?${MakeQueryString(searchParams)}`,
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

export const ProductSortSelect = ({ handleChange, defaultValue }) => {
  return (
    <>
      <label htmlFor="sortType">Sort by:</label>
      <select
        id="sortType"
        name="sortType"
        onChange={handleChange}
        defaultValue={defaultValue}
      >
        <option value={sortType.nameAscending}>Name ascending</option>
        <option value={sortType.nameDescending}>Name descending</option>
        <option value={sortType.quantityAscending}>Quantity ascending</option>
        <option value={sortType.quantityDescending}>Quantity descending</option>
      </select>
    </>
  );
};

export const ProductTypeFilters = ({ handleChange, defaultValue }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.target[0].blur();
      }}
    >
      <label htmlFor={filterType.type}>Type of product</label>
      <input
        id={filterType.type}
        name={filterType.type}
        type="text"
        maxLength="150"
        onBlur={handleChange}
        defaultValue={defaultValue}
      />
    </form>
  );
};

export const ProductIsOnDiscountFilter = ({ handleChange, defaultValue }) => {
  return (
    <>
      <label htmlFor={filterType.isOnDiscount}>Is on discount</label>
      <input
        id={filterType.isOnDiscount}
        name={filterType.isOnDiscount}
        type="checkbox"
        onChange={handleChange}
        defaultChecked={defaultValue}
      />
    </>
  );
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

const DisplayProductList = ({ products, handleOnClick }) => {
  if (!Array.isArray(products)) return null;

  if (products.length < 1)
    return <p>There are no product which meet your criteria.</p>;

  return products.map(
    ({
      id,
      manufacturer,
      name,
      quantity,
      firstImage,
      price,
      isOnDiscount,
      discountPrice,
    }) => (
      <article key={id} onClick={() => handleOnClick(id)}>
        <DisplayImage src={firstImage} alt={name} />
        <p>{name}</p>
        <p>{manufacturer}</p>
        <p>{quantity}</p>
        <p>{price}</p>
        {isOnDiscount && <p>{discountPrice}</p>}
      </article>
    )
  );
};

const MakeSearchParamsObject = (
  pageNumber,
  type,
  isOnDiscount,
  sortType,
  search
) => {
  return {
    pageNumber,
    [filterType.type]: type,
    [filterType.isOnDiscount]: isOnDiscount,
    sortType,
    search,
  };
};

export default function ProductList() {
  const [typeFilter, setTypeFilter] = useState("");
  const [isOnDiscountFilter, setIsOnDiscountFilter] = useState(false);
  const [sortTypeFilter, setSortTypeFilter] = useState(sortType.nameAscending);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState(null);

  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (selectedProductId) return;
    getProducts(
      MakeSearchParamsObject(
        pageNumber,
        typeFilter,
        isOnDiscountFilter,
        sortTypeFilter,
        search
      ),
      setTotalPages,
      setIsLoading,
      setProducts,
      history
    );
  }, [
    pageNumber,
    typeFilter,
    isOnDiscountFilter,
    sortTypeFilter,
    search,
    selectedProductId,
  ]);

  if (selectedProductId)
    return (
      <>
        <button onClick={() => setSelectedProductId(null)}>Back to list</button>
        <EditProduct
          productId={selectedProductId}
          setSelectedProductId={setSelectedProductId}
        />
      </>
    );

  return (
    <>
      <ProductSortSelect
        handleChange={({ target: { value } }) => setSortTypeFilter(value)}
        defaultValue={sortTypeFilter}
      />
      <ProductTypeFilters
        handleChange={({ target: { value } }) => setTypeFilter(value)}
        defaultValue={typeFilter}
      />
      <ProductIsOnDiscountFilter
        handleChange={({ target: { checked } }) =>
          setIsOnDiscountFilter(checked)
        }
        defaultValue={isOnDiscountFilter}
      />
      <ProductSearch
        handleChange={({ target: { value } }) => setSearch(value)}
        defaultValue={search}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <DisplayProductList
          products={products}
          handleOnClick={setSelectedProductId}
        />
      )}
      <Pagination
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        totalPages={totalPages}
      />
    </>
  );
}
