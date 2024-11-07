import { ObjectType, Field, Int } from "type-graphql";
import { Entity, BaseEntity, ManyToOne, Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Spell } from "./Spell";
import { SpellBook } from "./SpellBook";
import { Character } from "./Character";


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

    @ManyToOne(() => SpellBook)
    @Field(() => SpellBook)
    book: SpellBook

    @Field()
    @Column()
    pages: number
}