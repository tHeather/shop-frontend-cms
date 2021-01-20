import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Pagination, validatePagintaionInput } from "./Pagination";
import userEvent from "@testing-library/user-event";

describe.each([
  [3, 3],
  ["3", 3],
  ["", 1],
  [",", 1],
  [0, 1],
  [10, 5],
  ["a", 1],
])("validatePagintaionInput", (value, expected) => {
  test(`returns correct result  for input: ${value}`, () => {
    expect(validatePagintaionInput(value, 1, 5)).toBe(expected);
  });
});
describe("Pagination", () => {
  const mockedhandlePageNumberChange = jest.fn();
  beforeEach(() => {
    act(() => {
      render(
        <Pagination
          handlePageNumberChange={mockedhandlePageNumberChange}
          totalPages={5}
        />
      );
    });
  });

  test("render component correctly", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).not.toBeDisabled();
    expect(screen.getByRole("textbox")).toHaveValue("1");
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("change page number by buttons", () => {
    const buttons = screen.getAllByRole("button");
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("1");

    userEvent.click(buttons[1]);
    expect(mockedhandlePageNumberChange.mock.calls[0][0]).toBe(2);
    expect(input).toHaveValue("2");

    userEvent.click(buttons[0]);
    expect(input).toHaveValue("1");
    expect(mockedhandlePageNumberChange.mock.calls[1][0]).toBe(1);
  });

  test("change page number by input", () => {
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("1");

    userEvent.clear(input);
    userEvent.type(input, "2");
    userEvent.tab();
    expect(mockedhandlePageNumberChange.mock.calls[0][0]).toBe(2);
    expect(input).toHaveValue("2");

    userEvent.clear(input);
    userEvent.type(input, "3");
    userEvent.tab();
    expect(input).toHaveValue("3");
    expect(mockedhandlePageNumberChange.mock.calls[1][0]).toBe(3);
  });

  test("type text into input", () => {
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("1");
    userEvent.clear(input);
    userEvent.type(input, "text");
    userEvent.tab();
    expect(mockedhandlePageNumberChange.mock.calls).toHaveLength(0);
    expect(input).toHaveValue("1");
  });

  test("set page number to less than 1", () => {
    const buttons = screen.getAllByRole("button");
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("1");

    userEvent.clear(input);
    userEvent.type(input, "0");
    userEvent.tab();
    expect(mockedhandlePageNumberChange.mock.calls).toHaveLength(0);
    expect(input).toHaveValue("1");

    userEvent.click(buttons[0]);
    expect(input).toHaveValue("1");
  });

  test("set page number to more than total page number", () => {
    const input = screen.getByRole("textbox");
    const buttons = screen.getAllByRole("button");
    expect(input).toHaveValue("1");

    userEvent.clear(input);
    userEvent.type(input, "6");
    userEvent.tab();
    expect(mockedhandlePageNumberChange.mock.calls[0][0]).toBe(5);
    expect(input).toHaveValue("5");

    userEvent.click(buttons[1]);
    expect(input).toHaveValue("5");
  });
});
