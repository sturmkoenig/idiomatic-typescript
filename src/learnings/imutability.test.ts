/* Immutability
 *
 * uses const instead of let
 * usage of readonly and deepReadonly
 *  */

import { expect, test } from "vitest";
import type { DeepReadonly } from "ts-essentials";

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

  const clonedUser = originalUser;

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

  const clonedUser = originalUser;

  clonedUser.contact.street = "Knasterkattasteramt 2.";
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
});
