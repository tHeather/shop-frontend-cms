import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { HandleUnauthorizedOrForbiddenError } from "../../../../components/Errors/ErrorHandlers";
import { JsonFetch } from "../../../../components/fetches/Fetches";
import Loader from "../../../../components/loader/Loader";
import Modal from "../../../../components/Messages/Modal";
import { settings } from "../../../../settings";
import SaveProduct from "../SaveProduct/SaveProduct";

const deleteProduct = async (
  productId,
  setIsLoading,
  setIsDeleted,
  setisNotFund,
  history
) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/api/Product/${productId}`,
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
      case 404:
        setisNotFund(true);
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

const BacktoListModal = ({ setSelectedProductId, children }) => {
  return (
    <Modal>
      {children}
      <button onClick={() => setSelectedProductId(null)}>Back to list</button>
    </Modal>
  );
};

export default function EditProduct({ productId, setSelectedProductId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFund, setisNotFund] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const history = useHistory();

  if (isNotFund)
    return (
      <BacktoListModal setSelectedProductId={setSelectedProductId}>
        <p>Product not found.</p>
      </BacktoListModal>
    );

  if (isDeleted)
    return (
      <BacktoListModal setSelectedProductId={setSelectedProductId}>
        <p>Product successfully deleted.</p>
      </BacktoListModal>
    );

  if (isLoading) return <Loader />;

  return (
    <>
      <button
        onClick={() => {
          deleteProduct(
            productId,
            setIsLoading,
            setIsDeleted,
            setisNotFund,
            history
          );
        }}
      >
        Delete product
      </button>
      <SaveProduct
        productId={productId}
        setSelectedProductId={setSelectedProductId}
      />
    </>
  );
}
