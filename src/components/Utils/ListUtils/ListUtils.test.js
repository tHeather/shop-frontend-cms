import { act, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { ItemList, Price, Search } from "./ListUtils";

test("Price: render discount and regular price", () => {
  act(() => {
    render(<Price price="100" isOnDiscount={true} discountPrice="50" />);
  });

  expect(screen.getByText("100")).toBeInTheDocument();
  expect(screen.getByText("50")).toBeInTheDocument();
});

test("Price: render only regular price", () => {
  act(() => {
    render(<Price price="100" isOnDiscount={false} discountPrice="50" />);
  });

  expect(screen.getByText("100")).toBeInTheDocument();
  expect(screen.queryByText("50")).not.toBeInTheDocument();
});

describe.each([
  [null, null],
  [undefined, null],
  [{}, null],
  ["", null],
  [0, null],
  ["a", null],
])("ItemList: Not array parameters", (parameter, expected) => {
  test(`Input: ${parameter} => Output: ${expected}`, () => {
    expect(ItemList({ items: parameter, onClickHandler: jest.fn() })).toBe(
      expected
    );
  });
});

test("ItemList: empty array parameter", () => {
  act(() => {
    render(<ItemList items={[]} onClickHandler={jest.fn()} />);
  });

  expect(
    screen.getByText("There are no products that meet your criteria.")
  ).toBeInTheDocument();
});

test("ItemList: render items correctly", () => {
  act(() => {
    render(
      <ItemList
        items={[
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
            id: "2",
            name: "HP",
            quantity: 15,
            price: 5000,
            isOnDiscount: false,
            discountPrice: 4500,
            mainImage: "imageHP.jpg",
          },
        ]}
        onClickHandler={jest.fn()}
      />
    );
  });

  expect(screen.getAllByRole("article").length).toBe(2);
  expect(screen.getByAltText("Mackbook").getAttribute("src")).toBe(
    "imageMacbook.jpg"
  );
  expect(screen.getByText("Mackbook")).toBeInTheDocument();
  expect(screen.getByText("10000")).toBeInTheDocument();
  expect(screen.getByText("9500")).toBeInTheDocument();

  expect(screen.getByAltText("HP").getAttribute("src")).toBe("imageHP.jpg");
  expect(screen.getByText("HP")).toBeInTheDocument();
  expect(screen.getByText("5000")).toBeInTheDocument();
  expect(screen.queryByText("4500")).not.toBeInTheDocument();
});

describe("ItemList: with button", () => {
  const mockedOnClikButtonHandler = jest.fn();

  beforeEach(() => {
    const MockedButton = jest.fn(({ item }) => (
      <button onClick={() => mockedOnClikButtonHandler(item)}>
        Test button
      </button>
    ));

    act(() => {
      render(
        <ItemList
          items={[
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
              id: "2",
              name: "HP",
              quantity: 15,
              price: 5000,
              isOnDiscount: false,
              discountPrice: 4500,
              mainImage: "imageHP.jpg",
            },
          ]}
          Button={MockedButton}
        />
      );
    });
  });

  test("render button correctly", () => {
    const productContainers = screen.getAllByRole("article");
    const button = within(productContainers[0]).getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe("Test button");
  });

  test("fire onClick event on button", () => {
    const productContainers = screen.getAllByRole("article");
    const button = within(productContainers[0]).getByRole("button");
    userEvent.click(button);
    expect(mockedOnClikButtonHandler.mock.calls).toHaveLength(1);
    expect(mockedOnClikButtonHandler.mock.calls[0][0]).toEqual({
      id: "1",
      name: "Mackbook",
      quantity: 5,
      price: 10000,
      isOnDiscount: true,
      discountPrice: 9500,
      mainImage: "imageMacbook.jpg",
    });
  });
});

test("ItemList: handle on click event", () => {
  const mockedOnClickHandler = jest.fn();

  act(() => {
    render(
      <ItemList
        items={[
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
            id: "2",
            name: "HP",
            quantity: 15,
            price: 5000,
            isOnDiscount: false,
            discountPrice: 4500,
            mainImage: "imageHP.jpg",
          },
        ]}
        onClickHandler={mockedOnClickHandler}
      />
    );
  });

  const productContainers = screen.getAllByRole("article");
  userEvent.click(productContainers[0].firstElementChild);
  expect(mockedOnClickHandler.mock.calls).toHaveLength(1);
  expect(mockedOnClickHandler.mock.calls[0][0]).toEqual({
    id: "1",
    name: "Mackbook",
    quantity: 5,
    price: 10000,
    isOnDiscount: true,
    discountPrice: 9500,
    mainImage: "imageMacbook.jpg",
  });
});

describe("Search", () => {
  const mockedHandleChange = jest.fn();
  const mockedHandleSubmit = jest.fn();

  beforeEach(() => {
    act(() => {
      render(
        <Search
          handleChange={mockedHandleChange}
          handleSubmit={mockedHandleSubmit}
        />
      );
    });
    userEvent.type(
      screen.getByPlaceholderText("Search for a product..."),
      "Text"
    );
  });

  test("fire handleChange on change", () => {
    expect(mockedHandleChange.mock.calls.length).toBe(4);
    expect(mockedHandleChange.mock.calls[0][0].target.value).toBe("Text");
  });

  test("fire handleSubmit on enter", () => {
    userEvent.type(
      screen.getByPlaceholderText("Search for a product..."),
      "{enter}"
    );
    expect(mockedHandleSubmit.mock.calls.length).toBe(1);
  });

  test("fire handleSubmit on click on the button", () => {
    userEvent.click(screen.getByRole("button"));
    expect(mockedHandleSubmit.mock.calls.length).toBe(1);
  });
});

test("Search: set default value", () => {
  const mockedHandleChange = jest.fn();
  const mockedHandleSubmit = jest.fn();
  act(() => {
    render(
      <Search
        defaultValue="test"
        handleChange={mockedHandleChange}
        handleSubmit={mockedHandleSubmit}
      />
    );
  });
  expect(screen.getByPlaceholderText("Search for a product...").value).toBe(
    "test"
  );
});
