import AuthProvider, { AuthContext } from "../../components/auth/AuthContext";
import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import React, { useState } from "react";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

afterEach(() => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("sessionData");
});

test("Set sessionData in session storage", async () => {
  const setState = jest.fn();
  useState.mockImplementation((init) => [init, setState]);

  act(() => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ login }) =>
            login({ role: "admin", email: "admin@test.pl", token: "testToken" })
          }
        </AuthContext.Consumer>
      </AuthProvider>
    );
  });
  expect(sessionStorage.getItem("sessionData")).toBe(
    JSON.stringify({ role: "admin", email: "admin@test.pl" })
  );
});

test("Log in with data from session storage", async () => {
  sessionStorage.setItem(
    "sessionData",
    JSON.stringify({ role: "admin", email: "admin@test.pl" })
  );

  const setState = jest.fn();
  useState.mockImplementation((state) => [state, setState]);

  act(() => {
    render(<AuthProvider />);
  });
  expect(setState.mock.calls).toHaveLength(1);
  expect(setState.mock.calls[0][0]).toEqual({
    role: "admin",
    email: "admin@test.pl",
  });
});

test("attempt to log in with session storage data (with no data in session storage)", async () => {
  const setState = jest.fn();
  useState.mockImplementation((state) => [state, setState]);

  act(() => {
    render(<AuthProvider />);
  });
  expect(setState.mock.calls).toHaveLength(0);
});

test("Set token in session storage", async () => {
  const setState = jest.fn();
  useState.mockImplementation((init) => [init, setState]);

  act(() => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ login }) => login({ token: "testToken" })}
        </AuthContext.Consumer>
      </AuthProvider>
    );
  });
  expect(sessionStorage.getItem("token")).toBe("testToken");
});

test.only("Set state with session data", async () => {
  const setState = jest.fn();
  useState.mockImplementation((init) => [init, setState]);

  act(() => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ login }) =>
            login({
              role: "admin",
              email: "admin@test.pl",
              token: "testToken",
            })
          }
        </AuthContext.Consumer>
      </AuthProvider>
    );
  });
  expect(setState.mock.calls.length).toBe(1);
  expect(setState.mock.calls[0][0]).toEqual({
    role: "admin",
    email: "admin@test.pl",
  });
});

test("Set state with initial data", async () => {
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
  expect(setState.mock.calls[0][0]).toEqual({
    role: "guest",
    email: "",
  });
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
