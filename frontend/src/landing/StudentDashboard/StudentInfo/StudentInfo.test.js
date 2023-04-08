import React from 'react';
import { render, wait } from '@testing-library/react';
import StudentInfo, {API} from './StudentInfo.js.js';

const setup = () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');

    const utils = render(
        <StudentInfo />
    )

    return {
        ...utils,
    }
};

test('on startup, api call is made to get student info', async () => {
    // mock user
    const mockUser = {
        "name": "ymart1n",
        "email": "1231293@ww.com",
        "phone": "1234567980"
    };

    const getFunc = jest.spyOn(API, 'getUser').mockImplementationOnce(() => {
        return Promise.resolve(mockUser);
    })
    
    const { getByText } = setup();

    await wait (() => expect(getFunc).toHaveBeenCalled());

    const welcome = getByText(mockUser.name);
    expect(welcome).toBeInTheDocument();
    const email = getByText(mockUser.email);
    expect(email).toBeInTheDocument();
    const phone = getByText(mockUser.phone);
    expect(phone).toBeInTheDocument();

});
