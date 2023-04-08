import React from "react";
import './Login.css';

import LoginForm from '../LoginForm/LoginForm.js';

function Login(props) {

    const setLoggedIn = props.setLoggedIn;

    const initialLoginValues = {
        email: '',
        password: ''
    };

    const [loginValues, setLoginValues] = React.useState(initialLoginValues);
    const [failedAuthenticate, setFailedAuthenticate] = React.useState(false);

    let content;
    if (failedAuthenticate === true) {
        content = <p className="AuthenticationFailed">Incorrect Email/Password</p>
    }
    return (
        <div className="LoginPage">
            <div className="LeftSideImage">
                <p className="SloganTitle">A system you can rely on.</p>

            </div>
            <div className="LoginBox">
                <p className="WelcomeBack">Welcome Back</p>
                {content}
                <LoginForm
                  loginInfo={loginValues}
                  initialLoginValues={initialLoginValues}
                  setLoginValues={setLoginValues}
                  setFailedAuthenticate={setFailedAuthenticate}
                  setLoggedIn={setLoggedIn}
                />

            </div>
       </div>
    );
}

export default Login;