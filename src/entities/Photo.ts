import { Field, ObjectType } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
@ObjectType()
export class Photo {
  @PrimaryGeneratedColumn()
  @Field()
  id: number

  @Column({ length: 100 })
  @Field()
  name: string

  @Column("text")
  @Field()
  description: string

  @Column()
  @Field()
  filename: string

  @Column()
  @Field()
  views: number

  @Column()
  @Field()
  isPublished: boolean
}
