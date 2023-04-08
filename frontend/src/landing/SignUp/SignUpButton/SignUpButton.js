import React from 'react';
import {useHistory} from 'react-router-dom';
import '../SignUp/SignUp.css';

function SignUpButton(props) {
    const history = useHistory()
    const handleSignUp = () => {
        if(props.email && props.username && props.password){
            const newUser = {
                name: props.username,
                email: props.email,
                password: props.password,
                roles: {
                    admin: props.type.includes("admin"),
                    instructor: props.type.includes("Instructor"),
                    organization: props.type.includes("Social Initiative"),
                    student: props.type.includes("Student")
                },
                phone: props.phone
            }
            // wait for API call then route somewhere and do something with access token
            API.postSignUp(newUser)
            .then(
                (response) => {
                    history.push('/login')
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    alert(JSON.stringify(error, null, 2));
                }
            )
        }else{
             alert("one or more of the required fields arent filled!")
        }
    }

    return(
        <button id="signInButton" aria-label="submit-button" type="submit" 
            onClick={handleSignUp}>CONFIRM</button>
    )
}

export const API = {

    postSignUp(data) {
        const url = 'http://localhost:5000/authentication/signup/';
        return fetch(url, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',// 'Content-Type': 'application/x-www-form-urlencoded',
                },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data)
        })
        .then(res => {
            // check to see if the server responded with a 200 request (ok)
            // if not, then reject the promise so that proper error handling can take place
            return res.json().then(json => {
                return res.ok ? json : Promise.reject(json);
            });
        });
    }

}

export default SignUpButton;