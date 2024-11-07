import { Character } from "../entities/Character";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { SpellBook } from "../entities/SpellBook";
import { Arg, Ctx, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";

@ObjectType()
  class SpellBookResponse {
    @Field(() => String, { nullable: true })
    errors?: string
  
    @Field(() => SpellBook, { nullable: true })
    spellBook?: SpellBook;
  }

@Resolver(SpellBook)
export class SpellBookResolver {

    @Query(() => [SpellBook])
    @UseMiddleware(isAuth)
    async mySpellBooks(
        @Arg('charId') cid: number
    ) {
        return await SpellBook.findBy({ownerId: cid})
    }

    @FieldResolver(() => Character)
    async owner(
        @Root() spellBook: SpellBook
    ) {
       return await Character.findOneBy({id: spellBook.ownerId})
    }

    @Mutation(() => SpellBookResponse)
    @UseMiddleware(isAuth)
    async writeSpell(

        // @Arg('bookId') bId: number,
        // @Arg('spellId') sId: number
    ) {

    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteSpellBook(
        @Ctx(){req} : MyContext,
        @Arg('charId') cId: number,
        @Arg('bookId') bId: number
    ) {
        const character = await Character.findOneBy({id: cId})
        if(!character || character.ownerId !== req.session.userId) return "fuck off"
        await SpellBook.delete({id: bId, ownerId: cId})
        return true
    }

    @Mutation(() => SpellBookResponse)
    @UseMiddleware(isAuth)
    async renameSpellBook(
        @Ctx() {req}: MyContext,
        @Arg('name') name: string,
        @Arg('bookId') bId: number,
        @Arg('charId') cId: number,
    ): Promise<SpellBookResponse> {
        const character = await Character.findOneBy({id: cId})
        if(!character || character.ownerId !== req.session.userId) return {errors: "wtf bro"}

        const newBook = await SpellBook.save({
            name: name,
            ownerId: cId,
            id: bId
        })

        return {spellBook: newBook}
    }

    @Mutation(() => SpellBookResponse)
    @UseMiddleware(isAuth)
    async createSpellBook(
        @Ctx() {req}: MyContext,
        @Arg('name') name: string,
        @Arg('charId') cId: number,
        @Arg('maxPages') maxPages: number
    ): Promise<SpellBookResponse> {
        const character = await Character.findOneBy({id: cId})
        if(!character || character.ownerId !== req.session.userId) return {errors: "wtf bro"}

        const newBook = await SpellBook.save({
            name: name,
            ownerId: cId,
            maxPages
        })

        return {spellBook: newBook}
    }
}