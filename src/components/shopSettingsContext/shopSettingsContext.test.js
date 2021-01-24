import { act, render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { JsonFetch } from "../fetches/Fetches";
import ShopSettingsProvider, {
  ShopSettingsContext,
} from "./shopSettingsContext";
import { settings } from "../../settings";
import userEvent from "@testing-library/user-event";

jest.mock("../fetches/Fetches");

describe("gestSettings (GET)", () => {
  const valueChecker = jest.fn();
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          theme: {
            id: 1,
            name: "Green, grey and white",
            secondaryBackgroundColor: "#f1f1f1",
            secondaryTextColor: "#000000",
            leadingBackgroundColor: "#02d463",
            leadingTextColor: "#000000",
            navbarBackgroundColor: "#ffffff",
            navbarTextColor: "#000000",
            mainBackgroundColor: "#ffffff",
            mainTextColor: "#000000",
            footerBackgroundColor: "#ffffff",
            footerTextColor: "#000000",
          },
          logo: "logo.png",
          currency: "1",
          regulations: "regulations.pdf",
        }),
    });

    act(() => {
      render(
        <ShopSettingsProvider>
          <ShopSettingsContext.Consumer>
            {({ setShopSettings, ...contextData }) => {
              valueChecker(contextData);
              return (
                <button
                  data-testid="setDataBtn"
                  onClick={() =>
                    setShopSettings({
                      theme: {
                        id: 2,
                        name: "theme2",
                        secondaryBackgroundColor: "#f1f1f1",
                        secondaryTextColor: "#000000",
                        leadingBackgroundColor: "#02d463",
                        leadingTextColor: "#000000",
                        navbarBackgroundColor: "#ffffff",
                        navbarTextColor: "#333333",
                        mainBackgroundColor: "#ffffff",
                        mainTextColor: "#000000",
                        footerBackgroundColor: "#ffffff",
                        footerTextColor: "#000000",
                      },
                      logo: "logo2.png",
                      currency: "2",
                      regulations: "regulations2.pdf",
                    })
                  }
                >
                  Set data
                </button>
              );
            }}
          </ShopSettingsContext.Consumer>
        </ShopSettingsProvider>
      );
    });
    await waitFor(() =>
      expect(screen.getByTestId("setDataBtn")).toBeInTheDocument()
    );
  });

  test("make request with correct parameters (on mount)", async () => {
    expect(JsonFetch.mock.calls).toHaveLength(1);
    expect(JsonFetch.mock.calls[0][0]).toBe(
      `${settings.backendApiUrl}/api/ShopSettings`
    );
    expect(JsonFetch.mock.calls[0][1]).toBe("GET");
    expect(JsonFetch.mock.calls[0][2]).toBe(false);
    expect(JsonFetch.mock.calls[0][3]).toBe(null);
  });

  test("add fetched data to context", async () => {
    expect(valueChecker.mock.calls).toHaveLength(1);
    expect(valueChecker.mock.calls[0][0]).toStrictEqual({
      theme: {
        id: 1,
        name: "Green, grey and white",
        secondaryBackgroundColor: "#f1f1f1",
        secondaryTextColor: "#000000",
        leadingBackgroundColor: "#02d463",
        leadingTextColor: "#000000",
        navbarBackgroundColor: "#ffffff",
        navbarTextColor: "#000000",
        mainBackgroundColor: "#ffffff",
        mainTextColor: "#000000",
        footerBackgroundColor: "#ffffff",
        footerTextColor: "#000000",
      },
      logo: "logo.png",
      currency: "1",
      regulations: "regulations.pdf",
    });
  });

  test("set context data via passed function", async () => {
    const setDataBtn = screen.getByTestId("setDataBtn");
    userEvent.click(setDataBtn);
    await waitFor(() => expect(setDataBtn).toBeInTheDocument());
    expect(valueChecker.mock.calls).toHaveLength(2);
    expect(valueChecker.mock.calls[1][0]).toStrictEqual({
      theme: {
        id: 2,
        name: "theme2",
        secondaryBackgroundColor: "#f1f1f1",
        secondaryTextColor: "#000000",
        leadingBackgroundColor: "#02d463",
        leadingTextColor: "#000000",
        navbarBackgroundColor: "#ffffff",
        navbarTextColor: "#333333",
        mainBackgroundColor: "#ffffff",
        mainTextColor: "#000000",
        footerBackgroundColor: "#ffffff",
        footerTextColor: "#000000",
      },
      logo: "logo2.png",
      currency: "2",
      regulations: "regulations2.pdf",
    });
  });
});
