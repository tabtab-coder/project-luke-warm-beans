import React from 'react';
import { ReactComponent as EditIcon } from 'icons/7.svg';

function JobInfo(props) {
  const job = props.job

  const handleEdit = (event) => {
    props.setFormValues(job);
    props.setShowForm(true);
  }

  let pub = null;
  if (job.published) {
    pub = <span className="published">

      <p>Published</p>
      </span>;
  } else {
    pub = <span className="not-published">

    <p>Not Published</p>
    </span>;
  }

  let paid = null;
  if (job.paid) {
    paid = <p>Paid Oppurtunity</p>;
  } else {
    paid = <p>Volunteer Oppurtunity</p>;
  }

  return (
    <div className="info-card">
      <h1>{paid}</h1>
      <p>{job.description}</p>
      <div className="toolbar">
        {pub}
        <button aria-label="edit-button" className="rect-1627" onClick={e => handleEdit(e)}><EditIcon/><p>Edit</p></button>
      </div>
    </div>
  );
}

export default JobInfo;