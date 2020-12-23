import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { AuthContext } from "../auth/AuthContext";
import Navigation, { AccountNav, CustomerNav } from "./Navigation";
import { BrowserRouter } from "react-router-dom";
import { userType } from "../constants/constants";

test("Navigation: renders correcty (admin)", () => {
  act(() => {
    render(
      <AuthContext.Provider
        value={{
          role: userType.admin,
          email: "admin@test.pl",
          login: jest.fn(),
          logout: jest.fn(),
        }}
      >
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  });
  expect(screen.getByText("Products")).toBeInTheDocument();
  expect(screen.getByText("Add product")).toBeInTheDocument();
  expect(screen.getByText("Product list")).toBeInTheDocument();
  expect(screen.getByText("Logout")).toBeInTheDocument();
  expect(screen.getByText("admin@test.pl")).toBeInTheDocument();
});

test("Navigation: renders correctly (loggedInCustomer)", () => {
  act(() => {
    render(
      <AuthContext.Provider
        value={{
          role: userType.loggedInCustomer,
          email: "loggedInCustomer@test.pl",
          login: jest.fn(),
          logout: jest.fn(),
        }}
      >
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  });
  const links = screen.getAllByRole("link");
  expect(links[0].getAttribute("href")).toBe("/");
  expect(links[1].getAttribute("href")).toBe("/cart");
  expect(screen.queryByText("Sign in")).not.toBeInTheDocument();
  expect(screen.getByText("Logout")).toBeInTheDocument();
  expect(screen.getByText("loggedInCustomer@test.pl")).toBeInTheDocument();
});

test("Navigation: renders correctly (guest)", () => {
  act(() => {
    render(
      <AuthContext.Provider
        value={{
          role: userType.guest,
          email: "",
          login: jest.fn(),
          logout: jest.fn(),
        }}
      >
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  });
  const links = screen.getAllByRole("link");
  expect(links[0].getAttribute("href")).toBe("/");
  expect(links[1].getAttribute("href")).toBe("/cart");
  expect(links[2].getAttribute("href")).toBe("/login");
  expect(links[2].textContent).toBe("Sign in");
  expect(links[3].getAttribute("href")).toBe("/registration");
  expect(links[3].textContent).toBe("Sign up");
  expect(screen.queryByText("Logout")).not.toBeInTheDocument();
});

test("AccountNav: renders correctly (admin)", () => {
  act(() => {
    render(
      <BrowserRouter>
        <AccountNav
          role={userType.admin}
          email="admin@test.pl"
          logout={jest.fn()}
        />
      </BrowserRouter>
    );
  });
  const changePasswordLink = screen.getByRole("link");
  expect(changePasswordLink.getAttribute("href")).toBe(
    "/admin/change-password"
  );
  expect(changePasswordLink.textContent).toBe("Change password");
  expect(screen.getByText("Logout")).toBeInTheDocument();
  expect(screen.getByText("admin@test.pl")).toBeInTheDocument();
});

test("AccountNav: renders correctly (customer)", () => {
  act(() => {
    render(
      <BrowserRouter>
        <AccountNav
          role={userType.loggedInCustomer}
          email="customer@test.pl"
          logout={jest.fn()}
        />
      </BrowserRouter>
    );
  });
  const links = screen.getAllByRole("link");
  expect(links[0].getAttribute("href")).toBe("/change-data");
  expect(links[0].textContent).toBe("Change data");
  expect(links[1].getAttribute("href")).toBe("/orders");
  expect(links[1].textContent).toBe("My orders");
  expect(screen.getByText("Logout")).toBeInTheDocument();
  expect(screen.getByText("customer@test.pl")).toBeInTheDocument();
});

test("CustomerNav: renders correctly (guest)", () => {
  act(() => {
    render(
      <BrowserRouter>
        <CustomerNav role={userType.guest} />
      </BrowserRouter>
    );
  });
  const links = screen.getAllByRole("link");
  expect(links[0].getAttribute("href")).toBe("/");
  expect(links[1].getAttribute("href")).toBe("/cart");
  expect(links[2].getAttribute("href")).toBe("/login");
  expect(links[2].textContent).toBe("Sign in");
  expect(links[3].getAttribute("href")).toBe("/registration");
  expect(links[3].textContent).toBe("Sign up");
  expect(screen.queryByText("Logout")).not.toBeInTheDocument();
});

test("CustomerNav: renders correctly (loggedInCustomer)", () => {
  act(() => {
    render(
      <BrowserRouter>
        <CustomerNav
          role={userType.loggedInCustomer}
          email="loggedInCustomer@test.pl"
          logout={jest.fn()}
        />
      </BrowserRouter>
    );
  });
  const links = screen.getAllByRole("link");
  expect(links[0].getAttribute("href")).toBe("/");
  expect(links[1].getAttribute("href")).toBe("/cart");
  expect(screen.queryByText("Sign in")).not.toBeInTheDocument();
  expect(screen.getByText("Logout")).toBeInTheDocument();
  expect(screen.getByText("loggedInCustomer@test.pl")).toBeInTheDocument();
});
