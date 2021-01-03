import { act, render, screen, waitFor, within } from "@testing-library/react";
import { Form, Formik } from "formik";
import {
  FileUploadField,
  SelectField,
  StandardField,
  TextArea,
} from "./Fields";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

test("Standard field: render correctly", () => {
  act(() => {
    render(
      <Formik>
        <Form>
          <StandardField
            label="Test label"
            id="testId"
            name="testName"
            type="number"
          />
        </Form>
      </Formik>
    );
  });

  expect(screen.getByLabelText("Test label")).toBeInTheDocument();
  const input = screen.getByLabelText("Test label", { selector: "input" });
  expect(input).toBeInTheDocument();
  expect(input.getAttribute("name")).toBe("testName");
  expect(input.getAttribute("type")).toBe("number");
  expect(input.getAttribute("id")).toBe("testId");
});

test("Standard field: render without id attribute", () => {
  act(() => {
    render(
      <Formik>
        <Form>
          <StandardField label="Test label" name="testName" type="number" />
        </Form>
      </Formik>
    );
  });

  expect(screen.getByLabelText("Test label")).toBeInTheDocument();
  const input = screen.getByLabelText("Test label", { selector: "input" });
  expect(input).toBeInTheDocument();
  expect(input.getAttribute("name")).toBe("testName");
  expect(input.getAttribute("type")).toBe("number");
  expect(input.getAttribute("id")).toBe("testName");
});

test("Standard field: set value", async () => {
  act(() => {
    render(
      <Formik initialValues={{ testName: "" }}>
        {({ values: { testName } }) => {
          return (
            <>
              <div data-testid="output">{testName}</div>
              <Form>
                <StandardField
                  label="Test label"
                  id="testId"
                  name="testName"
                  type="text"
                />
              </Form>
            </>
          );
        }}
      </Formik>
    );
  });

  userEvent.type(
    screen.getByLabelText("Test label", { selector: "input" }),
    "test text"
  );

  const output = await screen.findByTestId("output");
  expect(output.textContent).toBe("test text");
});

test("TextArea: render correctly", () => {
  act(() => {
    render(
      <Formik>
        <Form>
          <TextArea label="Test label" id="testId" name="testName" />
        </Form>
      </Formik>
    );
  });

  expect(screen.getByLabelText("Test label")).toBeInTheDocument();
  const input = screen.getByLabelText("Test label", { selector: "textarea" });
  expect(input).toBeInTheDocument();
  expect(input.getAttribute("name")).toBe("testName");
  expect(input.getAttribute("id")).toBe("testId");
});

test("TextArea: render without id attribute", () => {
  act(() => {
    render(
      <Formik>
        <Form>
          <TextArea label="Test label" name="testName" />
        </Form>
      </Formik>
    );
  });

  expect(screen.getByLabelText("Test label")).toBeInTheDocument();
  const input = screen.getByLabelText("Test label", { selector: "textarea" });
  expect(input).toBeInTheDocument();
  expect(input.getAttribute("name")).toBe("testName");
  expect(input.getAttribute("id")).toBe("testName");
});

test("TextArea: set value", async () => {
  act(() => {
    render(
      <Formik initialValues={{ testName: "" }}>
        {({ values: { testName } }) => {
          return (
            <>
              <div data-testid="output">{testName}</div>
              <Form>
                <TextArea label="Test label" name="testName" />
              </Form>
            </>
          );
        }}
      </Formik>
    );
  });

  userEvent.type(
    screen.getByLabelText("Test label", { selector: "textarea" }),
    "test text"
  );

  const output = await screen.findByTestId("output");
  expect(output.textContent).toBe("test text");
});

test("FileUploadField: upload file", async () => {
  const valueChecker = jest.fn();
  const file = new File(["test"], "test.png", { type: "image/png" });

  act(() => {
    render(
      <Formik initialValues={{ testName: "" }}>
        {({ values: { testName } }) => {
          valueChecker(testName);
          return (
            <>
              <Form>
                <FileUploadField label="Test label" name="testName" />
              </Form>
            </>
          );
        }}
      </Formik>
    );
  });

  await act(async () => {
    await userEvent.upload(
      screen.getByLabelText("Test label", { selector: "input" }),
      file
    );
  });

  expect(valueChecker.mock.calls[1][0]).toStrictEqual(file);
});

describe("SelectField", () => {
  beforeEach(() => {
    const options = [
      <option key={0} value={0}>
        Zero
      </option>,
      <option key={1} value={1}>
        One
      </option>,
    ];

    act(() => {
      render(
        <Formik initialValues={{ testLabel: "" }}>
          {({ values: { testName } }) => {
            return (
              <>
                <div data-testid="output">{testName}</div>
                <Form>
                  <SelectField id="testName" name="testName" label="Test label">
                    {options}
                  </SelectField>
                </Form>
              </>
            );
          }}
        </Formik>
      );
    });
  });

  test("render component correctly", () => {
    const selectTag = document.getElementById("testName");
    const optionsTags = within(selectTag).getAllByRole("option");
    expect(optionsTags).toHaveLength(2);
    expect(optionsTags[0]).toHaveValue("0");
    expect(optionsTags[0]).toHaveTextContent("Zero");
    expect(optionsTags[1]).toHaveValue("1");
    expect(optionsTags[1]).toHaveTextContent("One");
  });

  test("select option", async () => {
    const selectTag = document.getElementById("testName");
    const output = screen.getByTestId("output");
    userEvent.selectOptions(selectTag, "1");
    await waitFor(() => expect(output).toBeInTheDocument());
    expect(output).toHaveTextContent(1);
  });
});
