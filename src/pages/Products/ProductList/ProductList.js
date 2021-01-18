import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  FILTER_TYPE,
  SORT_TYPES,
} from "../../../components/constants/constants";
import { JsonFetch } from "../../../components/fetches/Fetches";
import Loader from "../../../components/loader/Loader";
import { StyledButton } from "../../../components/StyledComponents/Button";
import { StyledInput } from "../../../components/StyledComponents/Input";
import { DisplayImage } from "../../../components/Utils/ImageUtils/ImageUtils";
import { Pagination } from "../../../components/Utils/ListUtils/ListUtils";
import { MakeQueryString } from "../../../components/Utils/QueryStringUtils/QueryStringUtils";
import { settings } from "../../../settings";
import EditProduct from "../EditProduct/EditProduct";
import {
  StyledProductListEditProductContainer,
  StyledProductListBackToListButton,
  StyledProductListFiltersContainer,
  StyledProductListProductContainer,
  StyledProductListListContainer,
  StyledProductListPaginationContainer,
  StyledProductListContainer,
  StyledProductListFiltersInner,
} from "./ProductListStyles";

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
      `${settings.backendApiUrl}/api/Product?${MakeQueryString(searchParams)}`,
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
      <StyledInput
        as="select"
        id="sortType"
        name="sortType"
        onChange={handleChange}
        defaultValue={defaultValue}
      >
        <option value={SORT_TYPES.nameAscending}>Name ascending</option>
        <option value={SORT_TYPES.nameDescending}>Name descending</option>
        <option value={SORT_TYPES.quantityAscending}>Quantity ascending</option>
        <option value={SORT_TYPES.quantityDescending}>
          Quantity descending
        </option>
      </StyledInput>
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
      <label htmlFor={FILTER_TYPE.type}>Type of product</label>
      <StyledInput
        id={FILTER_TYPE.type}
        name={FILTER_TYPE.type}
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
    <div>
      <StyledInput
        id={FILTER_TYPE.isOnDiscount}
        name={FILTER_TYPE.isOnDiscount}
        type="checkbox"
        onChange={handleChange}
        defaultChecked={defaultValue}
      />
      <label htmlFor={FILTER_TYPE.isOnDiscount}>Is on discount</label>
    </div>
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
      <StyledInput
        name="search"
        type="text"
        maxLength="150"
        placeholder="Search for a product..."
        onBlur={handleChange}
        defaultValue={defaultValue}
      />
      <StyledButton>Submit</StyledButton>
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
      <StyledProductListProductContainer
        key={id}
        onClick={() => handleOnClick(id)}
      >
        <DisplayImage src={firstImage} alt={name} />
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <td>{name}</td>
            </tr>
            <tr>
              <th>Manufacturer</th>
              <td>{manufacturer}</td>
            </tr>
            <tr>
              <th>Quantity</th>
              <td>{quantity}</td>
            </tr>
            <tr>
              <th>Price</th>
              <td>{price}</td>
            </tr>
            {isOnDiscount && (
              <tr>
                <th>Discount price</th>
                <td>{discountPrice}</td>
              </tr>
            )}
          </tbody>
        </table>
      </StyledProductListProductContainer>
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
    [FILTER_TYPE.type]: type,
    [FILTER_TYPE.isOnDiscount]: isOnDiscount,
    sortType,
    search,
  };
};

export default function ProductList() {
  const [typeFilter, setTypeFilter] = useState("");
  const [isOnDiscountFilter, setIsOnDiscountFilter] = useState(false);
  const [sortTypeFilter, setSortTypeFilter] = useState(
    SORT_TYPES.nameAscending
  );
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
      <StyledProductListEditProductContainer>
        <StyledProductListBackToListButton
          onClick={() => setSelectedProductId(null)}
        >
          Back to list
        </StyledProductListBackToListButton>
        <EditProduct
          productId={selectedProductId}
          setSelectedProductId={setSelectedProductId}
        />
      </StyledProductListEditProductContainer>
    );

  return (
    <StyledProductListContainer>
      <StyledProductListFiltersContainer>
        <StyledProductListFiltersInner>
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
        </StyledProductListFiltersInner>
      </StyledProductListFiltersContainer>
      <StyledProductListListContainer>
        {isLoading ? (
          <Loader />
        ) : (
          <DisplayProductList
            products={products}
            handleOnClick={setSelectedProductId}
          />
        )}
      </StyledProductListListContainer>
      <StyledProductListPaginationContainer>
        <Pagination
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          totalPages={totalPages}
        />
      </StyledProductListPaginationContainer>
    </StyledProductListContainer>
  );
}
