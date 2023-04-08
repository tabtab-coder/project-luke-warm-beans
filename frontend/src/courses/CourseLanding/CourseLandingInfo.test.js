import React from 'react';
import jsonCourses from '../courses.json';
import { render, waitForElement } from '@testing-library/react';
import CourseLandingInfo, {API} from './CourseLandingInfo.js';

const setup = () =>{

    let id = '0'
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');
   
    const utils = render(
        <CourseLandingInfo id={id}/>
    );

    return {
        ...utils,
        id
    }
}

test('when course landing page opens API call needs to be made', async () => {
    const getFunc = jest.spyOn(API, 'getCourse').mockImplementationOnce(() => {
      return Promise.resolve(jsonCourses[0]);
    })

    const { container, pushSpy } = setup();
    await waitForElement(() => container.querySelectorAll('.courseLanding'))
    const courseLandingInfo = container.querySelectorAll('.courseLanding');
    expect(courseLandingInfo.length).toBe(3);
    expect(getFunc).toHaveBeenCalled();
});
