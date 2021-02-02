import { act, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ProductList from "./ProductList";
import {
  FILTER_TYPE,
  SORT_TYPES,
} from "../../../components/constants/constants";
import { JsonFetch } from "../../../components/fetches/Fetches";
import { settings } from "../../../settings";
import { MemoryRouter, Route } from "react-router";
import { ThemeProvider } from "styled-components";
import { DEFAULT_THEME } from "../../../components/shopSettingsContext/shopSettingsContext";

jest.mock("../../../components/fetches/Fetches");

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
        <ThemeProvider theme={DEFAULT_THEME}>
          <MemoryRouter initialEntries={["/admin/products"]}>
            <Route path="/admin/products" component={() => <ProductList />} />
            <Route path="/500" component={() => <div>Server error</div>} />
          </MemoryRouter>
        </ThemeProvider>
      );
    });

    await waitFor(() =>
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument()
    );
  });

  test("get products on mount", async () => {
    expect(JsonFetch.mock.calls).toHaveLength(1);
    expect(JsonFetch.mock.calls[0][0]).toBe(
      `${settings.backendApiUrl}/api/Product?pageNumber=1&sortType=${SORT_TYPES.nameAscending}`
    );
    expect(JsonFetch.mock.calls[0][1]).toBe("GET");
    expect(JsonFetch.mock.calls[0][2]).toBe(false);
    expect(JsonFetch.mock.calls[0][3]).toBe(null);
  });

  test("make request with filters", async () => {
    JsonFetch.mockReturnValue({
      status: 200,
      json: () =>
        Promise.resolve({
          result: [
            {
              id: "1",
              name: "Asus",
              quantity: 5,
              price: 10000,
              isOnDiscount: true,
              discountPrice: 9500,
              firstImage: "Asus.jpg",
            },
          ],
          totalPages: 5,
        }),
    });

    const searchInput = screen.getByPlaceholderText("Search for a product...");
    const sortInput = screen.getByLabelText("Sort by:", { selector: "select" });
    const typeInput = screen.getByLabelText("Type of product", {
      selector: "input",
    });

    userEvent.type(
      screen.getByPlaceholderText("Search for a product..."),
      "Asus"
    );
    await waitFor(() => expect(searchInput).toHaveValue("Asus"));

    userEvent.selectOptions(sortInput, [SORT_TYPES.nameDescending].toString());
    await waitFor(() =>
      expect(sortInput).toHaveValue([SORT_TYPES.nameDescending].toString())
    );

    userEvent.type(typeInput, "Laptop");
    await waitFor(() => expect(typeInput).toHaveValue("Laptop"));

    expect(JsonFetch.mock.calls).toHaveLength(3);
    expect(JsonFetch.mock.calls[2][0]).toBe(
      `${settings.backendApiUrl}/api/Product?pageNumber=1&${FILTER_TYPE.type}=Laptop&${FILTER_TYPE.isOnDiscount}=false&sortType=${SORT_TYPES.nameDescending}&search=Asus`
    );
    expect(JsonFetch.mock.calls[2][1]).toBe("GET");
    expect(JsonFetch.mock.calls[2][2]).toBe(false);
    expect(JsonFetch.mock.calls[2][3]).toBe(null);

    expect(await screen.findByText("Asus")).toBeInTheDocument();
  });

  test("get next page pagination", async () => {
    JsonFetch.mockReturnValue({
      status: 200,
      json: () =>
        Promise.resolve({
          result: [
            {
              id: "1",
              name: "Asus",
              quantity: 5,
              price: 10000,
              isOnDiscount: true,
              discountPrice: 9500,
              firstImage: "Asus.jpg",
            },
          ],
          totalPages: 5,
        }),
    });

    userEvent.click(screen.getByTestId("paginationNextBtn"));

    expect(JsonFetch.mock.calls).toHaveLength(2);
    expect(JsonFetch.mock.calls[1][0]).toBe(
      `${settings.backendApiUrl}/api/Product?pageNumber=2&sortType=${SORT_TYPES.nameAscending}`
    );
    expect(JsonFetch.mock.calls[1][1]).toBe("GET");
    expect(JsonFetch.mock.calls[1][2]).toBe(false);
    expect(JsonFetch.mock.calls[1][3]).toBe(null);

    expect(await screen.findByText("Asus")).toBeInTheDocument();
  });

  test("handle server response (GET, 200)", async () => {
    JsonFetch.mockReturnValue({
      status: 200,
      json: () =>
        Promise.resolve({
          result: [
            {
              id: "1",
              name: "Asus",
              quantity: 5,
              price: 123,
              isOnDiscount: true,
              discountPrice: 12,
              firstImage: "Asus.jpg",
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

    const searchInput = screen.getByPlaceholderText("Search for a product...");
    userEvent.type(
      screen.getByPlaceholderText("Search for a product..."),
      "Asus"
    );
    userEvent.tab();
    await waitFor(() => expect(searchInput).toHaveValue("Asus"));

    const productContainers = await screen.findAllByRole("article");
    expect(productContainers).toHaveLength(2);

    const AsusImage = await within(productContainers[0]).findByAltText("Asus");
    expect(AsusImage.getAttribute("src")).toBe(
      `${settings.backendApiUrl}/Asus.jpg`
    );
    expect(
      await within(productContainers[0]).findByText("Asus")
    ).toBeInTheDocument();
    expect(
      await within(productContainers[0]).findByText("123")
    ).toBeInTheDocument();
    expect(
      await within(productContainers[0]).findByText("12")
    ).toBeInTheDocument();

    const hpImage = await within(productContainers[1]).findByAltText("HP");
    expect(hpImage.getAttribute("src")).toBe(
      `${settings.backendApiUrl}/imageHP.jpg`
    );
    expect(
      await within(productContainers[1]).findByText("HP")
    ).toBeInTheDocument();
    expect(
      await within(productContainers[1]).findByText("5000")
    ).toBeInTheDocument();
    expect(
      within(productContainers[1]).queryByText("4500")
    ).not.toBeInTheDocument();
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

    const productContainer = await screen.findByRole("article");
    userEvent.click(productContainer);
    expect(await screen.findByText("Back to list")).toBeInTheDocument();
  });
});
