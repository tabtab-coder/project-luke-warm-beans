import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CourseList from './CourseList.js';
import jsonCourses from '../courses.json';


const setup = () => {
  const courses = jsonCourses;
  const selected = 2;
  const handleSelection = jest.fn((index) => {});
  const handleCreate = jest.fn(() => {});

  
  const utils = render(
    <CourseList
      courses={courses}
      selected={selected}
      handleSelection={handleSelection}
      handleCreate={handleCreate}
    />
  );

  return {
    selected,
    courses,
    handleSelection,
    handleCreate,
    ...utils,
  }
};

test('the current selected post should have the selected class', () => {
  const { selected, courses, getByText } = setup();
 
  const selectedCourseCard = getByText(courses[selected].name).parentElement;
  expect(selectedCourseCard.classList.contains('selected')).toBe(true);
});


test('selecting the create card should switch to the creation form', () => {
  const { handleCreate, getByText } = setup();
 
  fireEvent.click(getByText("Create new course").parentElement);
  // clicking the create button should switch to the creation form
  expect(handleCreate).toHaveBeenCalled();
});