import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { HandleUnauthorizedOrForbiddenError } from "../../../components/Errors/ErrorHandlers";
import { JsonFetch } from "../../../components/fetches/Fetches";
import Loader from "../../../components/loader/Loader";
import { Modal } from "../../../components/Messages/Modal";
import { settings } from "../../../settings";
import SaveProduct from "../SaveProduct/SaveProduct";
import {
  StyledEditProductDeleteButton,
  StyledEditProductContainer,
} from "./EditProductStyles";

const deleteProduct = async (
  productId,
  setIsLoading,
  setActiveModalText,
  history
) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.backendApiUrl}/api/Product/${productId}`,
      "DELETE",
      true,
      null
    );

    switch (response.status) {
      case 204:
        setActiveModalText("Product successfully deleted.");
        setIsLoading(false);
        break;
      case 401:
      case 403:
        HandleUnauthorizedOrForbiddenError(history);
        break;
      case 404:
        setActiveModalText("Product not found.");
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

export default function EditProduct({ productId, setSelectedProductId }) {
  const [activeModalText, setActiveModalText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  if (activeModalText)
    return (
      <Modal>
        <p>{activeModalText}</p>
        <button onClick={() => setSelectedProductId(null)}>Back to list</button>
      </Modal>
    );

  if (isLoading) return <Loader />;

  return (
    <StyledEditProductContainer>
      <SaveProduct
        productId={productId}
        setSelectedProductId={setSelectedProductId}
      />
      <StyledEditProductDeleteButton
        onClick={() => {
          deleteProduct(productId, setIsLoading, setActiveModalText, history);
        }}
      >
        Delete product
      </StyledEditProductDeleteButton>
    </StyledEditProductContainer>
  );
}
