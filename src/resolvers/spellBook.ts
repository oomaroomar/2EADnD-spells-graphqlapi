import { Character } from "../entities/Character";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { SpellBook } from "../entities/SpellBook";
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { SpellPage } from "../entities/SpellPage";

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
    async owner(@Root() spellBook: SpellBook) {
       return await Character.findOneBy({id: spellBook.ownerId})
    }

    @FieldResolver(() => Int)
    async pagesLeft(@Root() spellBook: SpellBook) {
        return await SpellBook.pagesLeft(spellBook)
    }

    @FieldResolver(() => SpellPage)
    async spellPages(@Root() spellBook: SpellBook) {
        const spellPages = await SpellPage.createQueryBuilder("sp")
            .leftJoinAndSelect("sp.spell", 'spell')
            .where("sp.bookId = :bkId", {bkId: spellBook.id})
            .getMany()
        return spellPages
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteSpellBook(
        @Ctx(){req} : MyContext,
        @Arg('bookId') bId: number
    ) {
        await SpellBook.delete({id: bId, userOwnerId: req.session.userId})
        return true
    }

    @Mutation(() => SpellBook, {nullable: true})
    @UseMiddleware(isAuth)
    async renameSpellBook(
        @Ctx() {req}: MyContext,
        @Arg('name') name: string,
        @Arg('bookId') bId: number,
    ): Promise<SpellBook | null> {
        const result = await SpellBook.createQueryBuilder()
            .update(SpellBook)
            .set({name})
            .where('id = :bId and userOwnerId = :uoid', {
                bId,
                uoid: req.session.userId
            })
            .returning('*')
            .execute()

        return result.raw[0] ? result.raw[0] : null
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
            maxPages,
            userOwnerId: req.session.userId
        })

        return {spellBook: newBook}
    }
}