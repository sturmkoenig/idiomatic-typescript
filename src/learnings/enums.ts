export enum SkillsEnum {
  Typescript = "Typescript",
  Java = "Java",
}

export const Status = ["loading", "error", "success"] as const;
export type Status = (typeof Status)[number];

export const printSkills = (skill: SkillsEnum) => {
  console.log(skill);
};

export const printStatus = (status: Status) => {
  console.log(status);
};

const isStatus = (value: unknown): value is Status =>
  Status.includes(value as Status);

const isSkill = (value: unknown): value is SkillsEnum =>
  Object.keys(SkillsEnum).includes(value as SkillsEnum);

export const parseStatus = (status: unknown): Status | undefined => {
  return isStatus(status) ? status : undefined;
};
export const parseSkill = (value: unknown): SkillsEnum | undefined => {
  return isSkill(value) ? (value as SkillsEnum) : undefined;
};
