import React from 'react';
import {useHistory} from "react-router-dom";

import './CourseFeedback.css';

function CourseFeedback(props) {

  const initialComment = {
    comment: '',
    course: '',
    public: false

  };

  const [feedback, setFeedback] = React.useState(initialComment)
  const id = props.id;
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    // update state with the new course
    const feedbackJSON = {
      ...feedback,
      course: id
    };

    var jwtToken = JSON.parse(localStorage.getItem("jwtAuthToken"))

    if ( jwtToken === null) {
      history.push("/login")
    } else {
      API.postFeedback(feedbackJSON, jwtToken.access_token).then(
        (result) => {
          props.addFeedback(feedbackJSON);
          // reset form values
          setFeedback(initialComment);
        },
        (error) => {
            alert(JSON.stringify(error));
        }
      );
    }
  }

  const handleCommentChange = (event) => {
    setFeedback({
      ...feedback,
      comment: event.target.value,
    });
  }

  const handlePublicChange = (event) => {
    setFeedback({
      ...feedback,
      public: event.target.checked
    });
  }

  return (
    <form aria-label="feedback-form" className="feedbackForm" onSubmit={handleSubmit}>

      <label className="label-text">Leave a Comment:</label>
      <textarea aria-label="obj-input" className="rect-2" placeholder="Write your thoughts on the course!" type="text" value={feedback.comment} onChange={e => handleCommentChange(e)} />

      <div className="row">
        <div className="labelRectCombo">
          <label className="label-text">Publish?</label>
          <input aria-label="public-input" type="checkbox" className="checkbox" checked={feedback.public} onChange={e => handlePublicChange(e)}></input>
        </div>
        <button aria-label="submit-button" className="rect-1627" type="submit">Submit</button>

      </div>
    </form>
  );
}

export const API = {

  postFeedback(feedback, token) {
    const url = 'http://localhost:5000/feedback/';
    // Default options are marked with *
    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(feedback) // body data type must match "Content-Type" header
    }).then( res => {
      // check to see if the server responded with a 200 request (ok)
      // if not, then reject the promise so that proper error handling can take place
      return res.json().then(json => {
          return res.ok ? json : Promise.reject(json);
      });
  });
  },

}

export default CourseFeedback;

