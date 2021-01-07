import { act, render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { settings } from "../../settings";
import userEvent from "@testing-library/user-event";
import { ShopSettingsContext } from "../../components/shopSettingsContext/shopSettingsContext";
import ShopSettings from "./ShopSettings";
import { FormDataFetch } from "../../components/fetches/Fetches";
import { MemoryRouter, Route } from "react-router";

jest.mock("../../components/fetches/Fetches");

describe("shopSettings", () => {
  const mockedSetShopSettings = jest.fn();
  beforeEach(async () => {
    act(() => {
      render(
        <MemoryRouter initialEntries={["/settings"]}>
          <ShopSettingsContext.Provider
            value={{
              tertiaryColor: "#112233",
              secondaryColor: "#223344",
              leadingColor: "#334455",
              logo: "logo.png",
              currency: "PLN",
              setShopSettings: mockedSetShopSettings,
            }}
          >
            <Route path="/settings">
              <ShopSettings />
            </Route>
            <Route exact path="/500">
              <div>Server error</div>
            </Route>
            <Route exact path="/">
              <div>Login page</div>
            </Route>
          </ShopSettingsContext.Provider>
        </MemoryRouter>
      );
    });
  });

  test("fill form with initial data from context", () => {
    expect(screen.getByTestId("shopSettingsForm")).toHaveFormValues({
      tertiaryColor: "#112233",
      secondaryColor: "#223344",
      leadingColor: "#334455",
      logo: "",
      regulations: "",
      currency: "0",
    });
  });

  test("make update request with correct parameters (PUT)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          tertiaryColor: "#112233",
          secondaryColor: "#223344",
          leadingColor: "#334455",
          logo: "",
          regulations: "",
          currency: "5",
        }),
    });

    const selectTag = document.getElementById("currency");
    userEvent.selectOptions(selectTag, "5");
    userEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(screen.getByTestId("loader")).toBeInTheDocument()
    );

    expect(FormDataFetch.mock.calls).toHaveLength(1);
    expect(FormDataFetch.mock.calls[0][0]).toBe(
      `${settings.baseURL}/api/ShopSettings`
    );
    expect(FormDataFetch.mock.calls[0][1]).toBe("PUT");
    expect(Object.fromEntries(FormDataFetch.mock.calls[0][2])).toEqual({
      tertiaryColor: "#112233",
      secondaryColor: "#223344",
      leadingColor: "#334455",
      logo: "",
      regulations: "",
      currency: "5",
    });
  });

  test("handle server resposne (PUT, 200)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          tertiaryColor: "#112233",
          secondaryColor: "#223344",
          leadingColor: "#334455",
          regulations: "",
          logo: "",
          currency: "5",
        }),
    });

    expect(screen.getByTestId("shopSettingsForm")).toHaveFormValues({
      tertiaryColor: "#112233",
      secondaryColor: "#223344",
      leadingColor: "#334455",
      regulations: "",
      logo: "",
      currency: "0",
    });

    const selectTag = document.getElementById("currency");
    userEvent.selectOptions(selectTag, "5");
    userEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(screen.getByTestId("loader")).toBeInTheDocument()
    );

    expect(
      screen.getByText("Settings successfully saved.")
    ).toBeInTheDocument();
    userEvent.click(screen.getByText("OK"));

    expect(mockedSetShopSettings.mock.calls).toHaveLength(1);
    expect(mockedSetShopSettings.mock.calls[0][0]).toEqual({
      tertiaryColor: "#112233",
      secondaryColor: "#223344",
      leadingColor: "#334455",
      regulations: "",
      logo: "",
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
      tertiaryColor: "#112233",
      secondaryColor: "#223344",
      leadingColor: "#334455",
      regulations: "",
      logo: "",
      currency: "0",
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
