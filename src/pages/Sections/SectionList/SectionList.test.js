import { act, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import SectionList, { DisplaySections } from "./SectionList";
import { MemoryRouter, Route } from "react-router";
import { JsonFetch } from "../../../components/fetches/Fetches";
import { settings } from "../../../settings";

jest.mock("../../../components/fetches/Fetches");

describe("DisplaySections: with sections to dispaly", () => {
  const mockedsetSelectedSectionId = jest.fn();
  const mockerDeleteSection = jest.fn();
  const sections = [
    { id: 1, title: "section1" },
    { id: 2, title: "section2" },
  ];

  beforeEach(() => {
    act(() => {
      render(
        <DisplaySections
          sections={sections}
          setSelectedSectionId={mockedsetSelectedSectionId}
          deleteSection={mockerDeleteSection}
          setIsDeleted="setIsDeleted"
          setIsLoading="setIsLoading"
          history="history"
        />
      );
    });
  });

  test("render list correctly", () => {
    const list = screen.getByRole("list");
    const listItems = within(list).getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
    expect(within(listItems[0]).getByText("section1")).toBeInTheDocument();
    const section1Btns = within(listItems[0]).getAllByRole("button");
    expect(section1Btns).toHaveLength(2);
  });

  test("handle onClick event on edit button", () => {
    const list = screen.getByRole("list");
    const listItems = within(list).getAllByRole("listitem");
    const section1Btns = within(listItems[0]).getAllByRole("button");
    userEvent.click(section1Btns[0]);
    expect(mockedsetSelectedSectionId.mock.calls).toHaveLength(1);
    expect(mockedsetSelectedSectionId.mock.calls[0][0]).toBe(1);
  });

  test("handle onClick event on delete button", () => {
    const list = screen.getByRole("list");
    const listItems = within(list).getAllByRole("listitem");
    const section1Btns = within(listItems[0]).getAllByRole("button");
    userEvent.click(section1Btns[1]);
    expect(mockerDeleteSection.mock.calls).toHaveLength(1);
    expect(mockerDeleteSection.mock.calls[0][0]).toBe(1);
    expect(mockerDeleteSection.mock.calls[0][1]).toBe("setIsDeleted");
    expect(mockerDeleteSection.mock.calls[0][2]).toBe("setIsLoading");
    expect(mockerDeleteSection.mock.calls[0][3]).toBe("history");
  });
});

test("DisplaySections: render component without sections to display", () => {
  act(() => {
    render(<DisplaySections sections={[]} />);
  });

  expect(screen.getByText("There are no sections yet.")).toBeInTheDocument();
});

describe("SectionList", () => {
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve([
          { id: 1, title: "section1" },
          { id: 2, title: "section2" },
        ]),
    });

    act(() => {
      render(
        <MemoryRouter initialEntries={["/admin/sections"]}>
          <Route
            exact
            path="/admin/sections"
            component={() => <SectionList />}
          />
          <Route exact path="/" component={() => <div>Login page</div>} />
          <Route exact path="/500" component={() => <div>Server error</div>} />
        </MemoryRouter>
      );
    });
    await waitFor(async () =>
      expect(await screen.findByText("section1")).toBeInTheDocument()
    );
  });

  test("make request with correct parameters (GET)", async () => {
    expect(JsonFetch.mock.calls.length).toBe(1);
    expect(JsonFetch.mock.calls[0][0]).toBe(
      `${settings.baseURL}/section/section-names`
    );
    expect(JsonFetch.mock.calls[0][1]).toBe("GET");
    expect(JsonFetch.mock.calls[0][2]).toBe(false);
    expect(JsonFetch.mock.calls[0][3]).toBe(null);
  });
  test("render component correctly with (GET, 200)", async () => {
    expect(await screen.findByText("section1")).toBeInTheDocument();
    expect(await screen.findByText("section2")).toBeInTheDocument();
  });

  test("make request with correct parameters (DELETE)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 204,
    });

    const list = screen.getByRole("list");
    const listItems = within(list).getAllByRole("listitem");
    const section1Btns = within(listItems[0]).getAllByRole("button");
    userEvent.click(section1Btns[1]);
    expect(
      await screen.findByText("Successfully deleted the section.")
    ).toBeInTheDocument();

    expect(JsonFetch.mock.calls.length).toBe(2);
    expect(JsonFetch.mock.calls[1][0]).toBe(`${settings.baseURL}/section/1`);
    expect(JsonFetch.mock.calls[1][1]).toBe("DELETE");
    expect(JsonFetch.mock.calls[1][2]).toBe(true);
    expect(JsonFetch.mock.calls[1][3]).toBe(null);
  });

  test("handle server response (DELETE, 204)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 204,
    }).mockReturnValueOnce({
      status: 200,
      json: () => Promise.resolve([{ id: 2, title: "section2" }]),
    });

    const list = screen.getByRole("list");
    const listItems = within(list).getAllByRole("listitem");
    const section1Btns = within(listItems[0]).getAllByRole("button");
    userEvent.click(section1Btns[1]);

    expect(
      await screen.findByText("Successfully deleted the section.")
    ).toBeInTheDocument();
    userEvent.click(screen.getByText("OK"));

    expect(
      screen.queryByText("Successfully deleted the section.")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("section1")).not.toBeInTheDocument();
    expect(await screen.findByText("section2")).toBeInTheDocument();
  });

  test("handle server response (DELETE, 401)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 401,
    });

    const list = screen.getByRole("list");
    const listItems = within(list).getAllByRole("listitem");
    const section1Btns = within(listItems[0]).getAllByRole("button");
    userEvent.click(section1Btns[1]);

    expect(screen.queryByText("section1")).not.toBeInTheDocument();
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  test("handle server response (DELETE, 403)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 403,
    });

    const list = screen.getByRole("list");
    const listItems = within(list).getAllByRole("listitem");
    const section1Btns = within(listItems[0]).getAllByRole("button");
    userEvent.click(section1Btns[1]);

    expect(screen.queryByText("section1")).not.toBeInTheDocument();
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  test("handle server response (DELETE, 500)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 500,
    });

    const list = screen.getByRole("list");
    const listItems = within(list).getAllByRole("listitem");
    const section1Btns = within(listItems[0]).getAllByRole("button");
    userEvent.click(section1Btns[1]);

    expect(screen.queryByText("section1")).not.toBeInTheDocument();
    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });

  test("select section", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () => Promise.resolve({ title: "", products: [] }),
    });

    const list = screen.getByRole("list");
    const listItems = within(list).getAllByRole("listitem");
    const section1Btns = within(listItems[0]).getAllByRole("button");
    userEvent.click(section1Btns[0]);

    expect(screen.queryByText("section1")).not.toBeInTheDocument();
    expect(await screen.findByText("Back to list")).toBeInTheDocument();
  });
});

test("SectionList: handle server response (GET, 500)", async () => {
  JsonFetch.mockReturnValueOnce({
    status: 500,
  });

  act(() => {
    render(
      <MemoryRouter initialEntries={["/admin/sections"]}>
        <Route exact path="/admin/sections" component={() => <SectionList />} />
        <Route exact path="/500" component={() => <div>Server error</div>} />
      </MemoryRouter>
    );
  });

  expect(await screen.findByText("Server error")).toBeInTheDocument();
});
