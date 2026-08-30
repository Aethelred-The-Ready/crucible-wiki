import React from 'react';

function getDescription(drawback) {
    switch (drawback) {
        case "Lower Caste": return "Magic and Fighting cannot be Priority A or B";
        case "Expertise Devotion": return "Expertise must be Priority A";
        case "Crafting Devotion": return "Crafting must be Priority A";
        case "Fighting Devotion": return "Fighting must be Priority A";
        case "Magical Devotion": return "Magic must be Priority A";
        case "Pacifist": return "Fighting cannot be above Priority C";
        case "Traditionalist": return "Cannot purchase Heritage Skills belonging to Traits they do not possess";
        case "Academic": return "Magic must be higher Priority than Fighting";
        case "Trickster": return "Magic and Expertise must be consecutive Priorities";
        case "Hunter": return "Expertise must be higher Priority than Crafting";
        case "Limited Magic": return "Magic cannot be above Priority C";
        case "No Heroes": return "Fighting and Expertise cannot be Priority A";
        case "Spellcraft": return "Magic and Crafting must be consecutive Priorities";
        case "Nimble Fingers": return "Crafting and Expertise must be consecutive Priorities";
        case "Feeble Frame": return "Fighting cannot be higher Priority than Expertise";
        case "Limited Dexterity": return "Crafting and Expertise cannot be above Priority C";
        case "Martial Focus": return "Fighting must be higher Priority than Magic";
        case "Artisan": return "Crafting cannot be below Priority B";
        case "Might and Magic": return "Magic and Fighting must be consecutive Priorities";
        case "Leadfoot": return "Expertise must be lower Priority than Fighting";
        case "Battlecraft": return "Crafting and Fighting must be consecutive Priorities";
        case "Violence Aversion": return "Fighting and Expertise must be below Priority B";
        case "Claws Out": return "Expertise or Fighting must be Priority A";
        case "Stalker": return "Expertise and Fighting must be consecutive Priorities";
        case "Slow and Steady": return "Expertise and Fighting cannot be above Priority C";
    } 
    
    return "BAD DRAWBACK"
}

export function HeritageDrawbacks(props) {
    return <>
        <h3 style={{lineHeight: '0.2em'}}>Heritage Drawbacks</h3>
        <small>(Choose one only if all three Heritage Traits are taken)</small><br />
        <br />
        <b>{props.a}</b><br/>
        {getDescription(props.a)}<br/><br/>
        <b>{props.b}</b><br/>
        {getDescription(props.b)}
    </>
}