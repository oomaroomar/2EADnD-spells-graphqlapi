import DataLoader from "dataloader";
import { Spell } from "../entities/Spell";
import { In } from "typeorm";

// [1, 78, 8, 9]
// [{id: 1, username: 'tim'}, {}, {}, {}]
export const createSpellLoader = () =>
  new DataLoader<number, Spell>(async (spellIds) => {
    const spells = await Spell.find({where: {id: In(spellIds)}})
    const spellIdToSpell: Record<number, Spell> = {};
    spells.forEach((s) => {
        spellIdToSpell[s.id] = s;
    });

    const sortedSpells = spellIds.map((sId) => spellIdToSpell[sId]);
    return sortedSpells;
  });