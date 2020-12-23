import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { HandleUnauthorizedOrForbiddenError } from "../../../../components/Errors/ErrorHandlers";
import { JsonFetch } from "../../../../components/fetches/Fetches";
import Loader from "../../../../components/loader/Loader";
import Modal from "../../../../components/Messages/Modal";
import { DisplayImage } from "../../../../components/Utils/ImageUtils/ImageUtils";
import { DisplayItemList } from "../../../../components/Utils/ListUtils/ListUtils";
import { settings } from "../../../../settings";

const getProducts = async (search, setIsLoading, setProducts, history) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/product?search=${search}`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const products = await response.json();
        setProducts(products);
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
      `${settings.baseURL}/section/${sectionId}`,
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
  setisNotFund,
  setIsLoading,
  history
) => {
  if (!sectionName || sectionProducts.length < 1) return;

  try {
    setIsLoading(true);

    const url = `${settings.baseURL}/section${
      sectionId ? `/${sectionId}` : ""
    }`;
    const method = sectionId ? "PUT" : "POST";

    const response = await JsonFetch(url, method, true, {
      title: sectionName,
      products: sectionProducts.map(({ id }) => id),
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

const SavedModal = ({ setIsSaved }) => {
  return (
    <Modal>
      <p>Section saved successfully.</p>
      <button onClick={() => setIsSaved(false)}>OK</button>
    </Modal>
  );
};

const NotFoundModal = ({ setSelectedSectionId }) => {
  return (
    <Modal>
      <p>Section not found.</p>
      <button onClick={() => setSelectedSectionId(null)}>OK</button>
    </Modal>
  );
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

const ProductTemplate = ({ product, setSectionProducts, isRemoveMode }) => {
  const { name, firstImage, price, isOnDiscount, discountPrice } = product;
  const handleBtnClick = isRemoveMode
    ? removeProductFromSection
    : addProductToSection;

  return (
    <article>
      <DisplayImage src={firstImage} alt={name} />
      <p>{name}</p>
      <p>{price}</p>
      {isOnDiscount && <p>{discountPrice}</p>}
      <button onClick={() => handleBtnClick(product, setSectionProducts)}>
        {isRemoveMode ? "Remove" : "Add"}
      </button>
    </article>
  );
};

export default function SaveSection({ sectionId, setSelectedSectionId }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(null);

  const [sectionProducts, setSectionProducts] = useState([]);
  const [sectionName, setSectionName] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [isNotFund, setisNotFund] = useState(false);
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

  if (isNotFund)
    return <NotFoundModal setSelectedSectionId={setSelectedSectionId} />;
  if (isSaved) return <SavedModal setIsSaved={setIsSaved} />;
  if (isLoading) return <Loader />;

  return (
    <>
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
            setisNotFund,
            setIsLoading,
            history
          )
        }
        disabled={!sectionName || sectionProducts.length < 1}
      >
        Save section
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          getProducts(search, setIsLoading, setProducts, history);
        }}
      >
        <input
          name="search"
          type="text"
          maxLength="150"
          onChange={({ target: { value } }) => setSearch(value)}
          placeholder="Search for a product..."
        />
        <button>Submit</button>
      </form>

      <DisplayItemList
        items={products}
        ItemTemplate={(item) => (
          <ProductTemplate
            isRemoveMode={false}
            product={item}
            setSectionProducts={setSectionProducts}
          />
        )}
      />

      <h2>Products in section ({sectionProducts.length})</h2>
      <label htmlFor="sectionName">Section name:</label>
      <input
        id="sectionName"
        onChange={({ target: { value } }) => setSectionName(value)}
        max="150"
        type="text"
        defaultValue={sectionName}
      />
      {sectionProducts.length > 0 && (
        <DisplayItemList
          items={sectionProducts}
          ItemTemplate={(item) => (
            <ProductTemplate
              isRemoveMode={true}
              product={item}
              setSectionProducts={setSectionProducts}
            />
          )}
        />
      )}
    </>
  );
}
