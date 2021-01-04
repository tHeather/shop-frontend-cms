import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import SaveCategory, {
  addTypeToCategory,
  removeTypeFromCategory,
  SelectType,
  TypeList,
} from "./SaveCategory";
import { JsonFetch } from "../../../components/fetches/Fetches";
import { settings } from "../../../settings";
import { MemoryRouter, Route } from "react-router";
jest.mock("../../../components/fetches/Fetches");

test("addTypeToCategory", () => {
  const mockedSetCategoryTypes = jest.fn((fun) => fun(new Set()));
  const expectResult = new Set().add("Laptop");

  addTypeToCategory("Laptop", mockedSetCategoryTypes);

  expect(mockedSetCategoryTypes.mock.results[0].value).toEqual(expectResult);
});

test("removeTypeFromCategory", () => {
  const initSet = new Set().add("Laptop").add("Speaker");
  const expectResult = new Set().add("Speaker");
  const mockedSetCategoryTypes = jest.fn((fun) => fun(initSet));

  removeTypeFromCategory("Laptop", mockedSetCategoryTypes);

  expect(mockedSetCategoryTypes.mock.results[0].value).toEqual(expectResult);
});

describe("SelectType", () => {
  test("render component correctly (with types)", () => {
    const mockedSetSelectedValue = jest.fn();
    act(() => {
      render(
        <SelectType
          types={["Laptop", "Speaker", "keyboard"]}
          setSelectedType={mockedSetSelectedValue}
        />
      );
    });

    expect(screen.getByText("Type")).toBeInTheDocument();
  });

  test("render component correctly (with empty array)", () => {
    const mockedSetSelectedValue = jest.fn();
    act(() => {
      render(
        <SelectType types={[]} setSelectedType={mockedSetSelectedValue} />
      );
    });

    expect(
      screen.getByText(
        "First you need to add some products to be able to divide their types into categories."
      )
    ).toBeInTheDocument();
  });

  test("handle selection of option", () => {
    const mockedSetSelectedValue = jest.fn();
    act(() => {
      render(
        <SelectType
          types={["Laptop", "Speaker", "keyboard"]}
          setSelectedType={mockedSetSelectedValue}
        />
      );
    });

    userEvent.selectOptions(
      screen.getByLabelText("Type", { selector: "select" }),
      "Speaker"
    );
    expect(mockedSetSelectedValue.mock.calls.length).toBe(1);
    expect(mockedSetSelectedValue.mock.calls[0][0]).toBe("Speaker");
  });
});

describe("TypeList", () => {
  test("render component correctly (with empty set)", () => {
    const mockedremoveTypeFromCategory = jest.fn();
    const mockedsetCategoryTypes = jest.fn();
    act(() => {
      render(
        <TypeList
          categoryTypes={new Set()}
          setCategoryTypes={mockedsetCategoryTypes}
          removeTypeFromCategory={mockedremoveTypeFromCategory}
        />
      );
    });

    expect(screen.getByText("No types here yet.")).toBeInTheDocument();
  });

  test("render component correctly (with types)", () => {
    const mockedremoveTypeFromCategory = jest.fn();
    const initSet = new Set().add("Laptop").add("Speaker");
    const mockedsetCategoryTypes = jest.fn();

    act(() => {
      render(
        <TypeList
          categoryTypes={initSet}
          setCategoryTypes={mockedsetCategoryTypes}
          removeTypeFromCategory={mockedremoveTypeFromCategory}
        />
      );
    });

    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Speaker")).toBeInTheDocument();
  });

  test("handle removing type", async () => {
    const initSet = new Set().add("Laptop").add("Speaker");
    const mockedsetCategoryTypes = jest.fn();
    const mockedremoveTypeFromCategory = jest.fn();

    act(() => {
      render(
        <TypeList
          categoryTypes={initSet}
          setCategoryTypes={mockedsetCategoryTypes}
          removeTypeFromCategory={mockedremoveTypeFromCategory}
        />
      );
    });

    const buttons = await screen.findAllByRole("button");
    userEvent.click(buttons[0]);

    expect(mockedremoveTypeFromCategory.mock.calls.length).toBe(1);
    expect(mockedremoveTypeFromCategory.mock.calls[0][0]).toBe("Laptop");
    expect(mockedremoveTypeFromCategory.mock.calls[0][1]).toEqual(
      mockedsetCategoryTypes
    );
  });
});

describe("getTypes (GET)", () => {
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () => Promise.resolve({ types: ["Laptop", "PC", "Keyboard"] }),
    });

    act(() => {
      render(<SaveCategory />);
    });
    await waitForElementToBeRemoved(screen.queryByTestId("loader"));
  });

  test("make request with correct paramteres (GET)", async () => {
    expect(JsonFetch.mock.calls.length).toBe(1);
    expect(JsonFetch.mock.calls[0][0]).toBe(
      `${settings.baseURL}/api/Product/types`
    );
    expect(JsonFetch.mock.calls[0][1]).toBe("GET");
    expect(JsonFetch.mock.calls[0][2]).toBe(false);
    expect(JsonFetch.mock.calls[0][3]).toBe(null);
  });

  test("handle server response (GET, 200)", async () => {
    expect(await screen.findByText("Category name")).toBeInTheDocument();
    const select = await screen.findByLabelText("Type", { selector: "select" });
    expect(select.value).toBe("Laptop");
    expect(await screen.findByText("No types here yet.")).toBeInTheDocument();
  });
});

test("handle server response (GET,500)", async () => {
  JsonFetch.mockReturnValueOnce({
    status: 500,
  });
  act(() => {
    render(
      <MemoryRouter initialEntries={["/admin/menu"]}>
        <Route path="/admin/menu" component={() => <SaveCategory />} />
        <Route path="/500" component={() => <div>Server error</div>} />
      </MemoryRouter>
    );
  });
  expect(await screen.findByText("Server error")).toBeInTheDocument();
});

describe("saveCategory (POST)", () => {
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () => Promise.resolve({ types: ["Laptop", "PC", "Keyboard"] }),
    });
    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/menu"]}>
          <Route path="/admin/menu" component={() => <SaveCategory />} />
          <Route path="/500" component={() => <div>Server error</div>} />
          <Route path="/" component={() => <div>Login page</div>} />
        </MemoryRouter>
      );
    });

    await waitForElementToBeRemoved(screen.queryByTestId("loader"));
  });

  test("make request with correct paramteres (POST)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 204,
    });

    const categoryInput = await screen.findByLabelText("Category name", {
      selector: "input",
    });
    userEvent.type(categoryInput, "Computers");

    const beforeAddbuttons = await screen.findAllByRole("button");
    userEvent.click(beforeAddbuttons[0]);

    const afterAddbuttons = await screen.findAllByRole("button");
    userEvent.click(afterAddbuttons[afterAddbuttons.length - 1]);
    expect(
      await screen.findByText("Category successfully saved.")
    ).toBeInTheDocument();

    expect(JsonFetch.mock.calls.length).toBe(2);
    expect(JsonFetch.mock.calls[1][0]).toBe(`${settings.baseURL}/api/Category`);
    expect(JsonFetch.mock.calls[1][1]).toBe("POST");
    expect(JsonFetch.mock.calls[1][2]).toBe(true);
    expect(JsonFetch.mock.calls[1][3]).toEqual({
      title: "Computers",
      types: ["Laptop"],
    });
  });

  test("handle srever response (POST,204)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 204,
    });

    const categoryInput = await screen.findByLabelText("Category name", {
      selector: "input",
    });
    userEvent.type(categoryInput, "Computers");

    const beforeAddbuttons = await screen.findAllByRole("button");
    userEvent.click(beforeAddbuttons[0]);

    const afterAddbuttons = await screen.findAllByRole("button");
    userEvent.click(afterAddbuttons[afterAddbuttons.length - 1]);
    expect(
      await screen.findByText("Category successfully saved.")
    ).toBeInTheDocument();

    userEvent.click(await screen.findByText("OK"));
    expect(
      screen.queryByText("Category successfully saved.")
    ).not.toBeInTheDocument();
    expect(await screen.findByText("Category name")).toBeInTheDocument();
  });

  test("handle server response (POST, 400)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 400,
      json: () => Promise.resolve({ errors: ["error 400"] }),
    });
    const categoryInput = await screen.findByLabelText("Category name", {
      selector: "input",
    });
    userEvent.type(categoryInput, "Computers");

    const beforeAddbuttons = await screen.findAllByRole("button");
    userEvent.click(beforeAddbuttons[0]);

    const afterAddbuttons = await screen.findAllByRole("button");
    userEvent.click(afterAddbuttons[afterAddbuttons.length - 1]);
    expect(await screen.findByText("error 400")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("closeErrorBtn"));
    expect(screen.queryByText("error 400")).not.toBeInTheDocument();
  });

  test("handle server response (POST, 401)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 401,
    });
    const categoryInput = await screen.findByLabelText("Category name", {
      selector: "input",
    });
    userEvent.type(categoryInput, "Computers");

    const beforeAddbuttons = await screen.findAllByRole("button");
    userEvent.click(beforeAddbuttons[0]);

    const afterAddbuttons = await screen.findAllByRole("button");
    userEvent.click(afterAddbuttons[afterAddbuttons.length - 1]);
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  test("handle server response (POST, 403)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 403,
    });
    const categoryInput = await screen.findByLabelText("Category name", {
      selector: "input",
    });
    userEvent.type(categoryInput, "Computers");

    const beforeAddbuttons = await screen.findAllByRole("button");
    userEvent.click(beforeAddbuttons[0]);

    const afterAddbuttons = await screen.findAllByRole("button");
    userEvent.click(afterAddbuttons[afterAddbuttons.length - 1]);
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  test("handle server response (POST, 500)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 500,
    });
    const categoryInput = await screen.findByLabelText("Category name", {
      selector: "input",
    });
    userEvent.type(categoryInput, "Computers");

    const beforeAddbuttons = await screen.findAllByRole("button");
    userEvent.click(beforeAddbuttons[0]);

    const afterAddbuttons = await screen.findAllByRole("button");
    userEvent.click(afterAddbuttons[afterAddbuttons.length - 1]);
    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });
});

describe("updateCategory (PUT)", () => {
  const mockedSetSelectedCategory = jest.fn();
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () => Promise.resolve({ types: ["Laptop", "PC", "Keyboard"] }),
    });
    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/menu"]}>
          <Route
            path="/admin/menu"
            component={() => (
              <SaveCategory
                initCategory={{
                  id: "123",
                  title: "category1",
                  types: ["type1", "type2"],
                }}
                setSelectedCategory={mockedSetSelectedCategory}
              />
            )}
          />
          <Route path="/500" component={() => <div>Server error</div>} />
          <Route path="/" component={() => <div>Login page</div>} />
        </MemoryRouter>
      );
    });

    await waitForElementToBeRemoved(screen.queryByTestId("loader"));
  });

  test("render component correctly", async () => {
    expect(
      screen.getByLabelText("Category name", {
        selector: "input",
      })
    ).toHaveValue("category1");
    expect(screen.getByText("type1")).toBeInTheDocument();
    expect(screen.getByText("type2")).toBeInTheDocument();
  });

  test("make request with correct paramteres (PUT)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 204,
    });

    const categoryInput = await screen.findByLabelText("Category name", {
      selector: "input",
    });
    userEvent.clear(categoryInput);
    userEvent.type(categoryInput, "Computers");

    userEvent.click(screen.getByText("Save"));
    expect(
      await screen.findByText("Category successfully saved.")
    ).toBeInTheDocument();

    expect(JsonFetch.mock.calls.length).toBe(2);
    expect(JsonFetch.mock.calls[1][0]).toBe(
      `${settings.baseURL}/api/Category/123`
    );
    expect(JsonFetch.mock.calls[1][1]).toBe("PUT");
    expect(JsonFetch.mock.calls[1][2]).toBe(true);
    expect(JsonFetch.mock.calls[1][3]).toEqual({
      title: "Computers",
      types: ["type1", "type2"],
    });
  });

  test("handle srever response (PUT,204)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 204,
    });

    const categoryInput = await screen.findByLabelText("Category name", {
      selector: "input",
    });
    userEvent.clear(categoryInput);
    userEvent.type(categoryInput, "Computers");

    userEvent.click(screen.getByText("Save"));
    expect(
      await screen.findByText("Category successfully saved.")
    ).toBeInTheDocument();
    userEvent.click(await screen.findByText("OK"));
    expect(
      screen.queryByText("Category successfully saved.")
    ).not.toBeInTheDocument();
    expect(categoryInput).toHaveValue("Computers");
  });

  test("handle server response (PUT, 400)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 400,
      json: () => Promise.resolve({ errors: ["error 400"] }),
    });
    const categoryInput = await screen.findByLabelText("Category name", {
      selector: "input",
    });
    userEvent.clear(categoryInput);
    userEvent.type(categoryInput, "Computers");

    const beforeAddbuttons = await screen.findAllByRole("button");
    userEvent.click(beforeAddbuttons[0]);

    const afterAddbuttons = await screen.findAllByRole("button");
    userEvent.click(afterAddbuttons[afterAddbuttons.length - 1]);
    expect(await screen.findByText("error 400")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("closeErrorBtn"));
    expect(screen.queryByText("error 400")).not.toBeInTheDocument();
  });

  test("handle server response (PUT, 404)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 404,
    });
    const categoryInput = await screen.findByLabelText("Category name", {
      selector: "input",
    });
    userEvent.clear(categoryInput);
    userEvent.type(categoryInput, "Computers");

    const beforeAddbuttons = await screen.findAllByRole("button");
    userEvent.click(beforeAddbuttons[0]);

    const afterAddbuttons = await screen.findAllByRole("button");
    userEvent.click(afterAddbuttons[afterAddbuttons.length - 1]);
    expect(await screen.findByText("Category not found.")).toBeInTheDocument();

    userEvent.click(screen.getByText("Back to list"));
    expect(mockedSetSelectedCategory.mock.calls).toHaveLength(1);
    expect(mockedSetSelectedCategory.mock.calls[0][0]).toBe(null);
  });

  test("handle server response (PUT, 401)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 401,
    });
    const categoryInput = await screen.findByLabelText("Category name", {
      selector: "input",
    });
    userEvent.clear(categoryInput);
    userEvent.type(categoryInput, "Computers");

    const beforeAddbuttons = await screen.findAllByRole("button");
    userEvent.click(beforeAddbuttons[0]);

    const afterAddbuttons = await screen.findAllByRole("button");
    userEvent.click(afterAddbuttons[afterAddbuttons.length - 1]);
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  test("handle server response (PUT, 403)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 403,
    });
    const categoryInput = await screen.findByLabelText("Category name", {
      selector: "input",
    });
    userEvent.clear(categoryInput);
    userEvent.type(categoryInput, "Computers");

    const beforeAddbuttons = await screen.findAllByRole("button");
    userEvent.click(beforeAddbuttons[0]);

    const afterAddbuttons = await screen.findAllByRole("button");
    userEvent.click(afterAddbuttons[afterAddbuttons.length - 1]);
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  test("handle server response (PUT, 500)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 500,
    });
    const categoryInput = await screen.findByLabelText("Category name", {
      selector: "input",
    });
    userEvent.clear(categoryInput);
    userEvent.type(categoryInput, "Computers");

    const beforeAddbuttons = await screen.findAllByRole("button");
    userEvent.click(beforeAddbuttons[0]);

    const afterAddbuttons = await screen.findAllByRole("button");
    userEvent.click(afterAddbuttons[afterAddbuttons.length - 1]);
    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });
});
