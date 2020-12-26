import { act, render, screen, waitFor } from "@testing-library/react";
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
        name: "Computers",
        types: ["Laptops", "PCs"],
      },
      {
        id: "2",
        name: "Peripherals",
        types: ["Computer mice", "Keyboard", "Printers"],
      },
    ];

    act(() => {
      render(<DisplayCategories categories={categories} />);
    });

    const itemContainers = await screen.findAllByRole("article");
    expect(itemContainers.length).toBe(2);
    expect(await screen.findByText("Computers")).toBeInTheDocument();
    expect(await screen.findByText("Laptops")).toBeInTheDocument();
    expect(await screen.findByText("PCs")).toBeInTheDocument();
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

describe("CategoryList without routing", () => {
  beforeEach(async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 200,
        json: () =>
          Promise.resolve([
            {
              id: "1",
              name: "Computers",
              types: ["Laptops", "PCs"],
            },
            {
              id: "2",
              name: "Peripherals",
              types: ["Computer mice", "Keyboard", "Printers"],
            },
          ]),
      };
    });
    act(() => {
      render(<CategoryList />);
    });

    await waitFor(async () =>
      expect(await screen.findByText("Add new category")).toBeInTheDocument()
    );
  });

  test("component redner correctly (GET, 200)", async () => {
    expect(await screen.findByText("Add new category")).toBeInTheDocument();
    const itemContainers = await screen.findAllByRole("article");
    expect(itemContainers.length).toBe(2);
    expect(await screen.findByText("Computers")).toBeInTheDocument();
    expect(await screen.findByText("Laptops")).toBeInTheDocument();
    expect(await screen.findByText("PCs")).toBeInTheDocument();
  });

  test("make request with corretly parameters (GET)", async () => {
    expect(JsonFetch.mock.calls.length).toBe(1);
    expect(JsonFetch.mock.calls[0][0]).toBe(`${settings.baseURL}/category`);
    expect(JsonFetch.mock.calls[0][1]).toBe("GET");
    expect(JsonFetch.mock.calls[0][2]).toBe(false);
  });

  test("make request with corretly parameters(DELETE)", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 204,
      };
    });

    const deleteBtns = await screen.findAllByText("Delete");
    userEvent.click(deleteBtns[0]);

    expect(JsonFetch.mock.calls.length).toBe(2);
    expect(JsonFetch.mock.calls[1][0]).toBe(`${settings.baseURL}/category/1`);
    expect(JsonFetch.mock.calls[1][1]).toBe("DELETE");
    expect(JsonFetch.mock.calls[1][2]).toBe(true);

    expect(await screen.findByText("Successfully deleted")).toBeInTheDocument();
  });

  test("handle server response (DELETE,204)", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 204,
      };
    });

    const deleteBtns = await screen.findAllByText("Delete");
    userEvent.click(deleteBtns[0]);

    expect(await screen.findByText("Successfully deleted")).toBeInTheDocument();
    JsonFetch.mockImplementation(() => {
      return {
        status: 200,
        json: () =>
          Promise.resolve([
            {
              id: "2",
              name: "Peripherals",
              types: ["Computer mice", "Keyboard", "Printers"],
            },
          ]),
      };
    });
    userEvent.click(await screen.findByText("OK"));
    expect(await screen.findByText("Peripherals")).toBeInTheDocument();
    expect(screen.queryByText("Computers")).not.toBeInTheDocument();
  });
});

describe("CategoryList with routing", () => {
  beforeEach(async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 200,
        json: () =>
          Promise.resolve([
            {
              id: "1",
              name: "Computers",
              types: ["Laptops", "PCs"],
            },
            {
              id: "2",
              name: "Peripherals",
              types: ["Computer mice", "Keyboard", "Printers"],
            },
          ]),
      };
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

  test("handle server response (DELETE,401)", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 401,
      };
    });

    const deleteBtns = await screen.findAllByText("Delete");
    userEvent.click(deleteBtns[0]);
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  test("handle server response (DELETE,403)", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 401,
      };
    });

    const deleteBtns = await screen.findAllByText("Delete");
    userEvent.click(deleteBtns[0]);
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  test("handle server response (DELETE,500)", async () => {
    JsonFetch.mockImplementation(() => {
      return {
        status: 500,
      };
    });

    const deleteBtns = await screen.findAllByText("Delete");
    userEvent.click(deleteBtns[0]);
    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });
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
