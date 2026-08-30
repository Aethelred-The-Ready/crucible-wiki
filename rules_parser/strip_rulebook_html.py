
import re

with open("Crucible_V1p0.html", "r", encoding="utf-8") as rulebook:
	rulebook_content = rulebook.read()

# Column Line Breaks
rulebook_content = re.sub(r' class="t m0( \S\S?\S?\S){1,8} ws0"', "", rulebook_content, flags=re.MULTILINE)
# Gaps
rulebook_content = re.sub(r'<span class="_ _\d"><\/span>', "", rulebook_content, flags=re.MULTILINE)
# Headers
rulebook_content = re.sub(r'<div id=".*?/>', "", rulebook_content, flags=re.MULTILINE)
# Font info
rulebook_content = re.sub(r'^@font.*?$\n', "", rulebook_content, flags=re.MULTILINE)
# other style
rulebook_content = re.sub(r"^\..*?$\n", "", rulebook_content, flags=re.MULTILINE)
# Top of page stuff
rulebook_content = re.sub(r'<div class="c \S\S\S? \S\S\S? \S\S\S? \S\S\S?"><div>Crucible V1.0.\d.\d</div>', "<div>", rulebook_content, flags=re.MULTILINE)
# Bottom of page stuff
rulebook_content = re.sub(r'<div class="pi".*?><\/div>', "", rulebook_content, flags=re.MULTILINE)
# Dont care about spans
rulebook_content = re.sub(r"<span.*?>", "", rulebook_content, flags=re.MULTILINE)
rulebook_content = re.sub(r"</span>", "", rulebook_content, flags=re.MULTILINE)
# Idk random stuff
rulebook_content = re.sub(r' class="c( \S\S?\S?\S){1,8} h10?"', "", rulebook_content, flags=re.MULTILINE)
rulebook_content = re.sub(r' class="c( \S\S?\S?\S){1,8}"', "", rulebook_content, flags=re.MULTILINE)
# Now replace every </div><div> with a newline
rulebook_content = re.sub(r"<\/div><div>", "<br/>", rulebook_content, flags=re.MULTILINE)
rulebook_content = re.sub(r"</div><br/><div>", "<br/>", rulebook_content, flags=re.MULTILINE)

# Remove all page numbers
rulebook_content = re.sub(r"<br/>\d\d?\d?</div></div></div></div>$", "<br/></div></div></div></div>", rulebook_content, flags=re.MULTILINE)

# Replace UTF-8 characters and html nonsense
rulebook_content = rulebook_content.replace("’", "'")
rulebook_content = rulebook_content.replace("&apos;", "'")
rulebook_content = rulebook_content.replace("“", "\"")
rulebook_content = rulebook_content.replace("”", "\"")
rulebook_content = rulebook_content.replace("\u201c", "\"")
rulebook_content = rulebook_content.replace("\u201d", "\"")
rulebook_content = rulebook_content.replace("’", "'")
rulebook_content = rulebook_content.replace("’", "'")
rulebook_content = rulebook_content.replace("’", "'")
rulebook_content = rulebook_content.replace("’", "'")

rulebook_content = rulebook_content.replace("Weapon <br/>Proficiency", "Weapon Proficiency")
rulebook_content = rulebook_content.replace("Level 5 Alchemy Slot, Level 5 Spell Slot, or <br/>5 Ranks in Smithing", "Level 5 Alchemy Slot, Level 5 Spell Slot, or 5 Ranks in Smithing")



with open("Crucible_text.html", "w", encoding="utf-8") as rulebook_text:
	rulebook_text.write(rulebook_content)