export enum Skills {
  Typescript = "Typescript",
  Java = "Java",
}

export const STATUS = {
  LOADED: "loading",
  ERROR: "error",
  SUCCESS: "success",
} as const;
export type Status = keyof typeof STATUS;

export const printSkills = (skill: Skills) => {
  if (parseSkill(skill)) console.log(skill);
};

export const printStatus = (status: unknown) => {
  if (parseStatus(status)) console.log(status);
};

const isStatus = (value: unknown): value is Status =>
  Object.keys(STATUS).includes(value as Status);

const isSkill = (value: unknown): value is Skills =>
  Object.keys(Skills).includes(value as Skills);

export const parseStatus = (status: unknown): Status | undefined => {
  return isStatus(status) ? status : undefined;
};
export const parseSkill = (value: unknown): Skills | undefined => {
  return isSkill(value) ? value : undefined;
};
