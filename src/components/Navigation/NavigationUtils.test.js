import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import {
  Collapse,
  DisplayLinks,
} from "../Utils/NavigationUtils/NavigationUtils";
import { MemoryRouter } from "react-router";

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
