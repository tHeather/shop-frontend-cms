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
          tertiaryColor: "#112233",
          secondaryColor: "#223344",
          leadingColor: "#334455",
          logo: "logo.png",
          currency: "PLN",
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
                      tertiaryColor: "#998877",
                      secondaryColor: "#887766",
                      leadingColor: "#776655",
                      logo: "logo2.png",
                      currency: "EUR",
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
    expect(valueChecker.mock.calls[0][0]).toEqual({
      tertiaryColor: "#112233",
      secondaryColor: "#223344",
      leadingColor: "#334455",
      logo: "logo.png",
      currency: "PLN",
      regulations: "regulations.pdf",
    });
  });

  test("set context data via passed function", async () => {
    const setDataBtn = screen.getByTestId("setDataBtn");
    userEvent.click(setDataBtn);
    await waitFor(() => expect(setDataBtn).toBeInTheDocument());
    expect(valueChecker.mock.calls).toHaveLength(2);
    expect(valueChecker.mock.calls[1][0]).toEqual({
      tertiaryColor: "#998877",
      secondaryColor: "#887766",
      leadingColor: "#776655",
      logo: "logo2.png",
      currency: "EUR",
      regulations: "regulations2.pdf",
    });
  });
});
