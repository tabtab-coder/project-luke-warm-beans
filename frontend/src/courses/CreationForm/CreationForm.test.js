import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import CreationForm, {API} from './CreationForm.js';


const setup = (isNewCourse) => {
  // testing with localStorage sucks: https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');


  // mock course
  const newCourse = {
    "name": "new course",
    "objective": "create a course",
    "learningOutcomes": "git gud",
    "instructor": "Mr Beast",
    "published": false,
  };

  const accessToken = '1234';

  // mocking all the functions that are given as props to the form
  const setValues = jest.fn((values) => {});
  const setShowForm = jest.fn((show) => {});
  const addCourse = jest.fn((values) => {});
  const updateCourse = jest.fn((values) => {});

  const utils = render(
    <CreationForm
      values={newCourse}
      isNewCourse={isNewCourse}
      accessToken={accessToken}
      setValues={setValues}
      setShowForm={setShowForm}
      addCourse={addCourse}
      updateCourse={updateCourse}
    />
  );

  // getLabelText matches off of the aria-label property on input tags
  const publish = utils.getByLabelText('publish-input');
  const objective = utils.getByLabelText('obj-input');
  const learningOutcomes = utils.getByLabelText('lrn-input');
  const name = utils.getByLabelText('name-input');
  const form = utils.getByLabelText('creation-form');
  const submit = utils.getByLabelText('submit-button');
  
  return {
    publish,
    objective,
    learningOutcomes,
    name,
    form,
    submit,
    setValues,
    setShowForm,
    ...utils,
  }
}

test('creation form populates correctly', () => {
  const { publish, objective, learningOutcomes, name } = setup(true);

  expect(publish.checked).toBe(false);
  expect(objective.value).toBe("create a course");
  expect(learningOutcomes.value).toBe("git gud");
  expect(name.value).toBe("new course");
});

test('submitting a new course should call a post request', async () => {
  const { submit, setShowForm } = setup(true);
  const postFunc = jest.spyOn(API, 'postCourse').mockImplementationOnce(() => {
    return Promise.resolve({'id': 'L33THACKERZ'});
  })

  // the alert function gets mocked out here because the unit test crashes
  // without it (theres no implementation for window in unit test land)
  const alertFunc = jest.spyOn(window, 'alert').mockImplementationOnce(() => {
    return;
  })

  fireEvent.click(submit);

  await wait (() => expect(postFunc).toHaveBeenCalledTimes(1));

  // show form should have been set to false
  // expect(setShowForm.mock.calls[0][0]).toBe(false);
  // post function should be called
  // checking what params the function was called with: https://jestjs.io/docs/en/mock-functions
  // show form should have been set to false
  expect(setShowForm.mock.calls[0][0]).toBe(false);


});

test('submitting a pre-existing course should call a put request', async () => {
  const { submit, setShowForm } = setup(false);
  const putFunc = jest.spyOn(API, 'putCourse').mockImplementationOnce(() => {
    return Promise.resolve({'something': 'return'});
  })

  const alertFunc = jest.spyOn(window, 'alert').mockImplementationOnce(() => {
    return;
  })

  fireEvent.click(submit);

  await wait (() => expect(putFunc).toHaveBeenCalledTimes(1));
  // show form should have been set to false
  expect(setShowForm.mock.calls[0][0]).toBe(false);
});

test('changing input values should update the state', () => {
  const { objective, setValues } = setup(true);

  fireEvent.change(objective, { target: { value: 'new objective' }});

  expect(setValues).toHaveBeenCalled();
});
