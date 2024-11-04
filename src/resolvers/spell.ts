import "reflect-metadata"
import { Spell } from "../entities/Spell"
import { MyContext, SpellEditInput, SpellInput } from "../types"
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql"
import { User } from "../entities/User"

@ObjectType()
class PaginatedSpells {
  @Field(() => [Spell])
  spells: Spell[]

  @Field()
  hasMore: boolean
}

ObjectType()
class AuthError {
  @Field()
  message: string
}

@ObjectType()
class SpellEditResponse {
  @Field(() => String, {nullable: true})
  errors?: string
  
  @Field(() => Spell, {nullable: true})
  spell?: Spell
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
  async clericSpells(
    @Arg('limit') limit: number, 
    @Arg('lvlCursor', () => Number, {nullable: true}) lvlOffset: number | null,
    @Arg('nameCursor', () => String, {nullable: true}) nameOffset: string | null,
  ): Promise<PaginatedSpells> {
    const spells = await Spell.findSomeClassSpells({level: lvlOffset, name: nameOffset}, limit + 1, 'Cleric')
    return {
      spells: spells.slice(0, limit),
      hasMore: spells.length === limit + 1
    }
  }
  @Query(() => PaginatedSpells)
  async wizardSpells(
    @Arg('limit') limit: number, 
    @Arg('lvlCursor', () => Number, {nullable: true}) lvlOffset: number | null,
    @Arg('nameCursor', () => String, {nullable: true}) nameOffset: string | null,
    @Ctx() {req}: MyContext
  ): Promise<PaginatedSpells> {
    console.log('session', req.session)
    const spells = await Spell.findSomeClassSpells({level: lvlOffset, name: nameOffset}, limit + 1, 'Wizard')
    return {
      spells: spells.slice(0, limit),
      hasMore: spells.length === limit + 1
    }
  }

  @Query(() => PaginatedSpells)
  async allSpells(
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

  @Mutation(() => SpellEditResponse)
  async updateSpell(
    @Arg("spellInfo", () => SpellEditInput) spellInfo: SpellEditInput,
    @Ctx() {req}: MyContext
  ): Promise<SpellEditResponse> {
    if (!req.session.userId) {
      return {errors: "You do not have access to edit this spell"}
    }
    const user = await User.findOneBy({id: req.session.userId})
    if(user?.isAdmin) {
      const updatedSpell = await Spell.save({...spellInfo})
      console.log('updatedSpell', updatedSpell)
      return {spell: updatedSpell}
    } 
    return {errors: "You do not have access to edit this spell"}
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
