import "reflect-metadata"
import { Spell } from "../entities/Spell"
import { SpellInput } from "../types"
import {
  Arg,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql"

@ObjectType()
class PaginatedSpells {
  @Field(() => [Spell])
  spells: Spell[]

  @Field()
  hasMore: boolean
}

@Resolver(Spell)
export class SpellResolver {
  @Query(() => Spell)
  async spellByID(
    @Arg("id", () => Int) id: number,
  ): Promise<Spell | null> {
    return Spell.findOneBy({ id })
  }

  @Query(() => [Spell])
  async spellsByName(
    @Arg("name", () => String) name: string
  ): Promise<Spell[] | null> {
    return Spell.findBy({ name })
  }


  @Query(() => PaginatedSpells)
  async spells(
    @Arg('limit') limit: number, 
    @Arg('lvlCursor', () => Number, {nullable: true}) lvlOffset: number | null,
    @Arg('nameCursor', () => String, {nullable: true}) nameOffset: string | null,
  ): Promise<PaginatedSpells> {
    const spells = await Spell.findSome({level: lvlOffset, name: nameOffset}, limit + 1)
    return {
      spells: spells.slice(0, limit),
      hasMore: spells.length === limit + 1
    }
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
