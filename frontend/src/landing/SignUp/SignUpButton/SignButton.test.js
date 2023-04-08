import React from 'react';
import { Router } from 'react-router-dom';
import {createMemoryHistory} from 'history';
import { render, fireEvent, wait } from '@testing-library/react';
import SignUpButton, {API} from './SignUpButton.js';

const setup = () => {
    const history = createMemoryHistory();
    const pushSpy = jest.spyOn(history, 'push');
    const email = "batu@gmail.com"
    const username = "batu"
    const password = "123456"
    const phone = "1231241241343242141"
    const type = ["student"]

    const utils = render(
        <Router history={history}>
            <SignUpButton 
            username={username}
            email={email}
            password={password}
            phone={phone}
            type={type}/>
        </Router>
    );

    const submit = utils.getByLabelText('submit-button');

    return{
        ...utils,
        submit,
        username,
        pushSpy,
        email,
        password,
        phone,
        type
    }
};


test('when submit is clicked, API call is made, at sucess user switches to login page', async () => {
    const getFunc = jest.spyOn(API, 'postSignUp').mockImplementationOnce(() => {
      return Promise.resolve();
    })

    const { submit, pushSpy } = setup();
    const alertFunc = jest.spyOn(window, 'alert').mockImplementationOnce(() => {
        return;
      })
    fireEvent.click(submit);

    await wait (() => expect(getFunc).toHaveBeenCalled());
    expect(pushSpy).toHaveBeenCalledWith('/login');
});
