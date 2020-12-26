import AuthProvider, { AuthContext } from "../../components/auth/AuthContext";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import React, { useState } from "react";
import userEvent from "@testing-library/user-event";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

afterEach(() => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("email");
});

test("set session data in session storage", async () => {
  const setState = jest.fn();
  useState.mockImplementation((init) => [init, setState]);

  act(() => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ login }) => (
            <button
              onClick={() =>
                login({ email: "admin@test.pl", token: "testToken" })
              }
            >
              Log in
            </button>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    );
  });

  userEvent.click(screen.getByText("Log in"));

  expect(sessionStorage.getItem("email")).toBe("admin@test.pl");
  expect(sessionStorage.getItem("token")).toBe("testToken");
});

test("set state with user email", async () => {
  const setState = jest.fn();
  useState.mockImplementation((init) => [init, setState]);

  act(() => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ login }) => (
            <button
              onClick={() =>
                login({ email: "admin@test.pl", token: "testToken" })
              }
            >
              Log in
            </button>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    );
  });

  userEvent.click(screen.getByText("Log in"));

  expect(setState.mock.calls).toHaveLength(1);
  expect(setState.mock.calls[0][0]).toEqual("admin@test.pl");
});

test("log in with data from session storage", async () => {
  sessionStorage.setItem("email", "admin@test.pl");

  const setState = jest.fn();
  useState.mockImplementation((state) => [state, setState]);

  act(() => {
    render(<AuthProvider />);
  });
  expect(setState.mock.calls).toHaveLength(1);
  expect(setState.mock.calls[0][0]).toEqual("admin@test.pl");
});

test("attempt to log in with session storage data (with empty session storage)", async () => {
  const setState = jest.fn();
  useState.mockImplementation((state) => [state, setState]);

  act(() => {
    render(<AuthProvider />);
  });
  expect(setState.mock.calls).toHaveLength(0);
});

test("Set state with initial data (logout)", async () => {
  const setState = jest.fn();
  useState.mockImplementation((init) => [init, setState]);

  act(() => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>{({ logout }) => logout()}</AuthContext.Consumer>
      </AuthProvider>
    );
  });
  expect(setState.mock.calls.length).toBe(1);
  expect(setState.mock.calls[0][0]).toEqual("");
});

test("Remove token from session storage", async () => {
  const setState = jest.fn();
  useState.mockImplementation((init) => [init, setState]);

  act(() => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>{({ logout }) => logout()}</AuthContext.Consumer>
      </AuthProvider>
    );
  });
  expect(sessionStorage.getItem("token")).toBe(null);
});
