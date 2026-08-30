# A list of terms to link the first time they show up in a page
# Format is "string to be linked": "[string to be linked](link to page)"

# A function to check if the position of a potential replacement is inside another tag
def in_tag(string, position):
	before_count = 0
	for char in string[:position]:
		if char == "[":
			before_count += 1
		elif char == "]":
			before_count -= 1
	if before_count > 0:
		return True
	after_count = 0
	for char in string[position:]:
		if char == "[":
			after_count += 1
		elif char == "]":
			after_count -= 1
	if after_count > 0:
		return True
	return False

def try_replace(string, needle):
	sfn = string.find(needle)
	# Do not want to replace already in a tag, or middle of a word
	if sfn != -1 and not in_tag(string, sfn) and not in_tag(string, sfn + len(needle)):# and (len(string) == sfn + len(needle) or string[sfn + len(needle)] in " .,:;"): 
		return string.replace(needle, replacement_list[needle], 1)
	return string

def run_replaceemnt_list(string):
	for needle in replacement_list:
		# If the needle is in the string, but not in a tag already
		string = try_replace(string, needle)
	return string


# they are checked in the order seen here, so deconflict smaller terms by having them come later.
# The system will never put one link inside another
replacement_list = {
	"Δ": "[Δ](/docs/glossary/pyramid)",
	"Pyramid Skills on Page 32.": "[Pyramid Skills](/docs/glossary/pyramid).",
	"Pyramid Skills on Page 32": "[Pyramid Skills](/docs/glossary/pyramid)",
	"Pyramid Skills": "[Pyramid Skills](/docs/glossary/pyramid)",
	"Pyramid": "[Pyramid](/docs/glossary/pyramid)",
	"Physical Representations": "[Physical Representations](/docs/equipment)",
	"Physical Representation": "[Physical Representation](/docs/equipment)",
	"Chapter 7: Magic": "[Spellcasting](/docs/magic/spellcasting)",
	"Ritual Magic": "[Ritual Magic](/docs/rituals)",
	"Extraplanar creature or Elemental": "[Extraplanar creature or Elemental](/docs/lore/planes-of-existance)",
	# Skills
	"Dodge Skill": "[Dodge Skill](/docs/skills/expertise/dodge)",
	"Archery Skill": "[Dodge Skill](/docs/skills/fighting/archery)",
	# Curses
	"Curse": "[Curse](/docs/glossary/curse)",
	"Curses": "[Curses](/docs/glossary/curse)",
	"Blind": "[Blind](/docs/glossary/curse#blind)",
	"Cripple": "[Cripple](/docs/glossary/curse#cripple)",
	"Drain": "[Drain](/docs/glossary/curse#drain)",
	"Fetter": "[Fetter](/docs/glossary/curse#fetter)",
	"Fumble": "[Fumble](/docs/glossary/curse#fumble)",
	"Frailty": "[Frailty](/docs/glossary/curse#frailty)",
	"Paralysis": "[Paralysis](/docs/glossary/curse#paralysis)",
	"Weakness": "[Weakness](/docs/glossary/curse#weakness)",
	#Compulsions
	"Compulsion": "[Compulsion](/docs/glossary/compulsion)",
	"Compulsions": "[Compulsions](/docs/glossary/compulsion)",
	"Calm": "[Calm](/docs/glossary/compulsion#calm)",
	"Charm": "[Charm](/docs/glossary/compulsion#charm)",
	"Cowardice": "[Cowardice](/docs/glossary/compulsion#cowardice)",
	"Dominate": "[Dominate](/docs/glossary/compulsion#dominate)",
	"Fear": "[Fear](/docs/glossary/compulsion#fear)",
	"Shun": "[Shun](/docs/glossary/compulsion#shun)",
	"Silence": "[Silence](/docs/glossary/compulsion#silence)",
	"Sleep": "[Sleep](/docs/glossary/compulsion#sleep)",
	#Bindings
	"Binding": "[Binding](/docs/glossary/binding)",
	"Bindings": "[Bindings](/docs/glossary/binding)",
	"Bind": "[Bind](/docs/glossary/binding#bind)",
	"Confine": "[Confine](/docs/glossary/binding#confine)",
	"Pin": "[Pin](/docs/glossary/binding#pin)",
	"Web": "[Web](/docs/glossary/binding#web)",
	#Other effects
	"Abolishment": "[Abolishment](/docs/glossary/abolishment)",
	"Absorb": "[Absorb](/docs/glossary/absorb)",
	"Aegis": "[Aegis](/docs/glossary/aegis)",
	"Alarm": "[Alarm](/docs/glossary/alarm)",
	"Conversion": "[Conversion](/docs/glossary/conversion)",
	"Aura": "[Aura](/docs/glossary/aura)",
	"Banish": "[Banish](/docs/glossary/banish)",
	"Berserk": "[Berserk](/docs/glossary/berserk)",
	"Block": "[Block](/docs/glossary/block)",
	"Body": "[Body](/docs/glossary/body)",
	"Breach": "[Breach](/docs/glossary/breach)",
	"Break": "[Break](/docs/glossary/break)",
	"Clarity": "[Clarity](/docs/glossary/clarity)",
	"Claws": "[Claws](/docs/glossary/claws)",
	"Natural Weapons": "[Claws](/docs/glossary/claws)",
	"Cleanse": "[Cleanse](/docs/glossary/cleanse)",
	"Conjure": "[Conjure](/docs/glossary/conjure)",
	"Control": "[Claws](/docs/glossary/control)",
	"Death Throes": "[Death Throes](/docs/glossary/death-throes)",
	"Death": "[Death](/docs/glossary/death)",
	"Destroys": "[Destroys](/docs/glossary/destroy)",
	"Destroy": "[Destroy](/docs/glossary/destroy)",
	"Enhance Physical Armour": "[Enhance Physical Armour](/docs/glossary/enhance)",
	"Enhance Natural Armour": "[Enhance Natural Armour](/docs/glossary/enhance)",
	"Enhance Magical Armour": "[Enhance Magical Armour](/docs/glossary/enhance)",
	"Enhance Avoidance Armour": "[Enhance Avoidance Armour](/docs/glossary/enhance)",
	"Enhance": "[Enhance](/docs/glossary/enhance)",
	"Enthral": "[Enthral](/docs/glossary/enthral)",
	"Fabricate": "[Fabricate](/docs/glossary/fabricate)",
	"False Vitality": "[False Vitality](/docs/glossary/false-vitality)",
	"Healing": "[Healing](/docs/glossary/healing)",
	"Imbue Skill": "[Imbue Skill](/docs/glossary/imbue-skill)",
	"Imbue Spell": "[Imbue Spell](/docs/glossary/imbue-spell)",
	"Immunity": "[Immunity](/docs/glossary/immunity)",
	"Imprison": "[Imprison](/docs/glossary/imprison)",
	"Indestructible": "[Indestructible](/docs/glossary/indestructible)",
	"Inspiration": "[Inspiration](/docs/glossary/inspiration)",
	"Lantern": "[Lantern](/docs/glossary/lantern)",
	"Life": "[Life](/docs/glossary/life)",
	"Mirage": "[Mirage](/docs/glossary/mirage)",
	"Nullify": "[Nullify](/docs/glossary/nullify)",
	"Refit Physical Armour": "[Refit Physical Armour](/docs/glossary/refit)",
	"Refit Natural Armour": "[Refit Natural Armour](/docs/glossary/refit)",
	"Refit Magical Armour": "[Refit Magical Armour](/docs/glossary/refit)",
	"Refit Avoidance Armour": "[Refit Avoidance Armour](/docs/glossary/refit)",
	"Refit All Armour": "[Refit All Armour](/docs/glossary/refit)",
	"Refit": "[Refit](/docs/glossary/refit)",
	"Repel": "[Repel](/docs/glossary/repel)",
	"Reclection": "[Reflection](/docs/glossary/reflect)",
	"Reflect": "[Reflect](/docs/glossary/reflect)",
	"Regenerate": "[Regenerate](/docs/glossary/regenerate)",
	"Rejuvenate": "[Rejuvenate](/docs/glossary/rejuvenate)",
	"Renew": "[Renew](/docs/glossary/renew)",
	"Repaired": "[Repaired](/docs/glossary/repair)",
	"Repair": "[Repair](/docs/glossary/repair)",
	"Resistance": "[Resistance](/docs/glossary/resistance)",
	"Resist": "[Resist](/docs/glossary/resist)",
	"Revive": "[Revive](/docs/glossary/revive)",
	"Safeguard": "[Safeguard](/docs/glossary/safeguard)",
	"Sanctuary": "[Sanctuary](/docs/glossary/sanctuary)",
	"Seal": "[Seal](/docs/glossary/seal)",
	"Shield": "[Shield](/docs/glossary/shield)",
	"Stabilise": "[Stabilise](/docs/glossary/stabilise)",
	"Stasis": "[Stasis](/docs/glossary/stasis)",
	"Tarry": "[Tarry](/docs/glossary/tarry)",
	"Teleport": "[Teleport](/docs/glossary/teleport)",
	"Vanquish": "[Vanquish](/docs/glossary/vanquish)",
	"Vertigo": "[Vertigo](/docs/glossary/vertigo)",
	"Ward": "[Ward](/docs/glossary/Ward)",
	# Counted things
	"Ambush": "[Ambush](/docs/glossary/ambush)",
	"Cunning": "[Cunning](/docs/glossary/cunning)",
	"Fortify": "[Fortify](/docs/glossary/fortify)",
	"Fortification Points": "[Fortification Points](/docs/glossary/fortify)",
	"Strength": "[Strength](/docs/glossary/strength)",
	"Vorpal": "[Vorpal](/docs/glossary/vorpal)",
	#Removals
	"Dispel": "[Dispel](/docs/glossary/dispel)",
	"Remove": "[Remove](/docs/glossary/remove)",
	#Skills
	"Diagnose": "[Diagnose](/docs/skills/background-skills/diagnose)",
	"Echo Spellshape": "[Echo Spellshape](/docs/skills/magic-skills/echo-spellshape)",
	"Empower Spellshape": "[Empower Spellshape](/docs/skills/magic-skills/empower-spellshape)",
	"Piercing Spellshape": "[Piercing Spellshape](/docs/skills/magic-skills/piercing-spellshape)",
	"Spellshape": "[Spellshape](/docs/magic/magichapes)",
	"Potion": "[Diagnose](/docs/skills/crafting-skills/potion)",
	"Scroll": "[Diagnose](/docs/skills/crafting-skills/scroll)",
	#Things
	"Iron": "[Iron](/docs/equipment/special-materials)",
	"Silver": "[Silver](/docs/equipment/special-materials)",
	"Arcane Armour": "[Arcane Armour](/docs/equipment/non-physical-armour)",
	"Physical Armour": "[Physical Armour](/docs/equipment/armour)",
	"Natural Armour": "[Natural Armour](/docs/equipment/non-physical-armour)",
	"Avoidance Armour": "[Avoidance Armour](/docs/equipment/non-physical-armour)",
	"Thrown Weapon": "[Avoidance Armour](/docs/equipment/weapons)",
	#Delivery types
	"&lt;Effect&gt;- Strike": "[&lt;Effect&gt;- Strike](/docs/glossary/delivery-types#strike)",
	"&lt;Effect&gt;-Strike": "[&lt;Effect&gt;- Strike](/docs/glossary/delivery-types#strike)",
	"&lt;Effect&gt; - Strike": "[&lt;Effect&gt;- Strike](/docs/glossary/delivery-types#strike)",
	"&lt;Effect&gt; -Strike": "[&lt;Effect&gt;- Strike](/docs/glossary/delivery-types#strike)",
	"Arcane-Strike": "[Arcane-Strike](/docs/glossary/delivery-types#arcane)",
	"Magic-Strike": "[Magic-Strike](/docs/glossary/delivery-types#magic)",
	"Physical-Strike": "[Physical-Strike](/docs/glossary/delivery-types#physical)",
	"Poison-Strike": "[Poison-Strike](/docs/glossary/delivery-types#poison)",
	"Elemental-Strike": "[Elemental-Strike](/docs/glossary/delivery-types#elemental)",
	"Arcane(-Strike)": "[Arcane-Strike](/docs/glossary/delivery-types#arcane)",
	"Magic(-Strike)": "[Magic-Strike](/docs/glossary/delivery-types#magic)",
	"Physical(-Strike)": "[Physical-Strike](/docs/glossary/delivery-types#physical)",
	"Poison(-Strike)": "[Poison-Strike](/docs/glossary/delivery-types#poison)",
	"Elemental(-Strike)": "[Elemental-Strike](/docs/glossary/delivery-types#elemental)",
	"Arcane": "[Arcane](/docs/glossary/delivery-types#arcane)",
	"Magic": "[Magic](/docs/glossary/delivery-types#magic)",
	"Physical": "[Physical](/docs/glossary/delivery-types#physical)",
	"Poison": "[Poison](/docs/glossary/delivery-types#poison)",
	"Elemental": "[Elemental](/docs/glossary/delivery-types#elemental)",
	"Area of Effect": "[Area of Effect](/docs/glossary/delivery-types#area-of-effect)",
	"Lesser": "[Lesser](/docs/glossary/delivery-types#lesser)",
	"Piercing": "[Piercing](/docs/glossary/delivery-types#piercing)",
	"Sound of Voice": "[Sound of Voice](/docs/glossary/delivery-types#sound-of-voice)",
	"Contingency": "[Contingency](/docs/glossary/delivery-types#contingency)",
	"Touch": "[Contingency](/docs/glossary/delivery-types#touch)",
}