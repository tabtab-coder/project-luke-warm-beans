import React, { useState } from "react";
import {useHistory} from 'react-router-dom';
import GenericQuestions from '../GenericQuesitons/GenericQuestions'
import UserTypeDeclaration from '../TypeDeclaration/TypeDeclaration'
import SocialInitiativesQuestions from '../SInitiativesQuestions/SInitiativesQuestions'
import InstructorQuesitons from '../InstructorQuestions/InstructorQuestions'
import SignUpButton from "../SignUpButton/SignUpButton";
import './SignUp.css';

function SignUp() {
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [type, setType] = useState(["Student"])
    const [studentChecked, setStudentChecked] = useState(true)
    const [identify, setIdentify] = useState([])
    const [category, setCategory] = useState('')
    const [choice, setChoice] = useState('')

    const handleSelectIdentify = (event) => {
        setIdentify(identify.concat(event.target.name))
    } 

    const handleSelectChoice = (event) =>{
        setChoice(event.target.name)
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }
    
    const handleSelectType = (event) => {
        if(event.target.id === "Student"){
            setStudentChecked(!studentChecked)
        }
        if(type.includes(event.target.id)){
            setType(type.filter(t => t !== event.target.id))
        }else{
            setType(type.concat(event.target.id))
        }
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handlePhoneChange = (event) => {
        setPhone(event.target.value)
    }
    
    const handleCategory = (event) =>{
        if(category === ''){
            setCategory(event.target.id)
        }else{
            setCategory(event.target.id)
        }
    }

    return (
        <div className="SignUpPage">
            <br/><h1>Welcome to U-Impactify!</h1>
            <div className="SignUpSection1">
                <GenericQuestions 
                    email={email} handleEmailChange={handleEmailChange}
                    username={username} handleUsernameChange={handleUsernameChange}
                    password={password} handlePasswordChange={handlePasswordChange}
                    phone={phone} handlePhoneChange={handlePhoneChange}
                />
                <div className="SignUpImg1"></div>
            </div>
            
            <div className="SignUpSection2">
                <UserTypeDeclaration 
                    handleSelectType={handleSelectType}
                    studentChecked={studentChecked}/>
                <InstructorQuesitons
                    handleSelectIdentify={handleSelectIdentify}
                    handleSelectChoice={handleSelectChoice}/>
                <div className="SignUpImg2"></div>
            </div>
            
            <SocialInitiativesQuestions
                handleCategory={handleCategory}/>
            <SignUpButton 
                username={username}
                email={email}
                password={password}
                phone={phone}
                type={type}/>
        </div>
    );
}

export default SignUp;