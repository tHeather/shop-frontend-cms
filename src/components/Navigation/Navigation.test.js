import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { AuthContext } from "../auth/AuthContext";
import Navigation, { Collapse, DisplayLinks } from "./Navigation";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("Collapse", () => {
  beforeEach(() => {
    act(() => {
      render(
        <Collapse btnText="Test text">Some text inside container.</Collapse>
      );
    });
  });

  test("renders correctly", () => {
    expect(screen.getByRole("button").textContent).toBe("Test text");
    expect(screen.getByText("Some text inside container.")).toBeInTheDocument();
  });

  test("toggle opening state", () => {
    const button = screen.getByRole("button");
    const container = screen.getByText("Some text inside container.");

    const stylesBefore = window.getComputedStyle(container);
    expect(stylesBefore.getPropertyValue("transform")).toBe("scaleY(0)");

    act(() => {
      userEvent.click(button);
    });

    const stylesAfter = window.getComputedStyle(container);
    expect(stylesAfter.getPropertyValue("transform")).toBe("scaleY(1)");

    act(() => {
      userEvent.click(button);
    });

    const stylesFinal = window.getComputedStyle(container);
    expect(stylesFinal.getPropertyValue("transform")).toBe("scaleY(0)");
  });
});

describe("DisplayLinks", () => {
  const links = [
    { label: "Test label 1", url: "/test1" },
    { label: "Test label 2", url: "/test2" },
  ];

  test("with no likns", () => {
    expect(DisplayLinks({ links: null })).toBe(null);
  });

  test("render links correctly", () => {
    act(() => {
      render(
        <MemoryRouter>
          <DisplayLinks links={links} />
        </MemoryRouter>
      );
    });
    const linksArr = screen.getAllByRole("link");
    expect(linksArr.length).toBe(2);
    expect(linksArr[0].getAttribute("href")).toBe("/test1");
    expect(linksArr[1].getAttribute("href")).toBe("/test2");
    expect(linksArr[0].textContent).toBe("Test label 1");
    expect(linksArr[1].textContent).toBe("Test label 2");
  });
});

test("Navigation: render component correctly", () => {
  act(() => {
    render(
      <AuthContext.Provider
        value={{
          userEmail: "admin@test.pl",
          login: jest.fn(),
          logout: jest.fn(),
        }}
      >
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  });

  expect(screen.getByText("Products")).toBeInTheDocument();
  expect(screen.getByText("Add product")).toBeInTheDocument();
  expect(screen.getByText("Product list")).toBeInTheDocument();
  expect(screen.getByText("Visual settings")).toBeInTheDocument();
  expect(screen.getByText("Menu")).toBeInTheDocument();
  expect(screen.getByText("Current sections")).toBeInTheDocument();
  expect(screen.getByText("Add Section")).toBeInTheDocument();

  expect(screen.getByText("Logout")).toBeInTheDocument();
  const changePasswordLink = screen.getByText("Change password");
  expect(changePasswordLink).toBeInTheDocument();
  expect(changePasswordLink.getAttribute("href")).toBe("/change-password");
  expect(screen.getByText("admin@test.pl")).toBeInTheDocument();
});

test("Navigation: return null if user is not logged in", () => {
  act(() => {
    render(
      <AuthContext.Provider
        value={{
          userEmail: "",
          login: jest.fn(),
          logout: jest.fn(),
        }}
      >
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  });

  expect(screen.queryByText("Logout")).not.toBeInTheDocument();
});
