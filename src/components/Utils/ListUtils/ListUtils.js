export const validatePagintaionInput = (value, pageNumber, totalPages) => {
  const int = parseInt(value);
  if (!int) return pageNumber;
  if (int > totalPages) return totalPages;
  if (int < 1) return pageNumber;
  return int;
};

const handleOnBlurPagination = (e, pageNumber, totalPages, setPageNumber) => {
  const {
    target: { value },
  } = e;
  const result = validatePagintaionInput(value, pageNumber, totalPages);
  e.target.value = result;
  setPageNumber(result);
};

export const Pagination = ({ pageNumber, setPageNumber, totalPages }) => {
  return (
    <>
      <button
        disabled={pageNumber === 1}
        onClick={() => setPageNumber((prev) => (prev - 1 < 1 ? 1 : prev - 1))}
      >
        Prev
      </button>
      <span>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.target[0].blur();
          }}
        >
          <input
            type="number"
            max={totalPages}
            min={1}
            defaultValue={pageNumber}
            onBlur={(e) =>
              handleOnBlurPagination(e, pageNumber, totalPages, setPageNumber)
            }
          />
        </form>
        / {totalPages}
      </span>
      <button
        data-testid="paginationNextBtn"
        disabled={pageNumber === totalPages}
        onClick={() =>
          setPageNumber((prev) =>
            prev + 1 <= totalPages ? prev + 1 : totalPages
          )
        }
      >
        Next
      </button>
    </>
  );
};
