import React from 'react';
import { render, waitForElement, wait, screen } from '@testing-library/react';

import CoursesPage, {API} from './CoursesPage.js';
import jsonCourses from '../courses.json';
import { StaticRouter } from 'react-router-dom'

const setup = () => {
  // testing with localStorage sucks: https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');

  const utils = render(
    // need to wrap the CoursePage component with a static router to 
    // simulate the Router information for the real app
    // This is needed because we use <Link/> tags inside <CoursesPage /> in <CourseCard />

    // ref: https://reactrouter.com/web/guides/testing
    <StaticRouter>
        <CoursesPage />
    </StaticRouter>
    
  );
    
  return {
    ...utils,
  }
};

test('on startup, api call is made to get published courses', async () => {
  const getFunc = jest.spyOn(API, 'getCourses').mockImplementationOnce(() => {
    return Promise.resolve(jsonCourses);
  })
  
  const { container } = setup();

  await wait (() => expect(getFunc).toHaveBeenCalledTimes(1));

  // check that all the cards in the test data are rendered
  const courseCards = container.querySelectorAll('.course-card');
  expect(courseCards.length).toBe(jsonCourses.length);
});

