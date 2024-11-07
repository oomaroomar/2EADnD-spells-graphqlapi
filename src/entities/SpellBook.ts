import { Field, Int, ObjectType } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Index, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToMany, JoinTable } from "typeorm";
import { Character } from "./Character";
import { SpellPage } from "./SpellPage";
import { User } from "./User";

@ObjectType()
@Entity()
export class SpellBook extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    @Index()
    userOwnerId!: number

    @Field(() => User)
    @ManyToOne(() => User)
    @Index()
    userOwner!: User

    @Field()
    @Column()
    @Index()
    ownerId!: number

    @Field(() => Character)
    @ManyToOne(() => Character)
    @Index()
    owner!: Character

    @Field(() => SpellPage, {nullable: true})
    @OneToMany(() => SpellPage, sp => sp.book)
    spellPages?: SpellPage

    @Field(() => String)
    @Column()
    @Index()
    name!: string
    
    @Field(() => Int, {nullable: true})
    @Column({nullable: true})
    maxPages: number
}


