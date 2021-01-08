import { act, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import EditProduct from "./EditProduct";
import { JsonFetch } from "../../../components/fetches/Fetches";
import { settings } from "../../../settings";
import { MemoryRouter, Route } from "react-router";

jest.mock("../../../components/fetches/Fetches");

test("EditProduct: render component correctly", async () => {
  JsonFetch.mockReturnValueOnce({
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
  });

  const mockedsetSelectedProductId = jest.fn();

  act(() => {
    render(
      <EditProduct
        productId="123"
        setSelectedProductId={mockedsetSelectedProductId}
      />
    );
  });

  expect(JsonFetch.mock.calls.length).toBe(1);

  expect(await screen.findByText("Delete product")).toBeInTheDocument();
  expect(
    await screen.findByLabelText("Product name", { selector: "input" })
  ).toBeInTheDocument();
  expect(
    screen.getByLabelText("First image of product, which is also thumbnail.", {
      selector: "input",
    })
  ).toBeInTheDocument();
});

test("EditProduct: make GET request with correct parameters", async () => {
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

  const mockedsetSelectedProductId = jest.fn();

  act(() => {
    render(
      <EditProduct
        productId="123"
        setSelectedProductId={mockedsetSelectedProductId}
      />
    );
  });

  expect(JsonFetch.mock.calls.length).toBe(1);
  expect(JsonFetch.mock.calls[0][0]).toBe(
    `${settings.backendApiUrl}/api/Product/123`
  );
  expect(JsonFetch.mock.calls[0][1]).toBe("GET");
  expect(JsonFetch.mock.calls[0][2]).toBe(false);
  expect(JsonFetch.mock.calls[0][3]).toBe(null);

  await waitFor(async () => {
    expect(
      await screen.findByLabelText("Product name", {
        selector: "input",
      })
    ).toBeInTheDocument();
  });
});

test("EditProduct: handle server response (GET,status 200)", async () => {
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

  const mockedsetSelectedProductId = jest.fn();

  act(() => {
    render(
      <EditProduct
        productId="123"
        setSelectedProductId={mockedsetSelectedProductId}
      />
    );
  });

  const nameInput = await screen.findByLabelText("Product name", {
    selector: "input",
  });
  expect(nameInput.value).toBe("Mackbook");

  const firstImage = await screen.findAllByRole("img");
  expect(firstImage[0].getAttribute("src")).toBe(
    `${settings.backendApiUrl}/image1.jpg`
  );
});

test("EditProduct: handle server response (GET,status 404)", async () => {
  JsonFetch.mockImplementation(() => {
    return {
      status: 404,
    };
  });

  const mockedsetSelectedProductId = jest.fn();

  act(() => {
    render(
      <EditProduct
        productId="123"
        setSelectedProductId={mockedsetSelectedProductId}
      />
    );
  });

  expect(await screen.findByText("Product not found.")).toBeInTheDocument();

  userEvent.click(await screen.findByText("Back to list"));
  expect(mockedsetSelectedProductId.mock.calls.length).toBe(1);
  expect(mockedsetSelectedProductId.mock.calls[0][0]).toBe(null);
});

test("EditProduct: handle server response (GET,status 500)", async () => {
  JsonFetch.mockImplementation(() => {
    return {
      status: 500,
    };
  });

  const mockedsetSelectedProductId = jest.fn();

  act(() => {
    render(
      <MemoryRouter>
        <Route
          exact
          to="/admin/products"
          component={() => {
            return (
              <EditProduct
                productId="123"
                setSelectedProductId={mockedsetSelectedProductId}
              />
            );
          }}
        />
        <Route exact to="/500" component={() => <div>Server error</div>} />
      </MemoryRouter>
    );
  });

  expect(await screen.findByText("Server error")).toBeInTheDocument();
});

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
          <Route exact path="/500" component={() => <div>Server error</div>} />
          <Route exact path="/" component={() => <div>Login page</div>} />
        </MemoryRouter>
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
