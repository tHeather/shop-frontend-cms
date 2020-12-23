import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ProductList, { AdminSortSelect, AdminFilters } from "./ProductList";
import {
  filterType,
  sortType,
} from "../../../../components/constants/constants";
import { JsonFetch } from "../../../../components/fetches/Fetches";
import { settings } from "../../../../settings";
import { MemoryRouter, Route } from "react-router";

jest.mock("../../../../components/fetches/Fetches");

describe("AdminSortSelect", () => {
  const mockedHandleChange = jest.fn();
  beforeEach(() => {
    act(() => {
      render(
        <AdminSortSelect
          handleChange={mockedHandleChange}
          defaultValue={sortType.quantityAscending}
        />
      );
    });
  });

  test("set default value", () => {
    expect(
      screen.getByLabelText("Sort by:", { selector: "select" }).value
    ).toBe(sortType.quantityAscending);
  });

  test("fire handleChange on select", () => {
    const select = screen.getByLabelText("Sort by:", { selector: "select" });
    userEvent.selectOptions(select, [sortType.nameDescending]);
    expect(select.value).toBe(sortType.nameDescending);
    expect(mockedHandleChange.mock.calls.length).toBe(1);
  });
});

describe("AdminFilters", () => {
  const mockedHandleChange = jest.fn();
  beforeEach(() => {
    act(() => {
      render(
        <AdminFilters
          handleChange={mockedHandleChange}
          defaultValue={{
            [filterType.type]: "test type",
            [filterType.isOnDiscount]: true,
          }}
        />
      );
    });
  });

  test("set default values", () => {
    expect(
      screen.getByLabelText("Type of product", { selector: "input" }).value
    ).toBe("test type");
    expect(
      screen.getByLabelText("Is on discount", { selector: "input" }).checked
    ).toBe(true);
  });

  test("fire handleChange on change", () => {
    const input = screen.getByLabelText("Type of product", {
      selector: "input",
    });
    userEvent.clear(input);
    userEvent.type(input, "Text");
    expect(mockedHandleChange.mock.calls[0][0].target.value).toBe("Text");

    const checkbox = screen.getByLabelText("Is on discount", {
      selector: "input",
    });
    userEvent.click(checkbox);
    expect(mockedHandleChange.mock.calls[1][0].target.checked).toBe(false);
  });
});

describe("ProductList", () => {
  beforeEach(() => {
    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/products"]}>
          <Route path="/admin/products" component={() => <ProductList />} />
          <Route path="/500" component={() => <div>Server error</div>} />
        </MemoryRouter>
      );
    });

    userEvent.type(
      screen.getByPlaceholderText("Search for a product..."),
      "Mackbook"
    );

    userEvent.selectOptions(
      screen.getByLabelText("Sort by:", { selector: "select" }),
      [sortType.nameDescending]
    );

    userEvent.type(
      screen.getByLabelText("Type of product", { selector: "input" }),
      "Laptop"
    );
    userEvent.click(
      screen.getByLabelText("Is on discount", {
        selector: "input",
      })
    );
  });

  test("make request with correct parameters", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 200,
        json: () =>
          Promise.resolve([
            {
              id: "1",
              name: "Mackbook",
              quantity: 5,
              price: 10000,
              isOnDiscount: true,
              discountPrice: 9500,
              mainImage: "imageMacbook.jpg",
            },
          ]),
      };
    });

    userEvent.click(screen.getByRole("button"));

    expect(JsonFetch.mock.calls.length).toBe(1);
    expect(JsonFetch.mock.calls[0][0]).toBe(
      `${settings.baseURL}/product?${filterType.type}=Laptop&${filterType.isOnDiscount}=true&sortBy=${sortType.nameDescending}&search=Mackbook`
    );
    expect(JsonFetch.mock.calls[0][1]).toBe("GET");
    expect(JsonFetch.mock.calls[0][2]).toBe(false);
    expect(JsonFetch.mock.calls[0][3]).toBe(null);

    expect(await screen.findByText("Mackbook")).toBeInTheDocument();
  });

  test("handle server response (status 200)", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 200,
        json: () =>
          Promise.resolve([
            {
              id: "1",
              name: "Mackbook",
              quantity: 5,
              price: 10000,
              isOnDiscount: true,
              discountPrice: 9500,
              mainImage: "imageMacbook.jpg",
            },
            {
              id: "2",
              name: "HP",
              quantity: 15,
              price: 5000,
              isOnDiscount: false,
              discountPrice: 4500,
              mainImage: "imageHP.jpg",
            },
          ]),
      };
    });

    userEvent.click(screen.getByRole("button"));

    const productContainers = await screen.findAllByRole("article");
    expect(await productContainers.length).toBe(2);

    const mackbookImage = await screen.findByAltText("Mackbook");
    expect(mackbookImage.getAttribute("src")).toBe("imageMacbook.jpg");
    expect(await screen.findByText("Mackbook")).toBeInTheDocument();
    expect(await screen.findByText("10000")).toBeInTheDocument();
    expect(await screen.findByText("9500")).toBeInTheDocument();

    const hpImage = await screen.findByAltText("HP");
    expect(hpImage.getAttribute("src")).toBe("imageHP.jpg");
    expect(await screen.findByText("HP")).toBeInTheDocument();
    expect(await screen.findByText("5000")).toBeInTheDocument();
    expect(screen.queryByText("4500")).not.toBeInTheDocument();
  });

  test("handle server response (status 500)", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 500,
      };
    });

    userEvent.click(screen.getByRole("button"));

    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });

  test("select product", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 200,
        json: () =>
          Promise.resolve([
            {
              id: "1",
              name: "Mackbook",
              quantity: 5,
              price: 10000,
              isOnDiscount: true,
              discountPrice: 9500,
              mainImage: "imageMacbook.jpg",
            },
          ]),
      };
    });

    userEvent.click(screen.getByRole("button"));
    const productContainer = await screen.findByRole("article");
    userEvent.click(productContainer.firstChild);
    expect(await screen.findByText("Back to list")).toBeInTheDocument();
  });
});
