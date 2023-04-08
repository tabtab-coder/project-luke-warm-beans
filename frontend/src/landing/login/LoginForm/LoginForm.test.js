import React from 'react';
import { Router } from 'react-router-dom';
import {createMemoryHistory} from 'history';
import { render, fireEvent, wait } from '@testing-library/react';
import LoginForm, {API} from './LoginForm.js';

const setup = () => {
  // mock login values
  const loginValues = {
    "email" : "email",
    "password" : "password"
  }

  // mocking all the functions that are given as props to the form
  const setLoginValues = jest.fn((loginInfo) => {});
  const setFailedAuthenticate = jest.fn((auth) => {});
  const setLoggedIn = jest.fn((logged) => {});
  
  const history = createMemoryHistory();
  const pushSpy = jest.spyOn(history, 'push');

  const utils = render(
    <Router history={history}>
      <LoginForm
        loginInfo={loginValues}
        initialLoginValues={loginValues}
        setLoginValues={setLoginValues}
        setFailedAuthenticate={setFailedAuthenticate}
        setLoggedIn={setLoggedIn}
      />
    </Router>
  );

  // getLabelText matches off of the aria-label property on input tags
  const email = utils.getAllByLabelText('email-input');
  const password = utils.getAllByLabelText('password-input');
  const form = utils.getAllByLabelText('login-form');
  const submit = utils.getAllByLabelText('submit-button');

  return {
    loginValues,
    email,
    password,
    form,
    submit,
    setLoginValues,
    setFailedAuthenticate,
    setLoggedIn,
    pushSpy,
    ...utils,
  }
}

test('submitting login should call a POST request', async () => {
    const { submit, setFailedAuthenticate, setLoggedIn, pushSpy } = setup();
    const setItemSpy = jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem');
    const postFunc = jest.spyOn(API, 'postLogin').mockImplementationOnce(() => {
        return Promise.resolve({
               "access_token" : "1234",
               "logged_in_as" : "user",
               "refresh_token": "0987"
        });
    });

    fireEvent.click(submit[0]);

    await wait (() => expect(postFunc).toHaveBeenCalledTimes(1));

    // setLoggedin should be true and setFailedAuthenticate should be false
    // localStorage should have been updated
    // We expect a redirect as well so history.push should be called

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setLoggedIn.mock.calls[0][0]).toBe(true);
    expect(setFailedAuthenticate.mock.calls[0][0]).toBe(false);
    expect(pushSpy).toHaveBeenCalledWith('/about');

});


test('changing input values should update the state', () => {
  const { email, setLoginValues } = setup();
  fireEvent.change(email[0], { target: { value: 'email@aemail.com' }});


  expect(setLoginValues).toHaveBeenCalled();
});