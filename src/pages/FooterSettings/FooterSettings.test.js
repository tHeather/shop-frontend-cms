import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { JsonFetch } from "../../components/fetches/Fetches";
import { settings } from "../../settings";
import { MemoryRouter, Route } from "react-router";
import FooterSettings from "./FooterSettings";
import userEvent from "@testing-library/user-event";

jest.mock("../../components/fetches/Fetches");

describe("Get data", () => {
  test("make request with correct parametrs (GET)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          monFriHours: "08:00-16:00",
          satSunHours: "10:00-15:00",
          telephone: "123-456-789",
          email: "test@test.com",
          text: "Some text in footer",
        }),
    });

    act(() => {
      render(<FooterSettings />);
    });

    await waitForElementToBeRemoved(screen.getByTestId("loader"));

    expect(JsonFetch.mock.calls).toHaveLength(1);
    expect(JsonFetch.mock.calls[0][0]).toBe(`${settings.baseURL}/api/footer`);
    expect(JsonFetch.mock.calls[0][1]).toBe("GET");
    expect(JsonFetch.mock.calls[0][2]).toBe(false);
    expect(JsonFetch.mock.calls[0][3]).toBe(null);
  });

  test("handle server response (GET,200)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          monFriHours: "08:00-16:00",
          satSunHours: "10:00-15:00",
          telephone: "123-456-789",
          email: "test@test.com",
          text: "Some text in footer",
        }),
    });

    act(() => {
      render(<FooterSettings />);
    });

    expect(await screen.findByTestId("footerSettingsForm")).toHaveFormValues({
      monFriHours: "08:00-16:00",
      satSunHours: "10:00-15:00",
      telephone: "123-456-789",
      email: "test@test.com",
      text: "Some text in footer",
    });
  });

  test("handle server response (GET,500)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 500,
    });
    act(() => {
      render(
        <MemoryRouter initialEntries={["/product"]}>
          <Route exact path="/product">
            <FooterSettings />
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
    expect(screen.queryByTestId("footerSettingsForm")).not.toBeInTheDocument();
  });
});

describe("Update data", () => {
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          monFriHours: "08:00-16:00",
          satSunHours: "10:00-15:00",
          telephone: "123-456-789",
          email: "test@test.com",
          text: "Some text in footer",
        }),
    });

    act(() => {
      render(
        <MemoryRouter initialEntries={["/product"]}>
          <Route exact path="/product">
            <FooterSettings />
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

    await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
  });

  test("make request with correct parametrs (PUT)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 201,
    });

    const emailInput = screen.getByLabelText("E-mail", { selector: "input" });

    userEvent.clear(emailInput);
    userEvent.type(emailInput, "newEmailAddress@test.com");
    userEvent.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    await waitFor(() =>
      expect(screen.getByTestId("footerSettingsForm")).toBeInTheDocument()
    );

    expect(JsonFetch.mock.calls).toHaveLength(2);
    expect(JsonFetch.mock.calls[1][0]).toBe(`${settings.baseURL}/api/footer`);
    expect(JsonFetch.mock.calls[1][1]).toBe("PUT");
    expect(JsonFetch.mock.calls[1][2]).toBe(true);
    expect(JsonFetch.mock.calls[1][3]).toEqual({
      monFriHours: "08:00-16:00",
      satSunHours: "10:00-15:00",
      telephone: "123-456-789",
      email: "newEmailAddress@test.com",
      text: "Some text in footer",
    });
  });

  test("handle server response (PUT, 201)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 201,
    });

    const emailInput = screen.getByLabelText("E-mail", { selector: "input" });

    userEvent.clear(emailInput);
    userEvent.type(emailInput, "newEmailAddress@test.com");
    userEvent.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    expect(
      await screen.findByText("Data successfully saved.")
    ).toBeInTheDocument();
    userEvent.click(
      screen.getByRole("button", {
        name: /ok/i,
      })
    );

    expect(await screen.findByTestId("footerSettingsForm")).toHaveFormValues({
      monFriHours: "08:00-16:00",
      satSunHours: "10:00-15:00",
      telephone: "123-456-789",
      email: "newEmailAddress@test.com",
      text: "Some text in footer",
    });
  });

  test("handle server response (PUT, 400)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 400,
      json: () => Promise.resolve({ errors: ["status 400"] }),
    });

    const emailInput = screen.getByLabelText("E-mail", { selector: "input" });

    userEvent.clear(emailInput);
    userEvent.type(emailInput, "newEmailAddress@test.com");
    userEvent.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    expect(await screen.findByText("status 400")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("closeErrorBtn"));

    expect(await screen.findByTestId("footerSettingsForm")).toHaveFormValues({
      monFriHours: "08:00-16:00",
      satSunHours: "10:00-15:00",
      telephone: "123-456-789",
      email: "newEmailAddress@test.com",
      text: "Some text in footer",
    });
  });

  test("handle server response (PUT, 401)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 401,
    });

    userEvent.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.queryByTestId("footerSettingsForm")).not.toBeInTheDocument();
  });

  test("handle server response (PUT, 403)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 403,
    });

    userEvent.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.queryByTestId("footerSettingsForm")).not.toBeInTheDocument();
  });

  test("handle server response (PUT, 500)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 500,
    });

    userEvent.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    expect(await screen.findByText("Server error")).toBeInTheDocument();
    expect(screen.queryByTestId("footerSettingsForm")).not.toBeInTheDocument();
  });
});
