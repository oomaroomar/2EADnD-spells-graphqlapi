# quick script to convert json arrays to dictionaries
import json

f = open('wizard.json')
wSpells = json.load(f)
f.close()
newSpells = []

for s in wSpells:
    newSpell = s
    newSpell['savingThrow'] = s['save']
    del newSpell['save']
    if 'errata' in newSpell:
        del newSpell['errata']
    newSpells.append(newSpell)

with open('wizards.json', 'w') as fp:
    json.dump(newSpells, fp, ensure_ascii=True, indent=4)

fp.close()