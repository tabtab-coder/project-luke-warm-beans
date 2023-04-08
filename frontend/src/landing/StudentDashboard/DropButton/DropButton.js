import React from 'react';
import { useHistory } from "react-router-dom";
import ConfirmationPopup from '../../ConfirmationPopup/ConfirmationPopup';
import './DropButton.css'

export default function DropButton(props) {
    const [error, setError] = React.useState(null);
    const history = useHistory();
    const [showPopup, setShowPopup] = React.useState(false);

    const togglePopup = () => {
      setShowPopup(!showPopup)
    }

    const handleClick = (event) => {
      event.preventDefault();

      var jwtToken = JSON.parse(localStorage.getItem("jwtAuthToken"))
    
        if (jwtToken) {
          API.dropCourse(props.course.id, jwtToken.access_token)
            .then(
            () => {
              
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              setError(error);
            }
          );
          togglePopup();
        } else {
          history.push("./login")
        }
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    } else {
      return (
        <div>
          <button id="dropButton" onClick={togglePopup}>Drop</button>
          {showPopup ? 
            <ConfirmationPopup
              text='Are you sure you want to drop this course?'
              description='This action will remove you from this course.'
              yesOption={handleClick}
              noOption={togglePopup}
            />
            : null
          }
        </div>
      )
    }
}

export const API = {
    dropCourse: async (course_id, token) => {
      const url = 'http://localhost:5000/course/disenroll/' + course_id + '/';
  
      return fetch(url, {
        method: 'DELETE',
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