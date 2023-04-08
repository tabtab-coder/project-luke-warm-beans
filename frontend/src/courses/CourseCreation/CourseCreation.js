import React from 'react';
import {useHistory} from 'react-router-dom';

import CourseList from '../CourseList/CourseList.js';
import CreationForm from '../CreationForm/CreationForm.js';
import CourseInfo from '../CourseInfo/CourseInfo.js';

import QuizCreation from '../quizzes/QuizCreation/QuizCreation.js';
import './CourseCreation.css';

import Analytics from '../Analytics/Analytics.js';

function CourseCreation(props) {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const [courses, setCourses] = React.useState([]);
  const [selected, setSelected] = React.useState(0);
  const [showForm, setShowForm] = React.useState(false);


  // const [showQuizzes, setShowQuizzes] = React.useState(false);

  // const string values for tabs
  const INFO_TAB = "INFO";
  const QUIZ_TAB = "QUIZ";
  const ANALYTICS = "ANALYTICS";

  const [tab, setTab] = React.useState(INFO_TAB);
  const setShowQuizzes = (show) => {
    if (show === true) {
      setTab(QUIZ_TAB);
    } else {
      setTab(INFO_TAB);
    }
  }


  const history = useHistory();

  const initialValues = {
    name: '',
    objective:'',
    learningOutcomes: '',
    published: false,
    students: []
  };

  const [formValues, setValues] = React.useState(initialValues);


  // add a new course to the list
  const addCourse = (values) => {
    setCourses([...courses, values]);
  }

  // update a pre-existing course in the list
  const updateCourse = (values) => {
    let crs = [...courses];
    crs[selected] = values;
    setCourses(crs);
  }

  React.useEffect(() => {
    var token = JSON.parse(localStorage.getItem("jwtAuthToken"))
    if ( token === null) {
        history.push("/login")
    } else {

        API.getCourses(token.access_token)
          .then(
            (result) => {
                setIsLoaded(true);
                setCourses(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
      }
  }, [])

  const handleCreate = () => {
    setValues(initialValues);
    setSelected(courses.length);
    setShowQuizzes(false);
    setShowForm(true);
  }

  const handleSelection = (index) => {
    setShowForm(false);
    setSelected(index);
    setShowQuizzes(false);
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    let content;
    if (selected === courses.length || showForm === true) {
      content = <CreationForm
        values={formValues}
        initialValues={initialValues}
        setValues={setValues}
        setShowForm={setShowForm}
        addCourse={addCourse}
        updateCourse={updateCourse}
        isNewCourse={selected === courses.length}
      />
    } else {
      content = <CourseInfo 
        setFormValues={setValues} 
        setShowForm={setShowForm} 
        course={courses[selected]}
      />
    }

    let quizContent;
    let analyticsContent;
    let tabs;

    if (selected === courses.length) {
      tabs = null;
      quizContent = null;
      analyticsContent = null;
    } else {
      tabs = 
        <div className="tabs">
          <button onClick={() => setTab(INFO_TAB)}>Course</button>
          <button onClick={() => setTab(QUIZ_TAB)}>Quizzes</button>
          <button onClick={() => setTab(ANALYTICS)}>Analytics</button>
        </div>
      quizContent = <QuizCreation course={courses[selected]} />
      analyticsContent = <Analytics course={courses[selected]} />
    }


    let displayContent = null;
    if (tab == INFO_TAB) {
      displayContent = content;
    } else if (tab == QUIZ_TAB) {
      displayContent = quizContent;
    } else if (tab == ANALYTICS) {
      displayContent = analyticsContent;
    }


    return (
      <div className="CreateCoursePage">
        <div className="info-header"><strong>Welcome back!</strong></div>
        <div className="info-text">Instructor can manage your courses here:</div>
        <CourseList courses={courses} selected={selected} handleCreate={handleCreate} handleSelection={handleSelection}/>

        <div className="forms">
          {tabs}
          {displayContent}
        </div>

      </div>
    );
  }
}

export const API = {
  getCourses: async (token) => {
    const url = "http://localhost:5000/course/instructor/";
    return fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }).then(res => res.json());
  },
}

export default CourseCreation;
