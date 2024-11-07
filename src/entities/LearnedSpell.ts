import { ObjectType, Field, Int } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Spell } from "./Spell";
import { Character } from "./Character";


@ObjectType()
@Entity()
export class LearnedSpell extends BaseEntity {
    @PrimaryColumn()
    spellId!: number

    @ManyToOne(() => Spell, spell => spell.spellKnowers)
    spell!: Spell

    @PrimaryColumn()
    charId!: number

    @ManyToOne(() => Character, char => char.learnedSpells)
    character: Character

    @Field(() => Int, {nullable: true})
    @Column({nullable: true})
    learnLvl: number

    @Field(() => Int, {nullable: true})
    @Column({nullable: true})
    failLvl: number

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}