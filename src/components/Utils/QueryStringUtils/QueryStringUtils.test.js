import { MakeQueryString } from "./queryStringUtils";

describe.each([
  [
    {
      testName1: "testValue1",
      testName2: "testValue2",
      testName3: "testValue3",
    },
    "testName1=testValue1&testName2=testValue2&testName3=testValue3",
  ],
  [
    {
      testName1: "testValue1",
      testName2: "",
      testName3: "testValue3",
    },
    "testName1=testValue1&testName3=testValue3",
  ],
  [
    {
      testName1: "",
      testName2: "",
      testName3: "",
    },
    "",
  ],
  [{}, ""],
  [[], ""],
])("test", (params, expected) => {
  test(`Expected: ${expected}`, () => {
    expect(MakeQueryString(params)).toBe(expected);
  });
});
