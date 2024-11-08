import { ObjectType, Field, Int } from "type-graphql";
import { Entity, BaseEntity, ManyToOne, Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Spell } from "./Spell";
import { SpellBook } from "./SpellBook";


@ObjectType()
@Entity()
export class SpellPage extends BaseEntity {
    @Field()
    @PrimaryColumn()
    spellId!: number

    @ManyToOne(() => Spell, spell => spell.spellKnowers)
    @Field(() => Spell)
    spell!: Spell

    @PrimaryColumn()
    @Field()
    bookId!: number

    @ManyToOne(() => SpellBook, {onDelete: "CASCADE"})
    @Field(() => SpellBook)
    book: SpellBook

    @Field(() => Int, {nullable: true})
    @Column({nullable: true})
    pages: number
}