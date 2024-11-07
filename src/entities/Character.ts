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
    @Index()
    owner!: User

    @Field()
    @Column()
    name!: string

    @Field(() => [Spell], {nullable: true})
    @ManyToMany(() => Spell, spell => spell.id, {nullable: true})
    @JoinTable({name: 'character_spells'})
    spells?: Spell[]

    @Field(() => [SpellBook], {nullable: true})
    @OneToMany(() => SpellBook, book => book.id, {nullable: true})
    spellBooks?: SpellBook[]

}