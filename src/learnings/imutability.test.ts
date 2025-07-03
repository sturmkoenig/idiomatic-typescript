/* Immutability
 *
 * uses const instead of let TODO
 * usage of readonly and deepReadonly
 * usage of `as const` type assertion to assume narrowest possible type
 * showcase array operations that mutate the data structure (.sort, .push)
 *  */

import { expect, test } from "vitest";
import type { DeepReadonly } from "ts-essentials";

test("mutating shared object causes bugs", () => {
  type Settings = { darkMode: boolean };

  const updateDarkMode = (settings: Settings, enabled: boolean) => {
    settings.darkMode = enabled;
  };

  const settings = { darkMode: false };
  const userA = settings;
  const userB = settings;

  updateDarkMode(userA, true);

  expect(userB.darkMode).toBe(false); // ❌ schlägt fehl
});

//common bugs
test("unintentional overwrite", () => {
  const logCitiesAlphabetical = (cities: string[]) =>
    console.log(cities.sort());

  //sorted by number of population! Note the const keyword
  const cities = ["Tokyo", "Delhi", "Shanghai", "Mumbai", "Beijing"];
  // print cities in alphabetical order
  logCitiesAlphabetical(cities);
  expect(cities[0]).toBe("Tokyo");
});

// enforcing immutability using readonly
test("use immutable variants", () => {
  const logCitiesAphabetical = (cities: Readonly<string[]>) =>
    console.log(cities.toSorted());
  // Biggest first.
  const cities: Readonly<string[]> = [
    "Tokyo",
    "Delhi",
    "Shanghai",
    "Mumbai",
    "Beijing",
  ];
  logCitiesAphabetical(cities);
  expect(cities[0]).toBe("Tokyo");
});

test("but how to change the list?", () => {
  const addCity = (cities: Readonly<string[]>, newCitty: string) => [
    ...cities,
    newCitty,
  ];
  //or
  // Biggest first.
  const cities: Readonly<string[]> = [
    "Tokyo",
    "Delhi",
    "Shanghai",
    "Mumbai",
    "Beijing",
  ];
  expect(addCity(cities, "Dhaka")).toStrictEqual([
    "Tokyo",
    "Delhi",
    "Shanghai",
    "Mumbai",
    "Beijing",
    "Dhaka",
  ]);
});

test("what about objects?", () => {
  type User = {
    id: string;
    name: string;
    roles: string[];
  };

  function addAdminRole(user: User): void {
    user.roles.push("admin");
  }

  const originalUser: User = {
    id: "u123",
    name: "Alice",
    roles: ["user"],
  };

  const clonedUser = originalUser;

  addAdminRole(clonedUser);

  expect(originalUser.roles).toStrictEqual(["admin"]);
});

test("what about readonly objects?", () => {
  type User = {
    id: string;
    name: string;
    roles: string[];
    contact: {
      street: string;
      city: string;
    };
  };

  const originalUser: Readonly<User> = {
    id: "u123",
    name: "Alice",
    roles: ["user"],
    contact: {
      street: "Henriette Constanette Weg 3.",
      city: "Bumselburg",
    },
  };

  const clonedUser = { ...originalUser };

  clonedUser.contact.street = "Knasterkattasteramt 2.";

  expect(originalUser.contact.street).toStrictEqual(
    "Henriette Constanette Weg 3",
  );
});

test("deepreadonly to the rescue", () => {
  type User = {
    id: string;
    name: string;
    roles: string[];
    contact: {
      street: string;
      city: string;
    };
  };

  const originalUser: DeepReadonly<User> = {
    id: "u123",
    name: "Alice",
    roles: ["user"],
    contact: {
      street: "Henriette Constanette Weg 3.",
      city: "Bumselburg",
    },
  };

  const clonedUser = { ...originalUser };

  // error due to deepreadonly!
  //clonedUser.contact.street = "Knasterkattasteramt 2.";
});

// it is also possible to cast to 'as const'
test("deepreadonly to the rescue", () => {
  type User = {
    id: string;
    name: string;
    roles: string[];
    contact: {
      street: string;
      city: string;
    };
  };

  const originalUser = {
    id: "u123",
    name: "Alice",
    roles: ["user"],
    contact: {
      street: "Henriette Constanette Weg 3.",
      city: "Bumselburg",
    },
  } as const;

  const clonedUser = { ...originalUser };

  // error due to deepreadonly!
  //clonedUser.contact.street = "Knasterkattasteramt 2.";
});

test("how to copy readonly object then?", () => {
  type User = {
    id: string;
    name: string;
    roles: string[];
    contact: {
      street: string;
      city: string;
    };
  };

  const originalUser: DeepReadonly<User> = {
    id: "u123",
    name: "Alice",
    roles: ["user"],
    contact: {
      street: "Henriette Constanette Weg 3.",
      city: "Bumselburg",
    },
  };

  const clonedUser = {
    ...originalUser,
    contact: { ...originalUser.contact, street: "Knasterkattasteramt 2." },
  };
  expect(clonedUser.contact.street).toEqual("Knasterkattasteramt 2.");
  expect(originalUser.contact.street).toEqual("Henriette Constanette Weg 3.");
});

// use as const to assume most narrow type possible!
test("mutation inside nested structure", () => {
  const config = {
    options: {
      flags: ["fast", "debug"],
    },
  } as const;

  //config.options.flags.push("verbose"); // ❌
});

// use const as a default TODO
test("let vs const", () => {});
