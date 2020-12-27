import { act, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route } from "react-router";
import SaveProduct from "./SaveProduct";
import { JsonFetch, FormDataFetch } from "../../../components/fetches/Fetches";
import { settings } from "../../../settings";

const file1 = new File(["test1"], "test1.png", { type: "image/png" });
const file2 = new File(["test2"], "test2.png", { type: "image/png" });
const file3 = new File(["test3"], "test3.png", { type: "image/png" });

const FillForm = () => {
  userEvent.type(
    screen.getByLabelText("Product name", { selector: "input" }),
    "Mackbook"
  );
  userEvent.type(
    screen.getByLabelText("Type of product", { selector: "input" }),
    "Laptop"
  );
  userEvent.type(
    screen.getByLabelText("Manufacturer", { selector: "input" }),
    "Apple"
  );
  userEvent.type(screen.getByLabelText("Quantity", { selector: "input" }), "3");
  userEvent.type(screen.getByLabelText("Price", { selector: "input" }), "2");
  userEvent.type(
    screen.getByLabelText("Product description", { selector: "textarea" }),
    "Description"
  );
  userEvent.click(
    screen.getByLabelText("Is on discount", { selector: "input" })
  );
  userEvent.type(
    screen.getByLabelText("Discount price", { selector: "input" }),
    "1"
  );
  userEvent.upload(
    screen.getByLabelText("First image of product, which is also thumbnail.", {
      selector: "input",
    }),
    file1
  );
  userEvent.upload(
    screen.getByLabelText("Second image of product.", { selector: "input" }),
    file2
  );
  userEvent.upload(
    screen.getByLabelText("Third image of product.", { selector: "input" }),
    file3
  );
};

jest.mock("../../../components/fetches/Fetches");

describe("Save product", () => {
  beforeEach(() => {
    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/add-product"]}>
          <Route exact path="/admin/add-product">
            <SaveProduct />
          </Route>
          <Route exact path="/500">
            <div>Server error</div>
          </Route>
          <Route exact path="/">
            <div>Login page</div>
          </Route>
        </MemoryRouter>
      );
    });
  });

  test("Do not fetch product after component mount", () => {
    JsonFetch.mockImplementation();
    expect(JsonFetch.mock.calls).toHaveLength(0);
  });

  describe.each([
    ["name", "text", "Product name", "input"],
    ["type", "text", "Type of product", "input"],
    ["manufacturer", "text", "Manufacturer", "input"],
    ["quantity", "number", "Quantity", "input"],
    ["price", "number", "Price", "input"],
    ["description", "textarea", "Product description", "textarea"],
    ["isOnDiscount", "checkbox", "Is on discount", "input"],
    ["discountPrice", "number", "Discount price", "input"],
    [
      "firstImage",
      "file",
      "First image of product, which is also thumbnail.",
      "input",
    ],
    ["secondImage", "file", "Second image of product.", "input"],
    ["thirdImage", "file", "Third image of product.", "input"],
  ])("render %s field in form", (name, type, label, selector) => {
    test(`render ${name} field`, () => {
      const form = screen.getByTestId("saveProductForm");
      const field = within(form).getByLabelText(label, { selector });
      expect(field.getAttribute("name")).toBe(name);
      if (selector === "textarea") return;
      expect(field.getAttribute("type")).toBe(type);
    });
  });

  test("make request with correct parameters (POST)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 201,
    });

    FillForm();

    userEvent.click(screen.getByText("Save"));

    await waitFor(async () =>
      expect(
        await screen.findByText("Product data successfully saved.")
      ).toBeInTheDocument()
    );

    expect(FormDataFetch.mock.calls).toHaveLength(1);
    expect(FormDataFetch.mock.calls[0][0]).toBe(
      `${settings.baseURL}/api/Product`
    );
    expect(FormDataFetch.mock.calls[0][1]).toBe("POST");
    expect(Object.fromEntries(FormDataFetch.mock.calls[0][2])).toEqual({
      name: "Mackbook",
      type: "Laptop",
      manufacturer: "Apple",
      quantity: "3",
      price: "2",
      description: "Description",
      isOnDiscount: "true",
      firstImage: file1,
      secondImage: file2,
      thirdImage: file2,
      discountPrice: "1",
    });
  });

  test("handle server response (POST, 201)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 201,
    });

    FillForm();

    userEvent.click(screen.getByText("Save"));

    await waitFor(async () =>
      expect(
        await screen.findByText("Product data successfully saved.")
      ).toBeInTheDocument()
    );

    userEvent.click(await screen.findByText("OK"));

    const form = await screen.findByTestId("saveProductForm");
    expect(form).toHaveFormValues({
      name: "",
      type: "",
      manufacturer: "",
      quantity: null,
      price: null,
      description: "",
      isOnDiscount: false,
      discountPrice: null,
      firstImage: "",
      secondImage: "",
      thirdImage: "",
    });
  });

  test("handle server response (POST, 400)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 400,
      json: () => Promise.resolve({ errors: ["status 400"] }),
    });

    FillForm();

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("status 400")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("closeErrorBtn"));

    const form = await screen.findByTestId("saveProductForm");
    expect(form).toHaveFormValues({
      name: "Mackbook",
      type: "Laptop",
      manufacturer: "Apple",
      quantity: 3,
      price: 2,
      description: "Description",
      isOnDiscount: true,
      discountPrice: 1,
      firstImage: "",
      secondImage: "",
      thirdImage: "",
    });
  });

  test("handle server response (POST, 401)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 401,
    });

    FillForm();

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.queryByTestId("saveProductForm")).not.toBeInTheDocument();
  });

  test("handle server response (POST, 403)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 403,
    });

    FillForm();

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.queryByTestId("saveProductForm")).not.toBeInTheDocument();
  });

  test("handle server response (POST, 500)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 500,
    });

    FillForm();

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Server error")).toBeInTheDocument();
    expect(screen.queryByTestId("saveProductForm")).not.toBeInTheDocument();
  });
});

describe("Get product", () => {
  test("make request with correct parametrs (GET)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          id: 123,
          name: "Mackbook",
          type: "Laptop",
          manufacturer: "Apple",
          quantity: 3,
          price: 2,
          description: "Description",
          isOnDiscount: true,
          discountPrice: 1,
          firstImage: "firstImage.png",
          secondImage: "secondImage.png",
          thirdImage: "thirdImage.png",
        }),
    });
    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/add-product"]}>
          <Route exact path="/admin/add-product">
            <SaveProduct productId="123" />
          </Route>
          <Route exact path="/500">
            <div>Server error</div>
          </Route>
          <Route exact path="/">
            <div>Login page</div>
          </Route>
        </MemoryRouter>
      );
    });
    await waitFor(() =>
      expect(screen.queryByTestId("saveProductForm")).toBeInTheDocument()
    );
    expect(JsonFetch.mock.calls).toHaveLength(1);
    expect(JsonFetch.mock.calls[0][0]).toBe(
      `${settings.baseURL}/api/Product/123`
    );
    expect(JsonFetch.mock.calls[0][1]).toBe("GET");
    expect(JsonFetch.mock.calls[0][2]).toBe(false);
    expect(JsonFetch.mock.calls[0][3]).toBe(null);
  });

  test("handle server response (GET,200)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          id: 123,
          name: "Mackbook",
          type: "Laptop",
          manufacturer: "Apple",
          quantity: 3,
          price: 2,
          description: "Description",
          isOnDiscount: true,
          discountPrice: 1,
          firstImage: "firstImage.png",
          secondImage: "secondImage.png",
          thirdImage: "thirdImage.png",
        }),
    });
    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/add-product"]}>
          <Route exact path="/admin/add-product">
            <SaveProduct productId="123" />
          </Route>
          <Route exact path="/500">
            <div>Server error</div>
          </Route>
          <Route exact path="/">
            <div>Login page</div>
          </Route>
        </MemoryRouter>
      );
    });

    const form = await screen.findByTestId("saveProductForm");
    expect(form).toHaveFormValues({
      name: "Mackbook",
      type: "Laptop",
      manufacturer: "Apple",
      quantity: 3,
      price: 2,
      description: "Description",
      isOnDiscount: true,
      discountPrice: 1,
      firstImage: "",
      secondImage: "",
      thirdImage: "",
    });
  });

  test("handle server response (GET,404)", async () => {
    const mockedSetSelectedProductId = jest.fn();
    JsonFetch.mockReturnValueOnce({
      status: 404,
    });
    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/add-product"]}>
          <Route exact path="/admin/products">
            <div>Product list</div>
          </Route>
          <Route exact path="/admin/add-product">
            <SaveProduct
              productId="123"
              setSelectedProductId={mockedSetSelectedProductId}
            />
          </Route>
          <Route exact path="/500">
            <div>Server error</div>
          </Route>
          <Route exact path="/">
            <div>Login page</div>
          </Route>
        </MemoryRouter>
      );
    });
    expect(await screen.findByText("Product not found.")).toBeInTheDocument();
    userEvent.click(screen.getByText("Back to list"));
    expect(mockedSetSelectedProductId.mock.calls).toHaveLength(1);
    expect(mockedSetSelectedProductId.mock.calls[0][0]).toBe(null);
  });

  test("handle server response (GET,500)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 500,
    });
    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/add-product"]}>
          <Route exact path="/admin/add-product">
            <SaveProduct productId="123" />
          </Route>
          <Route exact path="/500">
            <div>Server error</div>
          </Route>
          <Route exact path="/">
            <div>Login page</div>
          </Route>
        </MemoryRouter>
      );
    });
    expect(await screen.findByText("Server error")).toBeInTheDocument();
    expect(screen.queryByTestId("saveProductForm")).not.toBeInTheDocument();
  });
});

describe("Update product", () => {
  const mockedSetSelectedProductId = jest.fn();
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          id: 123,
          name: "Mackbook",
          type: "Laptop",
          manufacturer: "Apple",
          quantity: 3,
          price: 2,
          description: "Description",
          isOnDiscount: true,
          discountPrice: 1,
          firstImage: "firstImage.png",
          secondImage: "secondImage.png",
          thirdImage: "thirdImage.png",
        }),
    });
    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/add-product"]}>
          <Route exact path="/admin/add-product">
            <SaveProduct
              productId="123"
              setSelectedProductId={mockedSetSelectedProductId}
            />
          </Route>
          <Route exact path="/admin/products">
            <div>Product list</div>
          </Route>
          <Route exact path="/500">
            <div>Server error</div>
          </Route>
          <Route exact path="/">
            <div>Login page</div>
          </Route>
        </MemoryRouter>
      );
    });
    await waitFor(() =>
      expect(screen.queryByTestId("saveProductForm")).toBeInTheDocument()
    );
  });

  test("make request with correct parameters (PUT)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          id: 123,
          name: "Mackbook",
          type: "Laptop",
          manufacturer: "Apple",
          quantity: 3,
          price: 2,
          description: "Description",
          isOnDiscount: true,
          discountPrice: 1,
          firstImage: "firstImage.png",
          secondImage: "secondImage.png",
          thirdImage: "thirdImage.png",
        }),
    });

    const nameInput = screen.getByLabelText("Product name", {
      selector: "input",
    });
    userEvent.clear(nameInput);
    userEvent.type(nameInput, "Mackbook Pro");

    userEvent.click(screen.getByText("Save"));

    expect(
      await screen.findByText("Product data successfully saved.")
    ).toBeInTheDocument();

    expect(FormDataFetch.mock.calls).toHaveLength(1);
    expect(FormDataFetch.mock.calls[0][0]).toBe(
      `${settings.baseURL}/api/Product/123`
    );
    expect(FormDataFetch.mock.calls[0][1]).toBe("PUT");
    expect(Object.fromEntries(FormDataFetch.mock.calls[0][2])).toEqual({
      name: "Mackbook Pro",
      type: "Laptop",
      manufacturer: "Apple",
      quantity: "3",
      price: "2",
      description: "Description",
      isOnDiscount: "true",
      discountPrice: "1",
      firstImage: "",
      secondImage: "",
      thirdImage: "",
    });
  });

  test("handle server response (PUT, 204)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          id: 123,
          name: "Mackbook",
          type: "Laptop",
          manufacturer: "Apple",
          quantity: 3,
          price: 2,
          description: "Description",
          isOnDiscount: true,
          discountPrice: 1,
          firstImage: "firstImage.png",
          secondImage: "secondImage.png",
          thirdImage: "thirdImage.png",
        }),
    });

    const nameInput = screen.getByLabelText("Product name", {
      selector: "input",
    });
    userEvent.clear(nameInput);
    userEvent.type(nameInput, "Mackbook Pro");
    userEvent.click(screen.getByText("Save"));

    await waitFor(async () =>
      expect(
        await screen.findByText("Product data successfully saved.")
      ).toBeInTheDocument()
    );
    userEvent.click(screen.getByText("OK"));

    const form = await screen.findByTestId("saveProductForm");
    expect(form).toHaveFormValues({
      name: "Mackbook Pro",
      type: "Laptop",
      manufacturer: "Apple",
      quantity: 3,
      price: 2,
      description: "Description",
      isOnDiscount: true,
      discountPrice: 1,
      firstImage: "",
      secondImage: "",
      thirdImage: "",
    });
  });

  test("handle server response (PUT,404)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 404,
    });

    userEvent.click(screen.getByText("Save"));
    expect(await screen.findByText("Product not found.")).toBeInTheDocument();
    userEvent.click(screen.getByText("Back to list"));
    expect(mockedSetSelectedProductId.mock.calls).toHaveLength(1);
    expect(mockedSetSelectedProductId.mock.calls[0][0]).toBe(null);
  });

  test("handle server response (PUT, 400)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 400,
      json: () => Promise.resolve({ errors: ["status 400"] }),
    });

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("status 400")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("closeErrorBtn"));

    const form = await screen.findByTestId("saveProductForm");
    expect(form).toHaveFormValues({
      name: "Mackbook",
      type: "Laptop",
      manufacturer: "Apple",
      quantity: 3,
      price: 2,
      description: "Description",
      isOnDiscount: true,
      discountPrice: 1,
      firstImage: "",
      secondImage: "",
      thirdImage: "",
    });
  });

  test("handle server response (PUT, 401)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 401,
    });

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.queryByTestId("saveProductForm")).not.toBeInTheDocument();
  });

  test("handle server response (PUT, 403)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 403,
    });

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.queryByTestId("saveProductForm")).not.toBeInTheDocument();
  });

  test("handle server response (PUT, 500)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 500,
    });

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Server error")).toBeInTheDocument();
    expect(screen.queryByTestId("saveProductForm")).not.toBeInTheDocument();
  });
});

describe("delete image", () => {
  const mockedSetSelectedProductId = jest.fn();
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          id: 123,
          name: "Mackbook",
          type: "Laptop",
          manufacturer: "Apple",
          quantity: 3,
          price: 2,
          description: "Description",
          isOnDiscount: true,
          discountPrice: 1,
          firstImage: "firstImage.png",
          secondImage: "secondImage.png",
          thirdImage: "thirdImage.png",
        }),
    });
    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/add-product"]}>
          <Route exact path="/admin/add-product">
            <SaveProduct
              productId="123"
              setSelectedProductId={mockedSetSelectedProductId}
            />
          </Route>
          <Route exact path="/admin/products">
            <div>Product list</div>
          </Route>
          <Route exact path="/500">
            <div>Server error</div>
          </Route>
          <Route exact path="/">
            <div>Login page</div>
          </Route>
        </MemoryRouter>
      );
    });
    await waitFor(() =>
      expect(screen.queryByTestId("saveProductForm")).toBeInTheDocument()
    );
  });

  test("make request with correct parameters (DELETE)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 204,
    });

    userEvent.click(screen.getByTestId("deleteFirstImageBtn"));

    expect(
      await screen.findByText("Image successfully deleted.")
    ).toBeInTheDocument();

    expect(JsonFetch.mock.calls).toHaveLength(2);
    expect(JsonFetch.mock.calls[1][0]).toBe(
      `${settings.baseURL}/api/Product/123/images/firstImage.png`
    );
    expect(JsonFetch.mock.calls[1][1]).toBe("DELETE");
    expect(JsonFetch.mock.calls[1][2]).toBe(true);
    expect(JsonFetch.mock.calls[1][3]).toBe(null);
  });

  test("handle server response (DELETE, 204)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 204,
    });

    expect(screen.getAllByRole("img")[0].getAttribute("src")).toBe(
      `${settings.baseURL}/firstImage.png`
    );

    expect(screen.getAllByRole("img")[1].getAttribute("src")).toBe(
      `${settings.baseURL}/secondImage.png`
    );

    expect(screen.getAllByRole("img")[2].getAttribute("src")).toBe(
      `${settings.baseURL}/thirdImage.png`
    );

    userEvent.click(screen.getByTestId("deleteFirstImageBtn"));

    expect(
      await screen.findByText("Image successfully deleted.")
    ).toBeInTheDocument();

    userEvent.click(screen.getByText("OK"));

    expect(screen.getAllByRole("img")[0].getAttribute("src")).toBe(
      "imagePlaceholder.png"
    );

    expect(screen.getAllByRole("img")[1].getAttribute("src")).toBe(
      `${settings.baseURL}/secondImage.png`
    );

    expect(screen.getAllByRole("img")[2].getAttribute("src")).toBe(
      `${settings.baseURL}/thirdImage.png`
    );
  });

  test("handle server response (DELETE, 404)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 404,
    });

    expect(screen.getAllByRole("img")[0].getAttribute("src")).toBe(
      `${settings.baseURL}/firstImage.png`
    );

    expect(screen.getAllByRole("img")[1].getAttribute("src")).toBe(
      `${settings.baseURL}/secondImage.png`
    );

    expect(screen.getAllByRole("img")[2].getAttribute("src")).toBe(
      `${settings.baseURL}/thirdImage.png`
    );

    userEvent.click(screen.getByTestId("deleteFirstImageBtn"));

    expect(await screen.findByText("Image not found.")).toBeInTheDocument();

    userEvent.click(screen.getByText("OK"));

    expect(screen.getAllByRole("img")[0].getAttribute("src")).toBe(
      "imagePlaceholder.png"
    );

    expect(screen.getAllByRole("img")[1].getAttribute("src")).toBe(
      `${settings.baseURL}/secondImage.png`
    );

    expect(screen.getAllByRole("img")[2].getAttribute("src")).toBe(
      `${settings.baseURL}/thirdImage.png`
    );
  });

  test("handle server response (PUT, 401)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 401,
    });

    userEvent.click(screen.getByTestId("deleteFirstImageBtn"));

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.queryByTestId("saveProductForm")).not.toBeInTheDocument();
  });

  test("handle server response (PUT, 403)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 403,
    });

    userEvent.click(screen.getByTestId("deleteFirstImageBtn"));

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.queryByTestId("saveProductForm")).not.toBeInTheDocument();
  });

  test("handle server response (PUT, 500)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 500,
    });

    userEvent.click(screen.getByTestId("deleteFirstImageBtn"));

    expect(await screen.findByText("Server error")).toBeInTheDocument();
    expect(screen.queryByTestId("saveProductForm")).not.toBeInTheDocument();
  });
});
