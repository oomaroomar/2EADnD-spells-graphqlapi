import { Character } from "../entities/Character";
import { User } from "../entities/User";
import { MyContext } from "../types";
import { validateRegister } from "src/utils/validateRegister";
import { Arg, Ctx, Field, FieldResolver, InputType, Mutation, ObjectType, Query, Resolver, Root } from "type-graphql";
import { SpellEditResponse } from "./spell";
import { Spell } from "../entities/Spell";


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

    @FieldResolver(() => [Spell], {nullable: true})
    async spells(
        @Root() character: Character, 
        // @Ctx() {spellLoader}: MyContext
    ): Promise<Spell[] | null> {
        // console.log("inside spells resolver", character)
        // const sIds = character.spells?.map(spell => spell.id)
        // if(!sIds?.length) return null
        // const stuff = await spellLoader.loadMany(sIds)
        // console.log(stuff)
        return character.spells ? character.spells : null

    }

    @Query(() => Character, {nullable: true})
    async character(@Arg('cId') cId: number): Promise<Character | null> {
        const character = await Character.findOne({where: { id: cId }, relations: {spells: true}})
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
        const character = await Character.findOne({where: {id: characterId}, relations: {spells: true}})
        if(!character) return {error: 'Your mom'}
        
        const oldSpells = character.spells ? character.spells : []

        console.log(character.spells)
        character.spells = oldSpells.concat([spell])
        console.log(character)
        const newCharacter = await Character.save({...character})

        console.log('What I am about to return', newCharacter)
        return {character: newCharacter}
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

    @Mutation(() => CharacterResponse)
    async createCharacter(
      @Arg("name") name: string,
      @Ctx() { req }: MyContext
    ): Promise<CharacterResponse> {
        if(name.length === 0) return {error: 'Please provide a name'}
        const user = await User.findOneBy({id: req.session.userId})
        if(!user) return {error: 'Please sign in'}

        const newCharacter = await Character.save({
            owner: user,
            name: name,
        })

        return {character: newCharacter}
    }
}