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

    @Column()
    @Index()
    userOwnerId!: number

    @ManyToOne(() => User)
    userOwner!: User

    @Column()
    @Index()
    ownerId!: number

    @Field(() => Character)
    @ManyToOne(() => Character)
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

    static async pagesLeft(spellBook: SpellBook) {
        const writtenPages = await SpellPage.findBy({bookId: spellBook.id})
        return spellBook.maxPages - writtenPages.reduce((acc, cur) => acc + cur.pages, 0)
    }
}


