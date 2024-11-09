import { ObjectType, Field, Int } from "type-graphql";
import { Entity, BaseEntity, ManyToOne, Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Spell } from "./Spell";
import { SpellBook } from "./SpellBook";


@ObjectType()
@Entity()
export class SpellPage extends BaseEntity {
    @PrimaryColumn()
    @Field()
    spellId!: number

    @ManyToOne(() => Spell, spell => spell.spellKnowers)
    spell!: Spell

    @PrimaryColumn()
    bookId!: number

    @ManyToOne(() => SpellBook, {onDelete: "CASCADE"})
    book: SpellBook

    @Field(() => Int, {nullable: true})
    @Column({nullable: true})
    pages: number
}