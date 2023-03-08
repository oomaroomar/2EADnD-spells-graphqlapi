import { Spell } from "../entities/Spell"
import { School, Sphere, Caster, Save, Book } from "src/types"
import {
  Arg,
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql"

// Jump down to line 60

@InputType()
class SpellInput {
  @Field()
  level!: number

  @Field()
  name!: string

  @Field()
  school: School

  @Field()
  sphere: Sphere

  @Field()
  class!: Caster

  @Field()
  verbal!: boolean

  @Field()
  somatic!: boolean

  @Field()
  material!: boolean

  @Field()
  materials: string

  @Field()
  range: string

  @Field()
  aoe: string

  @Field()
  castingTime: number

  @Field()
  duration: string

  @Field()
  savingThrow: Save

  @Field()
  damage: string

  @Field()
  description: string

  @Field()
  source: Book
}

@Resolver(Spell)
export class SpellResolver {
  @Query(() => Spell)
  async spell(
    @Arg("id", () => Int) id: number,
    @Arg("name", () => String) name: string
  ): Promise<Spell | null> {
    if (id) {
      return Spell.findOneBy({ id })
    }
    return Spell.findOneBy({ name })
  }

  @Mutation(() => Spell)
  async createSpell(@Arg("spellInfo") spellInfo: SpellInput): Promise<Spell> {
    return Spell.create({ ...spellInfo }).save()
  }
}
