import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Link, MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { AuthContext } from "../auth/AuthContext";
import Routing from "./Routing";

test("get access to private route (logged in user)", () => {
  act(() => {
    render(
      <AuthContext.Provider
        value={{
          userEmail: "admin@test.pl",
          login: jest.fn(),
          logout: jest.fn(),
        }}
      >
        <MemoryRouter initialEntries={["/"]}>
          <Routing />
          <Link to="/add-product">Add product</Link>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  });

  userEvent.click(screen.getByText("Add product"));
  expect(screen.getByTestId("saveProductForm")).toBeInTheDocument();
});

test("prevent getting access to private route (not logged in user)", () => {
  act(() => {
    render(
      <AuthContext.Provider
        value={{
          userEmail: "",
          login: jest.fn(),
          logout: jest.fn(),
        }}
      >
        <MemoryRouter initialEntries={["/"]}>
          <Routing />
          <Link to="/add-product">Add product</Link>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  });

  userEvent.click(screen.getByText("Add product"));
  expect(screen.getByText("Log in")).toBeInTheDocument();
});

test("404 route", () => {
  act(() => {
    render(
      <AuthContext.Provider
        value={{
          userEmail: "",
          login: jest.fn(),
          logout: jest.fn(),
        }}
      >
        <MemoryRouter initialEntries={["/not-existing-route"]}>
          <Routing />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  });

  expect(screen.getByText("404")).toBeInTheDocument();
});
