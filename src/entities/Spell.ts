import { Book, Caster, Save, School, Sphere } from "src/types"
import { Field, ObjectType, Int } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, Brackets } from "typeorm"
import { Cursor } from "src/types"

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
  school: School

  @Field()
  @Column()
  class!: Caster

  @Field()
  @Column()
  verbal!: boolean

  @Field()
  @Column()
  somatic!: boolean

  @Field()
  @Column()
  material!: boolean

  @Field()
  @Column()
  materials: string

  @Field()
  @Column()
  range: string

  @Field()
  @Column()
  aoe: string

  @Field()
  @Column()
  castingTime: string

  @Field()
  @Column()
  duration: string

  @Field()
  @Column()
  savingThrow: Save

  @Field()
  @Column()
  damage: string

  @Field()
  @Column()
  description: string

  @Field()
  @Column()
  source: Book

  @Field({nullable: true})
  @Column({nullable: true})
  sphere: string

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
}

