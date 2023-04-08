import React from 'react';
import { render, waitForElement, wait, screen } from '@testing-library/react';

import JobCreation, {API} from './JobCreation.js';
import jsonJobs from '../jobs.json';


const setup = () => {
  // testing with localStorage sucks: https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');

  const utils = render(
    <JobCreation />
  );
    
  return {
    ...utils,
  }
};

test('on startup, api call is made to get jobs', async () => {
  const getFunc = jest.spyOn(API, 'getJobs').mockImplementationOnce(() => {
    return Promise.resolve(jsonJobs);
  })
  
  const { container } = setup();
  // for now jobs use the course styling page -> so we query for course related styles
  await waitForElement(() => container.querySelectorAll('.course-list-card'))

  const jobCards = container.querySelectorAll('.course-list-card');
  
  expect(jobCards.length).toBe(jsonJobs.length);
  expect(getFunc).toHaveBeenCalled();
});

