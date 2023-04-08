import React from 'react';
import { render, waitForElement, wait, screen } from '@testing-library/react';

import Analytics, {API} from './Analytics.js';
import jsonCourses from '../courses.json';

const setup = () => {
  // testing with localStorage sucks: https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');

  const utils = render(
    <Analytics course={jsonCourses[0]}/>
  );
    
  return {
    ...utils,
  }
};

test('on startup, api calls are made', async () => {
  const getEnrolled = jest.spyOn(API, 'getEnrolled').mockImplementationOnce(() => {
    return Promise.resolve({'students': 5});
  })
  
  const getViews = jest.spyOn(API, 'getViews').mockImplementationOnce(() => {
    return Promise.resolve({'views': 420});
  })
  const getQuizzes = jest.spyOn(API, 'getQuizzes').mockImplementationOnce(() => {
    return Promise.resolve({'quizzes': 7});
  })
  const getAverages = jest.spyOn(API, 'getAverages').mockImplementationOnce(() => {
    return Promise.resolve({'quizzes': 7});
  })

  const { container } = setup();

  await waitForElement(() => container.querySelector('#analyticContent'));
  
  expect(getEnrolled).toHaveBeenCalled();
  expect(getViews).toHaveBeenCalled();
  expect(getQuizzes).toHaveBeenCalled();
});
