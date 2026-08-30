
import json, re

with open("Crucible_text.html", "r", encoding="utf-8") as rulebook:
    rulebook_content = rulebook.read()


# Skill table extractor
def skill_table_parser(start_codon, end_codon, group):
    tr = []
    st_start = rulebook_content.find(start_codon) + len(start_codon)
    st_end = rulebook_content.find(end_codon)
    st_cont = rulebook_content[st_start:st_end].split("<br/>")
    categ = ""
    for line in st_cont:
        words = line.split(" ")
        if words[0].find("*") != -1:
            can_rep = True
            words[0] = words[0].replace("*", "")
        title = words[0]
        tent_costs = []
        past_costs = False
        can_rep = False
        reqs = ""
        for word in words[1:]:
            if past_costs:
                reqs += " " + word
            elif word.isdigit() or word == "-" or re.match(r"\*\+\d", word):
                tent_costs.append(word)
                if (len(tent_costs) == 4 and group != "Heritage") or (len(tent_costs) == 2 and group == "Heritage"):
                    past_costs = True
            # Got a string, but we thought we were dealing with the costs
            elif len(tent_costs) > 0:
                # If we have our 4 or 2 costs
                if len(tent_costs) > 1:
                    past_costs = True
                    reqs = word
                # Otherwise this is still part of the skill name, clear tentative costs and keep adding to title
                else:
                    if word.find("*") != -1:
                        can_rep = True
                        word = word.replace("*", "")
                    title += " " + tent_costs[0] + " " + word
                    tent_costs = []
            elif not past_costs:
                if word.find("*") != -1:
                    can_rep = True
                    word = word.replace("*", "")
                title += " " + word
            else:
                reqs += " " + word
        if len(tent_costs) == 0:
            # Descriptor line
            categ = title
            continue;

        # Now we have our skill bits, make the object
        if group == "Heritage":
            skill = {"Name": title, "Categ": categ, "rep": can_rep, "A": tent_costs[0], "B": tent_costs[1], "Req": reqs.strip()}
        elif group == "Background":
            skill = {"Name": title, "Categ": categ, "rep": can_rep, "A": tent_costs[0], "Req": reqs.strip()}
        else:
            skill = {"Name": title, "Categ": categ, "rep": can_rep, "A": tent_costs[0], "B": tent_costs[1], "C": tent_costs[2], "D": tent_costs[3], "Req": reqs.strip()}
        tr.append(skill)
    return tr

fighting_skill_costs = skill_table_parser("<div><div>Fighting Skills<br/>Priority<br/>Skill Name A B C D Prerequisites<br/>", "<br/>*This Skill can be bought more than once.<br/>Table 4.4 – Fighting Skills<br/></div></div></div></div>", "Fighting")
expertise_skill_costs = skill_table_parser("<div><div>Expertise Skills<br/>Priority<br/>Skill Name A B C D Prerequisites<br/>", "<br/>*This Skill can be bought more than once.<br/>Table 4.5 – Expertise Skills<br/></div></div></div></div>", "Expertise")
magic_skill_costs = skill_table_parser("<div><div>Magic Skills<br/>Priority<br/>Skill Name A B C D Prerequisites<br/>", "<br/>*This Skill can be bought more than once.<br/>Table 4.6 – Magic Skills<br/></div></div></div></div>", "Magic")
crafting_skill_costs = skill_table_parser("<div><div>Crafting Skills<br/>Priority<br/>Skill Name A B C D Prerequisites<br/>", "<br/>*This Skill can be bought more than once.<br/>Table 4.7 – Crafting Skills<br/></div></div></div></div>", "Crafting")
heritage_skill_costs = skill_table_parser("<div><div>Heritage Skills<br/>Priority<br/>Skill Name Has Trait Does Not Have Trait Group<br/>", "<br/>*This Skill can be bought more than once.<br/>Table 4.8 – Heritage Skills<br/></div></div></div></div>", "Heritage")
background_skill_costs = skill_table_parser("<div><div>Background<br/>Priority<br/>Skill Name A B C D Prerequisites<br/>", "<br/>*This Skill can be bought more than once.<br/>Table 4.9 – Background Skills<br/></div></div></div></div>", "Background")

# Grab the start and end of the skill description list
skill_descriptions_pos = rulebook_content.find("Skill Description List")
skill_description_start = skill_descriptions_pos + len("Skill Description List") + len("<br/>")
skill_description_end = rulebook_content.find("<div><div>Chapter 5: Equipment<br/>Equipment<br/>")

skill_descriptions = rulebook_content[skill_description_start:skill_description_end].replace("\n", "").replace("<div>", "").replace("</div>", "").split("<br/>")

# Now we have a line by line block of all the skill descriptions, go through them until we are done

current_skill_obj = {"Title": "", "Name": "", "Groups": "", "Category": "", "Multi": False, "Requirements": "", "Benefit": ""}

skill_list = []

def get_skill_costs (skill_name):
    skill_name = skill_name.lower()
    for skill in fighting_skill_costs:
        if (skill_name == skill["Name"].lower()):
            return (skill["Categ"], [skill["A"], skill["B"], skill["C"], skill["D"]])
    for skill in expertise_skill_costs:
        if (skill_name == skill["Name"].lower()):
            return (skill["Categ"], [skill["A"], skill["B"], skill["C"], skill["D"]])
    for skill in magic_skill_costs:
        if (skill_name == skill["Name"].lower()):
            return (skill["Categ"], [skill["A"], skill["B"], skill["C"], skill["D"]])
    for skill in crafting_skill_costs:
        if (skill_name == skill["Name"].lower()):
            return (skill["Categ"], [skill["A"], skill["B"], skill["C"], skill["D"]])
    for skill in heritage_skill_costs:
        if (skill_name == skill["Name"].lower()):
            return (skill["Categ"], [skill["A"], skill["B"]])
    for skill in background_skill_costs:
        if (skill_name == skill["Name"].lower()):
            return (skill["Categ"], [skill["A"]])
    print("Could not find skill " + skill_name)

currently = "benefit"

for line in skill_descriptions:
    # This is a title
    if line.find("[") != -1:
        if (current_skill_obj["Title"] != ""):
            temp = get_skill_costs(current_skill_obj["Name"])
            if temp is not None:
                current_skill_obj["Costs"] = temp[1]
                current_skill_obj["Category"] = temp[0]
            else:
                current_skill_obj["Costs"] = [2, 3, 4, 5]
                current_skill_obj["Category"] = current_skill_obj["Name"]
            skill_list.append(current_skill_obj.copy())
        current_skill_obj["Title"] = line
        current_skill_obj["Name"] = line[:line.find("[")-1]
        current_skill_obj["Groups"] = line[line.find("[")+1:line.find("]")]
        current_skill_obj["Multi"] = True if line.find("*") != -1 else False
        current_skill_obj["Requirements"] = ""
        current_skill_obj["Benefit"] = ""

        if "Weapon Proficiency" in current_skill_obj["Groups"] and not "Fighting" in current_skill_obj["Groups"]:
            current_skill_obj["Groups"] += ", Fighting"
        if "Alchemy" in current_skill_obj["Groups"] and not "Crafting" in current_skill_obj["Groups"]:
            current_skill_obj["Groups"] += ", Crafting"
    elif line.find("Requirements:") != -1:
        currently = "reqs"
        current_skill_obj["Requirements"] = line[len("Requirements:"):].strip()
    elif line.find("Benefit:") != -1:
        currently = "benefit"
        current_skill_obj["Benefit"] = line[len("Benefit:"):].strip()
    elif currently == "benefit":
        if len(line) > 4 and line[0:3] == "    ":
            current_skill_obj["Benefit"] += "<br/>"
        else:
            current_skill_obj["Benefit"] += " "
        current_skill_obj["Benefit"] += line.strip()
    elif currently == "reqs":
        if len(line) > 4 and line[0:3] == "    ":
            current_skill_obj["Requirements"] += "<br/>"
        else:
            current_skill_obj["Requirements"] += " "
        current_skill_obj["Requirements"] += line.strip()

with open("Crucible_Skills.json", "w", encoding="utf-8") as csfp:
    json.dump(skill_list, csfp, indent="\t")


# Grab the start and end of the spell description list
spell_descriptions_pos = rulebook_content.find("<div><div>Spell Descriptions <br/>")
spell_description_start = spell_descriptions_pos + len("<div><div>Spell Descriptions <br/>")
spell_description_end = rulebook_content.find("<div><div>Martial Arts<br/>Performing a Martial Art<br/>")

spell_descriptions = rulebook_content[spell_description_start:spell_description_end].replace("\n", "").replace("<div>", "").replace("</div>", "").split("<br/>")


# Grab cantrips
spell_descriptions_pos = rulebook_content.find("Cantrips <br/>cannot be recovered by Meditating nor are they a <br/>valid target for effects such as Inspiration or Renew.<br/>")
spell_description_start = spell_descriptions_pos + len("Cantrips <br/>cannot be recovered by Meditating nor are they a <br/>valid target for effects such as Inspiration or Renew.<br/>")
spell_description_end = rulebook_content.find("<div><div>Affliction Spell List<br/>Level Spell Name Range")

spell_descriptions += rulebook_content[spell_description_start:spell_description_end].replace("\n", "").replace("<div>", "").replace("</div>", "").split("<br/>")


# Now we have a line by line block of all the spell descriptions, go through them until we are done

c_spell = {"Title": "", "Name": "", "Groups": "", "School": "", "Level": "", "Range": "", "Duration": "", "Effect": "", "Incantation": "", "Delivery Verbal": ""}

spell_list = []

currently = "Title"

for index, line in enumerate(spell_descriptions):
    # Title is before school
    if len(spell_descriptions) > index + 1 and spell_descriptions[index + 1].find("School: ") != -1:
        spell_list.append(c_spell.copy())
        c_spell["Title"] = line.strip()
        c_spell["Groups"] = line[line.find("[")+1:line.find("]")] if line.find(" [") != -1 else ""
        c_spell["Name"] = line[:line.find(" [")] if line.find(" [") != -1 else line.strip()
        c_spell["Level"] = ""
        c_spell["Range"] = ""
        c_spell["Duration"] = ""
        c_spell["Incantation"] = ""
        c_spell["Delivery Verbal"] = ""
    elif line.find("School: ") != -1:
        currently = "School"
        c_spell["School"] = line[len("School: "):].strip()
    elif line.find("Level:") != -1:
        currently = "Level"
        c_spell["Level"] = line[len("Level:"):].strip()
        if c_spell["Level"] == "Cantrip":
            c_spell["Level"] = "0"
    elif line.find("Range:") != -1:
        currently = "Range"
        c_spell["Range"] = line[len("Range:"):].strip()
    elif line.find("Duration:") != -1:
        currently = "Duration"
        c_spell["Duration"] = line[len("Duration:"):].strip()
    elif line.find("Effect:") != -1:
        currently = "Effect"
        c_spell["Effect"] = line[len("Effect:"):].strip()
    elif line.find("Incantation:") != -1:
        currently = "Incantation"
        c_spell["Incantation"] = line[len("Incantation:"):].strip()
    elif line.find("Delivery Verbal:") != -1:
        currently = "Delivery Verbal"
        c_spell["Delivery Verbal"] = line[len("Delivery Verbal:"):].strip()
    else:
        # Add to whatever we are currently on
        if len(line) > 4 and line[0:3] == "    ":
            c_spell[currently] += "<br/>"
        c_spell[currently] += " " + line.strip()
spell_list.append(c_spell.copy())

spell_list = spell_list[1:]

with open("Crucible_Spells.json", "w", encoding="utf-8") as csfp:
    json.dump(spell_list, csfp, indent="\t")




# Grab the start and end of the alchemy description list
alchemy_descriptions_pos = rulebook_content.find("<div><div>Alchemy Descriptions <br/>")
alchemy_description_start = alchemy_descriptions_pos + len("<div><div>Alchemy Descriptions <br/>")
alchemy_description_end = rulebook_content.find("<div><div>Magic<br/>Casting a Spell<br/>")

alchemy_descriptions = rulebook_content[alchemy_description_start:alchemy_description_end].replace("\n", "").replace("<div>", "").replace("</div>", "").split("<br/>")

# Now we have a line by line block of all the alchemy descriptions, go through them until we are done

c_alchemy = {"Title": "", "Name": "", "Groups": "", "School": "", "Level": "", "Range": "", "Duration": "", "Effect": "", "Delivery Verbal": ""}

alchemy_list = []

currently = "Title"

for index, line in enumerate(alchemy_descriptions):
    # Title is before school
    if len(alchemy_descriptions) > index + 1 and alchemy_descriptions[index + 1].find("School: ") != -1:
        alchemy_list.append(c_alchemy.copy())
        c_alchemy["Title"] = line.strip()
        c_alchemy["Groups"] = line[line.find("[")+1:line.find("]")] if line.find(" [") != -1 else ""
        c_alchemy["Name"] = line[:line.find(" [")] if line.find(" [") != -1 else line.strip()
        c_alchemy["Level"] = ""
        c_alchemy["Range"] = ""
        c_alchemy["Duration"] = ""
        c_alchemy["Incantation"] = ""
        c_alchemy["Delivery Verbal"] = ""
    elif line.find("School: ") != -1:
        currently = "School"
        c_alchemy["School"] = line[len("School: "):].strip()
    elif line.find("Level:") != -1:
        currently = "Level"
        c_alchemy["Level"] = line[len("Level:"):].strip()
        if c_alchemy["Level"] == "Cantrip":
            c_alchemy["Level"] = "0"
    elif line.find("Range:") != -1:
        currently = "Range"
        c_alchemy["Range"] = line[len("Range:"):].strip()
    elif line.find("Duration:") != -1:
        currently = "Duration"
        c_alchemy["Duration"] = line[len("Duration:"):].strip()
    elif line.find("Effect:") != -1:
        currently = "Effect"
        c_alchemy["Effect"] = line[len("Effect:"):].strip()
    elif line.find("Incantation:") != -1:
        currently = "Incantation"
        c_alchemy["Incantation"] = line[len("Incantation:"):].strip()
    elif line.find("Delivery Verbal:") != -1:
        currently = "Delivery Verbal"
        c_alchemy["Delivery Verbal"] = line[len("Delivery Verbal:"):].strip()
    else:
        # Add to whatever we are currently on
        if len(line) > 4 and line[0:3] == "    ":
            c_alchemy[currently] += "<br/>"
        c_alchemy[currently] += " " + line.strip()
alchemy_list.append(c_alchemy.copy())

alchemy_list = alchemy_list[1:]

with open("Crucible_Alchemies.json", "w", encoding="utf-8") as csfp:
    json.dump(alchemy_list, csfp, indent="\t")

    

# Grab the start and end of the martial_art description list
martial_art_descriptions_pos = rulebook_content.find("<div><div>Martial Arts Descriptions<br/>")
martial_art_description_start = martial_art_descriptions_pos + len("<div><div>Martial Arts Descriptions<br/>")
martial_art_description_end = rulebook_content.find("<div><div>Chapter 8: Rituals Both Mundane and Magical<br/>Rituals")

martial_art_descriptions = rulebook_content[martial_art_description_start:martial_art_description_end].replace("\n", "").replace("<div>", "").replace("</div>", "").split("<br/>")

# Now we have a line by line block of all the martial_art descriptions, go through them until we are done

c_martial_art = {"Title": "", "Name": "", "Groups": "", "School": "", "Level": "", "Range": "", "Duration": "", "Effect": "", "Delivery Verbal": ""}

martial_art_list = []

currently = "Title"

for index, line in enumerate(martial_art_descriptions):
    # Title is before school
    if len(martial_art_descriptions) > index + 1 and martial_art_descriptions[index + 1].find("School: ") != -1:
        martial_art_list.append(c_martial_art.copy())
        c_martial_art["Title"] = line.strip()
        c_martial_art["Groups"] = line[line.find("[")+1:line.find("]")] if line.find(" [") != -1 else ""
        c_martial_art["Name"] = line[:line.find(" [")] if line.find(" [") != -1 else line.strip()
        c_martial_art["Level"] = ""
        c_martial_art["Range"] = ""
        c_martial_art["Duration"] = ""
        c_martial_art["Incantation"] = ""
        c_martial_art["Delivery Verbal"] = ""
    elif line.find("School: ") != -1:
        currently = "School"
        c_martial_art["School"] = line[len("School: "):].strip()
    elif line.find("Level:") != -1:
        currently = "Level"
        c_martial_art["Level"] = line[len("Level:"):].strip()
        if c_martial_art["Level"] == "Cantrip":
            c_martial_art["Level"] = "0"
    elif line.find("Range:") != -1:
        currently = "Range"
        c_martial_art["Range"] = line[len("Range:"):].strip()
    elif line.find("Duration:") != -1:
        currently = "Duration"
        c_martial_art["Duration"] = line[len("Duration:"):].strip()
    elif line.find("Effect:") != -1:
        currently = "Effect"
        c_martial_art["Effect"] = line[len("Effect:"):].strip()
    elif line.find("Incantation:") != -1:
        currently = "Incantation"
        c_martial_art["Incantation"] = line[len("Incantation:"):].strip()
    elif line.find("Delivery Verbal:") != -1:
        currently = "Delivery Verbal"
        c_martial_art["Delivery Verbal"] = line[len("Delivery Verbal:"):].strip()
    else:
        # Add to whatever we are currently on
        if len(line) > 4 and line[0:3] == "    ":
            c_martial_art[currently] += "<br/>"
        c_martial_art[currently] += " " + line.strip()
martial_art_list.append(c_martial_art.copy())

martial_art_list = martial_art_list[1:]

with open("Crucible_Martial_Arts.json", "w", encoding="utf-8") as csfp:
    json.dump(martial_art_list, csfp, indent="\t")