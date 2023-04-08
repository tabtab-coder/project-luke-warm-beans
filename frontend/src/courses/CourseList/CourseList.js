import React from 'react';

import './CourseList.css';

import { ReactComponent as AddIcon } from 'icons/add.svg';

function CourseList(props) {

  const cardClassses = (i) => {
    let classes = ["card", "course-list-card"];
    if (i === props.selected) {
      classes.push("selected");
    }

    return classes.join(' ');
  }
  
  const cards = props.courses.map((c, i) => 
    <button key={c.id} onClick={(e) => props.handleSelection(i)} className={cardClassses(i)}>
      <div className="subtitle">{c.name}</div>
    </button>
  );

  return (
    <div className="list">
      {cards}
      <button className="card create-card" onClick={(e) => {props.handleCreate()}}>
        <AddIcon />
        <p className="subtitle">Create new course</p>
      </button>
    </div>
  );
}

export default CourseList;
