import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import SaveSection from "./SaveSection";
import { JsonFetch } from "../../../components/fetches/Fetches";
import { settings } from "../../../settings";
import { MemoryRouter, Route } from "react-router";

jest.mock("../../../components/fetches/Fetches");

describe("SaveSection: Save mode", () => {
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
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

    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/sections"]}>
          <Route
            exact
            path="/admin/sections"
            component={() => <SaveSection />}
          />
          <Route exact path="/" component={() => <div>Login page</div>} />
          <Route exact path="/500" component={() => <div>Server error</div>} />
        </MemoryRouter>
      );
    });
    await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
  });

  test("render component correctly", () => {
    expect(
      screen.getByText("Save section", { selector: "button" })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search for a product...")
    ).toBeInTheDocument();
    expect(screen.getByText("Mackbook")).toBeInTheDocument();
    expect(screen.getByText("Products in section (0)")).toBeInTheDocument();
    const sectionNameInput = screen.getByLabelText("Section name:", {
      selector: "input",
    });
    expect(sectionNameInput).toBeInTheDocument();
    expect(sectionNameInput).toHaveValue("");
    expect(JsonFetch.mock.calls).toHaveLength(1);
  });

  describe("SaveSection (POST)", () => {
    beforeEach(async () => {
      userEvent.click(
        screen.getByText("Add to section", { selector: "button" })
      );

      userEvent.type(
        screen.getByLabelText("Section name:", {
          selector: "input",
        }),
        "Section1"
      );
    });

    test("make request with correct parameters (saveSection, POST)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 204,
      });
      userEvent.click(screen.getByText("Save section", { selector: "button" }));
      await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
      expect(JsonFetch.mock.calls.length).toBe(2);
      expect(JsonFetch.mock.calls[1][0]).toBe(
        `${settings.baseURL}/api/Section`
      );
      expect(JsonFetch.mock.calls[1][1]).toBe("POST");
      expect(JsonFetch.mock.calls[1][2]).toBe(true);
      expect(JsonFetch.mock.calls[1][3]).toEqual({
        title: "Section1",
        ProductIds: ["1"],
      });
    });

    test("handle server response (saveSection, POST, 204)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 204,
      });
      userEvent.click(screen.getByText("Save section", { selector: "button" }));
      await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
      expect(
        await screen.findByText("Section saved successfully.")
      ).toBeInTheDocument();
      userEvent.click(screen.getByText("OK"));
      expect(
        await screen.findByPlaceholderText("Search for a product...")
      ).toHaveValue("");

      expect(
        await screen.findByLabelText("Section name:", {
          selector: "input",
        })
      ).toHaveValue("");

      expect(screen.queryByText("Mackbook")).not.toBeInTheDocument();
    });

    test("handle server response (saveSection, POST, 401)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 401,
      });
      userEvent.click(screen.getByText("Save section", { selector: "button" }));
      await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
      expect(await screen.findByText("Login page")).toBeInTheDocument();
    });

    test("handle server response (saveSection, POST, 403)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 403,
      });
      userEvent.click(screen.getByText("Save section", { selector: "button" }));
      await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
      expect(await screen.findByText("Login page")).toBeInTheDocument();
    });

    test("handle server response (saveSection, POST, 500)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 500,
      });
      userEvent.click(screen.getByText("Save section", { selector: "button" }));
      await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
      expect(await screen.findByText("Server error")).toBeInTheDocument();
    });
  });
});

describe("GetProducts (GET)", () => {
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
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
          totalPages: 2,
        }),
    });
    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/sections"]}>
          <Route
            exact
            path="/admin/sections"
            component={() => <SaveSection />}
          />
          <Route exact path="/" component={() => <div>Login page</div>} />
          <Route exact path="/500" component={() => <div>Server error</div>} />
        </MemoryRouter>
      );
    });
    await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
  });

  test("make request with correct parameters (on mount)", async () => {
    expect(JsonFetch.mock.calls.length).toBe(1);
    expect(JsonFetch.mock.calls[0][0]).toBe(
      `${settings.baseURL}/api/Product?pageNumber=1`
    );
    expect(JsonFetch.mock.calls[0][1]).toBe("GET");
    expect(JsonFetch.mock.calls[0][2]).toBe(false);
    expect(JsonFetch.mock.calls[0][3]).toBe(null);
  });

  test("make request with correct parameters (pagination)", async () => {
    JsonFetch.mockReturnValueOnce({
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
          totalPages: 2,
        }),
    });
    userEvent.click(screen.getByTestId("paginationNextBtn"));
    await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
    expect(JsonFetch.mock.calls.length).toBe(2);
    expect(JsonFetch.mock.calls[1][0]).toBe(
      `${settings.baseURL}/api/Product?pageNumber=2`
    );
    expect(JsonFetch.mock.calls[1][1]).toBe("GET");
    expect(JsonFetch.mock.calls[1][2]).toBe(false);
    expect(JsonFetch.mock.calls[1][3]).toBe(null);
  });

  test("make request with correct parameters (search)", async () => {
    JsonFetch.mockReturnValueOnce({
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
          totalPages: 2,
        }),
    });
    userEvent.type(
      screen.getByPlaceholderText("Search for a product..."),
      "Mackbook"
    );
    userEvent.tab();
    await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
    expect(JsonFetch.mock.calls.length).toBe(2);
    expect(JsonFetch.mock.calls[1][0]).toBe(
      `${settings.baseURL}/api/Product?pageNumber=1&search=Mackbook`
    );
    expect(JsonFetch.mock.calls[1][1]).toBe("GET");
    expect(JsonFetch.mock.calls[1][2]).toBe(false);
    expect(JsonFetch.mock.calls[1][3]).toBe(null);
  });

  test("handle server response (GET, 200)", async () => {
    const image = await screen.findByAltText("Mackbook");
    expect(image.getAttribute("src")).toBe(
      `${settings.baseURL}/imageMacbook.jpg`
    );
    expect(await screen.findByText("Mackbook")).toBeInTheDocument();
    expect(await screen.findByText("10000")).toBeInTheDocument();
    expect(await screen.findByText("9500")).toBeInTheDocument();
  });

  test("handle server response (GET, 500)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 500,
    });
    userEvent.type(
      screen.getByPlaceholderText("Search for a product..."),
      "Mackbook"
    );
    userEvent.tab();
    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });
});

describe("SaveProduct: update mode", () => {
  const mockedSetSelectedSectionId = jest.fn();

  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          id: "12345",
          title: "Section1",
          products: [
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
              id: "3",
              name: "ASUS",
              quantity: 30,
              price: 2000,
              isOnDiscount: true,
              discountPrice: 1500,
              firstImage: "ASUS.jpg",
            },
          ],
        }),
    }).mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          result: [
            {
              id: "4",
              name: "Dell",
              quantity: 1,
              price: 10,
              isOnDiscount: true,
              discountPrice: 950,
              firstImage: "imageDell.jpg",
            },
          ],
          totalPages: 2,
        }),
    });

    act(() => {
      render(
        <MemoryRouter initialEntries={["/sections"]}>
          <Route
            exact
            path="/sections"
            component={() => (
              <SaveSection
                sectionId="12345"
                setSelectedSectionId={mockedSetSelectedSectionId}
              />
            )}
          />
          <Route exact path="/" component={() => <div>Login page</div>} />
          <Route exact path="/500" component={() => <div>Server error</div>} />
        </MemoryRouter>
      );
    });

    await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
  });

  test("redner component correctly (getSection,GET, 200)", async () => {
    expect(
      await screen.findByText("Save section", { selector: "button" })
    ).toBeInTheDocument();
    expect(
      await screen.findByPlaceholderText("Search for a product...")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Products in section (2)")
    ).toBeInTheDocument();

    const sectionNameInput = await screen.findByLabelText("Section name:", {
      selector: "input",
    });
    expect(sectionNameInput).toBeInTheDocument();
    expect(sectionNameInput).toHaveValue("Section1");
    expect(JsonFetch.mock.calls).toHaveLength(2);

    const image = await screen.findByAltText("Mackbook");
    expect(image.getAttribute("src")).toBe(
      `${settings.baseURL}/imageMacbook.jpg`
    );
    expect(await screen.findByText("Mackbook")).toBeInTheDocument();
    expect(await screen.findByText("10000")).toBeInTheDocument();
    expect(await screen.findByText("9500")).toBeInTheDocument();
  });

  test("make request with correct parameters (saveSection, GET)", async () => {
    expect(JsonFetch.mock.calls.length).toBe(2);
    expect(JsonFetch.mock.calls[0][0]).toBe(
      `${settings.baseURL}/api/Section/12345`
    );
    expect(JsonFetch.mock.calls[0][1]).toBe("GET");
    expect(JsonFetch.mock.calls[0][2]).toBe(false);
    expect(JsonFetch.mock.calls[0][3]).toBe(null);
  });

  describe("SaveSection (PUT)", () => {
    test("update section name", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 204,
      });

      const sectionNameInput = screen.getByLabelText("Section name:", {
        selector: "input",
      });

      userEvent.clear(sectionNameInput);
      userEvent.type(sectionNameInput, "Updated section");
      userEvent.click(screen.getByText("Save section", { selector: "button" }));

      expect(
        await screen.findByText("Section saved successfully.")
      ).toBeInTheDocument();
      userEvent.click(screen.getByText("OK"));

      expect(sectionNameInput).toHaveValue("Updated section");
    });

    test("update section product list (add product)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 200,
        json: () =>
          Promise.resolve({
            result: [
              {
                id: "4",
                name: "HP",
                quantity: 1,
                price: 10,
                isOnDiscount: true,
                discountPrice: 950,
                firstImage: "imageHP.jpg",
              },
            ],
            totalPages: 2,
          }),
      }).mockReturnValueOnce({
        status: 204,
      });

      userEvent.type(
        screen.getByPlaceholderText("Search for a product..."),
        "HP"
      );
      userEvent.tab();

      const productContainers = await screen.findAllByRole("article");
      const addButton = within(productContainers[0]).getByRole("button");
      userEvent.click(addButton);
      userEvent.click(screen.getByText("Save section", { selector: "button" }));

      expect(
        await screen.findByText("Section saved successfully.")
      ).toBeInTheDocument();
      userEvent.click(screen.getByText("OK"));

      expect(await screen.findAllByText("HP")).toHaveLength(2);
      expect(await screen.findByText("Mackbook")).toBeInTheDocument();
      expect(await screen.findByText("ASUS")).toBeInTheDocument();
    });

    test("update section product list (remove prodcut)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 204,
      });

      const productContainers = await screen.findAllByRole("article");
      const deletebutton = within(
        productContainers[productContainers.length - 1]
      ).getByRole("button");
      userEvent.click(deletebutton);
      userEvent.click(screen.getByText("Save section", { selector: "button" }));

      expect(
        await screen.findByText("Section saved successfully.")
      ).toBeInTheDocument();
      userEvent.click(screen.getByText("OK"));

      expect(screen.getByText("Mackbook")).toBeInTheDocument();
      expect(screen.queryByText("ASUS")).not.toBeInTheDocument();
    });

    test("make request with correct parameters (PUT)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 204,
      });

      const productContainers = await screen.findAllByRole("article");
      const deletebutton = within(
        productContainers[productContainers.length - 1]
      ).getByRole("button");
      userEvent.click(deletebutton);
      userEvent.click(screen.getByText("Save section", { selector: "button" }));
      expect(
        await screen.findByText("Section saved successfully.")
      ).toBeInTheDocument();

      expect(JsonFetch.mock.calls).toHaveLength(3);
      expect(JsonFetch.mock.calls[2][0]).toBe(
        `${settings.baseURL}/api/Section/12345`
      );
      expect(JsonFetch.mock.calls[2][1]).toBe("PUT");
      expect(JsonFetch.mock.calls[2][2]).toBe(true);
      expect(JsonFetch.mock.calls[2][3]).toEqual({
        title: "Section1",
        ProductIds: ["1"],
      });
    });

    test("handle server response (PUT, 401)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 401,
      });

      const productContainers = await screen.findAllByRole("article");
      const deletebutton = within(
        productContainers[productContainers.length - 1]
      ).getByRole("button");
      userEvent.click(deletebutton);
      userEvent.click(screen.getByText("Save section", { selector: "button" }));
      await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
      expect(await screen.findByText("Login page")).toBeInTheDocument();
    });

    test("handle server response (PUT, 403)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 403,
      });

      const productContainers = await screen.findAllByRole("article");
      const deletebutton = within(
        productContainers[productContainers.length - 1]
      ).getByRole("button");
      userEvent.click(deletebutton);
      userEvent.click(screen.getByText("Save section", { selector: "button" }));
      await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
      expect(await screen.findByText("Login page")).toBeInTheDocument();
    });

    test("handle server response (PUT, 500)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 500,
      });

      const productContainers = await screen.findAllByRole("article");
      const deletebutton = within(
        productContainers[productContainers.length - 1]
      ).getByRole("button");
      userEvent.click(deletebutton);
      userEvent.click(screen.getByText("Save section", { selector: "button" }));
      await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
      expect(await screen.findByText("Server error")).toBeInTheDocument();
    });
  });
});

test("handle server response (getSection,GET, 500)", async () => {
  JsonFetch.mockReturnValueOnce({
    status: 500,
  });

  act(() => {
    render(
      <MemoryRouter initialEntries={["/admin/sections"]}>
        <Route exact path="/admin/sections" component={() => <SaveSection />} />
        <Route exact path="/500" component={() => <div>Server error</div>} />
      </MemoryRouter>
    );
  });

  expect(await screen.findByText("Server error")).toBeInTheDocument();
});
