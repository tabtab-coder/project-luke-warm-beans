import React from 'react';
import { render, wait } from '@testing-library/react';

import Dashboard, {API} from './Dashboard.js';
import jsonCourses from 'courses/courses.json';
import { StaticRouter } from 'react-router-dom';
import mockUser from 'landing/SignUp/SignUp/mockUser.json';


const setup = () => {
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');
  const utils = render(
    // need to wrap the Dashboard component with a static router to 
    // simulate the Router information for the real app
    // This is needed because we use <Link/> tags inside <Dashboard /> 
    //                                            in <DashboardCrouseCard> in <LearnMoreButton />

    // ref: https://reactrouter.com/web/guides/testing
    <StaticRouter>
        <Dashboard user={mockUser[0]}/>
    </StaticRouter>
    
  );
    
  return {
    ...utils,
  }
};

test('on startup, api call is made to get courses with this signed-in student', async () => {
  const getStuCrs = jest.spyOn(API, 'getStudentCourses').mockImplementationOnce(() => {
    return Promise.resolve(jsonCourses);
  })
  
  const getInstCrs = jest.spyOn(API, 'getInstructorCourses').mockImplementationOnce(() => {
    return Promise.resolve(jsonCourses);
  })

  const getNPOCrs = jest.spyOn(API, 'getNPOCourses').mockImplementationOnce(() => {
    return Promise.resolve(jsonCourses);
  })

  const { container } = setup();

  await wait (() => expect(getStuCrs).toHaveBeenCalledTimes(1));
  await wait (() => expect(getInstCrs).toHaveBeenCalledTimes(1));
  await wait (() => expect(getNPOCrs).toHaveBeenCalledTimes(1));

  // check that all the cards in the test data are rendered
  const dashboardCourseCards = container.querySelectorAll('.dashboard-course-card');
  expect(dashboardCourseCards.length).toBe(jsonCourses.length);

  // check that all the cards in the test data are rendered twice as EndorsedCrsCard
  // Since instructorCrsCards and NPOCrsCards are both class '.endorsed-course-card'
  const endorsedCourseCards = container.querySelectorAll('.endorsed-course-card');
  expect(endorsedCourseCards.length).toBe(jsonCourses.length * 2);
});
