import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import CategoryList, { DisplayCategories } from "./CategoryList";
import { JsonFetch } from "../../../components/fetches/Fetches";
import { MemoryRouter, Route } from "react-router";
import { settings } from "../../../settings";
jest.mock("../../../components/fetches/Fetches");

describe("DisplayCategories: render component with following parameters:", () => {
  test("correct parameters", async () => {
    const categories = [
      {
        id: "1",
        title: "Computers",
        types: ["Laptops", "PCs"],
      },
      {
        id: "2",
        title: "Peripherals",
        types: ["Computer mice", "Keyboard", "Printers"],
      },
    ];

    act(() => {
      render(<DisplayCategories categories={categories} />);
    });

    const itemContainers = await screen.findAllByRole("article");
    expect(itemContainers).toHaveLength(2);
    expect(
      within(itemContainers[0]).getByText("Computers")
    ).toBeInTheDocument();
    expect(within(itemContainers[0]).getByText("Laptops")).toBeInTheDocument();
    expect(within(itemContainers[0]).getByText("PCs")).toBeInTheDocument();

    expect(
      within(itemContainers[1]).getByText("Peripherals")
    ).toBeInTheDocument();
    expect(
      within(itemContainers[1]).getByText("Computer mice")
    ).toBeInTheDocument();
    expect(within(itemContainers[1]).getByText("Keyboard")).toBeInTheDocument();
    expect(within(itemContainers[1]).getByText("Printers")).toBeInTheDocument();
  });

  test("empty array", async () => {
    const categories = [];

    act(() => {
      render(<DisplayCategories categories={categories} />);
    });

    expect(
      await screen.findByText("No categories here yet.")
    ).toBeInTheDocument();
  });

  test("null", async () => {
    const categories = null;

    act(() => {
      render(<DisplayCategories categories={categories} />);
    });

    expect(
      await screen.findByText("No categories here yet.")
    ).toBeInTheDocument();
  });
});

describe("getCategories (GET)", () => {
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve([
          {
            id: "1",
            title: "Computers",
            types: ["Laptops", "PCs"],
          },
          {
            id: "2",
            title: "Peripherals",
            types: ["Computer mice", "Keyboard", "Printers"],
          },
        ]),
    });

    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/menu"]}>
          <Route exact path="/admin/menu" component={() => <CategoryList />} />
          <Route exact path="/500" component={() => <div>Server error</div>} />
        </MemoryRouter>
      );
    });

    await waitFor(async () =>
      expect(await screen.findByText("Add new category")).toBeInTheDocument()
    );
  });

  test("make request with corretly parameters (GET)", async () => {
    expect(JsonFetch.mock.calls.length).toBe(1);
    expect(JsonFetch.mock.calls[0][0]).toBe(
      `${settings.backendApiUrl}/api/Category`
    );
    expect(JsonFetch.mock.calls[0][1]).toBe("GET");
    expect(JsonFetch.mock.calls[0][2]).toBe(false);
  });

  test("handle server response (GET, 200)", async () => {
    expect(await screen.findByText("Add new category")).toBeInTheDocument();
    const itemContainers = await screen.findAllByRole("article");
    expect(itemContainers).toHaveLength(2);
    expect(
      within(itemContainers[0]).getByText("Computers")
    ).toBeInTheDocument();
    expect(within(itemContainers[0]).getByText("Laptops")).toBeInTheDocument();
    expect(within(itemContainers[0]).getByText("PCs")).toBeInTheDocument();

    expect(
      within(itemContainers[1]).getByText("Peripherals")
    ).toBeInTheDocument();
    expect(
      within(itemContainers[1]).getByText("Computer mice")
    ).toBeInTheDocument();
    expect(within(itemContainers[1]).getByText("Keyboard")).toBeInTheDocument();
    expect(within(itemContainers[1]).getByText("Printers")).toBeInTheDocument();
  });

  test("handle server response (GET, 500)", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 500,
      };
    });

    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/menu"]}>
          <Route exact path="/admin/menu" component={() => <CategoryList />} />
          <Route exact path="/500" component={() => <div>Server error</div>} />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });
});

describe("deleteCategories (DELETE)", () => {
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve([
          {
            id: "1",
            title: "Computers",
            types: ["Laptops", "PCs"],
          },
          {
            id: "2",
            title: "Peripherals",
            types: ["Computer mice", "Keyboard", "Printers"],
          },
        ]),
    });

    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/menu"]}>
          <Route exact path="/admin/menu" component={() => <CategoryList />} />
          <Route exact path="/500" component={() => <div>Server error</div>} />
          <Route exact path="/" component={() => <div>Login page</div>} />
        </MemoryRouter>
      );
    });

    await waitFor(async () =>
      expect(await screen.findByText("Add new category")).toBeInTheDocument()
    );
  });

  test("make request with corretly parameters(DELETE)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 204,
    });

    const deleteBtns = await screen.findAllByText("Delete");
    userEvent.click(deleteBtns[0]);

    expect(JsonFetch.mock.calls.length).toBe(2);
    expect(JsonFetch.mock.calls[1][0]).toBe(
      `${settings.backendApiUrl}/api/Category/1`
    );
    expect(JsonFetch.mock.calls[1][1]).toBe("DELETE");
    expect(JsonFetch.mock.calls[1][2]).toBe(true);

    expect(await screen.findByText("Successfully deleted")).toBeInTheDocument();
  });

  test("handle server response (DELETE,204)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 204,
    });

    const deleteBtns = await screen.findAllByText("Delete");
    userEvent.click(deleteBtns[0]);

    expect(await screen.findByText("Successfully deleted")).toBeInTheDocument();
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve([
          {
            id: "2",
            title: "Peripherals",
            types: ["Computer mice", "Keyboard", "Printers"],
          },
        ]),
    });
    userEvent.click(await screen.findByText("OK"));
    expect(await screen.findByText("Peripherals")).toBeInTheDocument();
    expect(screen.queryByText("Computers")).not.toBeInTheDocument();
  });

  test("handle server response (DELETE,404)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 404,
    }).mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve([
          {
            id: "2",
            title: "Peripherals",
            types: ["Computer mice", "Keyboard", "Printers"],
          },
        ]),
    });

    const deleteBtns = await screen.findAllByText("Delete");
    userEvent.click(deleteBtns[0]);

    await waitForElementToBeRemoved(screen.queryByTestId("loader"));

    expect(screen.getByText("Category not found.")).toBeInTheDocument();
    userEvent.click(screen.getByText("OK"));

    await waitForElementToBeRemoved(screen.queryByTestId("loader"));

    const itemContainers = await screen.findAllByRole("article");
    expect(itemContainers).toHaveLength(1);
    expect(
      within(itemContainers[0]).getByText("Peripherals")
    ).toBeInTheDocument();
    expect(
      within(itemContainers[0]).getByText("Computer mice")
    ).toBeInTheDocument();
    expect(within(itemContainers[0]).getByText("Keyboard")).toBeInTheDocument();
    expect(within(itemContainers[0]).getByText("Printers")).toBeInTheDocument();
  });

  test("handle server response (DELETE,401)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 401,
    });

    const deleteBtns = await screen.findAllByText("Delete");
    userEvent.click(deleteBtns[0]);
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  test("handle server response (DELETE,403)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 403,
    });

    const deleteBtns = await screen.findAllByText("Delete");
    userEvent.click(deleteBtns[0]);
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  test("handle server response (DELETE,500)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 500,
    });

    const deleteBtns = await screen.findAllByText("Delete");
    userEvent.click(deleteBtns[0]);
    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });
});
