import React from 'react';
import { useHistory } from "react-router-dom";
import DashboardCourseCard from './DashboardCourseCard/DashboardCourseCard'
import DeleteAccountButton from '../DeleteAccount/DeleteAccountButton';
import './Dashboard.css';
import StudentInfo from './StudentInfo/StudentInfo';
import EndorsedCrsCard from './EndorsedCrsCard/EndorsedCrsCard'


function Dashboard(props) {
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const history = useHistory();

    const [studentCourses, setStudentCourses] = React.useState([]);
    const [instructorCourses, setInstructorCourses] = React.useState([]);
    const [NPOCourses, setNPOCourses] = React.useState([]);

    const user = props.user;

    const setLoggedIn = props.setLoggedIn;

    let delAccButton;
    delAccButton = <DeleteAccountButton setLoggedIn={setLoggedIn} />

    React.useEffect(() => {
      var jwtToken = JSON.parse(localStorage.getItem("jwtAuthToken"))
      if (jwtToken) {
        API.getStudentCourses(jwtToken.access_token)
          .then(
            (result) => {
              setIsLoaded(true);
              setStudentCourses(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        );
        API.getInstructorCourses(jwtToken.access_token)
          .then(
            (result) => {
              setIsLoaded(true);
              setInstructorCourses(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
        );
        API.getNPOCourses(jwtToken.access_token)
          .then(
            (result) => {
              setIsLoaded(true);
              setNPOCourses(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
        );
      } else {
        history.push("./login")
        delAccButton = null
      }
    }, [])

    const studentCrsCards = studentCourses.map(c => <DashboardCourseCard key={c.id} course={c}/>);
  
    const instructorCrsCards = instructorCourses.map(c => <EndorsedCrsCard key={c.id} course={c}/>)
    
    const NPOCrsCards = NPOCourses.map(c => <EndorsedCrsCard key={c.id} course={c}/>)
    
    const isStudent = user.roles.student;
    const isInstructor = user.roles.instructor;
    const isNPO = user.roles.organization;

    if (error) {
        return <p>courses could not be loaded</p>
    } else if (!isLoaded) {
        return <p>... loading</p>
    } else {
        
        return (
            <div className="student-dashboard">  
                <div>
                    <StudentInfo />
                </div>
                <div style={{ display: isStudent ? "inline-block" : "none" }}>
                  <div className="middle">
                    <div className="info-text">
                      <strong>Courses you currently enroll in:</strong>
                    </div>
                    {studentCrsCards}
                  </div>
                </div>
                <div style={{ display: isInstructor ? "inline-block" : "none" }}>
                  <div className="middle">
                    <div className="info-text">
                      <strong>Courses you are currently teaching:</strong>
                    </div>
                    {instructorCrsCards}
                  </div>
                </div>
                <div style={{ display: isNPO ? "inline-block" : "none" }}>
                  <div className="middle">
                    <div className="info-text">
                      <strong>Courses you have endorsed:</strong>
                    </div>
                    {NPOCrsCards}
                  </div>
                </div>
                <div>
                    {delAccButton}
                </div>
            </div>
        ); 
    }
}

export const API = {
    getStudentCourses: async (token) => {
      const url = "http://localhost:5000/course/student/";
  
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

    getInstructorCourses: async (token) => {
      const url = "http://localhost:5000/course/instructor/";
  
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

    getNPOCourses: async (token) => {
      const url = "http://localhost:5000/user/endorsed/";
  
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

export default Dashboard;