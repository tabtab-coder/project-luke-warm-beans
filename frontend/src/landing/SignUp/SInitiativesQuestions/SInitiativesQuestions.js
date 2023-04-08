import React from 'react';

const SocialInitiativesQuestions = (props) => {
    return(
        <div>
        <h2>-- Additional questions for Social Initiatives --</h2>
        <form>
            <h3>Check all that apply. Do you identify as:</h3>
            <label className="SignUpInputLabel">Social entrepreneurs or intrapreneurs</label>
            <input className="checkboxLeft" type="checkbox" name="entreperneur" id="entreperneur"/><br/>
            
            <label className="SignUpInputLabel">Worker at a charity or a non-profit organization</label>
            <input className="checkboxLeft" type="checkbox" name="charity" id="charity" /><br/>
            
            <label className="SignUpInputLabel">Individual who wants to learn something new</label>
            <input className="checkboxLeft" type="checkbox" name="learner" id="learner" /><br/>

            <label className="SignUpInputLabel">Other: Please List:</label>
            <input className="otherInfoInput" type="text" name="otherInitiativesCategory1" id="otherInitiativesCategory1" /><br/>
        </form>
        <form>
            <h3>What category does your company fits in?</h3>
            <label className="SignUpInputLabel">Arts and Culture</label>
            <input className="checkboxLeft" type="checkbox" name="ArtsCulture" id="ArtsCulture" onChange={props.handleCategory}/><br/>
                
            <label className="SignUpInputLabel" htmlFor="teacher">Civic and Environmental</label>
            <input className="checkboxLeft" type="checkbox" name="Civic" id="Civic" onChange={props.handleCategory}/><br/>
                
            <label className="SignUpInputLabel" htmlFor="facilitator">Education</label>
            <input className="checkboxLeft" type="checkbox" name="Educaiton" id="Educaiton" onChange={props.handleCategory}/><br/>

            <label className="SignUpInputLabel" htmlFor="facilitator">Health Services</label>
            <input className="checkboxLeft" type="checkbox" name="Health" id="Health" onChange={props.handleCategory}/><br/>

            <label className="SignUpInputLabel" htmlFor="facilitator">International Relations and Development</label>
            <input className="checkboxLeft" type="checkbox" name="InternationalRelations" id="InternationalRelations" onChange={props.handleCategory}/><br/>

            <label className="SignUpInputLabel" htmlFor="facilitator">Social and Legal Services</label>
            <input className="checkboxLeft" type="checkbox" name="SocialLegalServices" id="SocialLegalServices" onChange={props.handleCategory}/><br/>

            <label className="SignUpInputLabel" htmlFor="other">Other: Please List:</label>
            <input className="otherInfoInput" type="text" name="otherInitiativesCategory2" id="otherInitiativesCategory2" onChange={props.handleCategory}/><br/>
        </form>
        <form>
            <h3>What do you want to learn more about? (select all that apply)</h3>
            <label className="SignUpInputLabel" htmlFor="coach">Accounting</label>
            <input className="checkboxLeft" type="checkbox" name="Accounting" id="Accounting"/><br/>
                
            <label className="SignUpInputLabel" htmlFor="teacher">Business</label>
            <input className="checkboxLeft" type="checkbox" name="Business" id="Business"/><br/>
                
            <label className="SignUpInputLabel" htmlFor="facilitator">Communication</label>
            <input className="checkboxLeft" type="checkbox" name="Communication" id="Communication"/><br/>

            <label className="SignUpInputLabel" htmlFor="facilitator">Design</label>
            <input className="checkboxLeft" type="checkbox" name="Design" id="Design"/><br/>

            <label className="SignUpInputLabel" htmlFor="facilitator">Finance</label>
            <input className="checkboxLeft" type="checkbox" name="Finance" id="Finance"/><br/>

            <label className="SignUpInputLabel" htmlFor="facilitator">Project Managament</label>
            <input className="checkboxLeft" type="checkbox" name="Project Managament" id="Project Managament"/><br/>

            <label className="SignUpInputLabel" htmlFor="other">Other: Please List:</label>
            <input className="otherInfoInput" type="text" name="otherInitiativesCategory3" id="otherInitiativesCategory3"/><br/>
        </form>
    </div>
    )
}

export default SocialInitiativesQuestions;