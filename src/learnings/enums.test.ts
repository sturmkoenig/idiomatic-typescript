import {expect, test, vi} from 'vitest'
import {printSkills, printStatus, SkillsEnum} from "./enums.ts";

const consoleSpy = vi.spyOn(console, 'log')

test("should accept only enum values", () => {
    printSkills(SkillsEnum.Typescript)
    expect(consoleSpy).toHaveBeenCalledWith('Typescript')
})

test("should be callable by string", () => {
    printSkills("Typescript")
})

test("should be callable by string", () => {
    printStatus("loading")
})

