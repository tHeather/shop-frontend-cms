import { act, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import EditProduct from "./EditProduct";
import { JsonFetch } from "../../../components/fetches/Fetches";
import { MemoryRouter, Route } from "react-router";
import { ThemeProvider } from "styled-components";
import { DEFAULT_THEME } from "../../../components/shopSettingsContext/shopSettingsContext";

jest.mock("../../../components/fetches/Fetches");

describe("EditPorduct: Handle server response (DELETE)", () => {
  const mockedsetSelectedProductId = jest.fn();

  beforeEach(async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 200,
        json: () =>
          Promise.resolve({
            id: 123,
            name: "Mackbook",
            type: "Laptop",
            description: "Description of mackbook.",
            manufacturer: "Apple",
            quantity: 123,
            price: 12345,
            isOnDiscount: true,
            discountPrice: 11950,
            firstImage: "image1.jpg",
            secondImage: "image2.jpg",
            thirdImage: "image3.jpg",
          }),
      };
    });

    act(() => {
      render(
        <ThemeProvider theme={DEFAULT_THEME}>
          <MemoryRouter initialEntries={["/admin/products"]}>
            <Route
              exact
              path="/admin/products"
              component={() => {
                return (
                  <EditProduct
                    productId="123"
                    setSelectedProductId={mockedsetSelectedProductId}
                  />
                );
              }}
            />
            <Route
              exact
              path="/500"
              component={() => <div>Server error</div>}
            />
            <Route exact path="/" component={() => <div>Login page</div>} />
          </MemoryRouter>
        </ThemeProvider>
      );
    });

    await waitFor(async () => {
      expect(
        await screen.findByLabelText("Product name", {
          selector: "input",
        })
      ).toBeInTheDocument();
    });
  });

  test("status 204", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 204,
      };
    });

    userEvent.click(await screen.findByText("Delete product"));

    expect(
      await screen.findByText("Product successfully deleted.")
    ).toBeInTheDocument();

    userEvent.click(await screen.findByText("Back to list"));
    expect(mockedsetSelectedProductId.mock.calls.length).toBe(1);
    expect(mockedsetSelectedProductId.mock.calls[0][0]).toBe(null);
  });

  test("status 401", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 401,
      };
    });

    userEvent.click(await screen.findByText("Delete product"));

    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  test("status 403", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 403,
      };
    });

    userEvent.click(await screen.findByText("Delete product"));

    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  test("status 500", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 500,
      };
    });

    userEvent.click(await screen.findByText("Delete product"));

    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });
});
