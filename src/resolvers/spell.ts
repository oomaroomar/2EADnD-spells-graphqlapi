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

  @Mutation(() => Spell)
  async createSpell(@Arg("spellInfo") spellInfo: SpellInput): Promise<Spell | null> {
    console.log(spellInfo)
    return Spell.create({ ...spellInfo }).save()
  }
}
