import React from 'react';
import { fireEvent, getByLabelText, render } from '@testing-library/react';
import GenericQuestions, {API} from './GenericQuestions'

const setup = () => {
    const email = "batu@gmail.com"
    const username = "batu"
    const password = "123456"
    const phone = "123456789012345"
    const handleEmailChange = jest.fn((values) => {});
    const handleUsernameChange = jest.fn((values) => {});
    const handlePasswordChange = jest.fn((values) => {});
    const handlePhoneChange = jest.fn((values) => {});

  const utils = render(
    <GenericQuestions
        email={email} handleEmailChange={handleEmailChange}
        username={username} handleUsernameChange={handleUsernameChange}
        password={password} handlePasswordChange={handlePasswordChange}
        phone={phone} handlePhoneChange={handlePhoneChange}
    />
  );

  return {
    handleEmailChange,
    handleUsernameChange,
    handlePasswordChange,
    handlePhoneChange,
    ...utils
  }
}

test('renders the generic quesitons', () => {
    const { getByText } = setup();
    // const button = getByText("Delete Account");
    // expect(button).toBeInTheDocument();
    const question1 = getByText("Email:");
    const question2 = getByText("Name:");
    const question3 = getByText("Password:");
    const question4 = getByText("Phone:");
    expect(question1).toBeInTheDocument();
    expect(question2).toBeInTheDocument();
    expect(question3).toBeInTheDocument();
    expect(question4).toBeInTheDocument();

  });

  test('testing name change', () =>{
    const { getByLabelText } = setup();
    const input = getByLabelText(/Name/)
    expect(input.value).toBe('batu')
  });

  test('testing email change', () =>{
    const { getByLabelText } = setup();
    const input = getByLabelText(/Email/)
    expect(input.value).toBe('batu@gmail.com')
  });

  test('testing password change', () =>{
    const {getByLabelText } = setup();
    const input = getByLabelText(/Password/)
    expect(input.value).toBe('123456')
  });

  test('testing phone change', () =>{
    const {getByLabelText } = setup();
    const input = getByLabelText(/Phone/)
    expect(input.value).toBe('123456789012345')
  });

  