import { PriestSpell, WizardSpell } from "../entities/Spell"
import { WizardSpellInput } from "../types"
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

@Resolver(PriestSpell)
export class PriestSpellResolver {
  @Query(() => PriestSpell)
  async getSpellByID(
    @Arg("id", () => Int) id: number,
  ): Promise<PriestSpell | null> {
    return PriestSpell.findOneBy({ id })
  }

  @Query(() => [PriestSpell])
  async getPriestSpellByName(
    @Arg("name", () => String) name: string
  ): Promise<PriestSpell[] | null> {
    return PriestSpell.findBy({ name })
  }

  @Query(() => [WizardSpell])
  async getAllWizardSpells(): Promise<WizardSpell[]> {
    return WizardSpell.find()
  }

  @Mutation(() => WizardSpell)
  async createWizardSpell(@Arg("spellInfo") spellInfo: WizardSpellInput): Promise<WizardSpell | null> {
    return WizardSpell.create({ ...spellInfo }).save()
  }

  @Mutation(() => [WizardSpell])
  async createWizardSpells(@Arg("spellArray", () => [WizardSpellInput]) spellArray: WizardSpellInput[]): Promise<boolean> {
    const savedSpells = spellArray.map(async spell => await WizardSpell.create({...spell}).save())
    return true
  }

  @Mutation(() => WizardSpell)
  async deleteWizardSpell(@Arg("id") id: number): Promise<boolean> {
    await WizardSpell.delete({id})
    return true
  }

}

@Resolver(WizardSpell)
export class WizardSpellResolver {
  @Query(() => WizardSpell)
  async getSpellByID(
    @Arg("id", () => Int) id: number,
  ): Promise<WizardSpell | null> {
    return WizardSpell.findOneBy({ id })
  }

  @Query(() => [WizardSpell])
  async getWizardSpellByName(
    @Arg("name", () => String) name: string
  ): Promise<WizardSpell[] | null> {
    return WizardSpell.findBy({ name })
  }

  @Query(() => [WizardSpell])
  async getAllWizardSpells(): Promise<WizardSpell[]> {
    return WizardSpell.find()
  }

  @Mutation(() => WizardSpell)
  async createWizardSpell(@Arg("spellInfo") spellInfo: WizardSpellInput): Promise<WizardSpell | null> {
    return WizardSpell.create({ ...spellInfo }).save()
  }

  @Mutation(() => [WizardSpell])
  async createWizardSpells(@Arg("spellArray", () => [WizardSpellInput]) spellArray: WizardSpellInput[]): Promise<boolean> {
    const savedSpells = spellArray.map(async spell => await WizardSpell.create({...spell}).save())
    return true
  }

  @Mutation(() => WizardSpell)
  async deleteWizardSpell(@Arg("id") id: number): Promise<boolean> {
    await WizardSpell.delete({id})
    return true
  }
}
