import { useEffect, useRef, useState } from "react";
import { StyledInput } from "../../../StyledComponents/Input";
import {
  StyledPaginationButton,
  StyledPaginationForm,
} from "./PaginationStyles";

export const validatePagintaionInput = (inputValue, pageNumber, totalPages) => {
  const int = parseInt(inputValue);
  if (!int) return pageNumber;
  if (int > totalPages) return totalPages;
  if (int < 1) return 1;
  return int;
};

const handleBlur = (e, pageNumber, totalPages, setPageNumber) => {
  const validatedInput = validatePagintaionInput(
    e.target.value,
    pageNumber,
    totalPages
  );
  e.target.value = validatedInput;
  setPageNumber(validatedInput);
};

const handleSubmit = (e) => {
  e.preventDefault();
  e.target[0].blur();
};

export const Pagination = ({ handlePageNumberChange, totalPages }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const isMounted = useRef(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    inputRef.current.value = pageNumber;
    handlePageNumberChange(pageNumber);
  }, [pageNumber]);

  return (
    <>
      <StyledPaginationButton
        disabled={pageNumber === 1}
        onClick={() => setPageNumber((prev) => (prev - 1 < 1 ? 1 : prev - 1))}
      >
        <svg
          width="83"
          height="142"
          viewBox="0 0 83 142"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.28248 77.795C0.572527 74.085 0.572574 68.07 4.28258 64.36L64.7407 3.90285C68.4507 0.192901 74.4658 0.192947 78.1757 3.90296C81.8857 7.61297 81.8856 13.628 78.1756 17.338L24.4351 71.0777L78.1748 124.818C81.8847 128.528 81.8847 134.543 78.1747 138.253C74.4647 141.963 68.4496 141.963 64.7396 138.253L4.28248 77.795ZM18.9999 80.5776L11 80.5776L11.0001 61.5776L19.0001 61.5776L18.9999 80.5776Z"
            fill="black"
          />
        </svg>
      </StyledPaginationButton>
      <StyledPaginationForm onSubmit={handleSubmit}>
        <StyledInput
          type="text"
          max={totalPages}
          ref={inputRef}
          defaultValue={pageNumber}
          onBlur={(e) => handleBlur(e, pageNumber, totalPages, setPageNumber)}
        />
        / <div>{totalPages}</div>
      </StyledPaginationForm>

      <StyledPaginationButton
        data-testid="paginationNextBtn"
        disabled={pageNumber === totalPages}
        onClick={() =>
          setPageNumber((prev) =>
            prev + 1 <= totalPages ? prev + 1 : totalPages
          )
        }
      >
        <svg
          width="83"
          height="142"
          viewBox="0 0 83 142"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M78.7175 77.7174C82.4275 74.0074 82.4274 67.9923 78.7174 64.2824L18.2593 3.82522C14.5493 0.115264 8.53424 0.115311 4.82429 3.82532C1.11434 7.53533 1.11438 13.5504 4.82439 17.2603L58.5649 71L4.82523 124.741C1.11528 128.451 1.11532 134.466 4.82533 138.176C8.53534 141.886 14.5504 141.886 18.2604 138.176L78.7175 77.7174ZM64.0001 80.5L72 80.4999L71.9999 61.4999L63.9999 61.5L64.0001 80.5Z"
            fill="black"
          />
        </svg>
      </StyledPaginationButton>
    </>
  );
};
