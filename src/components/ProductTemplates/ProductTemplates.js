import { DisplayImage } from "../Utils/ImageUtils/ImageUtils";

export const Price = ({ price, isOnDiscount, discountPrice }) => {
  if (!isOnDiscount) return <p>{price}</p>;

  return (
    <>
      <p>{price}</p>
      <p>{discountPrice}</p>
    </>
  );
};

export const SmallInnerProductTemplate = ({
  name,
  firstImage,
  price,
  isOnDiscount,
  discountPrice,
}) => {
  return (
    <>
      <DisplayImage src={firstImage} alt={name} />
      <p>{name}</p>
      <Price
        price={price}
        isOnDiscount={isOnDiscount}
        discountPrice={discountPrice}
      />
    </>
  );
};

export const MediumInnerProductTemplate = ({
  manufacturer,
  name,
  quantity,
  firstImage,
  price,
  isOnDiscount,
  discountPrice,
}) => {
  return (
    <>
      <DisplayImage src={firstImage} alt={name} />
      <p>{name}</p>
      <p>{manufacturer}</p>
      <p>{quantity}</p>
      <Price
        price={price}
        isOnDiscount={isOnDiscount}
        discountPrice={discountPrice}
      />
    </>
  );
};
