import json, math, sys, re


skill_contents_list = {}
with open("./Crucible_Skills.json", "r", encoding="utf-8") as file_pointer:
	content = file_pointer.read()
	skill_contents_list = json.loads(content)

skill_name_list = []
for skill in skill_contents_list:
	skill_name_list.append(skill["Name"])

# Make the ability lookup table
statement = "INSERT INTO abilities_lookup (ability_name) values ('" + "'),('".join(skill_name_list) + "');"
# print if needed
# print(statement)


