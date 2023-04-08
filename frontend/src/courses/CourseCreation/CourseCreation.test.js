import React from 'react';
import { render, waitForElement, wait, screen } from '@testing-library/react';

import CourseCreation, {API} from './CourseCreation.js';
import jsonCourses from '../courses.json';


const setup = () => {
  // testing with localStorage sucks: https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');

  const utils = render(
    <CourseCreation />
  );
    
  return {
    ...utils,
  }
};

test('on startup, api call is made to get courses', async () => {
  const getFunc = jest.spyOn(API, 'getCourses').mockImplementationOnce(() => {
    return Promise.resolve(jsonCourses);
  })
  
  const { container } = setup();

  await waitForElement(() => container.querySelectorAll('.course-list-card'))

  const courseCards = container.querySelectorAll('.course-list-card');
  
  expect(courseCards.length).toBe(jsonCourses.length);
  expect(getFunc).toHaveBeenCalled();
});

test('course creation starts by showing course info when there are pre-existing courses', async () => {
  const getFunc = jest.spyOn(API, 'getCourses').mockImplementationOnce(() => {
    return Promise.resolve(jsonCourses);
  })

  const { container } = setup();

  await waitForElement(() => container.querySelectorAll('.course-list-card'));

  const info = container.querySelector(".info-card");
  const form = container.querySelector(".creation-form");
  
  expect(info).not.toBeNull();
  expect(form).toBeNull();
});

test('course creation starts by showing the creation form when there are no courses', async () => {
  const getFunc = jest.spyOn(API, 'getCourses').mockImplementationOnce(() => {
    // return an empty array of courses
    return Promise.resolve([]);
  })

  const { container } = setup();

  await waitForElement(() => container.querySelectorAll('.course-list-card'));

  const info = container.querySelector(".info-card");
  const form = container.querySelector(".creation-form");

  expect(info).toBeNull();
  expect(form).not.toBeNull();
});