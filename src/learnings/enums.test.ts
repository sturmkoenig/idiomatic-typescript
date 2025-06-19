import { expect, test, vi } from "vitest";
import { printSkills, printStatus, Skills, STATUS } from "./enums.ts";

const consoleSpy = vi.spyOn(console, "log");

test("should accept only enum values", () => {
  printSkills(Skills.Typescript);
  expect(consoleSpy).toHaveBeenCalledWith("Typescript");
});

test("should be callable by string", () => {
  // can't use a string!
  //printSkills("Typescript");
  printSkills(Skills.Typescript);
});

test("should be callable by string", () => {
  printStatus("loading");
  printStatus(STATUS.LOADED);
});
