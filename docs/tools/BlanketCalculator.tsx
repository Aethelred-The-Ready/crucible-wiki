import {useState} from 'react';

type Props = {

};

export default ({}: Props) => {
    const [xp, setXP] = useState("")
    const [blankets, setBlankets] = useState("")
    const [finalSP, setFinalSP] = useState("")
    const [finalXP, setFinalXP] = useState("")

    function xp_per_sp(sp) {
        var level = Math.floor((sp - 50) / 10);
        return (level + 4) * (level + 9)/2;
    }

    function calculateSP() {
        if (xp == "" || blankets == "") {
            return;
        }
        var blanket_count = parseInt(blankets, 10)
        var currentSP = 60;
        var Xpeater = parseInt(xp, 10);
        var totalXP = Xpeater

        while (Xpeater >= xp_per_sp(currentSP)) {
            Xpeater -= xp_per_sp(currentSP);
            currentSP++;
        }
        var addingSP = currentSP
        for(var i = 0; i < blanket_count; i++) {
            Xpeater += addingSP
            totalXP += addingSP
            addingSP = currentSP
            while (Xpeater >= xp_per_sp(currentSP)) {
                Xpeater -= xp_per_sp(currentSP);
                currentSP++;
            }
        }

        setFinalSP(currentSP + "")
        setFinalXP(totalXP + "")
    }

    function calculateBlankets() {
        if (xp == "" || finalSP == "") {
            return;
        }
        var currentSP = 60;
        var Xpeater = parseInt(xp, 10);
        var final_sp = parseInt(finalSP, 10)
        var totalXP = Xpeater

        while (Xpeater >= xp_per_sp(currentSP)) {
            Xpeater -= xp_per_sp(currentSP);
            currentSP++;
        }
        var blanketCount = 0;
        for(blanketCount = 0; currentSP < final_sp; blanketCount++) {
            Xpeater += currentSP
            totalXP += currentSP
            while (Xpeater >= xp_per_sp(currentSP)) {
                Xpeater -= xp_per_sp(currentSP);
                currentSP++;
            }
        }
        

        setBlankets(blanketCount + "")
        setFinalXP(totalXP + "")
    }

    function handleNumberInput(setter, value) {
        if (value.target.value == "") {
            setter("")
        } else if (!Number.isNaN(parseInt(value.target.value))) {
            setter(value.target.value)
        }
    }

    return (
        <div>
            <p>Enter your current XP, then either other number, and press the button beside the value you want to calculate</p>
            <table>
                <tr>
                    <td>Current XP</td>
                    <td><input  value={xp} onChange={(val) => handleNumberInput(setXP, val)}/></td>
                </tr>
                <tr>
                    <td>Blankets To Add</td>
                    <td><input value={blankets} onChange={(val) => handleNumberInput(setBlankets, val)}/></td>
                    <td><button onClick={calculateBlankets}>Calculate Blankets</button></td>
                </tr>
                <tr>
                    <td>Final SP</td>
                    <td><input value={finalSP} onChange={(val) => handleNumberInput(setFinalSP, val)}/></td>
                    <td><button onClick={calculateSP}>Calculate SP</button></td>
                </tr>
                <tr>
                    <td>Final XP</td>
                    <td><input value={finalXP}/></td>
                    <td>
                        <button onClick={() => {setXP(finalXP)}}>Use Final XP</button>
                    </td>
                </tr>
            </table>
        </div>
    )
}