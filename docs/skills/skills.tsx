import React from 'react';

import * as char_config from '../../rules_parser/Character_Config.json'

type Props = {
    skill_group: string
};


type skill_obj = {
  name: string,
  skill_group: string,
  A_cost: number | null,
  B_cost: number | null,
  C_cost: number | null,
  D_cost: number | null,
  pre_req_str: string,
  pre_req_1: {
    name: string,
    count?: number
  }[],
  pre_req_2: {
    name: string,
    count?: number
  }[],
  options?: string[]
  group?: string[] | string,
  display_group: string,
  display_rank: number,
  can_repeat: boolean,
  max?: number,
  description: string,
  link: string,
  buyable: boolean
}

const skill_list: skill_obj[] = Object.keys(char_config).map(k => char_config[parseInt(k)])

export default (props: Props) => {
    let skills: skill_obj[] = []
    switch (props.skill_group) {
        case "Fighting":
        case "Expertise":
        case "Magic":
        case "Crafting":
        case "Background":
        case "Heritage":
            skills = skill_list.filter((elem) => elem && elem.skill_group == props.skill_group).sort((a, b) => {
                let tmp = a.display_group.localeCompare(b.display_group)
                if (tmp == 0) {
                    return a.display_rank - b.display_rank
                }
                return tmp
            })
            break;
        case "Martial Arts Slot":
        case "Spell Slot":
        case "Alchemy Slot":
        case "Weapon Training":
        case "Stealth Training":
            skills = skill_list.filter((elem) => elem && elem.name && elem.name.includes(props.skill_group))
            break;
        default:
            skills = skill_list.filter((elem) => elem && elem.group && elem.group == props.skill_group)
    }
    if (skills.length == 0) {
        return <> SKILLS NOT FOUND </>
    }

    function renderSkill(skill: skill_obj, index: number, skills: skill_obj[]) {
        let link = "./" + skill.name.toLowerCase().replaceAll(" ", "-")

        if (skill.name.includes("Level")) {
            link = "./" + skill.name.substring(8).toLowerCase().replaceAll(" ", "-")
        } else if (skill.name.includes("Weapon Training")) {
            link = "./weapon-training"
        }


        switch (props.skill_group) {
            case "Fighting":
            case "Expertise":
            case "Magic":
            case "Crafting":
            case "Martial Arts Slot":
            case "Spell Slot":
            case "Alchemy Slot":
            case "Weapon Training":
            case "Stealth Training":
                return <>
                    {(index == 0 || skills[index - 1].display_group != skill.display_group) ? 
                        <tr key={skill.display_group}>
                            <td>
                                <b>
                                    {skill.display_group}
                                </b>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    : <></>}
                    <tr key={skill.name}>
                        <td><a href={link} >{skill.name + (skill.can_repeat ? "*" : "")}</a></td>
                        <td>{(skill.name.includes("+1") ? "+" : "") + skill.A_cost + (skill.name.includes("+1") ? "‡" : "")}</td>
                        <td>{(skill.name.includes("+1") ? "+" : "") + skill.B_cost + (skill.name.includes("+1") ? "‡" : "")}</td>
                        <td>{(skill.name.includes("+1") ? "+" : "") + skill.C_cost + (skill.name.includes("+1") ? "‡" : "")}</td>
                        <td>{(skill.name.includes("+1") ? "+" : "") + skill.D_cost + (skill.name.includes("+1") ? "‡" : "")}</td>
                        <td>{(skill.pre_req_str == "None" ? "" : skill.pre_req_str)}</td>
                    </tr>
                </>
            case "Heritage":
                return <>
                    {(index == 0 || skills[index - 1].display_group != skill.display_group) ? 
                        <tr key={skill.display_group}>
                            <td>
                                <b>
                                    <a href={(skill.group && typeof skill.group == "string" ? "../../heritages/heritage-traits/" + skill.group.toLowerCase().replace(" ", "-") : "")} >
                                        {skill.group}
                                    </a>
                                </b>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    : <></>}
                    <tr key={skill.name}>
                        <td><a href={"./" + skill.name.toLowerCase().replace(" ", "-")} >{skill.name + (skill.can_repeat ? "*" : "")}</a></td>
                        <td>{skill.A_cost}</td>
                        <td>{skill.B_cost}</td>
                        <td>
                            <a href={(skill.group && typeof skill.group == "string" ? "../../heritages/heritage-traits/" + skill.group.toLowerCase().replace(" ", "-") : "")} >
                                {skill.group}
                            </a>
                        </td>
                    </tr>
                </>
        }

        return <tr key={skill.name}>
            <td><a href={"../../skills/heritage/" + skill.name.toLowerCase().replace(" ", "-")} >{skill.name + (skill.can_repeat ? "*" : "")}</a></td>
            <td>{skill.A_cost}</td>
            <td>{skill.B_cost}</td>
        </tr>

    }

    switch (props.skill_group) {
        case "Fighting":
        case "Expertise":
        case "Magic":
        case "Crafting":
        case "Martial Arts Slot":
        case "Spell Slot":
        case "Alchemy Slot":
        case "Weapon Training":
        case "Stealth Training":
            return <>
                <table>
                    <thead>
                        <tr>
                            <td>Cost Table (SP)</td>
                            <td>A</td>
                            <td>B</td>
                            <td>C</td>
                            <td>D</td>
                            <td>Pre-requisites</td>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map(renderSkill)}
                    </tbody>
                </table>
                {(skills.some(skill => skill.can_repeat) ? "*This Skill can be bought more than once" : "")}
            </>
        case "Heritage":
            return <>
                <table>
                    <thead>
                        <tr>
                            <td>Cost Table (SP)</td>
                            <td>Has Trait</td>
                            <td>Does Not Have Trait</td>
                            <td>Trait</td>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map(renderSkill)}
                    </tbody>
                </table>
                {(skills.some(skill => skill.can_repeat) ? "*This Skill can be bought more than once" : "")}
            </>
    }
    return <>
        <table>
            <thead>
                <tr>
                    <td>Cost Table (SP)</td>
                    <td>Has Trait</td>
                    <td>Does Not Have Trait</td>
                </tr>
            </thead>
            <tbody>
                {skills.map(renderSkill)}
            </tbody>
        </table>
        {(skills.some(skill => skill.can_repeat) ? "*This Skill can be bought more than once" : "")}
    </>
}