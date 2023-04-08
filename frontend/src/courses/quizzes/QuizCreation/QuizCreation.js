import React from 'react';
import {useHistory} from 'react-router-dom';

import { ReactComponent as EditIcon } from 'icons/7.svg';
import { ReactComponent as AddIcon } from 'icons/add.svg';

import './QuizCreation.css';

import jsonQuizzes from '../quizzes.json';
import QuizForm from '../QuizForm/QuizForm';


function QuizCreation(props) {
  const history = useHistory();

  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const [selected, setSelected] = React.useState(0);
  const [quizzes, setQuizzes] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);

  const initialValues = {
    name: '',
    quizQuestions: [],
    published: false,
    course: props.course.id
  };

  const [formValues, setValues] = React.useState(initialValues);

  const addQuiz = (values) => {
    const qzs = [...quizzes, values];
    setQuizzes(qzs);
  }

  const updateQuiz = (values) => {
    const qzs = [...quizzes];
    qzs[selected] = values;
    setQuizzes(qzs);
  }

  const handleEdit = (event, i) => {
    setShowForm(true);
    setValues(quizzes[i]);
    setSelected(i);
  }

  const handleNew = (event) => {
    setShowForm(true);
    setSelected(quizzes.length);
  }

  React.useEffect(() => {
    let token = JSON.parse(localStorage.getItem("jwtAuthToken"))
    if ( token === null) {
      history.push("/login");
    } else {
      API.getQuizzes(token.access_token, props.course.id)
        .then(
          (result) => {
            setIsLoaded(true);
            setQuizzes(result);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }
  }, [])

  let quizBlocks = quizzes.map((q, i) => {
    return (
      <div key={q.id} className="quiz-block">
        <div>{q.name}</div>
        <div className="edit-button"><EditIcon onClick={e => handleEdit(e, i)}/></div>
      </div>
    )
  });
  if (isLoaded) {
    if (showForm) {
      return <QuizForm
        values={formValues}
        initialValues={initialValues}
        setValues={setValues}
        setShowForm={setShowForm}
        addQuiz={addQuiz}
        updateQuiz={updateQuiz}
        isNewQuiz={selected === quizzes.length}
      />
    } else {
      return (
        <div className="info-card">
          {quizBlocks}
          <div>
            <button onClick={e => handleNew(e)} className="create-button">
              <AddIcon width="30px" height="30px"/>
              Create quiz
            </button>
          </div>
        </div>
      )  
    }
  } else {
    return (
      <div className="info-card">
        <p>Hacking into the mainframe...</p>
      </div>
      
    )
  }

}



export const API = {
    getQuizzes: async (token, course_id) => {
      const url = `http://localhost:5000/quiz/course/${course_id}/`;
      return fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }).then(res => res.json());
    },

    // getQuizzes: (token, course_id) => {
    //     return Promise.resolve(jsonQuizzes);
    // }

  }

export default QuizCreation