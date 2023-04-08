import React from 'react';
import { useParams, useHistory } from "react-router-dom";
import CourseLandingInfo from './CourseLandingInfo'
import CourseFeedback from "../CourseFeedback/CourseFeedback.js";
import FeedbackList from "../FeedbackList/FeedbackList.js";

import './CourseLanding.css';

function CourseLanding(props) {

    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [feedback, setFeedback] = React.useState([]);
    const history = useHistory();
    let { id } = useParams();

    const addFeedback = (feedbackValue) => {
      setFeedback([...feedback, feedbackValue]);
    }

    React.useEffect(() => {
      var jwtToken = JSON.parse(localStorage.getItem("jwtAuthToken"))
      if (jwtToken) {
        API.getFeedback(id, jwtToken.access_token)
            .then(
            (result) => {
                setIsLoaded(true);
                setFeedback(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
            )
      } else {
        history.push("./login")
      }
    }, [])

    if (error) {
        return <p>comments could not be loaded</p>
    } else if (!isLoaded) {
        return <p>... loading</p>
    } else {
        return (
            <div className="coursePage">
                <div className="landingInfo">
                    <CourseLandingInfo id={id}/>

                </div>
                <div className="leaveFeedback">
                    <CourseFeedback id={id} addFeedback={addFeedback} />
                </div>
                <div className="comments">
                    <FeedbackList feedback={feedback}/>
                </div>
            </div>
        );
    }
}

export const API = {
    getFeedback: async (id, token) => {
      const url = "http://localhost:5000/feedback/" + id + "/";

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

export default CourseLanding;

