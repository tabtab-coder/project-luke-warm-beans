import React from "react";
import {useHistory} from "react-router-dom";

import { ReactComponent as SaveIcon } from 'icons/save.svg';

function CreationForm(props) {
  const values = props.values;
  const setValues = props.setValues;
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    // update state with the new course
    const jobJSON = {
      ...values,
    };

    var jwtToken = JSON.parse(localStorage.getItem("jwtAuthToken"))
    if (props.isNewJob) {
      if ( jwtToken === null) {
        history.push("/login")
      } else {
        API.postJob(jobJSON, jwtToken.access_token).then(
          (result) => {
            jobJSON.id = result.id;
            props.addJob(jobJSON);
            // reset form values
            setValues(props.initialValues);
            // navigate away from the creation form after submitting
            props.setShowForm(false);
          },
          (error) => {
              alert(JSON.stringify(error));
          }
        );
      }
      // alert('A new job was created');
    } else {
      if ( jwtToken === null) {
        history.push("/login")
      } else {
        API.putJob(jobJSON, jwtToken.access_token).then(
          (result) => {
            props.updateJob(jobJSON);
            // reset form values
            setValues(props.initialValues);
            // navigate away from the creation form after submitting
            props.setShowForm(false);
          },
          (error) => {
              alert(JSON.stringify(error));
          }
        );
      }
    }
  }


  const handleDescChange = (event) => {
    setValues({
      ...values,
      description: event.target.value,
    });
  }

  const handlePublishChange = (event) => {
    setValues({
      ...values,
      published: event.target.checked
    });
  }

  const handlePaidChange = (event) => {
    setValues({
      ...values,
      paid: event.target.checked
    });
  }

  return (
    <form aria-label="creation-form" className="creation-form" onSubmit={handleSubmit}>


      <label className="label-text">Description:</label>  
      <textarea aria-label="description-input" className="rect-2" placeholder="Enter the objective" type="text" value={values.description} onChange={e => handleDescChange(e)} />

      <div className="row">
        <div className="labelRectCombo">
          <label className="label-text">Publish?</label>
          <input aria-label="publish-input" type="checkbox" className="checkbox" checked={values.published} onChange={e => handlePublishChange(e)}></input>
        </div>
        <div className="labelRectCombo">
          <label className="label-text">Paid?</label>
          <input aria-label="paid-input" type="checkbox" className="checkbox" checked={values.paid} onChange={e => handlePaidChange(e)}></input>
        </div>
        <button aria-label="submit-button" className="rect-1627" type="submit"><SaveIcon/>Save</button>
        
      </div>
    </form>
  );
}

export const API = {
  async postJob(job, token) {
    const url = 'http://localhost:5000/opportunities/';
    // Default options are marked with *
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(job) // body data type must match "Content-Type" header
    });
    const json = await res.json();
    return res.ok ? json : Promise.reject(json);
  },

  async putJob(job, token) {
    const url = 'http://localhost:5000/opportunities/' + job.id + '/';
    // Default options are marked with *
    const res = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(job) // body data type must match "Content-Type" header
    });
    const json = await res.json();
    return res.ok ? json : Promise.reject(json);
  },

}

export default CreationForm;