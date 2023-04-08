import React from 'react';
import {useHistory} from 'react-router-dom';

import { ReactComponent as EditIcon } from 'icons/7.svg';
import { ReactComponent as AddIcon } from 'icons/add.svg';
import { ReactComponent as SaveIcon } from 'icons/save.svg';

function QuizViewStudent(props) {
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

    const values = props.quiz;
    const isSubmitted = props.isSubmitted;
    const submittedAnswers = props.submittedAnswers;
    // console.log("submittedAnswers:")
    // console.log(submittedAnswers)

    const dummyStudentAnswers = new Array(values.quizQuestions.length).fill(0);
    // console.log(dummyStudentAnswers)
    // console.log("we are called")


    const handleSubmit = (event) => {
        event.preventDefault();
        // console.log("do we ever submit?")
        var question = 0;
        var answer = 0;
        var answerPair = {};
        var finalAnswer = [];
        for(let i = 0; i < dummyStudentAnswers.length; i++){
            question = i;
            answer = dummyStudentAnswers[i];
            answerPair = {"question": question, "answer": answer}
            finalAnswer.push(answerPair);
        }
        //API calls
        const quizSubmissionJSON = {
            quiz: values.id,
            answers : finalAnswer
        };
    
        var jwtToken = JSON.parse(localStorage.getItem("jwtAuthToken"))
        API.postAnswers(jwtToken.access_token, quizSubmissionJSON)
        .then(
            (result) => {
                // console.log(result)
                // console.log("sent submisison")
                props.setShowForm(false);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                alert("Couldn't post answers properly!");
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    const handleOptionChange = (event, i, j) => {
        dummyStudentAnswers[i] = j;
    }

    const handleFormClose = () => {
        props.setShowForm(false);
        props.setIsSubmitted(false);
    }

  const questions = values.quizQuestions.map((qu, i) => {

    const options = [0, 1, 2, 3].map((j) => {
        if(isSubmitted){
            return (
                <div key={j}>
                  <label className="option-text"></label>
                  <input aria-label="option-text" className="rect-1643 mult-option" type="text" disabled={true}
                  value={values.quizQuestions[i].options[j].option} onChange={e => handleOptionChange(e, i, j)} />
                   <input className="radio-answer"  title="Correct Answer" type="radio" name={`answer-${i}`} 
                  checked={submittedAnswers[i].answer === j} onChange={()=>console.log("these are users old answers")}></input>
                </div>
              )
        }else{
            return (
                <div key={j}>
                  <label className="option-text"></label>
                  <input aria-label="option-text" className="rect-1643 mult-option" type="text" disabled={true}
                  value={values.quizQuestions[i].options[j].option} onChange={e => handleOptionChange(e, i, j)} />
                  <input className="radio-answer"  title="Correct Answer" type="radio" name={`answer-${i}`} 
                   onChange={e => handleOptionChange(e, i, j)}></input>
                </div>
              )
        }
    });

    return (
      <div key={i} className="mult-question">
        <div className="question-bar">
            <label className="question-text"><h2>Question {i+1}</h2></label>
        </div>

        <input aria-label="question-text" className="rect-1643" type="text" disabled={true}
        value={values.quizQuestions[i].question} onChange={() => console.log("what is this")} />
        <h2>Options</h2>
        {options}
      </div>
    )
  });


if(isSubmitted){

  let gradeContent = null;

  if (props.grade != -1) {
    gradeContent = <h1>You've already completed this quiz! Your grade was: {props.grade} / {props.quiz.quizQuestions.length}</h1>
  }

  console.log(props);
    return (
        <form aria-label="creation-form" className="quiz-form " onSubmit={handleSubmit}>
          {gradeContent}
          <div className="labelRectCombo">
            <label className="label-text quizName">Quiz Name:</label>  
            <input aria-label="name-input" className="rect-1643" type="text" disabled={true}
            value={values.name} onChange={() => console.log("this needs to be changed")} />
          </div>

          <h1>Multiple Choice Questions</h1>
          {questions}

          <div className="row">
            <button aria-label="close-button" className="rect-1627" type="button" 
            onClick={() => handleFormClose()}> Close </button>
          </div>
        </form>
      )
}else{
    return (
        <form aria-label="creation-form" className="quiz-form " onSubmit={handleSubmit}>
          <div className="labelRectCombo">
            <label className="label-text quizName">Quiz Name:</label>  
            <input aria-label="name-input" className="rect-1643" type="text" disabled={true}
            value={values.name} onChange={() => console.log("this needs to be changed")} />
          </div>

          <h1>Multiple Choice Questions</h1>
          {questions}

          <div className="row">
            <button aria-label="submit-button" className="rect-1627" type="submit"><SaveIcon/> Submit </button>
            <button aria-label="close-button" className="rect-1627" type="button" 
            onClick={() => handleFormClose()}> Close </button>
          </div>
        </form>
      )
}

}

export const API = {
    postAnswers: async (token, answers) => {
        const url = `http://localhost:5000/quiz/submit/`;
        
        return fetch(url, {
          method: 'POST',
          mode: 'cors', 
          cache: 'no-cache', 
          credentials: 'same-origin', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(answers) // body data type must match "Content-Type" header
        }).then( async res => {
          // check to see if the server responded with a 200 request (ok)
          // if not, then reject the promise so that proper error handling can take place
          const json = await res.json();
          return res.ok ? json : Promise.reject(json);
        });
      },

  }


export default QuizViewStudent;