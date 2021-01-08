import AuthProvider from "../../components/auth/AuthContext";
import Login from "./Login";
import { JsonFetch } from "../../components/fetches/Fetches";
import { act, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route } from "react-router";
import { settings } from "../../settings";
import ServerError from "../ErrorPages/ServerError";

jest.mock("../../components/fetches/Fetches");

describe("Login", () => {
  beforeEach(() => {
    act(() => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <AuthProvider>
            <Route exact to="/login" component={() => <Login />} />
            <Route exact to="/500" component={() => <ServerError />} />
            <Route exact path="/orders" component={() => <div>orders</div>} />
          </AuthProvider>
        </MemoryRouter>
      );
    });
  });

  test("prevent submitting empty form", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 400,
    });

    userEvent.click(screen.getByText("Log in"));

    expect(JsonFetch.mock.calls).toHaveLength(0);
    expect(
      await screen.findByText("E-mail and password are required.")
    ).toBeInTheDocument();
  });

  test("prevent submitting form without e-mail value", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 400,
    });

    userEvent.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password"
    );
    userEvent.click(screen.getByText("Log in"));

    expect(JsonFetch.mock.calls).toHaveLength(0);
    expect(
      await screen.findByText("E-mail and password are required.")
    ).toBeInTheDocument();
  });

  test("prevent submitting form without password value", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 400,
    });

    userEvent.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "test@test.com"
    );
    userEvent.click(screen.getByText("Log in"));

    expect(JsonFetch.mock.calls).toHaveLength(0);
    expect(
      await screen.findByText("E-mail and password are required.")
    ).toBeInTheDocument();
  });

  test("make request with correct parameters", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () => Promise.resolve({ email: "test@test.com" }),
    });

    userEvent.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "test@test.com"
    );

    userEvent.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password"
    );

    userEvent.click(screen.getByText("Log in"));

    await waitFor(() => expect(screen.getByText("orders")).toBeInTheDocument());

    expect(JsonFetch.mock.calls).toHaveLength(1);
    expect(JsonFetch.mock.calls[0][0]).toBe(
      `${settings.backendApiUrl}/api/Auth/login`
    );
    expect(JsonFetch.mock.calls[0][1]).toBe("POST");
    expect(JsonFetch.mock.calls[0][2]).toBe(false);
    expect(JsonFetch.mock.calls[0][3]).toEqual({
      email: "test@test.com",
      password: "password",
    });
  });

  test("handle server response (POST, 200)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () => Promise.resolve({ email: "test@test.com" }),
    });

    userEvent.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "test@test.com"
    );

    userEvent.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password"
    );

    userEvent.click(screen.getByText("Log in"));

    expect(await screen.findByText("orders")).toBeInTheDocument();
  });

  test("handle server response (POST, 400)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 400,
      json: () => Promise.resolve({ errors: ["status 400"] }),
    });

    userEvent.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "test@test.com"
    );

    userEvent.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password"
    );
    userEvent.click(screen.getByText("Log in"));

    expect(await screen.findByText("status 400")).toBeInTheDocument();
    expect(await screen.findByText("Log in")).toBeInTheDocument();
  });

  test("handle server response (POST, 401)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 401,
      json: () => Promise.resolve({ errors: ["status 401"] }),
    });

    userEvent.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "test@test.com"
    );

    userEvent.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password"
    );
    userEvent.click(screen.getByText("Log in"));

    expect(await screen.findByText("status 401")).toBeInTheDocument();
    expect(await screen.findByText("Log in")).toBeInTheDocument();
  });

  test("handle server response (POST, 500)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 500,
    });

    userEvent.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "test@test.com"
    );

    await userEvent.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password"
    );
    userEvent.click(screen.getByText("Log in"));

    expect(await screen.findByText("Server Error")).toBeInTheDocument();
  });
});
