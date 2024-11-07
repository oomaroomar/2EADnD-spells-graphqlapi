import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Character } from "./Character";
import { Spell } from "./Spell";
import { SpellBook } from "./SpellBook";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String, {nullable: true})
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true, nullable: true })
  email!: string;

  @Column()
  password!: string;

  @Field()
  @Column('boolean', {default: false})
  isAdmin: boolean = false

  @OneToMany(() => Character, (character) => character.owner)
  characters: Character[];

  @OneToMany(() => Spell, (spell) => spell.id)
  homebrewSpells: Spell[];

  @Field(() => [SpellBook], {nullable: true})
  @OneToMany(() => SpellBook, book => book.id, {nullable: true})
  spellBooks?: SpellBook[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}