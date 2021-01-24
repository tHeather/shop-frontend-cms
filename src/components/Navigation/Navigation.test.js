import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { AuthContext } from "../auth/AuthContext";
import Navigation, {
  AccountLinks,
  CollapseNavLinks,
  DisplayLinks,
  visualSettingsLinks,
  productLinks,
  ordersLinks,
  sections,
} from "./Navigation";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";

describe("CollapseNavLinks", () => {
  const content = ({ closeMenu, ...props }) => (
    <div {...props} onClick={closeMenu}>
      Some text inside container.
    </div>
  );
  const mockedCloseMenu = jest.fn();
  describe("Desktop version", () => {
    beforeEach(() => {
      act(() => {
        render(
          <ThemeProvider
            theme={{
              tertiaryColor: "#000000",
              secondaryColor: "#f1f1f1",
              leadingColor: "#02d463",
            }}
          >
            <CollapseNavLinks
              btnText="Test button text"
              Content={content}
              isMobile={false}
              closeMenu={mockedCloseMenu}
            />
          </ThemeProvider>
        );
      });
    });
    test("renders correctly", () => {
      expect(
        screen.getByRole("button", {
          name: /Test button text/,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Some text inside container.")
      ).toBeInTheDocument();
    });

    test("toggle opening state", () => {
      const container = screen.getByTestId("navCollapse");
      const content = screen.getByText("Some text inside container.");
      expect(content.getAttribute("style")).toBe("transform: scaleY(0);");
      userEvent.hover(container);
      expect(content.getAttribute("style")).toBe("transform: scaleY(1);");
      userEvent.unhover(container);
      expect(content.getAttribute("style")).toBe("transform: scaleY(0);");
    });

    test("pass closeMenu handler to onClick content", () => {
      const content = screen.getByText("Some text inside container.");
      userEvent.click(content);
      expect(mockedCloseMenu.mock.calls).toHaveLength(1);
    });
  });

  describe("Mobile version", () => {
    beforeEach(() => {
      act(() => {
        render(
          <ThemeProvider
            theme={{
              tertiaryColor: "#000000",
              secondaryColor: "#f1f1f1",
              leadingColor: "#02d463",
            }}
          >
            <CollapseNavLinks
              btnText="Test button text"
              Content={content}
              isMobile={true}
              closeMenu={mockedCloseMenu}
            />
          </ThemeProvider>
        );
      });
    });
    test("renders correctly", () => {
      expect(
        screen.getByRole("button", {
          name: /Test button text/,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Some text inside container.")
      ).toBeInTheDocument();
    });

    test("toggle opening state", () => {
      const button = screen.getByRole("button", {
        name: /Test button text/,
      });
      const content = screen.getByText("Some text inside container.");
      expect(content.getAttribute("style")).toBe("display: none;");
      expect(button.className.includes("activeMobileCollapseBtn")).toBe(false);
      userEvent.click(button);
      expect(content.getAttribute("style")).toBe("display: block;");
      expect(button.className.includes("activeMobileCollapseBtn")).toBe(true);
      userEvent.click(button);
      expect(content.getAttribute("style")).toBe("display: none;");
      expect(button.className.includes("activeMobileCollapseBtn")).toBe(false);
    });

    test("pass closeMenu handler to onClick content", () => {
      const content = screen.getByText("Some text inside container.");
      userEvent.click(content);
      expect(mockedCloseMenu.mock.calls).toHaveLength(1);
    });
  });
});

describe("DisplayLinks", () => {
  const links = [
    { label: "Test label 1", url: "/test1" },
    { label: "Test label 2", url: "/test2" },
  ];
  const mockedCloseMenu = jest.fn();

  test("with no likns", () => {
    expect(DisplayLinks({ links: null })).toBe(null);
  });

  beforeEach(() => {
    act(() => {
      render(
        <ThemeProvider
          theme={{
            tertiaryColor: "#000000",
            secondaryColor: "#f1f1f1",
            leadingColor: "#02d463",
          }}
        >
          <MemoryRouter>
            <DisplayLinks
              links={links}
              closeMenu={mockedCloseMenu}
              style={{ color: "red" }}
            />
          </MemoryRouter>
        </ThemeProvider>
      );
    });
  });

  test("render links correctly", () => {
    const linksArr = screen.getAllByRole("link");
    expect(linksArr.length).toBe(2);
    expect(linksArr[0].getAttribute("href")).toBe("/test1");
    expect(linksArr[1].getAttribute("href")).toBe("/test2");
    expect(linksArr[0].textContent).toBe("Test label 1");
    expect(linksArr[1].textContent).toBe("Test label 2");
  });

  test("pass closeMenu function to onClick", () => {
    const linksArr = screen.getAllByRole("link");
    userEvent.click(linksArr[0]);
    expect(mockedCloseMenu.mock.calls).toHaveLength(1);
    userEvent.click(linksArr[1]);
    expect(mockedCloseMenu.mock.calls).toHaveLength(2);
  });

  test("pass props to container", () => {
    expect(screen.getByRole("list").getAttribute("style")).toBe("color: red;");
  });
});

describe("AccountLinks", () => {
  const mockedCloseMenu = jest.fn();
  const mockedLogout = jest.fn();
  beforeEach(() => {
    act(() => {
      render(
        <ThemeProvider
          theme={{
            tertiaryColor: "#000000",
            secondaryColor: "#f1f1f1",
            leadingColor: "#02d463",
          }}
        >
          <MemoryRouter>
            <AccountLinks
              userEmail="test@test.pl"
              logout={mockedLogout}
              closeMenu={mockedCloseMenu}
              style={{ color: "red" }}
            />
          </MemoryRouter>
        </ThemeProvider>
      );
    });
  });

  test("render links correctly", () => {
    expect(screen.getByTestId("userEmail")).toHaveTextContent("test@test.pl");
    expect(
      screen
        .getByRole("link", {
          name: /Change password/,
        })
        .getAttribute("href")
    ).toBe("/change-password");
    expect(
      screen.getByRole("button", {
        name: /Logout/,
      })
    ).toBeInTheDocument();
  });

  test("handle logout", () => {
    userEvent.click(
      screen.getByRole("button", {
        name: /Logout/,
      })
    );
    expect(mockedLogout.mock.calls).toHaveLength(1);
  });

  test("handle close menu", () => {
    userEvent.click(
      screen.getByRole("link", {
        name: /Change password/,
      })
    );
    expect(mockedCloseMenu.mock.calls).toHaveLength(1);
  });

  test("pass props to container", () => {
    expect(
      screen.getByTestId("accountLinksContainer").getAttribute("style")
    ).toBe("color: red;");
  });
});

describe("Navigation", () => {
  test("render component correctly", () => {
    act(() => {
      render(
        <ThemeProvider
          theme={{
            tertiaryColor: "#000000",
            secondaryColor: "#f1f1f1",
            leadingColor: "#02d463",
          }}
        >
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
        </ThemeProvider>
      );
    });

    sections.forEach(({ btnText }) =>
      expect(screen.getByText(btnText)).toBeInTheDocument()
    );

    productLinks.forEach(({ label }) =>
      expect(screen.getByText(label)).toBeInTheDocument()
    );

    visualSettingsLinks.forEach(({ label }) =>
      expect(screen.getByText(label)).toBeInTheDocument()
    );

    ordersLinks.forEach(({ label }) =>
      expect(screen.getByText(label)).toBeInTheDocument()
    );

    expect(screen.getByText("Logout")).toBeInTheDocument();
    const changePasswordLink = screen.getByText("Change password");
    expect(changePasswordLink).toBeInTheDocument();
    expect(changePasswordLink.getAttribute("href")).toBe("/change-password");
    expect(screen.getByText("admin@test.pl")).toBeInTheDocument();
  });

  test("return null if user is not logged in", () => {
    act(() => {
      render(
        <ThemeProvider
          theme={{
            tertiaryColor: "#000000",
            secondaryColor: "#f1f1f1",
            leadingColor: "#02d463",
          }}
        >
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
        </ThemeProvider>
      );
    });

    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });
});
