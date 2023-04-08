import React from 'react';

const UserTypeDeclaration = (props) => {
    return(
        <form>
            <h2 className="SignUpSubText">Are you joining as a Student or Instructor?</h2>
            {/* <h3>*On default every user is registered as a student, if you dont wish to be one, please unselect the field!</h3> */}
            <label className="SignUpInputLabel" htmlFor="Student">Student</label>
            <input className="checkboxLeft" type="checkbox" name="userType" id="Student" onChange={props.handleSelectType} checked={props.studentChecked}/>
            <br/>
            <label className="SignUpInputLabel" htmlFor="Instructor">Instructor</label>
            <input className="checkboxLeft" type="checkbox" name="userType" id="Instructor" onChange={props.handleSelectType}/>
            <br/>
            <label className="SignUpInputLabel" htmlFor="Social Initiative">Social Initiative</label>
            <input className="checkboxLeft" type="checkbox" name="userType" id="Social Initiative" onChange={props.handleSelectType} />
            <br/>
        </form>
    )
}

export default UserTypeDeclaration;