import React from 'react';
import DropButton from '../DropButton/DropButton'
import LearnMoreButton from '../LearnMoreButton/LearnMoreButton'
import './DashboardCourseCard.css'

export default function DashboardCourseCard(props) {
    return (
        <div className="dashboard-course-card">
            <div id="student">{props.course.id}</div>
            <div><h2>{props.course.name}</h2></div>
            <div className="float-right">
                <DropButton course={props.course}/>
                <LearnMoreButton course={props.course} />
            </div>
        </div>
    )
}