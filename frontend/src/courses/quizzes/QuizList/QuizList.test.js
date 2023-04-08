import React from 'react';
import { render, waitForElement, wait, fireEvent, getByLabelText } from '@testing-library/react';
import QuizList, {API} from './QuizList.js';
// import jsonQuizzes from '../quizzes.json';

const setup = () =>{
 
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => '{"accessToken":"yo"}');
    const quiz = [
        {
        "course": 'course_id',
        "quiz": "quiz id",
        "name": "quiz_name",
        "published": true,
        "quizQuestions": [{"answer":0, "question":0}]
      }
    ]

      const showQuiz = true;

    const setShowQuiz = jest.fn((values) => {});
    const utils = render(
        <QuizList quizzes={quiz} showQuiz={showQuiz} setShowQuiz={setShowQuiz}/>
    );
    
    return {
        ...utils,
        quiz,
        showQuiz,
        setShowQuiz
    }
}

test('when quiz options open up, user can see them and choose which one to do',
 async () => {
    // const mockUser = {
    //     "name": "ymart1n",
    //     "email": "1231293@ww.com",
    //     "phone": "1234567980",
    //     "roles": {
    //         "admin": false,
    //         "instructor": false,
    //         "organization": true,
    //         "student": true
    //     }
    // };

    const quizzes = [{
        "answers": [{"answer":0, "question":0}],
        "grade": 0,
        "id": "submission id",
        "quiz": "quiz id",
      }]

    // const coursesEnrolled = ["0", "eqweqwewqeqwe"]


    const quizSubmissions = jest.spyOn(API, 'getQuizSubmissions').mockImplementationOnce(() => {
      return Promise.resolve(quizzes);
    })

    const { getByText, container } = setup();

    await waitForElement(() => container.querySelectorAll('.quiz-selection-block-parent'))
    const quizBlocks = container.querySelectorAll('.quiz-selection-block-parent');
    expect(quizBlocks.length).toBe(1);

    const quizzesButton = getByText("Start Quiz");
    expect(quizzesButton).toBeInTheDocument();
    // fireEvent.click(quizzesButton);

    // await wait (() => expect(quizSubmissions).toHaveBeenCalled());

    // const quizzesButton = getByText("Quizzes");
    // expect(quizzesButton).toBeInTheDocument();
    // fireEvent.click(quizzesButton);
    // await wait (() => expect(quizInfo).toHaveBeenCalled());

    // const quizPosted = getByText("Your instructor has posted quizzes!");
    // expect(quizPosted).toBeInTheDocument();
});
