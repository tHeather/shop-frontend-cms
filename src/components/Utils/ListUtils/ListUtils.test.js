import { act, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DisplayItemList } from "./ListUtils";

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
