import React from "react";
import {useHistory} from "react-router-dom";
import './LoginForm.css';

function LoginForm(props) {

    const loginInfo = props.loginInfo;
    const setLoginValues = props.setLoginValues;
    const setFailedAuthenticate = props.setFailedAuthenticate;
    const setLoggedIn = props.setLoggedIn;
    const history = useHistory();

    const handleLogin = (event) => {
        event.preventDefault();

        // wait for API call then route somewhere and do something with access token
        API.postLogin(loginInfo)
            .then(
                (result) => {
                    setFailedAuthenticate(false);
                    setLoggedIn(true);
                    localStorage.setItem("jwtAuthToken", JSON.stringify(result))
                    history.push('/about')
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setFailedAuthenticate(true);
                }
            )
    }

    const handleEmailChange = (event) => {
        setLoginValues({
            ...loginInfo,
            email: event.target.value
        });
    }

    const handlePasswordChange = (event) => {
        setLoginValues({
            ...loginInfo,
            password: event.target.value
        });
    }

    return (

        <form aria-label="login-form" className="LoginForm" onSubmit={handleLogin}>
           <div className="FormSection">
             <label className="InputLabel" htmlFor="email">Email</label><br/>
             <input aria-label="email-input" className="InfoInput" placeholder="Enter Email Here" type="text"
               value={loginInfo.email} onChange={e => handleEmailChange(e)} />
           </div>

           <div className="FormSection">
             <label className="InputLabel" htmlFor="password">Password</label><br/>
             <input aria-label="password-input" className="InfoInput" placeholder="Enter Password Here" type="password"
               value={loginInfo.password} onChange={e => handlePasswordChange(e)} />
           </div>
           <div className="ForgotPassword">
             <a href="./about">Forgot Password?</a><br/>
           </div>
           
           <button aria-label="submit-button" className="LoginSubmit" type="submit" value="Login">Login</button>
        </form>
    );

}

export const API = {

    postLogin(data) {
        const url = 'http://localhost:5000/authentication/login/';
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

export default LoginForm;
