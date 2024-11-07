import { Field, ObjectType } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Index, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToMany, JoinTable } from "typeorm";
import { Spell } from "./Spell";
import { Character } from "./Character";
import { SpellPage } from "./SpellPage";

@ObjectType()
@Entity()
export class SpellBook extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Character)
    @ManyToOne(() => Character)
    @Index()
    owner: Character

    @Field()
    @Column()
    @Index()
    name!: string
    
    @Field(() => Spell)
    @ManyToMany(() => Spell, (spell) => spell.id)
    @JoinTable()
    spells: Spell[]

    @Field()
    @Column()
    maxPages: number

    @Field()
    @OneToMany(() => SpellPage, page => page.id)
    spellPages: SpellPage

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
    
}


