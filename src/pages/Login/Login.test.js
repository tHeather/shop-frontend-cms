import AuthProvider from "../../components/auth/AuthContext";
import Login from "./Login";
import { JsonFetch } from "../../components/fetches/Fetches";

import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route } from "react-router";
import { userType } from "../../components/constants/constants";
import { settings } from "../../settings";
import ServerError from "../ErrorPages/ServerError";

jest.mock("../../components/fetches/Fetches");

test("prevent submitting empty form", async () => {
  JsonFetch.mockImplementation(() => {
    return {
      status: 400,
    };
  });

  act(() => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
  });

  act(() => {
    userEvent.click(screen.getByText("Log in"));
  });

  expect(JsonFetch.mock.calls.length).toBe(0);
  expect(
    await screen.findByText("E-mail and password are required.")
  ).toBeInTheDocument();
});

test("prevent submitting form without e-mail value", async () => {
  JsonFetch.mockImplementation(() => {
    return {
      status: 400,
    };
  });

  act(() => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
  });

  await act(async () => {
    await userEvent.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password"
    );
    userEvent.click(screen.getByText("Log in"));
  });

  expect(JsonFetch.mock.calls.length).toBe(0);
  expect(
    await screen.findByText("E-mail and password are required.")
  ).toBeInTheDocument();
});

test("prevent submitting form without password value", async () => {
  JsonFetch.mockImplementation(() => {
    return {
      status: 400,
    };
  });

  act(() => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
  });

  await act(async () => {
    await userEvent.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "test@test.com"
    );
    userEvent.click(screen.getByText("Log in"));
  });

  expect(JsonFetch.mock.calls.length).toBe(0);
  expect(
    await screen.findByText("E-mail and password are required.")
  ).toBeInTheDocument();
});

test("make request with correct parameters", async () => {
  JsonFetch.mockImplementation(() => {
    return {
      status: 200,
      json: () => Promise.resolve({ role: userType.admin }),
    };
  });

  act(() => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
          <Route
            exact
            path="/admin/orders"
            component={() => <div>orders (Admin panel)</div>}
          />
        </AuthProvider>
      </MemoryRouter>
    );
  });

  await act(async () => {
    await userEvent.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "test@test.com"
    );

    await userEvent.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password"
    );

    userEvent.click(screen.getByText("Log in"));
  });

  expect(JsonFetch.mock.calls.length).toBe(1);
  expect(JsonFetch.mock.calls[0][0]).toBe(`${settings.baseURL}/auth/login`);
  expect(JsonFetch.mock.calls[0][1]).toBe("POST");
  expect(JsonFetch.mock.calls[0][2]).toBe(false);
  expect(JsonFetch.mock.calls[0][3]).toEqual({
    username: "test@test.com",
    password: "password",
  });
});

test("handle server response (status 200, admin)", async () => {
  JsonFetch.mockResolvedValue({
    status: 200,
    json: () => Promise.resolve({ role: userType.admin }),
  });

  act(() => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
          <Route
            exact
            path="/admin/orders"
            component={() => <div>orders (Admin panel)</div>}
          />
        </AuthProvider>
      </MemoryRouter>
    );
  });

  await act(async () => {
    userEvent.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "test@test.com"
    );

    await userEvent.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password"
    );
    userEvent.click(screen.getByText("Log in"));
  });

  expect(await screen.findByText("orders (Admin panel)")).toBeInTheDocument();
});

test("handle server response (status 200, logged in customer)", async () => {
  JsonFetch.mockResolvedValue({
    status: 200,
    json: () => Promise.resolve({ role: userType.loggedInCustomer }),
  });

  act(() => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
          <Route
            exact
            path="/orders"
            component={() => <div>orders (Logged in customer panel)</div>}
          />
        </AuthProvider>
      </MemoryRouter>
    );
  });

  await act(async () => {
    userEvent.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "test@test.com"
    );

    await userEvent.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password"
    );
    userEvent.click(screen.getByText("Log in"));
  });

  expect(
    await screen.findByText("orders (Logged in customer panel)")
  ).toBeInTheDocument();
});

test("handle server response (status 400)", async () => {
  JsonFetch.mockResolvedValue({
    status: 400,
    json: () => Promise.resolve({ message: ["status 400"] }),
  });

  act(() => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
  });

  await act(async () => {
    userEvent.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "test@test.com"
    );

    await userEvent.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password"
    );
    userEvent.click(screen.getByText("Log in"));
  });

  expect(await screen.findByText("status 400")).toBeInTheDocument();
  expect(await screen.findByText("Log in")).toBeInTheDocument();
});

test("handle server response (status 401)", async () => {
  JsonFetch.mockResolvedValue({
    status: 401,
    json: () => Promise.resolve({ message: ["status 401"] }),
  });

  act(() => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
  });

  await act(async () => {
    userEvent.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "test@test.com"
    );

    await userEvent.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password"
    );
    userEvent.click(screen.getByText("Log in"));
  });

  expect(await screen.findByText("status 401")).toBeInTheDocument();
  expect(await screen.findByText("Log in")).toBeInTheDocument();
});

test("handle server response (status 500)", async () => {
  JsonFetch.mockResolvedValue({
    status: 500,
  });

  act(() => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Route exact to="/login" component={() => <Login />} />
          <Route exact to="/500" component={() => <ServerError />} />
        </AuthProvider>
      </MemoryRouter>
    );
  });

  await act(async () => {
    userEvent.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "test@test.com"
    );

    await userEvent.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password"
    );
    userEvent.click(screen.getByText("Log in"));
  });

  expect(await screen.findByText("Server Error")).toBeInTheDocument();
});
