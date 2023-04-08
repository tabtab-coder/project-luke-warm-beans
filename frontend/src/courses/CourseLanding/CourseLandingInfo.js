import React from 'react';
import {useHistory} from 'react-router-dom';
import CourseEndorseButton from '../CourseEndorseButton/CourseEndorseButton'
import QuizButtonStudent from '../quizzes/QuizButtonStudent/QuizButtonStudent'

function CourseLandingAPI(props) {
    let id = props.id;
    const [currCourse, setCurrCourse] = React.useState([])
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

    const history = useHistory();

    React.useEffect(() => {
        var token = JSON.parse(localStorage.getItem("jwtAuthToken"))
        if (token === null) {
            history.push("/login")
        } else {
            API.getCourse(token.access_token, id)
            .then(
                (result) => {
                    setCurrCourse(result)
                    setIsLoaded(true);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                    alert("Couldn't retrieve course information!")
                }
            )
        }
    }, [])


    return (
        <div>
            <h1 className="courseLanding">{currCourse.name} by {currCourse.instructor}</h1>
            <h2 className="courseLanding">Objective of this course: {currCourse.objective}</h2>
            <h4 className="courseLanding">Learning outcomes: {currCourse.learningOutcomes}</h4>
            <CourseEndorseButton id={id} />
            <QuizButtonStudent id={id}/>
        </div>
    )
}

export const API = {
    getCourse: async (token, id) => {
      const url = `http://localhost:5000/course/published/${id}/`;
      return fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }).then( async res => {
        // check to see if the server responded with a 200 request (ok)
        // if not, then reject the promise so that proper error handling can take place
        const json = await res.json();
        return res.ok ? json : Promise.reject(json);
      });
    },
}

export default CourseLandingAPI;