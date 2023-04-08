import React from 'react';

const InstructorQuesitons =  (props) => {
    return(
        <div>
            <h2>-- Additional questions for Instructors --</h2>
            <form>
                <h3>Check all that apply. Do you identify as:</h3>
                <label className="SignUpInputLabel" htmlFor="coach">Coach</label>
                <input className="checkboxLeft" type="checkbox" name="coach" id="coach" onChange={props.handleSelectIdentify}/><br/>
                
                <label className="SignUpInputLabel" htmlFor="teacher">Teacher</label>
                <input className="checkboxLeft" type="checkbox" name="teacher" id="teacher" onChange={props.handleSelectIdentify}/><br/>
                
                <label className="SignUpInputLabel" htmlFor="facilitator">Facilitator</label>
                <input className="checkboxLeft" type="checkbox" name="facilitator" id="facilitator" onChange={props.handleSelectIdentify}/><br/>

                <label className="SignUpInputLabel" htmlFor="other">Other: Please List:</label>
                <input className="otherInfoInput" type="text" name="other" id="otherInstructor" onChange={props.handleSelectIdentify}/><br/>
            </form>
            <form>
                <h3>What do you need U-Impactify for?</h3>
                <label className="SignUpInputLabel" htmlFor="choice1">Conduct Lessons Live</label>
                <input className="checkboxLeft" type="checkbox" name="choice1" id="choice1" onChange={props.handleSelectChoice}/><br/>
                
                <label className="SignUpInputLabel" htmlFor="choice2">Handle Administrative Tasks</label>
                <input className="checkboxLeft" type="checkbox" name="choice2" id="choice2" onChange={props.handleSelectChoice}/><br/>
                
                <label className="SignUpInputLabel" htmlFor="choice3">Plan my lessons and sessions</label>
                <input className="checkboxLeft" type="checkbox" name="choice3" id="choice3" onChange={props.handleSelectChoice}/><br/>
            </form>
        </div>
    )
}

export default InstructorQuesitons;