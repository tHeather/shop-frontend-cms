import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter, Route } from "react-router";
import SliderSettings from "./SliderSettings";
import { FormDataFetch, JsonFetch } from "../../components/fetches/Fetches";
import { settings } from "../../settings";
import userEvent from "@testing-library/user-event";

jest.mock("../../components/fetches/Fetches");

const file1 = new File(["test1"], "test0.png", { type: "image/png" });
const file2 = new File(["test2"], "test1.png", { type: "image/png" });
const file3 = new File(["test3"], "test2.png", { type: "image/png" });
const file4 = new File(["test4"], "test3.png", { type: "image/png" });
const file5 = new File(["test5"], "test4.png", { type: "image/png" });

const objectOfObject = {
  firstSlide: file1,
  secondSlide: file2,
  thirdSlide: file3,
  fourthSlide: file4,
  fifthSlide: file5,
};

describe("getImages", () => {
  test("make request with correct parametrs (GET)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          firstSlide: "slide0.png",
          secondSlide: "slide1.png",
          thirdSlide: "slide2.png",
          fourthSlide: "slide3.png",
          fifthSlide: "slide4.png",
        }),
    });

    act(() => {
      render(<SliderSettings />);
    });

    await waitForElementToBeRemoved(() => screen.getByTestId("loader"));

    expect(JsonFetch.mock.calls).toHaveLength(1);
    expect(JsonFetch.mock.calls[0][0]).toBe(
      `${settings.backendApiUrl}/api/Slider`
    );
    expect(JsonFetch.mock.calls[0][1]).toBe("GET");
    expect(JsonFetch.mock.calls[0][2]).toBe(false);
    expect(JsonFetch.mock.calls[0][3]).toBe(null);
  });

  test("handle server response (GET, 200)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          firstSlide: "slide0.png",
          secondSlide: "slide1.png",
          thirdSlide: "slide2.png",
          fourthSlide: "slide3.png",
          fifthSlide: "slide4.png",
        }),
    });

    act(() => {
      render(<SliderSettings />);
    });

    await waitForElementToBeRemoved(() => screen.getByTestId("loader"));

    const imgs = screen.getAllByRole("img");

    imgs.forEach((img, index) =>
      expect(img.getAttribute("src")).toBe(
        `${settings.backendApiUrl}/slide${index}.png`
      )
    );
  });

  test("handle server response (GET, 500)", async () => {
    JsonFetch.mockReturnValueOnce({
      status: 500,
    });

    act(() => {
      render(
        <MemoryRouter initialEntries={["/slider"]}>
          <Route exact path="/slider">
            <SliderSettings />
          </Route>
          <Route exact path="/500">
            <div>Server error</div>
          </Route>
        </MemoryRouter>
      );
    });

    await waitForElementToBeRemoved(() => screen.getByTestId("loader"));

    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });
});

describe("updateImages (PUT)", () => {
  beforeEach(async () => {
    JsonFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          firstSlide: "",
          secondSlide: "",
          thirdSlide: "",
          fourthSlide: "",
          fifthSlide: "",
        }),
    });
    act(() => {
      render(
        <MemoryRouter initialEntries={["/slider"]}>
          <Route exact path="/slider">
            <SliderSettings />
          </Route>
          <Route exact path="/">
            <div>Login page</div>
          </Route>
          <Route exact path="/500">
            <div>Server error</div>
          </Route>
        </MemoryRouter>
      );
    });
    await waitForElementToBeRemoved(() => screen.getByTestId("loader"));
  });

  test("make request with correct parameters (PUT)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          firstSlide: "slide0.png",
          secondSlide: "slide1.png",
          thirdSlide: "slide2.png",
          fourthSlide: "slide3.png",
          fifthSlide: "slide4.png",
        }),
    });

    userEvent.upload(
      screen.getByLabelText("First slide", {
        selector: "input",
      }),
      file1
    );
    userEvent.upload(
      screen.getByLabelText("Second slide", {
        selector: "input",
      }),
      file2
    );
    userEvent.upload(
      screen.getByLabelText("Third slide", {
        selector: "input",
      }),
      file3
    );
    userEvent.upload(
      screen.getByLabelText("Fourth slide", {
        selector: "input",
      }),
      file4
    );
    userEvent.upload(
      screen.getByLabelText("Fifth slide", {
        selector: "input",
      }),
      file5
    );

    userEvent.click(screen.getByText("Save"));

    expect(
      await screen.findByText("Images successfully saved.")
    ).toBeInTheDocument();

    expect(FormDataFetch.mock.calls).toHaveLength(1);
    expect(FormDataFetch.mock.calls[0][0]).toBe(
      `${settings.backendApiUrl}/api/Slider`
    );
    expect(FormDataFetch.mock.calls[0][1]).toBe("PUT");
    const payload = Object.fromEntries(FormDataFetch.mock.calls[0][2]);
    for (const slide in payload) {
      expect(payload[slide] === objectOfObject[slide]).toBe(true);
    }
  });

  test("handle server response (PUT, 200)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          firstSlide: "slide0.png",
          secondSlide: "",
          thirdSlide: "",
          fourthSlide: "",
          fifthSlide: "",
        }),
    });

    expect(screen.getAllByRole("img")[0].getAttribute("src")).toBe(
      "imagePlaceholder.png"
    );

    userEvent.upload(
      screen.getByLabelText("First slide", {
        selector: "input",
      }),
      file1
    );

    userEvent.click(screen.getByText("Save"));

    expect(
      await screen.findByText("Images successfully saved.")
    ).toBeInTheDocument();

    userEvent.click(screen.getByText("OK"));

    expect(screen.getAllByRole("img")[0].getAttribute("src")).toBe(
      `${settings.backendApiUrl}/slide0.png`
    );
  });

  test("handle server response (PUT, 400)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 400,
      json: () => Promise.resolve({ errors: ["error 400"] }),
    });

    userEvent.upload(
      screen.getByLabelText("First slide", {
        selector: "input",
      }),
      file1
    );

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("error 400")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("closeErrorBtn"));

    expect(screen.getByTestId("sliderForm")).toHaveFormValues({
      firstSlide: "",
      secondSlide: "",
      thirdSlide: "",
      fourthSlide: "",
      fifthSlide: "",
    });
  });

  test("handle server response (PUT, 401)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 401,
    });

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.queryByTestId("sliderForm")).not.toBeInTheDocument();
  });

  test("handle server response (PUT, 403)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 403,
    });

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.queryByTestId("sliderForm")).not.toBeInTheDocument();
  });

  test("handle server response (PUT, 500)", async () => {
    FormDataFetch.mockReturnValueOnce({
      status: 500,
    });

    userEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Server error")).toBeInTheDocument();
    expect(screen.queryByTestId("sliderForm")).not.toBeInTheDocument();
  });
});
