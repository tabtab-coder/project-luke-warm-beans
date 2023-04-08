import React from 'react';

import { ReactComponent as AddIcon } from 'icons/add.svg';

function JobList(props) {

  const cardClassses = (i) => {
    let classes = ["card", "course-list-card"];
    if (i === props.selected) {
      classes.push("selected");
    }

    return classes.join(' ');
  }
  
  const cards = props.jobs.map((job, i) => 
    <button key={job.id} onClick={(e) => props.handleSelection(i)} className={cardClassses(i)}>
      <div className="subtitle">{job.description}</div>
    </button>
  );

  return (
    <div className="list">
      {cards}
      <button className="card create-card" onClick={(e) => {props.handleCreate()}}>
        <AddIcon />
        <p className="subtitle">Create new job posting</p>
      </button>
    </div>
  );
}

export default JobList;
