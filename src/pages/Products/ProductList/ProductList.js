import React, { useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router";
import { JsonFetch } from "../../../components/fetches/Fetches";
import Loader from "../../../components/loader/Loader";
import {
  loaderActionCreator,
  serverErrorActionCreator,
} from "../../../components/Utils/GlobalActions/GlobalActions";
import { DisplayImage } from "../../../components/Utils/ImageUtils/ImageUtils";
import { Pagination } from "../../../components/Utils/ListUtils/Pagination/Pagination";
import { MakeQueryString } from "../../../components/Utils/QueryStringUtils/QueryStringUtils";
import { settings } from "../../../settings";
import EditProduct from "../EditProduct/EditProduct";
import ProductListFilters from "./Filters/ProductListFilters";
import {
  changePageNumberActionCreator,
  saveProductsActionCreator,
} from "./ProductListReducer";
import {
  StyledProductListEditProductContainer,
  StyledProductListBackToListButton,
  StyledProductListFiltersContainer,
  StyledProductListProductContainer,
  StyledProductListListContainer,
  StyledProductListPaginationContainer,
  StyledProductListContainer,
} from "./ProductListStyles";
import { productListReducer } from "./ProductListReducer";
import { SORT_TYPES } from "../../../components/constants/constants";
import { StyledPageHeadline } from "../../../components/StyledComponents/PageHeadlineStyles";

const getProducts = async (searchParams, dispatch) => {
  dispatch(loaderActionCreator(true));
  try {
    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/Product?${MakeQueryString(searchParams)}`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const { result, totalPages } = await response.json();
        dispatch(saveProductsActionCreator(result, totalPages));
        break;
      case 500:
        dispatch(serverErrorActionCreator());
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
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

const initialState = {
  filters: { sortType: SORT_TYPES.nameAscending },
  products: null,
  totalPages: 0,
  pageNumber: 1,
  isLoading: false,
  isServerError: false,
};

export default function ProductList() {
  const [
    { filters, products, totalPages, pageNumber, isLoading, isServerError },
    dispatch,
  ] = useReducer(productListReducer, initialState);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (selectedProductId) return;
    getProducts({ pageNumber, ...filters }, dispatch);
  }, [pageNumber, filters, selectedProductId]);

  useEffect(() => {
    if (!isServerError) return;
    history.push("/500");
  }, [isServerError]);

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
    <>
      <StyledPageHeadline>Product list</StyledPageHeadline>
      <StyledProductListContainer>
        <StyledProductListFiltersContainer>
          <ProductListFilters dispatch={dispatch} />
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
            handlePageNumberChange={(pageNum) =>
              dispatch(changePageNumberActionCreator(pageNum))
            }
            totalPages={totalPages}
          />
        </StyledProductListPaginationContainer>
      </StyledProductListContainer>
    </>
  );
}
