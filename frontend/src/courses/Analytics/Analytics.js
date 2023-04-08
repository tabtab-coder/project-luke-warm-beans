import React from 'react';
import './Analytics.css';


function Analytics(props) {
  // views states
  const [viewsError, setViewsError] = React.useState(null);
  const [viewsLoaded, setViewsLoaded] = React.useState(false);

  const [views, setViews] = React.useState(0);


  // enrolled states
  const [enrolledError, setEnrolledError] = React.useState(null);
  const [enrolledLoaded, setEnrolledLoaded] = React.useState(false);

  const [enrolled, setEnrolled] = React.useState(0);


  // quiz states
  const [quizzesError, setQuizzesError] = React.useState(null);
  const [quizzesLoaded, setQuizzesLoaded] = React.useState(false);
  const [quizzes, setQuizzes] = React.useState(0);

  // averages states
  const [averagesError, setAveragesError] = React.useState(null);
  const [averagesLoaded, setAveragesLoaded] = React.useState(false);
  // list of information showing averages for published quizes in this course
  const [averages, setAverages] = React.useState([]);

  React.useEffect(() => {
    var token = JSON.parse(localStorage.getItem("jwtAuthToken"))
    API.getViews(token.access_token, props.course)
      .then(
        (result) => {
          setViewsLoaded(true);
          setViews(result.views);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setViewsLoaded(true);
          setViewsError(error);
        }
      );

    API.getEnrolled(token.access_token, props.course)
    .then(
      (result) => {
        setEnrolledLoaded(true);
        setEnrolled(result.students);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        setEnrolledLoaded(true);
        setEnrolledError(error);
      }
    );

    API.getQuizzes(token.access_token, props.course)
    .then(
      (result) => {
        setQuizzesLoaded(true);
        setQuizzes(result.quizzes);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        setQuizzesLoaded(true);
        setQuizzesError(error);
      }
    );

    API.getAverages(token.access_token, props.course)
    .then(
      (result) => {
        setAveragesLoaded(true);
        setAverages(result);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        setAveragesLoaded(true);
        setAveragesError(error);
      }
    );

    


      
  }, []);


  let viewsContent;

  if (viewsLoaded) {
    if (viewsError == null) {
      viewsContent = 
      <div>
        <p>This course's homepage has been viewed <strong>{views}</strong>  { views > 1 ? 'times' : 'time'}</p>
      </div>
    } else {
      viewsContent = 
      <div>
        <p>Looks like no one has seen your course yet... Have you published it?</p>
      </div>
    }  
  }

  let enrolledContent;

  if (enrolledLoaded) {
    if (enrolledError == null && enrolled > 0) {
      enrolledContent = 
      <div>
        <p>There { enrolled > 1 ? 'are' : 'is'} currently <strong>{enrolled}</strong> { enrolled > 1 ? 'students' : 'student'} enrolled in this course.</p>
      </div>
    } else {
      enrolledContent = 
      <div>
        <p>Nobody has enrolled in your course yet!</p>
      </div>
    }  
  }

  let quizzesContent;

  if (quizzesLoaded) {
    if (quizzesError == null && quizzes > 0) {
      quizzesContent = 
      <div>
        <p>There { quizzes > 1 ? 'are' : 'is'} currently <strong>{quizzes}</strong> { quizzes > 1 ? 'quizzes' : 'quiz'} published for this course. Your students are busy studying!</p>
      </div>
    } else {
      quizzesContent = 
      <div>
        <p>You haven't published a quiz yet! Your students are waiting!</p>
      </div>
    }  
  }

  let averagesContent;

  if (averagesLoaded) {
    if (averagesError == null && averages.length > 0) {
      averagesContent = averages.map(avg => 
        <div key = {avg.quiz}>
          <p><strong>{avg.quiz}</strong> has recieved <strong>{avg.totalSubmissions}</strong> submissions with an average score of <strong>{avg.average}%</strong></p>
        </div>
      );
      
    } else {
      averagesContent = 
      <div>
        <p>You haven't published a quiz yet! Your students are waiting!</p>
      </div>
    }  
  }

  let analyticContent;
  // wait for all requests to complete before showing anything
  // the render time might be too slow for some people so might want to change this later
  if (enrolledLoaded && viewsLoaded && quizzesLoaded) {
    analyticContent =
      <div id="analyticContent">
        <h3>👀 How many people have seen my course?</h3>
        <blockquote>
          {viewsContent}
        </blockquote>
        
        <h3>📚 How many students are enrolled?</h3>
        <blockquote>
          {enrolledContent}
        </blockquote>

        <h3>🎓 How many quizzes have been published for this course?</h3>
        <blockquote>
          {quizzesContent}
        </blockquote>

        <h3>💯 What are the averages for each quiz?</h3>
        <blockquote>
          {averagesContent}
        </blockquote>


        
      </div>
  } else {
    analyticContent = 
      <div>
        <p>Hacking into the mainframe...</p> 
      </div>
  }


  return (
    <div className="analytics-card">
      <h1>Welcome to Analytics for {props.course.name}</h1>
      <h2>Use the FAQ below to better understand your course and community!</h2>
      {analyticContent}
    </div>

  );
}

export const API = {
    getEnrolled: async (token, course) => {
      const url = "http://localhost:5000/analytics/enrolled/" + course.id + "/";
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const json = await res.json();
      return res.ok ? json : Promise.reject(json);
    },

    getViews: async (token, course) => {
      const url = "http://localhost:5000/analytics/views/" + course.id + "/";
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const json = await res.json();
      return res.ok ? json : Promise.reject(json);
    },

    getQuizzes: async (token, course) => {
      const url = "http://localhost:5000/analytics/quizzes/" + course.id + "/";
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const json = await res.json();
      return res.ok ? json : Promise.reject(json);
    },

    getAverages: async (token, course) => {
      const url = "http://localhost:5000/analytics/averages/" + course.id + "/";
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const json = await res.json();
      return res.ok ? json : Promise.reject(json);
    },

}

export default Analytics;