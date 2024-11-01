import { Book, Caster, Save, School, Sphere } from "src/types"
import { Field, ObjectType, Int } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, Brackets } from "typeorm"
import { Cursor } from "src/types"


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

  @Field()
  @Column()
  @Index()
  school: School

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

  @Field()
  @Index()
  @Column()
  source: Book

  @Field(() => [String], {nullable: true})
  @Index()
  @Column({type: 'text', array: true, nullable: true})
  spheres: string[]

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

