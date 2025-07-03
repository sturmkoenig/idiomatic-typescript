import { expect, test, vi } from "vitest";

/* Template literals */
{
  type EventNames<T extends string> = `${T}Changed` | `${T}Deleted`;

  // userChanged " userDeleted
  type UserEvents = EventNames<"user">;
}

/* Different kinds of enums
 * - It is of note that enums are a TS only construct
 */
{
  /* number valued
   * - duck typed
   * - is not 'erased' by compilation
   * - order dependent if not given a value!
   * */
  enum Flavor {
    Vanilla,
    Chocolate,
    Strawberry,
  }
  const myFavoriteFlavor: Flavor = 0;

  /* String valued
   * - only structure that is not structurally typed!
   * - therefore has different use experience in TS/JS
   * - is not 'erased' by compilation
   * */
  enum Todo {
    IN_WORK = "Progress",
    TODO = "Todo",
    DONE = "Done",
  }

  /* const enum
   * - behaves differently from string and number enums
   * - is erased during compilation
   * - though this is not the case when `preserveConstEnums` flag is set
   * - also interferes with `isolatedModules` support*/
  const enum CreativeColors {
    RED = "red",
    BLUE = "blue",
    GREEN = "green is not a creative color",
  }

  let flavor: Flavor.Chocolate;
}

/* String Literals vs. Enums */
{
  enum Skills {
    Typescript = "Typescript",
    Java = "Java",
  }

  const STATUS = {
    LOADED: "loading",
    ERROR: "error",
    SUCCESS: "success",
  } as const;
  type Status = keyof typeof STATUS;

  const printSkills = (skill: Skills) => {
    if (parseSkill(skill)) console.log(skill);
  };

  const printStatus = (status: unknown) => {
    if (parseStatus(status)) console.log(status);
  };

  const isStatus = (value: unknown): value is Status =>
    Object.keys(STATUS).includes(value as Status);

  const isSkill = (value: unknown): value is Skills =>
    Object.keys(Skills).includes(value as Skills);

  const parseStatus = (status: unknown): Status | undefined => {
    return isStatus(status) ? status : undefined;
  };
  const parseSkill = (value: unknown): Skills | undefined => {
    return isSkill(value) ? value : undefined;
  };

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
}
