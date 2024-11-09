import { Character } from "../entities/Character";
import { MyContext } from "../types";
import { Arg, Ctx, Field, FieldResolver, InputType, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { LearnedSpell } from "../entities/LearnedSpell";
import { SpellBook } from "../entities/SpellBook";


@ObjectType()
class CharacterResponse {
@Field(() => String, { nullable: true })
error?: string

@Field(() => Character, { nullable: true })
character?: Character;
}

@Resolver(Character)
export class CharacterResolver {

    @Query(() => Character, {nullable: true})
    async character(@Arg('cId') cId: number): Promise<Character | null> {
        return await Character.findOne({where: { id: cId }, relations: {spellBooks: true}})
    }

    @Query(() => [Character], {nullable: true})
    @UseMiddleware(isAuth)
    async myCharacters(@Ctx() {req} :MyContext): Promise<Character[]> {
        return (await Character.find({where: {ownerId: req.session.userId}}))
    }

    @FieldResolver(() => [LearnedSpell])
    async learnedSpells(@Root() character: Character): Promise<LearnedSpell[]> {
        return await LearnedSpell.find({where: {charId: character.id}, relations: {spell: true}})
    }

    @FieldResolver(() => [SpellBook])
    async spellBooks(@Root() character: Character): Promise<SpellBook[]> {
        return await SpellBook.find({where: {ownerId: character.id}})
    }

    @Mutation(() => CharacterResponse)
    @UseMiddleware(isAuth)
    async forgetSpell(
        @Arg("spellId") spellId: number,
        @Arg("characterId") characterId: number,
        @Ctx() {req}: MyContext
    ): Promise<boolean> {
        const character = await Character.findOne({where: {id: characterId, ownerId: req.session.userId}, relations: {learnedSpells: true}})
        if(!character) return false
        await LearnedSpell.delete({charId: characterId, spellId: spellId})
        return true
    }

    @Mutation(() => CharacterResponse)
    @UseMiddleware(isAuth)
    async learnSpell(
        @Arg("spellId") spellId: number,
        @Arg("characterId") characterId: number,
        @Ctx() {req}: MyContext
    ): Promise<CharacterResponse> {
        const character = await Character.findOne({where: {id: characterId}, relations: {learnedSpells: true}})
        if(!character || character.ownerId !== req.session.userId) return {error: 'Your mom'}
        const learned = await LearnedSpell.save({
            charId: characterId,
            spellId 
        })
        const oldSpells = character.learnedSpells ? character.learnedSpells : []
        const newSpells = oldSpells.concat(learned)
        character.learnedSpells = newSpells
        character.save()
        return {character}
    }

    @Mutation(() => CharacterResponse)
    @UseMiddleware(isAuth)
    async changeName(
      @Arg("characterId") characterId: number,
      @Arg("newName") name: string,
    ): Promise<CharacterResponse> {
        if(name.length === 0) return {error: 'Please provide a name'}
        const newCharacter = await Character.save({
            id: characterId,
            name: name,
        })
        return {character: newCharacter}
    }

    @Mutation(() => CharacterResponse)
    @UseMiddleware(isAuth)
    async deleteCharacter(
      @Arg("characterId") characterId: number,
    ): Promise<{error: string} | boolean> {
        await Character.delete({id: characterId})
        return true
    }

    @Mutation(() => CharacterResponse)
    @UseMiddleware(isAuth)
    async createCharacter(
      @Arg("name") name: string,
      @Ctx() { req }: MyContext
    ): Promise<CharacterResponse> {
        if(name.length === 0) return {error: 'Please provide a name'}
        const newCharacter = await Character.save({
            ownerId: req.session.userId,
            name: name,
        })
        return {character: newCharacter}
    }
}