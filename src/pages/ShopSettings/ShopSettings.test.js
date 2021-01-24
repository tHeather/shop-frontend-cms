import { act, render, waitFor, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { settings } from "../../settings";
import userEvent from "@testing-library/user-event";
import { ShopSettingsContext } from "../../components/shopSettingsContext/shopSettingsContext";
import ShopSettings from "./ShopSettings";
import { FormDataFetch, JsonFetch } from "../../components/fetches/Fetches";
import { MemoryRouter, Route } from "react-router";
import { ThemeProvider } from "styled-components";

jest.mock("../../components/fetches/Fetches");
const regulations = new File(["regulations"], "regulations.pdf", {
  type: "application/pdf",
});
const logo = new File(["logo"], "logo.png", { type: "image/png" });
const themes = [
  { id: 1, name: "Green, grey and white" },
  { id: 2, name: "Balck, red and white" },
];

const DEFAULT_THEME = {
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
};

describe("shopSettings", () => {
  const mockedSetShopSettings = jest.fn();
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () => Promise.resolve(themes),
    });
    act(() => {
      render(
        <MemoryRouter initialEntries={["/settings"]}>
          <ShopSettingsContext.Provider
            value={{
              theme: DEFAULT_THEME,
              logo: "",
              currency: "1",
              regulations: "",
              setShopSettings: mockedSetShopSettings,
            }}
          >
            <ThemeProvider theme={DEFAULT_THEME}>
              <Route path="/settings">
                <ShopSettings />
              </Route>
              <Route exact path="/500">
                <div>Server error</div>
              </Route>
              <Route exact path="/">
                <div>Login page</div>
              </Route>
            </ThemeProvider>
          </ShopSettingsContext.Provider>
        </MemoryRouter>
      );
    });

    await waitFor(() =>
      expect(screen.getByTestId("shopSettingsForm")).toBeInTheDocument()
    );
  });

  test("fetch themes and set them into select", () => {
    const themeSelect = document.getElementById("themeId");
    const options = within(themeSelect).getAllByRole("option");
    themes.forEach((theme, index) => {
      expect(options[index]).toHaveValue(theme.id.toString());
      expect(options[index]).toHaveTextContent(theme.name.toString());
    });
  });

  test("fill form with initial data from context", () => {
    expect(screen.getByTestId("shopSettingsForm")).toHaveFormValues({
      themeId: "1",
      logo: "",
      regulations: "",
      currency: "1",
    });
  });

  test("make update request with correct parameters (PUT)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          themeId: "2",
          logo: "logo.png",
          regulations: "regulations.pdf",
          currency: "5",
        }),
    });

    const themeSelect = document.getElementById("themeId");
    const currencySelect = document.getElementById("currency");
    const logoInput = document.getElementById("logo");
    const regulationsInput = document.getElementById("regulations");

    userEvent.selectOptions(themeSelect, "2");
    userEvent.selectOptions(currencySelect, "5");
    userEvent.upload(logoInput, logo);

    await waitFor(() =>
      expect(screen.getByAltText("logo")).toBeInTheDocument()
    );

    userEvent.upload(regulationsInput, regulations);
    userEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(
        screen.getByText("Settings saved successfully.")
      ).toBeInTheDocument()
    );

    expect(FormDataFetch.mock.calls).toHaveLength(1);
    expect(FormDataFetch.mock.calls[0][0]).toBe(
      `${settings.backendApiUrl}/api/ShopSettings`
    );
    expect(FormDataFetch.mock.calls[0][1]).toBe("PUT");
    expect(Object.fromEntries(FormDataFetch.mock.calls[0][2])).toStrictEqual({
      themeId: "2",
      logo,
      regulations,
      currency: "5",
    });
  });

  test("handle server resposne (PUT, 200)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          themeId: "1",
          logo: "logo.png",
          regulations: "regulations.pdf",
          currency: "5",
        }),
    });

    expect(screen.getByTestId("shopSettingsForm")).toHaveFormValues({
      themeId: "1",
      logo: "",
      regulations: "",
      currency: "1",
    });

    const selectTag = document.getElementById("currency");
    userEvent.selectOptions(selectTag, "5");
    userEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(screen.getByTestId("loader")).toBeInTheDocument()
    );

    expect(
      screen.getByText("Settings saved successfully.")
    ).toBeInTheDocument();
    userEvent.click(screen.getByText("OK"));

    expect(mockedSetShopSettings.mock.calls).toHaveLength(1);
    expect(mockedSetShopSettings.mock.calls[0][0]).toEqual({
      themeId: "1",
      logo: "logo.png",
      regulations: "regulations.pdf",
      currency: "5",
    });
  });

  test("handle server resposne (PUT, 400)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 400,
      json: () => Promise.resolve({ errors: ["error 400"] }),
    });

    const selectTag = document.getElementById("currency");
    userEvent.selectOptions(selectTag, "5");
    userEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(screen.getByTestId("loader")).toBeInTheDocument()
    );

    expect(screen.getByText("error 400")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("closeErrorBtn"));

    expect(screen.getByTestId("shopSettingsForm")).toHaveFormValues({
      themeId: "1",
      regulations: "",
      logo: "",
      currency: "1",
    });
  });

  test("handle server response (PUT, 401)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 401,
    });

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.queryByTestId("shopSettingsForm")).not.toBeInTheDocument();
  });

  test("handle server response (PUT, 403)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 403,
    });

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.queryByTestId("shopSettingsForm")).not.toBeInTheDocument();
  });

  test("handle server response (PUT, 500)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 500,
    });

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Server error")).toBeInTheDocument();
    expect(screen.queryByTestId("shopSettingsForm")).not.toBeInTheDocument();
  });
});
