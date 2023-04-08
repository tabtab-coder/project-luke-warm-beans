import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CourseInfo from './CourseInfo.js';
import jsonCourses from '../courses.json';


const setup = () => {
  const setFormValues = jest.fn((values) => {});
  const setShowForm = jest.fn((values) => {});
  const course = jsonCourses[0]; 
  
  const utils = render(
    <CourseInfo
      setFormValues={setFormValues}
      setShowForm={setShowForm}
      course={course}
    />
  );

  return {
    course,
    setFormValues,
    setShowForm,
    ...utils,
  }
};

test('clicking edit should move to form and set form values', () => {
  const { course, setFormValues, setShowForm, getByLabelText } = setup();
 
  const editButton = getByLabelText("edit-button");

  fireEvent.click(editButton);

  // clicking edit populates the form with current course information
  expect(setFormValues.mock.calls[0][0]).toBe(course);
  // clicking edit redirects to the form
  expect(setShowForm.mock.calls[0][0]).toBe(true);
});
