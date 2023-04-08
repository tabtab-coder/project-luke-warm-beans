import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import CreationForm, {API} from './CreationForm.js';

const setup = (isNewJob) => {
  // testing with localStorage sucks: https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');

  // mock course
  const newJob = {
    "id": 0,
    "paid": false,
    "description": "We want YOU to eat OUR chocolate bars",
    "published": true
  };

  const accessToken = '1234';

  // mocking all the functions that are given as props to the form
  const setValues = jest.fn((values) => {});
  const setShowForm = jest.fn((show) => {});
  const addJob = jest.fn((values) => {});
  const updateJob = jest.fn((values) => {});

  const utils = render(
    <CreationForm
      values={newJob}
      isNewJob={isNewJob}
      accessToken={accessToken}
      setValues={setValues}
      setShowForm={setShowForm}
      addJob={addJob}
      updateJob={updateJob}
    />
  );

  // getLabelText matches off of the aria-label property on input tags
  const publish = utils.getByLabelText('publish-input');
  const paid = utils.getByLabelText('paid-input');
  const description = utils.getByLabelText('description-input');

  const form = utils.getByLabelText('creation-form');
  const submit = utils.getByLabelText('submit-button');
  
  return {
    publish,
    paid,
    description,
    form,
    submit,
    setValues,
    setShowForm,
    ...utils,
  }
}

test('creation form populates correctly', () => {
  const { publish, description, paid } = setup(true);

  expect(publish.checked).toBe(true);
  expect(paid.checked).toBe(false);
  expect(description.value).toBe("We want YOU to eat OUR chocolate bars");
});

test('submitting a new job should call a post request', async () => {
  const { submit, setShowForm } = setup(true);
  const postFunc = jest.spyOn(API, 'postJob').mockImplementationOnce(() => {
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

test('submitting a pre-existing job should call a put request', async () => {
  const { submit, setShowForm } = setup(false);
  const putFunc = jest.spyOn(API, 'putJob').mockImplementationOnce(() => {
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
  const { description, setValues } = setup(true);

  fireEvent.change(description, { target: { value: 'new desc' }});

  expect(setValues).toHaveBeenCalled();
});