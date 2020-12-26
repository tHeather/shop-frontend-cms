import { MakeFormData } from "./FormDataUtils";

describe("MakeFormData", () => {
  const object = {
    1: "one",
    two: 2,
    file: new File(["test1"], "test1.png"),
  };

  const result = MakeFormData(object);

  test("returned object is FormData type", () => {
    expect(result instanceof FormData).toBe(true);
  });

  test("returned object contains all values", () => {
    expect(result.get("1")).toBe("one");
    expect(result.get("two")).toBe("2");
    expect(result.get("file") instanceof File).toBe(true);
  });
});
