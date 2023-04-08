import React from 'react';
import {
    Link
} from "react-router-dom";
import './LearnMoreButton.css'

export default function LearnMoreButton(props) {
    const link = `/courses/${props.course.id}`
    return (
        <Link to={link}>
            <button id="learnMoreButton">Learn More</button>
        </Link>
    )
}