import { Field, ObjectType } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Index, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { User } from "./User";
import { SpellBook } from "./SpellBook";
import { LearnedSpell } from "./LearnedSpell";

@ObjectType()
@Entity()
export class Character extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    ownerId!: number
    
    @ManyToOne(() => User, (user) => user.characters)
    @Index()
    owner: User

    @Field()
    @Column()
    name!: string

    @Field(() => [LearnedSpell])
    @OneToMany(() => LearnedSpell, ls => ls.character)
    learnedSpells: LearnedSpell[]

    @Field(() => [SpellBook], {nullable: true})
    @OneToMany(() => SpellBook, book => book.id, {nullable: true})
    spellBooks?: SpellBook[]

}