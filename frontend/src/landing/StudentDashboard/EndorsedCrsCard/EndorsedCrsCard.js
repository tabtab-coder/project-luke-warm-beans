import React from 'react';
import './EndorsedCrsCard.css';

import {
    Link
} from "react-router-dom";


function EndorsedCrsCard(props) {
    const link = `/courses/${props.course.id}`
    return (
        <Link to={link}>
            <div className="endorsed-course-card">
                <div><h2>{props.course.name}</h2></div>
            </div>
        </Link>
    )
}

export default EndorsedCrsCard;