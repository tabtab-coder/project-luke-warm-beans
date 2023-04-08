import React from 'react';
import {useHistory} from 'react-router-dom';
import json_jobs  from '../jobs.json';
import JobList from '../JobList/JobList.js';
import CreationForm from '../CreationForm/CreationForm.js';
import JobInfo from '../JobInfo/JobInfo.js';
import './JobCreation.css'


function JobCreation(props) {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const [jobs, setJobs] = React.useState([]);
  const [selected, setSelected] = React.useState(0);
  const [showForm, setShowForm] = React.useState(false);

  const history = useHistory();

  const initialValues = {
    paid: false,
    description: '',
    published: false,
  };

  const [formValues, setValues] = React.useState(initialValues);


  // add a new course to the list
  const addJob = (values) => {
    setJobs([...jobs, values]);
  }

  // update a pre-existing course in the list
  const updateJob = (values) => {
    let new_jobs = [...jobs];
    new_jobs[selected] = values;
    setJobs(new_jobs);
  }

  React.useEffect(() => {
    var token = JSON.parse(localStorage.getItem("jwtAuthToken"))
    if ( token === null) {
        history.push("/login")
    } else {
        API.getJobs(token.access_token)
          .then(
            (result) => {
                setIsLoaded(true);
                setJobs(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
      }
  }, [])

  const handleCreate = () => {
    setValues(initialValues);
    setSelected(jobs.length);
    setShowForm(true);
  }

  const handleSelection = (index) => {
    setShowForm(false);
    setSelected(index);
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    let content = null;
    if (selected === jobs.length || showForm === true) {
      content = <CreationForm
        values={formValues}
        initialValues={initialValues}
        setValues={setValues}
        setShowForm={setShowForm}
        addJob={addJob}
        updateJob={updateJob}
        isNewJob={selected === jobs.length}
      />
    } else {
      content = <JobInfo 
        setFormValues={setValues} 
        setShowForm={setShowForm} 
        job={jobs[selected]}
      />
    }

    return (
      <div className="JobCoursePage">
        <div className="info-header"><strong>Welcome back!</strong></div>
        <div className="info-text">NPO can manage job posting here:</div>
        <JobList jobs={jobs} selected={selected} handleCreate={handleCreate} handleSelection={handleSelection}/>
        {content}
      </div>
    );
  }
}

export const API = {
  getJobs: async (token) => {
    const url = "http://localhost:5000/opportunities/org/";
    return fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }).then(res => res.json());
  },
}

export default JobCreation;
