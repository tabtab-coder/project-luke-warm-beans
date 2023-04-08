import React from 'react';
import { render, waitForElement, wait, screen } from '@testing-library/react';

import QuizCreation, {API} from './QuizCreation.js';
import jsonQuizzes from '../quizzes.json';
import jsonCourses from '../../courses.json';

const setup = () => {
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');

  const utils = render(
    <QuizCreation
      course={jsonCourses[0]}
    />
  );
    
  return {
    ...utils,
  }
};

test('on startup, api call is made to get quizzes', async () => {
  const getFunc = jest.spyOn(API, 'getQuizzes').mockImplementationOnce(() => {
    return Promise.resolve(jsonQuizzes);
  })
  
  const { container } = setup();

  await waitForElement(() => container.querySelectorAll('.quiz-block'))

  const quizBlocks = container.querySelectorAll('.quiz-block');
  
  expect(quizBlocks.length).toBe(jsonQuizzes.length);
  expect(getFunc).toHaveBeenCalled();
});
