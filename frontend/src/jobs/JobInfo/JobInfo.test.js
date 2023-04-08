import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import JobInfo from './JobInfo.js';
import jsonJobs from '../jobs.json';


const setup = () => {
  const setFormValues = jest.fn((values) => {});
  const setShowForm = jest.fn((values) => {});
  const job = jsonJobs[0]; 
  
  const utils = render(
    <JobInfo
      setFormValues={setFormValues}
      setShowForm={setShowForm}
      job={job}
    />
  );

  return {
    job,
    setFormValues,
    setShowForm,
    ...utils,
  }
};

test('clicking edit should move to form and set form values', () => {
  const { job, setFormValues, setShowForm, getByLabelText } = setup();
 
  const editButton = getByLabelText("edit-button");

  fireEvent.click(editButton);

  // clicking edit populates the form with current course information
  expect(setFormValues.mock.calls[0][0]).toBe(job);
  // clicking edit redirects to the form
  expect(setShowForm.mock.calls[0][0]).toBe(true);
});
