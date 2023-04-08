import React from 'react';

import './FeedbackList.css';

function FeedbackList(props) {

    const feedbackList = props.feedback.reverse().map((comment) =>
        <Feedback key={comment.comment} value={comment} />
    );

    return feedbackList;
}

function Feedback(props) {
    var PP = "data:image/png;base64," + props.value.image;

    return <div className="userComment">
                 <img className="feedbackProfilePicture" src={PP} />
                 <p className="commenter">{props.value.user}</p>
                 <p className="comment">{props.value.comment}</p>
               </div>
}

export default FeedbackList;
