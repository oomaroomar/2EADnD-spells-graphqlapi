import "reflect-metadata"
import { Spell } from "../entities/Spell"
import { MyContext, SpellEditInput, SpellInput } from "../types"
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql"
import { User } from "../entities/User"
import { isAuth } from "../middleware/isAuth"

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
export class SpellEditResponse {
  @Field(() => String, {nullable: true})
  error?: string
  
  @Field(() => Spell, {nullable: true})
  spell?: Spell
}

@Resolver(Spell)
export class SpellResolver {
  @FieldResolver(() => String)
  async source(@Root() spell: Spell) {
    return spell.source ? spell.source : (await User.findOneBy({id: spell.creatorId}))?.username
  }


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
    // @Ctx() {req}: MyContext
  ): Promise<PaginatedSpells> {
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
  @UseMiddleware(isAuth)
  async createSpell(
    @Arg("spellInfo") spellInfo: SpellInput,
    @Ctx() {req}: MyContext
  ): Promise<Spell | null> {
    return Spell.create({ ...spellInfo, creatorId: req.session.userId}).save()
  }

  @Mutation(() => SpellEditResponse)
  @UseMiddleware(isAuth)
  async updateSpell(
    @Arg("spellInfo", () => SpellEditInput) spellInfo: SpellEditInput,
    @Ctx() {req}: MyContext
  ): Promise<SpellEditResponse> {
    const user = await User.findOneBy({id: req.session.userId})
    if(user?.isAdmin) {
     const updatedSpell = await Spell.save({...spellInfo})
      return {spell: updatedSpell}
    } 
    const result = await Spell.createQueryBuilder()
      .update(Spell)
      .set({...spellInfo})
      .where('id = :sId and creatorId = :cId', {
          sId: spellInfo.id,
          cId: req.session.userId
      })
      .returning('*')
      .execute()

    return result.raw[0] ? result.raw[0] : {error: "You do not have access to edit this spell"}
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createSpells(
    @Arg("spellArray", () => [SpellInput]) spellArray: SpellInput[],
    @Ctx(){req}: MyContext
  ): Promise<Boolean> {
    const isAdmin = (await User.findOneBy({id: req.session.userId}))?.isAdmin
    if(!isAdmin) return false
    spellArray.map(async spell => await Spell.create({...spell}).save())
    return true
  }

  @Mutation(() => Spell)
  @UseMiddleware(isAuth)
  async deleteSpell(
    @Arg("id") id: number,
    @Ctx() {req} : MyContext
  ): Promise<boolean> {
    const isAdmin = (await User.findOneBy({id: req.session.userId}))?.isAdmin
    if(isAdmin) {
      await Spell.delete({id})
    } else {
      // If user is not admin, the spells creatorId must match the users id
      await Spell.delete({id, creatorId: req.session.userId})
    }
    return true
  }
}
