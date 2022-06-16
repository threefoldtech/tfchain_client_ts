import { greeting } from "../src/index";

describe("greeting", () => {
  test("Should return `hello world`", () => {
    expect(greeting()).toBe("hello world");
  });
});
