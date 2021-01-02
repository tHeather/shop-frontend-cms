import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Pagination, validatePagintaionInput } from "./ListUtils";

describe.each([
  [3, 3],
  ["3", 3],
  ["", 1],
  [",", 1],
  [0, 1],
  [10, 5],
  ["a", 1],
])("validatePagintaionInput", (value, expected) => {
  test(`returns correct result  for input: ${value}`, () => {
    expect(validatePagintaionInput(value, 1, 5)).toBe(expected);
  });
});

test("Pagination: render component correctly", () => {
  act(() => {
    render(
      <Pagination pageNumber={1} setPageNumber={jest.fn()} totalPages={5} />
    );
  });
  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(2);
  expect(buttons[0]).toBeDisabled();
  expect(buttons[1]).not.toBeDisabled();
  expect(screen.getByRole("spinbutton")).toHaveValue(1);
  expect(screen.getByText("/ 5")).toBeInTheDocument();
});
