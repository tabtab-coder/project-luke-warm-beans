import React from 'react';
import { render, screen, fireEvent, wait } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App, {API} from './App';

import {API as CoursePageAPI} from 'courses/CoursesPage/CoursesPage.js';
import {API as CourseLandingAPI} from 'courses/CourseLanding/CourseLanding.js';
import {API as CourseLandingInfoAPI} from 'courses/CourseLanding/CourseLandingInfo.js';
import jsonCourses from 'courses/courses.json';
import mockUser from 'landing/SignUp/SignUp/mockUser.json';

test('renders landing page and navigation', () => {
  const { getAllByText, getByText } = render(<Router><App/></Router>);
  expect(getByText(/LOGIN/)).toBeInTheDocument();
  expect(getByText(/Home/)).toBeInTheDocument();
});

test('visiting a course home page should be tracked', async () => {
  // mock auth token to appear as logged in

  // required to have access to courses links
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');

  // mock the api call to get published courses on the COURSES PAGE
  const getCourses = jest.spyOn(CoursePageAPI, 'getCourses').mockImplementationOnce(() => {
    return Promise.resolve(jsonCourses);
  });

  // mock the api call to get a user
  const getUser = jest.spyOn(API, 'getUser').mockImplementationOnce(() => {
    return Promise.resolve(mockUser[0]);
  });

  // mock the api call to get individual course info on the COURSE LANDING PAGE
  const getCourseInfo = jest.spyOn(CourseLandingInfoAPI, 'getCourse').mockImplementationOnce(() => {
    return Promise.resolve(jsonCourses[0]);
  });

  // mock api call to get feedback
  const getFeedback = jest.spyOn(CourseLandingAPI, 'getFeedback').mockImplementationOnce(() => {
    return Promise.resolve([]);
  });

  // mock the api call to track user visits to pages ~ implemented in App.js
  const trackPage = jest.spyOn(API, 'trackPage').mockImplementation(() => {
    return Promise.resolve();
  });

  // render the app
  const { container } = render(<Router><App/></Router>);

  await wait (() => expect(getUser).toHaveBeenCalled());

  // we are currently on the home page
  // --> should only track visits to a course homepage
  expect(trackPage).not.toHaveBeenCalled();


  // find the link to the courses page
  const courseLink = container.querySelector("a[href='/courses']");
  console.log(courseLink.textContent);

  fireEvent.click(courseLink);

  await wait (() => expect(getCourses).toHaveBeenCalled());

  // we are currently on the course list page
  expect(container.querySelector(".courses-page")).toBeInTheDocument();
  // --> should only track visits to a course homepage
  expect(trackPage).not.toHaveBeenCalled();

  // get the course cards  
  const courseCards = container.querySelectorAll('.course-card');

  // click on the first course
  fireEvent.click(courseCards[0]);
  await wait (() => expect(getCourseInfo).toHaveBeenCalled());

  // we are currently on the course home page
  expect(container.querySelector(".coursePage")).toBeInTheDocument();
  // visiting this page should be tracked
  expect(trackPage).toHaveBeenCalled();
});

