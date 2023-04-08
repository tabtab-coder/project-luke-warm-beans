import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import { Router } from 'react-router-dom';
import {createMemoryHistory} from 'history';
import DeleteAccountButton, {API} from './DeleteAccountButton';

const setup = () => {
  // testing with localStorage sucks: https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');

  // mocking all the objects that are given as props to the button
  const accessToken = 'fake-token';
  const setAccessToken = jest.fn((values) => {});
  const setLoggedIn = jest.fn((values) => {});

  const history = createMemoryHistory();
  const pushSpy = jest.spyOn(history, 'push');


  const utils = render(
    <Router history={history}>
      <DeleteAccountButton
        accessToken={accessToken}
        setAccessToken={setAccessToken}
        setLoggedIn={setLoggedIn}
      />
    </Router>

  );
  
  return {
    setAccessToken,
    ...utils
  }
}

test('renders delete button', () => {
  const { getByText } = setup();
  const button = getByText("Delete Account");
  expect(button).toBeInTheDocument();
});

test('clicking button opens popup, clicking no closes popup', () => {
  const { getByText } = setup();
  // clicking delete opens popup
  const deleteButton = getByText("Delete Account");
  fireEvent.click(deleteButton);
  const header = getByText("Are you sure you want to delete your account?")
  expect(header).toBeInTheDocument();
  // clicking no closes popup
  const noButton = getByText("No");
  fireEvent.click(noButton);
  expect(header).not.toBeInTheDocument();
});

test('clicking yes on popup makes delete user API call', async () => {
  const deleteFunc = jest.spyOn(API, 'deleteUser').mockImplementationOnce(() => {
    return Promise.resolve();
  })

  const { getByText, setAccessToken } = setup();
  const deleteButton = getByText("Delete Account");
  fireEvent.click(deleteButton);
  const yesButton = getByText("Yes");
  fireEvent.click(yesButton);

  await wait (() => expect(deleteFunc).toHaveBeenCalled());
});
