import { makeRequestObject } from "./Fetches";

test("make request object correctly (POST, Authorization)", () => {
  sessionStorage.setItem("token", "TestToken");
  expect(makeRequestObject("POST", true, { name: "John" })).toEqual({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer TestToken",
    },
    body: JSON.stringify({ name: "John" }),
  });
});

test("make request object correctly (POST)", () => {
  sessionStorage.setItem("token", "TestToken");
  expect(makeRequestObject("POST", false, { name: "John" })).toEqual({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "John" }),
  });
});

test("make request object correctly (GET, Authorization)", () => {
  sessionStorage.setItem("token", "TestToken");
  expect(makeRequestObject("GET", true)).toEqual({
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer TestToken",
    },
  });
});

test("make request object correctly (GET)", () => {
  sessionStorage.setItem("token", "TestToken");
  expect(makeRequestObject("GET", false)).toEqual({
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
});
