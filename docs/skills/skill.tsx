import React from 'react';

import * as char_config from '../../rules_parser/Character_Config.json'

type Props = {
    name: string
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
  group?: string[] | string
  can_repeat: boolean,
  max?: number,
  description: string,
  link: string,
  buyable: boolean
}

const skill_list: skill_obj[] = Object.keys(char_config).map(k => char_config[parseInt(k)])


export default (props: Props) => {

    let skill = skill_list.find((elem) => elem && elem.name == props.name)
    if (skill == undefined) {
        return <> SKILL NOT FOUND </>
    }

    if (skill.skill_group == "Heritage") {
        return <>
            <table>
                <thead>
                    <tr>
                        <td>Cost (SP)</td>
                        <td>With</td>
                        <td>Without</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{skill.name + (skill.can_repeat ? "*" : "")}</td>
                        <td>{skill.A_cost}</td>
                        <td>{skill.B_cost}</td>
                    </tr>
                </tbody>
            </table>
            {(skill.can_repeat ? "*This Skill can be bought more than once" : "")}
        </>
    }
    return  <>
            <table>
                <thead>
                    <tr>
                        <td>Cost (SP)</td>
                        <td>A</td>
                        <td>B</td>
                        <td>C</td>
                        <td>D</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{skill.name + (skill.can_repeat ? "*" : "")}</td>
                        <td>{skill.A_cost}</td>
                        <td>{skill.B_cost}</td>
                        <td>{skill.C_cost}</td>
                        <td>{skill.D_cost}</td>
                    </tr>
                </tbody>
            </table>
            {(skill.can_repeat ? "*This Skill can be bought more than once" : "")}
        </>
}