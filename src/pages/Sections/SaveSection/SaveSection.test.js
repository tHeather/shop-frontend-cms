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
import { JsonFetch } from "../../../../components/fetches/Fetches";
import { settings } from "../../../../settings";
import { MemoryRouter, Route } from "react-router";

jest.mock("../../../../components/fetches/Fetches");

describe("SaveSection: Save mode", () => {
  test("render component correctly", () => {
    act(() => {
      render(<SaveSection />);
    });
    expect(
      screen.getByText("Save section", { selector: "button" })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search for a product...")
    ).toBeInTheDocument();
    expect(screen.getByText("Products in section (0)")).toBeInTheDocument();

    const sectionNameInput = screen.getByLabelText("Section name:", {
      selector: "input",
    });
    expect(sectionNameInput).toBeInTheDocument();
    expect(sectionNameInput).toHaveValue("");
    expect(JsonFetch.mock.calls).toHaveLength(0);
  });

  describe("SaveSection (POST)", () => {
    beforeEach(async () => {
      JsonFetch.mockReturnValueOnce({
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
            <Route
              exact
              path="/500"
              component={() => <div>Server error</div>}
            />
          </MemoryRouter>
        );
      });

      userEvent.type(
        screen.getByPlaceholderText("Search for a product..."),
        "Mackbook {enter}"
      );

      userEvent.click(
        within(await screen.findByRole("article")).getByRole("button")
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
      expect(JsonFetch.mock.calls[1][0]).toBe(`${settings.baseURL}/section`);
      expect(JsonFetch.mock.calls[1][1]).toBe("POST");
      expect(JsonFetch.mock.calls[1][2]).toBe(true);
      expect(JsonFetch.mock.calls[1][3]).toEqual({
        title: "Section1",
        products: ["1"],
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
  beforeEach(() => {
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
  });

  test("handle server response (GET, 200)", async () => {
    JsonFetch.mockReturnValueOnce({
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
    });
    userEvent.type(
      screen.getByPlaceholderText("Search for a product..."),
      "Mackbook {enter}"
    );
    const image = await screen.findByAltText("Mackbook");
    expect(image.getAttribute("src")).toBe("imageMacbook.jpg");
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
      "Mackbook {enter}"
    );
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
              mainImage: "imageMacbook.jpg",
            },
            {
              id: "3",
              name: "ASUS",
              quantity: 30,
              price: 2000,
              isOnDiscount: true,
              discountPrice: 1500,
              mainImage: "ASUS.jpg",
            },
          ],
        }),
    });

    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/sections"]}>
          <Route
            exact
            path="/admin/sections"
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
    expect(JsonFetch.mock.calls).toHaveLength(1);

    const image = await screen.findByAltText("Mackbook");
    expect(image.getAttribute("src")).toBe("imageMacbook.jpg");
    expect(await screen.findByText("Mackbook")).toBeInTheDocument();
    expect(await screen.findByText("10000")).toBeInTheDocument();
    expect(await screen.findByText("9500")).toBeInTheDocument();
  });

  test("make request with correct parameters (saveSection, GET)", async () => {
    expect(JsonFetch.mock.calls.length).toBe(1);
    expect(JsonFetch.mock.calls[0][0]).toBe(
      `${settings.baseURL}/section/12345`
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

    test("update section product list (add prodcut)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 200,
        json: () =>
          Promise.resolve([
            {
              id: "2",
              name: "HP",
              quantity: 10,
              price: 5000,
              isOnDiscount: true,
              discountPrice: 4500,
              mainImage: "Hp.jpg",
            },
          ]),
      }).mockReturnValueOnce({
        status: 204,
      });

      userEvent.type(
        screen.getByPlaceholderText("Search for a product..."),
        "HP {enter}"
      );

      const productContainers = await screen.findAllByRole("article");
      const addButton = within(productContainers[0]).getByRole("button");
      userEvent.click(addButton);
      userEvent.click(screen.getByText("Save section", { selector: "button" }));

      expect(
        await screen.findByText("Section saved successfully.")
      ).toBeInTheDocument();
      userEvent.click(screen.getByText("OK"));

      expect(await screen.findAllByText("HP")).toHaveLength(2);
    });

    test("update section product list (remove prodcut)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 204,
      });

      const productContainers = await screen.findAllByRole("article");
      const deletebutton = within(productContainers[0]).getByRole("button");
      userEvent.click(deletebutton);
      userEvent.click(screen.getByText("Save section", { selector: "button" }));

      expect(
        await screen.findByText("Section saved successfully.")
      ).toBeInTheDocument();
      userEvent.click(screen.getByText("OK"));

      expect(screen.queryByText("Mackbook")).not.toBeInTheDocument();
    });

    test("make request with correct parameters", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 204,
      });

      const productContainers = await screen.findAllByRole("article");
      const deletebutton = within(productContainers[0]).getByRole("button");
      userEvent.click(deletebutton);
      userEvent.click(screen.getByText("Save section", { selector: "button" }));
      expect(
        await screen.findByText("Section saved successfully.")
      ).toBeInTheDocument();

      expect(JsonFetch.mock.calls.length).toBe(2);
      expect(JsonFetch.mock.calls[1][0]).toBe(
        `${settings.baseURL}/section/12345`
      );
      expect(JsonFetch.mock.calls[1][1]).toBe("PUT");
      expect(JsonFetch.mock.calls[1][2]).toBe(true);
      expect(JsonFetch.mock.calls[1][3]).toEqual({
        title: "Section1",
        products: ["3"],
      });
    });

    test("handle server response (PUT, 401)", async () => {
      JsonFetch.mockReturnValueOnce({
        status: 401,
      });

      const productContainers = await screen.findAllByRole("article");
      const deletebutton = within(productContainers[0]).getByRole("button");
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
      const deletebutton = within(productContainers[0]).getByRole("button");
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
      const deletebutton = within(productContainers[0]).getByRole("button");
      userEvent.click(deletebutton);
      userEvent.click(screen.getByText("Save section", { selector: "button" }));
      await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
      expect(await screen.findByText("Server error")).toBeInTheDocument();
    });
  });
});

test("handle server response (getSection,GET, 500)", async () => {
  const mockedSetSelectedSectionId = jest.fn();

  JsonFetch.mockReturnValueOnce({
    status: 500,
  });

  act(() => {
    render(
      <MemoryRouter initialEntries={["/admin/sections"]}>
        <Route
          exact
          path="/admin/sections"
          component={() => (
            <SaveSection
              sectionId="12345"
              setSelectedSectionId={mockedSetSelectedSectionId}
            />
          )}
        />
        <Route exact path="/500" component={() => <div>Server error</div>} />
      </MemoryRouter>
    );
  });

  expect(await screen.findByText("Server error")).toBeInTheDocument();
});
