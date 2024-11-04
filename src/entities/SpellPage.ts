import { ObjectType, Field } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Spell } from "./Spell";
import { SpellBook } from "./SpellBook";

@ObjectType()
@Entity()
export class SpellPage extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Field(() => Spell)
    @ManyToOne(() => Spell, spell => spell.id)
    spell: Spell

    @Field(() => SpellBook)
    @ManyToOne(() => SpellBook, book => book.id)
    spellBook: SpellBook

    @Field()
    @Column()
    pages: number

}