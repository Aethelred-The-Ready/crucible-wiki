import React, { useState, useMemo, useEffect} from 'react';
import { technique } from './sortable_technique_list';
import useIsBrowser from '@docusaurus/useIsBrowser';


import './tool.css'

type Props = {
	rituals: ritual[],
	spells: technique[],
	alchemies: technique[],
	skills: skill[]
}

type ritual = {
	"Title": string,
	"Multi": boolean,
	"Name": string,
	"Groups": string,
	"Cost": string,
	"Type": string,
	"School": string,
	"Target": string,
	"Duration": string,
	"Effect": string
}

type skill = {
	"Title": string,
	"Name": string,
	"Groups": string,
	"Category": string,
	"Multi": boolean,
	"Requirements": string,
	"Benefit": string,
	"Costs": string[],
	"Rank": number,
	"Req_obj": any[]
}

type cost_obj = {
	power: number,
	creation: number,
	destruction: number,
	elemental: number,
	spirit: number,
	time: number,
	void: number,
	special: string,
	string: string
}

type ritual_obj = {
	name: string,
	multi: boolean,
	groups: string[],
	cost: cost_obj,
	type: string[],
	school: string[],
	target: string,
	duration: string,
	effect: string
}

type selected_ritual = {
	name: string,
	selection: string,
	num: number, 
	cost: cost_obj,
	rit_obj: ritual_obj
}

type built_ritual = {
	name: string,
	rituals: selected_ritual[],
	cost: cost_obj
}

export default (props: Props) => {
	
	const ritual_list: ritual[] = React.useMemo(() =>
		Object.keys(props.rituals).map(k => props.rituals[parseInt(k)]).filter((rit) => rit != undefined), [props.rituals]);
	const spell_list: technique[] = React.useMemo(() =>
		Object.keys(props.spells).map(k => props.spells[parseInt(k)]).filter((s) => {
			if (s == undefined) {
				return false
			} else if (s["Range"] == "Self") {
				return false 
			}
			return true;
		}), [props.spells]);
	const alchemies_list: technique[] = React.useMemo(() =>
		Object.keys(props.alchemies).map(k => props.alchemies[parseInt(k)]).filter((a) => a != undefined), [props.alchemies]);
	const skill_list: skill[] = React.useMemo(() =>
		Object.keys(props.skills).map(k => props.skills[parseInt(k)]).filter((s) => {
			if (s == undefined) {
				return false
			} else if (s["Category"] == "Heritage") {
				return false;
			} else if (s["Name"].includes("Slot")) { 
				return false;
			} else if (s["Benefit"].includes("Reset")) {
				return true
			}
			return false;
		}), [props.skills])

	const [selectedRitual, cSelectedRitual] = useState(ritual_list[0]["Name"])
	const [skill_selection, cSelectedSkill] = useState("")
	const [spell_selection, cSelectedSpell] = useState("")
	const [alchemy_selection, cSelectedAlch] = useState("")
	const [other_selection, cSelectedOther] = useState("")

	const [concert_name, changeConcertName] = useState("")
	const [harmonized_ritual, setHarmonized] = useState(false)
	const [ritual_type, setType] = useState<string[]>(["Magic"])

	const assembleCostObj = (cost_string: string) => {
		let temp: cost_obj = {
			power: 0,
			creation: 0,
			destruction: 0,
			elemental: 0,
			spirit: 0,
			time: 0,
			void: 0,
			special: "",
			string: cost_string
		}
		let match = cost_string.match(/P(\d)/) 
		if (match) {
			temp.power = parseInt(match[1])
		}
		match = cost_string.match(/C(\d)/) 
		if (match) {
			temp.creation = parseInt(match[1])
		}
		match = cost_string.match(/D(\d)/) 
		if (match) {
			temp.destruction = parseInt(match[1])
		}
		match = cost_string.match(/E(\d)/) 
		if (match) {
			temp.elemental = parseInt(match[1])
		}
		match = cost_string.match(/S(\d)/) 
		if (match) {
			temp.spirit = parseInt(match[1])
		}
		match = cost_string.match(/T(\d)/) 
		if (match) {
			temp.time = parseInt(match[1])
		}
		match = cost_string.match(/V(\d)/) 
		if (match) {
			temp.void = parseInt(match[1])
		}

		if (cost_string.includes(" + ")) {
			temp.special = cost_string.substring(cost_string.indexOf(" + ") + 3)
		}
		return temp;
	}

	const ritual_obj_list: ritual_obj[] = useMemo(() => {
		return ritual_list.map((parsed_ritual) => {
			let tmp: ritual_obj = {
				name: parsed_ritual["Name"],
				multi: parsed_ritual["Multi"],
				groups: parsed_ritual["Groups"].split(","),
				type: parsed_ritual["Type"].split(","),
				school: parsed_ritual["School"].split(","),
				cost: assembleCostObj(parsed_ritual["Cost"]),
				target: parsed_ritual["Target"],
				duration: parsed_ritual["Duration"],
				effect: parsed_ritual["Effect"]
			}
			tmp.type = tmp.type.map((val) => val.trim())
			return tmp;
		})
	}, ritual_list)

	const addCostString = (cost: cost_obj) => {
		cost.string = ""
		cost.string += (cost.power > 0 ? "P" + cost.power + " " : "")
		cost.string += (cost.creation > 0 ? "C" + cost.creation + " " : "")
		cost.string += (cost.destruction > 0 ? "D" + cost.destruction + " " : "")
		cost.string += (cost.elemental > 0 ? "E" + cost.elemental + " " : "")
		cost.string += (cost.spirit > 0 ? "S" + cost.spirit + " " : "")
		cost.string += (cost.time > 0 ? "T" + cost.time + " " : "")
		cost.string += (cost.void > 0 ? "V" + cost.void + " " : "") 
		cost.string += cost.special
	}

	let loaded_string = null;
	if (useIsBrowser()) {
		loaded_string = localStorage.getItem("concerts_built")
	}

	let builtConcerts_temp: built_ritual[] = []
	if (loaded_string != null) {
		builtConcerts_temp = JSON.parse(loaded_string)
	}

	const [builtConcerts, bCModifier] = useState(builtConcerts_temp)

	const [selectedRitualList, ritualListEditor] = useState<selected_ritual[]>([])

	const getReversePyramid = (num: number) => {
		if (num >= 15) {
			return 5;
		} else if (num >= 10) {
			return 4; 
		} else if (num >= 6) {
			return 3; 
		} else if (num >= 3) {
			return 2; 
		} else if (num >= 1) {
			return 1; 
		}
		return 0
	}

	const currentConcertStats = useMemo(() => {

		let cost: cost_obj = {
			power: 0,
			creation: 0,
			destruction: 0,
			elemental: 0,
			spirit: 0,
			time: 0,
			void: 0,
			special: "",
			string: ""
		}

		let slots = 0

		let ritual_types: string[][] = []


		// Check for invalid values while we are adding up the costs
		let validity = selectedRitualList.map((ritual, index) => {
			if(ritual == undefined){
				return;
			}
			cost.power += ritual.rit_obj.cost.power;
			cost.creation += ritual.rit_obj.cost.creation;
			cost.destruction += ritual.rit_obj.cost.destruction;
			cost.elemental += ritual.rit_obj.cost.elemental;
			cost.spirit += ritual.rit_obj.cost.spirit;
			cost.time += ritual.rit_obj.cost.time;
			cost.void += ritual.rit_obj.cost.void;

			if (ritual.rit_obj.cost.special.trim() == "Special") {
				cost.special += " + Special (" + ritual.name + ")"
			}
			if (ritual.name == "Extend Ritual, Greater") {
				cost.special += " (Requires 1 P2 or P4)"
			}

			switch(ritual.name){
				case "Annihilation":
				case "Delve History":
				case "Enhance Weapon":
				case "Enhance Armour":
				case "Exorcism":
				case "Extend Ritual":
				case "Funerary Rites":
				case "Instil Chaos":
				case "Neutralize":
				case "Poison Reserve":
				case "Prophecy":
				case "Ranger Bond, Protector":
				case "Reincarnate":
				case "Sending":
				case "Spell Store":
				case "Soul Forge":
				case "Stalker's Weapon":
				case "Sunder Magic":
				case "Teleportation Circle":
					slots = slots;
					break;
				case "Extend Ritual, Superior":
					slots++;
				default:
					slots++;
			}


			// Now check for invalidity
			let tmp = {valid: true, reason: ""}
			if (index != 0 && ritual.name == "Instil Chaos") {
				return {valid: false, reason: "Instil Chaos must be the first Ritual Cast"}
			} else if (index != selectedRitualList.length - 1 &&  ritual.name.includes("Extend")) {
				return {valid: false, reason: ritual.name + " must be the last Ritual in a Concert"}
			} else if (!ritual.rit_obj.multi && selectedRitualList.filter((r2) => r2.name == ritual.name).length > 1) {
				return {valid: false, reason: ritual.name + " cannot be duplicated"}
			} else if (ritual.name == "Imbue Skill" && selectedRitualList.filter((r2) => r2.selection == ritual.selection).length > 1) {
				return {valid: false, reason: "Imbue Skill " + ritual.selection + " cannot be duplicated"}
			} else if (!ritual.rit_obj.type.some((type) => {return ritual_type.includes(type.trim())})){
				return {valid: false, reason: ritual.name + " cannot be cast by the currently selected ritualist"}
			}

			return tmp
		})

		let ew = selectedRitualList.filter((r) => r.name == "Enhance Weapon").length
		let ea = selectedRitualList.filter((r) => r.name == "Enhance Armour").length
		let pr = selectedRitualList.filter((r) => r.name == "Poison Reserve").length
		let ss = selectedRitualList.filter((r) => r.name == "Spell Store").length
		let sw = selectedRitualList.filter((r) => r.name == "Poison Reserve").length
		let rbp = selectedRitualList.filter((r) => r.name == "Ranger Bond, Protector").length

		slots += Math.ceil(ea/5)

		slots += getReversePyramid(ew)
		slots += getReversePyramid(pr)
		slots += getReversePyramid(ss)
		slots += getReversePyramid(sw)
		slots += getReversePyramid(rbp)

		addCostString(cost)

		let summary: string[] = []
		selectedRitualList.forEach((ritual) => {
			switch(ritual.name) {
				case "Enhance Weapon":
					break;
			}
		})
		if (ew > 0) {
			summary.push("Enhance Weapon +" + getReversePyramid(ew))
		}
		if (pr > 0) {
			summary.push("Enhance Weapon +" + getReversePyramid(pr))
		}
		if (ss > 0) {
			summary.push("Enhance Weapon +" + getReversePyramid(ss))
		}
		if (sw > 0) {
			summary.push("Enhance Weapon +" + getReversePyramid(sw))
		}

		let stats = {cost: cost, validity: validity, slots: slots, summary: summary}

		return stats;
	}, [selectedRitualList, ritual_type])

	let rearrangeList = (index: number, dir: string) => {
		let target = index;
		if (dir == "up") {
			target--;
		} else {
			target++;
		}

		if (target < 0 || target >= selectedRitualList.length) {
			return
		}

		ritualListEditor((list) => {
			let temp = [...list]
			let swp = temp[target]
			temp[target] = temp[index]
			temp[index] = swp
			return temp
		})
	}

	let displayRitual = (ritual_selected: selected_ritual, index: number) => {
		let rit_obj: ritual_obj | undefined = ritual_obj_list.find((obj) => obj.name == ritual_selected.name);

		let cont = <><td>{ritual_selected.name} not found</td><td></td></>
		if (rit_obj != undefined){
			cont = <>
				<td>
					<b>{rit_obj.name}</b>
					{ritual_selected.selection == "" ? "" : " ("}
					{ritual_selected.selection}
					{ritual_selected.selection == "" ? "" : ")"}
				</td>
				<td>
					{ritual_selected.cost.string}
				</td>
				<td>
					{ritual_selected.rit_obj.type.join(", ")}
				</td>
				</>
		}
		let validity = currentConcertStats.validity[index]

		return <tr key={index} className="display-row" style={{color: (validity?.valid ? "black" : "red")}} title={validity?.reason}>
			<td className="display-cell">
				<button onClick={() => rearrangeList(index, "up")}>&#x25B2;</button>
				<button onClick={() => rearrangeList(index, "down")}>&#x25BC;</button>
			</td>
			{cont}
			<td>
				<div className="display-cell">
					<button onClick={() => ritualListEditor((list) => {let tmp = [...list]; tmp.splice(index, 1); return tmp})}>X</button>
				</div>
			</td>
		</tr>
	}

	useEffect(() => {
		try {
			if (useIsBrowser()) {
				localStorage.setItem("concerts_built",JSON.stringify(builtConcerts))
			}
		} catch (e: any) {
			if (e && e.name && (e.name == "QuotaExceededError" || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
				confirm("Out of local storage (5 MiB). Please delete some concerts before proceeding");
			}
		}
	}, [builtConcerts])

	const pickSavedRitual = (value: string) => {
		if (value == "none") {
			ritualListEditor(() => [])
				changeConcertName(() => "")
		}
		builtConcerts.forEach((ritual) => {
			if (ritual.name == value) {
				ritualListEditor(() => ritual.rituals)
				changeConcertName(() => value)
			}
		})
	}

	const saveConcert = () => {
		// Remove any concerts with the same name as this one
		bCModifier((bc) => {
			let tmp = bc.filter((concert) => concert.name != concert_name);
			// And add this one
			tmp.push(
				{
					name: concert_name, 
					rituals: selectedRitualList,
					cost: currentConcertStats.cost
				})
			return tmp;
		})
	}

	// Add this ritual to the selection
	const addRitual = (selection: string) => {
		let seled = ""
		if (selection == "Imbue Skill") {
			seled = skill_selection;
		} else if (selection == "Imbue Spell" || selection == "Channel Spell" || selection == "Spell Bond") {
			seled = spell_selection;
		} else if (selection == "Imbue Alchemy" || selection == "Channel Poison") {
			seled = alchemy_selection;
		} else if (selection == "Phalanx Guard" || selection == "Duplicate Scroll") {
			seled = other_selection;
		}
		if (seled == "---") {
			return
		}

		let num = 1;
		selectedRitualList.forEach((ritual) =>
			{
				if (ritual.num > num) {
					num = ritual.num + 1
				}
			})
		let rit_obj = ritual_obj_list.find((rit) => rit.name == selection)

		if (rit_obj != undefined) {
			let cost = {...rit_obj.cost};
			if (selection == "Imbue Spell") {
				let spell = spell_list.find((spell) => spell["Name"] == seled)
				cost.power += Math.ceil((spell == undefined ? 3 : parseInt(spell.Level))/3)
			} else if (selection == "Imbue Alchemy") {
				let alch = alchemies_list.find((alch) => alch["Name"] == seled)
				cost.power += Math.ceil((alch == undefined ? 3 : parseInt(alch.Level))/3)
			} else if (selection == "Imbue Skill") {
				let skill = skill_list.find((skill) => skill["Name"] == seled)
				cost.power += Math.ceil((skill == undefined ? 3 : parseInt(skill["Costs"][0]))/2)
			} else if (selection == "Duplicate Scroll") {
				let rit = ritual_obj_list.find((rit) => rit.name == seled)
				if (rit != undefined) {
					cost.power += rit.cost.power;
					cost.creation += rit.cost.creation;
					cost.destruction += rit.cost.destruction;
					cost.elemental += rit.cost.elemental;
					cost.spirit += rit.cost.spirit;
					cost.time += rit.cost.time;
					cost.void += rit.cost.void;
				}
			}

			addCostString(cost)

			let addObj: selected_ritual = {
				name: selection,
				selection: seled,
				num: num,
				cost: cost,
				rit_obj: rit_obj
			}
			ritualListEditor((list) => {
				let temp = [...list]
				temp.push(addObj)
				return temp
			})
		}
	}

	const addRemoveType = (yn: string, type: string) => {
		let tmp = [...ritual_type];
		if (yn == "yes") {
			tmp.push(type)
		} else {
			tmp.splice(tmp.indexOf(type), 1)
		}

		return tmp;
	}

	return <div>
		<div>
			Previously Built Concerts: 
			<select onChange={(event) => pickSavedRitual(event.target.value)}>
				<option value="none">----</option>
				{builtConcerts.map(concert => 
					<option value={concert.name} key={concert.name}>{concert.name}</option>
				)}
			</select>
		</div>
		<div>
			<div>
				Concert Name: <input type="text" value={concert_name} onChange={(event) => changeConcertName(()=>event.target.value)}></input>
				<button style={{marginLeft: "5px"}} onClick={saveConcert}>Save Concert</button>
				<button style={{marginLeft: "5px"}} onClick={() => {
					if (confirm("Are you sure you want to delete " + concert_name)) {
						bCModifier((bc) => bc.filter((c) => c.name != concert_name))
						ritualListEditor(() => [])
					}
				}}>Delete Concert</button>
			</div>
			
			<div>
				 {
					harmonized_ritual ? <>
						Ritual Types:&nbsp;
						<input type="checkbox" value={ritual_type.includes("Magic") ? "yes" : "no"} onChange={(event) => {setType((yn) => addRemoveType(event.target.value, "Magic"))}}> Magic </input>
						<input type="checkbox" value={ritual_type.includes("Smithing") ? "yes" : "no"} onChange={(event) => {setType((yn) => addRemoveType(event.target.value, "Magic"))}}> Magic </input>
						<input type="checkbox" value={ritual_type.includes("Alchemy") ? "yes" : "no"} onChange={(event) => {setType((yn) => addRemoveType(event.target.value, "Magic"))}}> Magic </input>
					</>
					:
					<>
						Ritual Type:&nbsp;
						<select value={ritual_type[0]} onChange={(event) => {setType(() => [event.target.value])}}>
							<option value="Magic">Magic</option>
							<option value="Smithing">Smithing</option>
							<option value="Alchemy">Alchemy</option>
						</select>
					</>
				}
			</div>
			<div>
				Concert Cost: {currentConcertStats.cost.string}
			</div>
			<div>
				Ritual Item Slots: {currentConcertStats.slots}
			</div>

			<select value={selectedRitual} onChange={(event) => {cSelectedRitual(event.target.value)}}>
				{ritual_obj_list.map((ritual) => 
					<option value={ritual.name} key={ritual.name}>{ritual.name}</option>
				)}
			</select>

			<button onClick={() => addRitual(selectedRitual)}>
				Add Ritual
			</button><br/>
			<div>
				{ selectedRitual == "Imbue Skill" ? 
					<select value={skill_selection} onChange={(event) => (cSelectedSkill(event.target.value))}>
					<option value="---">---</option>
						{skill_list.map((skill) => 
							<option value={skill["Name"]} key={skill["Name"]}>{skill["Name"]}</option>
						)}
					</select> : null}
				{ selectedRitual == "Imbue Spell" || selectedRitual == "Channel Spell" || selectedRitual == "Spell Bond" ? 
					<select value={spell_selection} onChange={(event) => (cSelectedSpell(event.target.value))}>
					<option value="---">---</option>
						{spell_list.map((spell) => 
							<option value={spell["Name"]} key={spell["Name"]}>{spell["Name"]}</option>
						)}
					</select> : null}
				{ selectedRitual == "Imbue Alchemy" || selectedRitual == "Channel Poison" ? 
					<select value={alchemy_selection} onChange={(event) => (cSelectedAlch(event.target.value))}>
					<option value="---">---</option>
						{alchemies_list.map((alchemy) => 
							<option value={alchemy["Name"]} key={alchemy["Name"]}>{alchemy["Name"]}</option>
						)}
					</select> : null}
				{ selectedRitual == "Duplicate Scroll" || selectedRitual == "Channel Poison" ? 
				<select value={other_selection} onChange={(event) => (cSelectedOther(event.target.value))}>
					<option value="---">---</option>
					{ritual_list.map((rit) => 
						<option value={rit["Name"]} key={rit["Name"]}>{rit["Name"]}</option>
					)}
				</select> : null}
				{ selectedRitual == "Phalanx Guard" ? 
				<select value={other_selection} onChange={(event) => (cSelectedOther(event.target.value))}>
					<option value="---">---</option>
					<option value={"Gauntlet/Buckler"}>Gauntlet or Buckler</option>
					<option value={"Small Shield"}>Small Shield</option>
					<option value={"Large Shield"}>Large Shield</option>
				</select> : null}
			</div>
		</div><br />
		<div>
			<table>
				<thead>
					<tr>
						<th>
							Sort
						</th>
						<th>
							Ritual Name
						</th>
						<th>
							Cost
						</th>
						<th>
							Ritual Type
						</th>
						<th>
							Remove
						</th>
					</tr>
				</thead>
				<tbody>
					{selectedRitualList.map(displayRitual)}
				</tbody>
			</table>
		</div>
	</div>
}