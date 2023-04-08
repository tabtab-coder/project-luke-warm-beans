import React from 'react';
import '../SignUp/SignUp.css';


const GenericQuestions = (props) => {
    return(
        <form className="SignUpGQ">
            <h2 className="SignUpSubText">Create an Account</h2>
            <label className="SignUpInputLabel" htmlFor="Email">Email:</label><br/>
            <input id="Email" className="SignUpInfoInput" type="text" name="email" placeholder="Email" 
            value={props.email} onChange={props.handleEmailChange}/>

            <label className="SignUpInputLabel" htmlFor="Name">Name:</label><br/>
            <input id="Name" className="SignUpInfoInput" type="text" name="Name" placeholder="Name" 
            value={props.username} onChange={props.handleUsernameChange}/>

            <label className="SignUpInputLabel" htmlFor="Password">Password:</label><br/>
            <input id="Password" className="SignUpInfoInput" type="password" name="password" placeholder="Password" 
            value={props.password} onChange={props.handlePasswordChange}/>

            <label className="SignUpInputLabel" htmlFor="Phone">Phone:</label><br/>
            <input id="Phone" className="SignUpInfoInput" type="text" name="phone" placeholder="Phone number" 
            value={props.phone} onChange={props.handlePhoneChange}/>
        </form>
    )
}

export default GenericQuestions ;