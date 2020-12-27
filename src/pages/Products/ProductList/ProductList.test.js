import { act, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ProductList, {
  ProductIsOnDiscountFilter,
  ProductSearch,
  ProductSortSelect,
  ProductTypeFilters,
} from "./ProductList";
import { filterType, sortType } from "../../../components/constants/constants";
import { JsonFetch } from "../../../components/fetches/Fetches";
import { settings } from "../../../settings";
import { MemoryRouter, Route } from "react-router";

jest.mock("../../../components/fetches/Fetches");

describe("ProductSortSelect", () => {
  const mockedHandleChange = jest.fn();
  beforeEach(() => {
    act(() => {
      render(
        <ProductSortSelect
          handleChange={mockedHandleChange}
          defaultValue={sortType.quantityAscending}
        />
      );
    });
  });

  test("set default value", () => {
    expect(
      screen.getByLabelText("Sort by:", { selector: "select" }).value
    ).toBe(sortType.quantityAscending.toString());
  });

  test("fire handleChange on select", () => {
    const select = screen.getByLabelText("Sort by:", { selector: "select" });
    const nameDescending = sortType.nameDescending.toString();
    userEvent.selectOptions(select, nameDescending);
    expect(select.value).toBe(nameDescending);
    expect(mockedHandleChange.mock.calls).toHaveLength(1);
  });
});

describe("ProductTypeFilters", () => {
  const mockedHandleChange = jest.fn();
  beforeEach(() => {
    act(() => {
      render(
        <ProductTypeFilters
          handleChange={mockedHandleChange}
          defaultValue="test type"
        />
      );
    });
  });

  test("set default values", () => {
    expect(
      screen.getByLabelText("Type of product", { selector: "input" }).value
    ).toBe("test type");
  });

  test("fire handleChange on change", () => {
    const input = screen.getByLabelText("Type of product", {
      selector: "input",
    });
    userEvent.clear(input);
    userEvent.type(input, "Text");
    userEvent.tab();
    expect(mockedHandleChange.mock.calls[0][0].target.value).toBe("Text");
  });
});

describe("ProductIsOnDiscountFilter", () => {
  const mockedHandleChange = jest.fn();
  beforeEach(() => {
    act(() => {
      render(
        <ProductIsOnDiscountFilter
          handleChange={mockedHandleChange}
          defaultValue={true}
        />
      );
    });
  });

  test("set default values", () => {
    expect(
      screen.getByLabelText("Is on discount", { selector: "input" }).checked
    ).toBe(true);
  });

  test("fire handleChange on change", () => {
    userEvent.click(
      screen.getByLabelText("Is on discount", {
        selector: "input",
      })
    );
    expect(mockedHandleChange.mock.calls[0][0].target.checked).toBe(false);
  });
});

describe("ProductSearch", () => {
  const mockedHandleChange = jest.fn();
  beforeEach(() => {
    act(() => {
      render(
        <ProductSearch
          handleChange={mockedHandleChange}
          defaultValue="test text"
        />
      );
    });
  });

  test("set default values", () => {
    expect(screen.getByPlaceholderText("Search for a product...")).toHaveValue(
      "test text"
    );
  });

  test("fire handleChange on change", () => {
    const input = screen.getByPlaceholderText("Search for a product...");
    userEvent.clear(input);
    userEvent.type(input, "new text");
    userEvent.tab();
    expect(mockedHandleChange.mock.calls[0][0].target.value).toBe("new text");
  });
});

describe("ProductList", () => {
  beforeEach(async () => {
    JsonFetch.mockResolvedValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          result: [
            {
              id: "1",
              name: "Mackbook",
              quantity: 5,
              price: 10000,
              isOnDiscount: true,
              discountPrice: 9500,
              firstImage: "imageMacbook.jpg",
            },
          ],
          totalPages: 5,
        }),
    });

    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/products"]}>
          <Route path="/admin/products" component={() => <ProductList />} />
          <Route path="/500" component={() => <div>Server error</div>} />
        </MemoryRouter>
      );
    });

    await waitFor(() =>
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument()
    );
  });

  test("make request with correct parameters", async () => {
    JsonFetch.mockReturnValue({
      status: 200,
      json: () =>
        Promise.resolve({
          result: [
            {
              id: "1",
              name: "Mackbook",
              quantity: 5,
              price: 10000,
              isOnDiscount: true,
              discountPrice: 9500,
              firstImage: "imageMacbook.jpg",
            },
          ],
          totalPages: 5,
        }),
    });

    const buttons = screen.getAllByRole("button");

    userEvent.click(buttons[buttons.length - 1]);

    userEvent.type(
      screen.getByPlaceholderText("Search for a product..."),
      "Mackbook"
    );

    userEvent.selectOptions(
      screen.getByLabelText("Sort by:", { selector: "select" }),
      [sortType.nameDescending].toString()
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

    expect(JsonFetch.mock.calls).toHaveLength(6);
    expect(JsonFetch.mock.calls[5][0]).toBe(
      `${settings.baseURL}/api/Product?pageNumber=2&${filterType.type}=Laptop&${filterType.isOnDiscount}=true&sortType=${sortType.nameDescending}&search=Mackbook`
    );
    expect(JsonFetch.mock.calls[5][1]).toBe("GET");
    expect(JsonFetch.mock.calls[5][2]).toBe(false);
    expect(JsonFetch.mock.calls[5][3]).toBe(null);

    expect(await screen.findByText("Mackbook")).toBeInTheDocument();
  });

  test("handle server response (GET, 200)", async () => {
    JsonFetch.mockReturnValue({
      status: 200,
      json: () =>
        Promise.resolve({
          result: [
            {
              id: "1",
              name: "Mackbook",
              quantity: 5,
              price: 10000,
              isOnDiscount: true,
              discountPrice: 9500,
              firstImage: "imageMacbook.jpg",
            },
            {
              id: "2",
              name: "HP",
              quantity: 15,
              price: 5000,
              isOnDiscount: false,
              discountPrice: 4500,
              firstImage: "imageHP.jpg",
            },
          ],
          totalPages: 1,
        }),
    });

    userEvent.type(
      screen.getByPlaceholderText("Search for a product..."),
      "Mackbook"
    );
    userEvent.tab();

    const productContainers = await screen.findAllByRole("article");
    expect(await productContainers.length).toBe(2);

    const mackbookImage = await screen.findByAltText("Mackbook");
    expect(mackbookImage.getAttribute("src")).toBe(
      `${settings.baseURL}/imageMacbook.jpg`
    );
    expect(await screen.findByText("Mackbook")).toBeInTheDocument();
    expect(await screen.findByText("10000")).toBeInTheDocument();
    expect(await screen.findByText("9500")).toBeInTheDocument();

    const hpImage = await screen.findByAltText("HP");
    expect(hpImage.getAttribute("src")).toBe(`${settings.baseURL}/imageHP.jpg`);
    expect(await screen.findByText("HP")).toBeInTheDocument();
    expect(await screen.findByText("5000")).toBeInTheDocument();
    expect(screen.queryByText("4500")).not.toBeInTheDocument();
  });

  test("handle server response (GET,500)", async () => {
    JsonFetch.mockReturnValue({
      status: 500,
    });

    userEvent.type(
      screen.getByPlaceholderText("Search for a product..."),
      "Mackbook"
    );
    userEvent.tab();

    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });

  test("select product", async () => {
    JsonFetch.mockReturnValue({
      status: 200,
      json: () =>
        Promise.resolve({
          result: [
            {
              id: "1",
              name: "Mackbook",
              quantity: 5,
              price: 10000,
              isOnDiscount: true,
              discountPrice: 9500,
              firstImage: "imageMacbook.jpg",
            },
          ],
          totalPages: 1,
        }),
    });

    userEvent.type(
      screen.getByPlaceholderText("Search for a product..."),
      "Mackbook"
    );
    userEvent.tab();
    const productContainer = await screen.findByRole("article");
    userEvent.click(productContainer.firstChild);
    expect(await screen.findByText("Back to list")).toBeInTheDocument();
  });
});
