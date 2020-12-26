import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DisplayImage } from "./ImageUtils";
import { settings } from "../../../settings";

describe("DisplayImage", () => {
  test("render component with given image", () => {
    act(() => {
      render(<DisplayImage src="testSource" alt="Test image" />);
    });

    const img = screen.getByRole("img");
    expect(img.getAttribute("src")).toBe(`${settings.baseURL}/testSource`);
    expect(img.getAttribute("alt")).toBe("Test image");
  });

  test("render component without given image", () => {
    act(() => {
      render(<DisplayImage />);
    });

    const img = screen.getByRole("img");
    expect(img.getAttribute("src")).toBe("imagePlaceholder.png");
    expect(img.getAttribute("alt")).toBe("");
  });
});
