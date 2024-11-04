import { Field, ObjectType } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Index, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Spell } from "./Spell";
import { User } from "./User";
import { SpellBook } from "./SpellBook";

@ObjectType()
@Entity()
export class Character extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;
    
    @ManyToOne(() => User, (user) => user.characters)
    owner: User

    @Field()
    @Column()
    name!: string

    @Field(() => Spell)
    @ManyToMany(() => Spell)
    @JoinTable()
    spells: Spell[]

    @Field(() => [SpellBook])
    @OneToMany(() => SpellBook, book => book.id)
    spellBooks: SpellBook[]

}