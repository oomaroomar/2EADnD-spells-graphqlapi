import { Book, Caster, Save, School, SpellInput, Sphere } from "src/types"
import { Field, ObjectType, Int, InputType } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, Brackets, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany, ManyToOne } from "typeorm"
import { Cursor } from "src/types"
import { Character } from "./Character"
import { SpellBook } from "./SpellBook"
import { SpellPage } from "./SpellPage"
import { LearnedSpell } from "./LearnedSpell"
import { User } from "./User"


// Index everything because data will be queries 10^6 times more often than it is mutated
@Entity()
@ObjectType()
export class Spell extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  @Index()
  level!: number

  @Field()
  @Column()
  @Index()
  name!: string

  @Field(() => [String])
  @Index()
  @Column({type: 'text', array: true})
  schools!: string[]

  @Field()
  @Index()
  @Column()
  class!: Caster

  @Field()
  @Index()
  @Column()
  verbal!: boolean

  @Field()
  @Index()
  @Column()
  somatic!: boolean

  @Field()
  @Index()
  @Column()
  material!: boolean

  @Field()
  @Index()
  @Column()
  materials: string

  @Field()
  @Index()
  @Column()
  range: string

  @Field()
  @Index()
  @Column()
  aoe: string

  @Field()
  @Index()
  @Column()
  castingTime: string

  @Field()
  @Index()
  @Column()
  duration: string

  @Field()
  @Index()
  @Column()
  savingThrow: Save

  @Field()
  @Index()
  @Column()
  damage: string

  @Field()
  @Column()
  description: string

  @Index()
  @Column({nullable: true})
  source: Book

  @Field(() => [String], {nullable: true})
  @Index()
  @Column({type: 'text', array: true, nullable: true})
  spheres: string[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({nullable: true})
  @Column({nullable: true})
  @Index()
  creatorId!: number

  @ManyToOne(() => User, {nullable: true})
  creator: User

  @OneToMany(() => LearnedSpell, ls => ls.spellId)
  spellKnowers: LearnedSpell[]

  @OneToMany(() => SpellPage, sp => sp.spell)
  writtenCopies: SpellPage[]

  static findSome(cursor: Cursor, limit: number) {
    return this.createQueryBuilder('spell')
      .where('spell.level  > :lvl', {lvl: cursor.level !== null ? cursor.level : 1})
      .orWhere(new Brackets(qb => {
        qb.where('spell.level  = :lvl', {lvl: cursor.level !== null ? cursor.level : 1})
        .andWhere('spell.name > :name', {name: cursor.name !== null ? cursor.name : '' })
      }))
      .orderBy('spell.level', 'ASC')
      .addOrderBy('spell.name', 'ASC')
      .take(limit)
      .getMany()
  }
  
  static findSomeClassSpells(cursor: Cursor, limit: number, castingClass: string) {
    return this.createQueryBuilder('spell')
      .where('spell.class = :class', {class: castingClass})
      .andWhere(new Brackets(qb => {
        qb.where('spell.level  > :lvl', {lvl: cursor.level !== null ? cursor.level : 1})
          .orWhere(new Brackets(qbp => {
          qbp.where('spell.level  = :lvl', {lvl: cursor.level !== null ? cursor.level : 1})
          .andWhere('spell.name > :name', {name: cursor.name !== null ? cursor.name : '' })
      }))
      }))
      .orderBy('spell.level', 'ASC')
      .addOrderBy('spell.name', 'ASC')
      .take(limit)
      .getMany()
  }
}

