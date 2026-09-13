import React, { useState } from 'react';

import "../../src/css/custom.css";

type Props = {
	schools: string[],
	techniques: technique[],
	type: string
}

export type technique = {
	"Title": string,
	"Name": string,
	"School": string,
	"Level": string,
	"Range": string,
	"Duration": string,
	"Effect": string,
	"Incantation": string,
	"Delivery Verbal": string
}

type technique_page = {
	label: string,
	column_a: technique[],
	column_b: technique[],
}

export default (props: Props) => {
	
	const technique_list: technique[] = React.useMemo(() =>
		Object.keys(props.techniques).map(k => props.techniques[parseInt(k)]), [props.techniques]);

	const [filterConfig, setfilterConfig] = useState({ sort_type: "level", max_level: 9, schools_included: [...props.schools] });

	const [advOptionsVisible, setAdvOptionsVisible] = useState(false)

	const [printOptions, setPrintOptions] = useState({lines_per_page: 53, font_size: 10})

	const techniqueInSchool = (technique: technique) => {
		if (technique == undefined) {
			return false
		}
		let technique_schools = technique.School.split(", ")
		return technique_schools.some((elem) => filterConfig.schools_included.some(schl => schl == elem))
	}

	const schoolSelected = (school: string) => {
		return filterConfig.schools_included.some(schl => schl == school)
	}

	// Close enough
	function guessTechniqueLineHeight(val: technique): number {
		return Math.ceil((val.Effect + " Effect:").length / 52) + 6 + Math.ceil(val['Delivery Verbal'].length/40) + Math.ceil(val.Incantation.length/40);
	}

	const sortedTechniques: technique_page[] = React.useMemo(() => {
		let sortableTechniques = [...technique_list].filter(techniqueInSchool).filter(tech => parseInt(tech.Level) <= filterConfig.max_level);
		sortableTechniques.sort((a, b) => {
			if (filterConfig.sort_type == "level") {
				if (a["Level"] == b["Level"]) {
					if (a.Name < b.Name) {
						return -1;
					}
					if (a.Name > b.Name) {
						return 1;
					}
				}
				if (a["Level"] < b["Level"]) {
					return -1;
				}
				if (a["Level"] > b["Level"]) {
					return 1;
				}
				return 0;
			} else {
				if (a.Name < b.Name) {
					return -1;
				}
				if (a.Name > b.Name) {
					return 1;
				}
				return 0;
			}
		});
		let tr: technique_page[] = [];
		let current_level: technique[] = [];
		let cur_level = sortableTechniques[0].Level;
		let cur_level_lines = 0
		let cur_column = 'a'
		let cur_level_a: technique[] = []
		let cur_level_b: technique[] = []
		let prev_last = "A"
		//console.log("sorting")
		sortableTechniques.forEach((val) => {
			let height = guessTechniqueLineHeight(val);
			if ((val.Level != cur_level && filterConfig.sort_type == "level") || (cur_level == sortableTechniques[0].Level && filterConfig.sort_type == "level" && cur_level_lines + height > printOptions.lines_per_page-8) || cur_level_lines + height > printOptions.lines_per_page) {
				//console.log(cur_level_lines)
				if ((val.Level != cur_level && filterConfig.sort_type == "level")) {
					//console.log("Level: " + val.Level)
					// If we are at the end of a level rather than end of column, split the remaining bits evenly
					// If we got to the b column, add to a
					if (cur_column == 'b') {
						current_level = cur_level_a.concat(current_level);
						cur_level_lines = current_level.reduce((a, val) => {return a + guessTechniqueLineHeight(val)}, 0)
					}
					let split_point = 0;
					let split_closeness = 10000;
					let counter = 0;
					current_level.forEach((val, index) => {
						counter += guessTechniqueLineHeight(val)
						if (Math.abs(counter - (cur_level_lines/2)) < split_closeness) {
							split_point = index + 1;
							split_closeness = Math.abs(counter - cur_level_lines/2);
						}
					})
					if (split_point == current_level.length) {
						split_point -= 1;
					}
					if (split_point == 0) {
						split_point = 1;
					}

					let current_level_a = current_level.slice(0, split_point)
					let current_level_b = current_level.slice(split_point)
					tr.push(
						{
							label: "Level " + cur_level,
							column_a: [...current_level_a],
							column_b: [...current_level_b]
						});
					// Then start over at a
					cur_column = 'a'
				} else {
					if (cur_column == 'a') {
						cur_level_a = [...current_level]
						cur_column = 'b'
					} else {
						cur_level_b = [...current_level]
						let label = "Level " + cur_level
						if (filterConfig.sort_type == "name") {
							let last = cur_level_b.at(-1)
							if (last == undefined) {
								label = ""
							} else if (cur_level_a[0].Name.at(0) == last.Name[0] || val.Name[0] == last.Name[0]) {
								let label_a = cur_level_a[0].Name.slice(0, prev_last.length)
								let label_b = last.Name.slice(0, 2)
								let index = 2
								while (label_a.slice(0, index) == label_b.slice(0, index) && last.Name.length > index) {
									index++;
									label_a = cur_level_a[0].Name.slice(0, Math.max(prev_last.length, index))
									label_b = last.Name.slice(0, index)
								}
								label = label_a + " - " + label_b;
								prev_last = label_b;
							} else if (prev_last.length > 1) {
								label = cur_level_a[0].Name.slice(0,prev_last.length) + " - " + last.Name[0];
								prev_last = last.Name[0];
							} else {
								label = cur_level_a[0].Name[0] + " - " + last.Name[0];
								prev_last = last.Name[0];
							}
						}
						tr.push(
						{
							label: label,
							column_a: [...cur_level_a],
							column_b: [...cur_level_b]
						});
						cur_column = 'a'
					}
				}
				current_level = []
				cur_level = val.Level
				cur_level_lines = 0;
			}
			cur_level_lines += height
			current_level.push(val)
		});
		if (cur_column == 'b') {
			current_level = cur_level_a.concat(current_level);
			cur_level_lines = current_level.reduce((a, val) => {return a + guessTechniqueLineHeight(val)}, 0)
		}
		let split_point = 0;
		let split_closeness = 10000;
		let counter = 0;
		current_level.forEach((val, index) => {
			counter += Math.ceil(val.Effect.length / 50) + 5 + Math.ceil(val['Delivery Verbal'].length/40) + Math.ceil(val.Incantation.length/40)
			if (Math.abs(counter - (cur_level_lines/2)) < split_closeness) {
				split_point = index + 1;
				split_closeness = Math.abs(counter - cur_level_lines/2);
			}
		})
		if (split_point == current_level.length) {
			split_point -= 1;
		}
		if (split_point == 0) {
			split_point = 1;
		}

		let current_level_a = current_level.slice(0, split_point)
		let current_level_b = current_level.slice(split_point)
		let label = "Level " + cur_level
		if (filterConfig.sort_type == "name") {
			let last = current_level_b.at(-1)
			if (last == undefined) {
				label = ""
			} else if (current_level_a[0].Name.at(0) == last.Name[0]) {
				let label_a = current_level_a[0].Name.slice(0, prev_last.length)
				let label_b = last.Name.slice(0, 2)
				let index = 2
				while (label_a.slice(0, index) == label_b.slice(0, index) && last.Name.length > index) {
					index++;
					label_a = current_level_a[0].Name.slice(0, Math.max(prev_last.length, index))
					label_b = last.Name.slice(0, index)
				}
				label = label_a + " - " + label_b;
				prev_last = label_b;
			} else if (prev_last.length > 1) {
				label = current_level_a[0].Name.slice(0,prev_last.length) + " - " + last.Name[0];
				prev_last = last.Name[0];
			} else {
				label = current_level_a[0].Name[0] + " - " + last.Name[0];
				prev_last = last.Name[0];
			}
		}
		tr.push(
			{
				label: label,
				column_a: [...current_level_a],
				column_b: [...current_level_b]
			});
		return tr;
	}, [technique_list, filterConfig, printOptions]);

	function print() {
		window.print()
		let filename = props.type + "_book_" + filterConfig.schools_included.join(", ") + "_0-" + filterConfig.max_level + ".pdf"
		return;
	}

	const requestFilter = (key: string) => {
		setfilterConfig((state) => {
			let new_state = {...state}
			if (new_state.schools_included.find((val) => key == val) === undefined) {
				new_state.schools_included.push(key)
			} else {
				new_state.schools_included = new_state.schools_included.filter(item => item != key)
			}
			return new_state;
		});
	};

	const sortBy = (key: string) => {
		setfilterConfig((state) => {
			let new_state = {...state};
			new_state.sort_type = key;
			return new_state;
		}
		)
	}

	const changeMaxLevel = (level: number) => {
		setfilterConfig({
			...filterConfig,
			max_level: level
		});
	};

	function renderTechnique(technique: technique, index: number){
		return <div style={{breakInside: 'avoid'}} key={index}>
			<b style={{fontSize: "larger"}}>{technique["Title"]}</b><br/>
			<b>School: </b>{technique["School"]}<br/>
			<b>Level: </b>{technique["Level"]}<br/>
			<b>Range: </b>{technique["Range"]}<br/>
			<b>Duration: </b>{technique["Duration"]}<br/>
			<b>Effect: </b>{technique["Effect"].replaceAll("&lt;", "<").replaceAll("&gt;", ">")}<br/>
			<b>Delivery Verbal: </b>{technique["Delivery Verbal"].replaceAll("&lt;", "<").replaceAll("&gt;", ">")}<br/>
			<b>Incantation: </b>{technique["Incantation"].replaceAll("&lt;", "<").replaceAll("&gt;", ">")}<br/><br/>
		</div>
	}

	function renderTechniquePage(page: technique_page, index: number) {
		return <div style={{marginTop: "10px", clear: "both", breakBefore: (index == 0 ? "avoid" : "page")}} key={index}>
			{index == 0 || page.label != sortedTechniques[index-1].label ? <h2 style={{width: '100%', textAlign: 'center'}}>{page.label}</h2> : null}
			<div style={{float: 'left', width: '47.5%'}}>
				{page.column_a.map((technique: technique, index) =>
					renderTechnique(technique, index)
				)}
			</div>
			<div style={{float: 'left', width: '47.5%', marginLeft: "5%"}}>
				{page.column_b.map((technique: technique, index) =>
					renderTechnique(technique, index)
				)}
			</div>
			<div className="not-printable" style={{clear: "both", backgroundColor: "#808080", height: "2px"}}></div>
		</div>
	}

	function changeFontSize(val: string) {
		let new_lines_per_page = Math.floor((printOptions.lines_per_page * printOptions.font_size / parseInt(val)))
		setPrintOptions((p_o) => {return {...p_o, font_size: parseInt(val), lines_per_page: new_lines_per_page};});
	}

	return <div>
			{
				props.schools.length > 1 ? 
					<div className="not-printable">
						<div>
							Include schools:
						</div>
						{props.schools.map((school) =>  <button onClick={() => {requestFilter(school)}}
							style={{backgroundColor: schoolSelected(school) ? '#e0e0e0' : '#808080'}} key={school}
							>{school}</button>
						)}
					</div>
				: null
			}
			<div className="not-printable">
				<div>
					Max Level: {filterConfig.max_level}
				</div>
				<input type='range' min='1' max='9' step='0' value={filterConfig.max_level} onChange={event => changeMaxLevel(parseInt(event.target.value))}></input>
			</div>
			<div className="not-printable">
				<div>
					Sort by:
				</div>
				<button onClick={() => {sortBy("level")}}
					style={{backgroundColor: filterConfig.sort_type == "level" ? '#e0e0e0' : '#808080'}} key="level"
					>Sort by Level</button>
				<button onClick={() => {sortBy("name")}}
					style={{backgroundColor: filterConfig.sort_type == "name" ? '#e0e0e0' : '#808080'}} key="name"
					>Sort by Name</button>
			</div>
			<div className="not-printable">In the Print Dialog, click More Settings then unseelct Headers and Footers if it is selected</div>
			<div className="not-printable"><button onClick={print}>Print {props.type} Book</button></div>
			<div className="not-printable"><button onClick={() => setAdvOptionsVisible(() => !advOptionsVisible)}>Click for advanced Options</button></div>
			{advOptionsVisible ? <div>
				Lines per page: <input type="number" value={printOptions.lines_per_page} onChange={(event) => setPrintOptions((p_o) => {return {...p_o, lines_per_page: parseInt(event.target.value)};})}></input><br/>
				Font size: <input type="number" value={printOptions.font_size} onChange={(event) => changeFontSize(event.target.value)}></input><br/>
				<button onClick={() => setPrintOptions(() => {return {lines_per_page: 53, font_size: 10};})}>Reset defaults</button>
			</div>: null}
			<div id='technique-book' style={{lineHeight: 1.3, fontSize: printOptions.font_size + "pt"}}>
				{sortedTechniques.map((technique_list: technique_page, index) =>
					renderTechniquePage(technique_list, index)
				)}
			</div>
		</div>
}