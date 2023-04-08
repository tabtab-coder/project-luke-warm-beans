import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import QuizForm, {API} from './QuizForm.js';
import jsonQuizzes from '../quizzes.json';

const setup = (isNewQuiz) => {
  // testing with localStorage sucks: https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');

  // the alert function gets mocked out here because the unit test crashes
  // without it (theres no implementation for window in unit test land)
  const alertFunc = jest.spyOn(window, 'alert').mockImplementation(() => {
    return;
  });


  const setValues = jest.fn((values) => {});
  const setShowForm = jest.fn((show) => {});
  const addQuiz = jest.fn((values) => {});
  const updateQuiz = jest.fn((values) => {});

  const newQuiz = {
    "id": 27,
    "name": "new quiz",
    "quizQuestions": [],
    "published": true,
    "course": 'fake_course_id'
  }


  const initialValues = {
    name: '',
    quizQuestions: [],
    published: false,
    course: 'fake_course_id_2'
  };


  const utils = render(
    <QuizForm
      values={newQuiz}
      initialValues={initialValues}
      setValues={setValues}
      setShowForm={setShowForm}
      addQuiz={addQuiz}
      updateQuiz={updateQuiz}
      isNewQuiz={isNewQuiz}
    />
  );

  // mocking implementation of the setValues (setState) function
  // allows us to update props and force the component to rerender as it
  // normaling would when a user interacts with this component
  setValues.mockImplementation((values) => {
    // rerender the component with the values passed into the function
    utils.rerender(
      <QuizForm
        values={values}
        initialValues={initialValues}
        setValues={setValues}
        setShowForm={setShowForm}
        addQuiz={addQuiz}
        updateQuiz={updateQuiz}
        isNewQuiz={isNewQuiz}
    />
    )
  });

  const newQuestion = utils.getByLabelText('new-question');
  const submit = utils.getByLabelText('submit-button');

    
  return {
    ...utils,
    newQuestion,
    submit,
    setShowForm,
  }
};

test('new question button creates a new question', async () => {  
  const { container, newQuestion } = setup(true);

  let questions = container.querySelectorAll('.mult-question');
  // new quiz starts with zero questions
  expect(questions.length).toBe(0);

  fireEvent.click(newQuestion);

  questions = container.querySelectorAll('.mult-question');
  // clicking the newQuestion button creates a new question (there is now one rendered to the page)
  expect(questions.length).toBe(1);
});

test('submitting a new quiz should call a post request', async () => {
  const { submit } = setup(true);
  const postFunc = jest.spyOn(API, 'postQuiz').mockImplementationOnce(() => {
    return Promise.resolve({'id': 'L33THACKERZ'});
  })

  fireEvent.click(submit);

  await wait (() => expect(postFunc).toHaveBeenCalledTimes(1));
});

test('submitting a pre-existing course should call a put request', async () => {
  const { submit } = setup(false);
  const putFunc = jest.spyOn(API, 'putQuiz').mockImplementationOnce(() => {
    return Promise.resolve({'something': 'return'});
  })

  fireEvent.click(submit);

  await wait (() => expect(putFunc).toHaveBeenCalledTimes(1));
});
