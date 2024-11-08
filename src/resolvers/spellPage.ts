import { Spell } from "../entities/Spell"
import { SpellBook } from "../entities/SpellBook"
import { SpellPage } from "../entities/SpellPage"
import { isAuth } from "../middleware/isAuth"
import { MyContext } from "../types"
import { Mutation, UseMiddleware, Arg, Ctx, FieldResolver, Root, Resolver, Field, InputType, ObjectType } from "type-graphql"

@ObjectType()
class SpellPageResponse {
    @Field({nullable: true})
    spellPage?: SpellPage
    @Field({nullable: true})
    error?: string
}

@InputType()
class WriteSpellInput {
    @Field()
    bookId: number
    @Field()
    spellId: number
    @Field()
    pages?: number
}


@Resolver(SpellPage)
export class SpellpageResolver {

    @Mutation(() => SpellPageResponse)
    @UseMiddleware(isAuth)
    async writeSpell(
        @Arg('input') input: WriteSpellInput,
        @Ctx() {req}: MyContext
    ): Promise<SpellPageResponse>{
        const book = await SpellBook.findOneBy({id: input.bookId, userOwnerId: req.session.userId})
        if(!book) return {error: "could not find book"}
        const pages = await SpellBook.pagesLeft(book)
        if(pages !== undefined) {
            if(pages < (input.pages as number)) return {error: "not enough pages"}
        }
        const spellPage = await SpellPage.save({
            ...input
        })
        return {spellPage}
    }

    @FieldResolver(() => Spell)
    async spell(@Root() spellPage: SpellPage) {
        return await Spell.findOneBy({id: spellPage.spellId})
    }

    @FieldResolver(() => SpellBook)
    async book(@Root() spellPage: SpellPage) {
        return await SpellBook.findOneBy({id: spellPage.bookId})
    }
}