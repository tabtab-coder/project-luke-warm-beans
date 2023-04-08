import React from 'react';
import { render, waitForElement, wait, fireEvent, getByLabelText } from '@testing-library/react';
import QuizButtonStudent, {API} from './QuizButtonStudent.js';
// import jsonQuizzes from '../quizzes.json';

const setup = () =>{

    let id = '0'
 
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');
   
    const utils = render(
        <QuizButtonStudent id={id}/>
    );
    
    return {
        ...utils,
        id
    }
}

test('when course landing page opens API call needs to be made to get user and when button clicked endorse API should work',
 async () => {
    const mockUser = {
        "name": "ymart1n",
        "email": "1231293@ww.com",
        "phone": "1234567980",
        "roles": {
            "admin": false,
            "instructor": false,
            "organization": true,
            "student": true
        }
    };

    const newQuiz = [{
        "id": 0,
        "name": "new quiz",
        "quizQuestions": [],
        "published": true,
        "course": 'fake_course_id'
      }]

    const coursesEnrolled = ["0", "eqweqwewqeqwe"]


    const userInfo = jest.spyOn(API, 'getUser').mockImplementationOnce(() => {
      return Promise.resolve(mockUser);
    })

    const enrolledCourses = jest.spyOn(API, 'getEnrolledCourses').mockImplementationOnce(() => {
        return Promise.resolve(coursesEnrolled);
    })

    const quizInfo = jest.spyOn(API, 'getQuizInfo').mockImplementationOnce(() => {
        return Promise.resolve(newQuiz);
    })
    const { getByText } = setup();
    await wait(() => expect(userInfo).toHaveBeenCalled());
    await wait (() => expect(enrolledCourses).toHaveBeenCalled());

    const quizzesButton = getByText("Quizzes");
    expect(quizzesButton).toBeInTheDocument();
    fireEvent.click(quizzesButton);
    await wait (() => expect(quizInfo).toHaveBeenCalled());

    const quizPosted = getByText("Your instructor has posted quizzes!");
    expect(quizPosted).toBeInTheDocument();
});
