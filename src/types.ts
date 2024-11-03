import { Request, Response } from "express"
import { Redis } from "ioredis"
import { InputType, Field } from "type-graphql"

export type MyContext = {
  req: Request & {sessions: Express.SessionStore}
  res: Response
  redis: Redis
}


export interface Cursor {
  name: string | null,
  level: number | null
}

export type Book = "PHB" | "ToM" | "S&M" | string
export type Save = "Negate" | "None" | "1/2" | "Special"
export type Caster = "Wizard" | "Cleric"
export type School =
  | "Abjuration"
  | "Alteration"
  | "Conjuration"
  | "Diviniation"
  | "Enchantment"
  | "Invocation"
  | "Illusion"
  | "Necromancy"

export type Sphere =
  | "All"
  | "Animal"
  | "Astral"
  | "Chaos"
  | "Charm"
  | "Combat"
  | "Creation"
  | "Divination"
  | "Elemental"
  | "Guardian"
  | "Healing"
  | "Law"
  | "Necromantic"
  | "Numbers"
  | "Plant"
  | "Protection"
  | "Summoning"
  | "Sun"
  | "Thought"
  | "Travelers"
  | "War"
  | "Wards"
  | "Weather"
  | ""
  | null


@InputType()
export class SpellInput {
  @Field()
  level!: number

  @Field()
  name!: string

  @Field()
  school: School

  @Field()
  class!: Caster

  @Field()
  verbal!: boolean

  @Field()
  somatic!: boolean

  @Field()
  material!: boolean

  @Field()
  materials: string

  @Field()
  range: string

  @Field()
  aoe: string

  @Field()
  castingTime: string

  @Field()
  duration: string

  @Field()
  savingThrow: Save

  @Field()
  damage: string

  @Field()
  description: string

  @Field()
  source: Book

  @Field(() => [String],{nullable: true})
  spheres: string[]
}
