import { act, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import {
  DisplayItemList,
  Pagination,
  validatePagintaionInput,
} from "./ListUtils";

describe("DisplayItemList", () => {
  test("empty array list", () => {
    act(() => {
      render(<DisplayItemList items={[]} />);
    });

    expect(
      screen.getByText("There are no item that meet your criteria.")
    ).toBeInTheDocument();
  });

  test("incorrect type of list", () => {
    expect(DisplayItemList({})).toBe(null);
  });

  test("render component correctly", () => {
    act(() => {
      render(
        <DisplayItemList
          items={[
            {
              id: "1",
              name: "Mackbook",
              price: 10000,
            },
            {
              id: "2",
              name: "HP",
              price: 5000,
            },
          ]}
          ItemTemplate={({ name, price }) => (
            <article>
              <span>{name}</span>
              <span>{price}</span>
            </article>
          )}
        />
      );
    });

    const productContainers = screen.getAllByRole("article");
    expect(productContainers).toHaveLength(2);
    expect(
      within(productContainers[0]).getByText("Mackbook")
    ).toBeInTheDocument();
    expect(within(productContainers[0]).getByText("10000")).toBeInTheDocument();
    expect(within(productContainers[1]).getByText("HP")).toBeInTheDocument();
    expect(within(productContainers[1]).getByText("5000")).toBeInTheDocument();
  });
});

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
