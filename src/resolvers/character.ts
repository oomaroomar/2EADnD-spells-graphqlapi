import { Character } from "../entities/Character";
import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, FieldResolver, InputType, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Spell } from "../entities/Spell";
import { isAuth } from "src/middleware/isAuth";
import { LearnedSpell } from "../entities/LearnedSpell";


@ObjectType()
class CharacterResponse {
@Field(() => String, { nullable: true })
error?: string

@Field(() => Character, { nullable: true })
character?: Character;
}

@Resolver(Character)
export class CharacterResolver {
    // learn spell
    // unlearn spell

    @Query(() => Character, {nullable: true})
    async character(@Arg('cId') cId: number): Promise<Character | null> {
        const character = await Character.findOne({where: { id: cId }, relations: {learnedSpells: true}})
        console.log(character)
        return character
    }

    @Mutation(() => CharacterResponse)
    async learnSpell(
        @Arg("spellId") spellId: number,
        @Arg("characterId") characterId: number,
        // @Ctx() {req}: MyContext
    ): Promise<CharacterResponse> {

        const spell = await Spell.findOneBy({id: spellId})
        if(!spell) return {error: 'Could not find the spell you\'re looking for'}
        const character = await Character.findOne({where: {id: characterId}, relations: {learnedSpells: true}})
        if(!character) return {error: 'Your mom'}
        

        const learned = await LearnedSpell.createQueryBuilder()
            .insert()
            .into(LearnedSpell)
            .values({
                charId: characterId,
                spellId: spellId
            })
            .execute()

        console.log(learned.raw)
        const oldSpells = character.learnedSpells ? character.learnedSpells : []
        // const newSpells = oldSpells.concat(learned.identifiers[0])

        // const newCharacter = await Character.save({...character})

        return {character}
    }

    @Mutation(() => CharacterResponse)
    async changeName(
      @Arg("characterId") characterId: number,
      @Arg("newName") name: string,
      @Ctx() { req }: MyContext
    ): Promise<CharacterResponse> {
        if(name.length === 0) return {error: 'Please provide a name'}
        const user = await User.findOneBy({id: req.session.userId})
        if(!user) return {error: 'Please sign in'}
        const newCharacter = await Character.save({
            id: characterId,
            name: name,
        })
        return {character: newCharacter}
    }

    @Mutation(() => CharacterResponse)
    async deleteCharacter(
      @Arg("characterId") characterId: number,
      @Ctx() { req }: MyContext
    ): Promise<{error: string} | boolean> {
        const user = await User.findOneBy({id: req.session.userId})
        if(!user) return {error: 'Please sign in'}
        const character = await Character.findOneBy({id: characterId})
        if(!character) return {error: 'Could not find the character you\'re looking for'}
        if(character.owner.id !== req.session.userId) return {error: 'You do not own this character'}
        
        await Character.delete({id: characterId})

        return true
    }

    // @Mutation(() => CharacterResponse)
    // @UseMiddleware(isAuth)
    // async createCharacter(
    //   @Arg("name") name: string,
    //   @Ctx() { req }: MyContext
    // ): Promise<CharacterResponse> {
    //     if(name.length === 0) return {error: 'Please provide a name'}

    //     const newCharacter = await Character.save({
    //         owner: req.session.userId,
    //         name: name,
    //     })

    //     return {character: newCharacter}
    // }
}