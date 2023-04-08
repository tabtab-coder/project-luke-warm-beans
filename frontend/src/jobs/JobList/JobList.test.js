import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import JobList from './JobList.js';
import jsonJobs from '../jobs.json';


const setup = () => {
  const jobs = jsonJobs;
  const selected = 2;
  const handleSelection = jest.fn((index) => {});
  const handleCreate = jest.fn(() => {});

  
  const utils = render(
    <JobList
      jobs={jobs}
      selected={selected}
      handleSelection={handleSelection}
      handleCreate={handleCreate}
    />
  );

  return {
    selected,
    jobs,
    handleSelection,
    handleCreate,
    ...utils,
  }
};

test('the current selected post should have the selected class', () => {
  const { selected, jobs, getByText } = setup();
 
  const selectedJobCard = getByText(jobs[selected].description).parentElement;
  expect(selectedJobCard.classList.contains('selected')).toBe(true);
});


test('selecting the create card should switch to the creation form', () => {
  const { handleCreate, getByText } = setup();
 
  fireEvent.click(getByText("Create new job posting").parentElement);
  // clicking the create button should switch to the creation form
  expect(handleCreate).toHaveBeenCalled();
});