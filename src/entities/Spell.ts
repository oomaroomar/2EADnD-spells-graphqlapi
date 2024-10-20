import { Book, Caster, Save, School, Sphere } from "src/types"
import { Field, ObjectType, Int } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity()
@ObjectType()
export class WizardSpell extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  level!: number

  @Field()
  @Column()
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
}

@Entity()
@ObjectType()
export class PriestSpell extends WizardSpell {
  @Field()
  @Column()
  sphere: string

}