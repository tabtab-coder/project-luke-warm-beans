import React from 'react';
import './App.css';
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";

import About from './landing/About/About.js';
import Home from './landing/Home/Home.js';
import SignUp from './landing/SignUp/SignUp/SignUp.js'
import CourseCreation from './courses/CourseCreation/CourseCreation.js';
import JobCreation from './jobs/JobCreation/JobCreation.js';

import CoursesPage from './courses/CoursesPage/CoursesPage.js';
import Login from './landing/login/Login/Login.js';
import TopBar from './utils/Navigation.js';
import Logout from './landing/login/Logout/Logout.js';
import Dashboard from 'landing/StudentDashboard/Dashboard';
import CourseLanding from './courses/CourseLanding/CourseLanding';

function usePageViews() {
  // https://reactrouter.com/web/api/Hooks/uselocation
  let location = useLocation();

  React.useEffect(() => {
    // only track visits to course pages -- reduces overall lag for the website
    if (location.pathname.startsWith('/courses/')) {
      API.trackPage(location.pathname);
    }
  }, [location]);
}


export const API = {
  async trackPage(page) {
    // replace forward slashes with ~ to avoid routing conflicts
    const regex = /\//gi;
    const safe_page = page.replace(regex, '~');

    const url = 'http://localhost:5000/page/' + safe_page + '/';
    
    const res = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: JSON.stringify(page) // body data type must match "Content-Type" header
    });
    const json = await res.json();
    return res.ok ? json : Promise.reject(json);
  },
  
  getUser: async (token) => {
    const url = 'http://localhost:5000/user/self/';

    return fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }).then( async res => {
      // check to see if the server responded with a 200 request (ok)
      // if not, then reject the promise so that proper error handling can take place
      const json = await res.json();
      return res.ok ? json : Promise.reject(json);
    });
  }
}

function App() {
  usePageViews();

  const [loggedIn, setLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState([]);

  React.useEffect(() => {
      var token = JSON.parse(localStorage.getItem("jwtAuthToken"))
      if (token === null) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
        API.getUser(token.access_token)
        .then(
          (result) => {
            setUser(result);
          }
        )
      }
    }, [loggedIn])

  return (
    <div className="header">
      <TopBar loggedIn={loggedIn} user={user}/>
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/about">
          <About setLoggedIn={setLoggedIn} />
        </Route>
        <Route path="/logout">
          <Logout
            setLoggedIn={setLoggedIn}
          />
        </Route>
        <Route path="/login">
          <Login
              setLoggedIn={setLoggedIn}
          />
        </Route>
        <Route path="/jobs">
          <JobCreation />
        </Route>
        <Route path="/create">
          <CourseCreation />
        </Route>
        <Route path="/courses/:id">
            <CourseLanding />
        </Route>
        <Route path="/courses">
          <CoursesPage />
        </Route>
        <Route path="/SignUp">
          <SignUp />
        </Route>
        <Route path="/dashboard">
          <Dashboard 
            setLoggedIn={setLoggedIn}
            user={user}
          />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
