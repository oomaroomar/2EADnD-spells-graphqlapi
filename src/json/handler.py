# quick script to convert json arrays to dictionaries
import json

f = open('wizard.json')
wSpells = json.load(f)
f.close()
newWSpells = {}

for s in wSpells:
    key =  s['school'] + ' - ' + s['name']
    newWSpells[key] = s

with open('wizards.json', 'w') as fp:
    json.dump(newWSpells, fp, ensure_ascii=True, indent=4)

fp.close()