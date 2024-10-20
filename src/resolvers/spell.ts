import { Spell } from "../entities/Spell"
import { SpellInput } from "../types"
import {
  Arg,
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql"

// Jump down to line 60


@Resolver(Spell)
export class SpellResolver {
  @Query(() => Spell)
  async getSpellByID(
    @Arg("id", () => Int) id: number,
  ): Promise<Spell | null> {
    return Spell.findOneBy({ id })
  }

  @Query(() => [Spell])
  async getSpellByName(
    @Arg("name", () => String) name: string
  ): Promise<Spell[] | null> {
    return Spell.findBy({ name })
  }

  @Query(() => [Spell])
  async getAllSpells(): Promise<Spell[]> {
    return Spell.find()
  }

  @Mutation(() => Spell)
  async createSpell(@Arg("spellInfo") spellInfo: SpellInput): Promise<Spell | null> {
    return Spell.create({ ...spellInfo }).save()
  }

  @Mutation(() => [Spell])
  async createSpells(@Arg("spellArray", () => [SpellInput]) spellArray: SpellInput[]): Promise<boolean> {
    const savedSpells = spellArray.map(async spell => await Spell.create({...spell}).save())
    return true
  }

  @Mutation(() => Spell)
  async deleteSpell(@Arg("id") id: number): Promise<boolean> {
    await Spell.delete({id})
    return true
  }
}
