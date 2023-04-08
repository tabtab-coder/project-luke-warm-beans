import React from 'react';
import { ReactComponent as EditIcon } from 'icons/7.svg';

import { ReactComponent as CheckIcon } from 'icons/156.svg';
import { ReactComponent as CrossIcon } from 'icons/44.svg';

import './CourseInfo.css';



function CourseInfo(props) {
  const course = props.course

  const handleEdit = (event) => {
    props.setFormValues(course);
    props.setShowForm(true);
  }

  let pub = null;
  if (course.published) {
    pub = <span className="published">

      <p>Published</p>
      </span>;
  } else {
    pub = <span className="not-published">

    <p>Not Published</p>
    </span>;
  }


  return (
    <div className="info-card">
      <h1>{course.name}</h1>
      <h2>Objective:</h2>
      <p>{course.objective}</p>
      <h2>Learning Outcomes:</h2>
      <p>{course.learningOutcomes}</p>

      <div className="toolbar">
        {pub}
        <button aria-label="edit-button" className="rect-1627" onClick={e => handleEdit(e)}><EditIcon/><p>Edit</p></button>
      </div>
    </div>
  );
}

export default CourseInfo;