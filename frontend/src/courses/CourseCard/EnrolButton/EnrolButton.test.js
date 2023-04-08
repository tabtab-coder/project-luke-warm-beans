import React from "react";

import { render, fireEvent, wait } from '@testing-library/react';
import EnrolButton, {API} from './EnrolButton.js';

const setup = () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');

    // mock course id
    const courseID = {
        "courseId": "5f9f89d2c6370973b4f32222"
    };

    const utils = render(
        <EnrolButton 
            course_id={courseID}
        />
    );
    
    return {
        ...utils
    }
}

test('renders enrol button', () => {
    const { getByText } = setup();
    const button = getByText("Enrol");
    expect(button).toBeInTheDocument();
});

test('clicking enrol button makes enroll course API call', async () => {
    const postFunc = jest.spyOn(API, 'enrolCourse').mockImplementationOnce(() => {
        return Promise.resolve({"courseId": '5f9f89d2c6370973b4f32222'});
    })

    const { getByText } = setup();
    const enrolButton = getByText("Enrol");
    fireEvent.click(enrolButton);

    await wait (() => expect(postFunc).toHaveBeenCalled());

})