import React from 'react';
import QuizList from "../QuizList/QuizList"

function QuizButtonStudent(props) {

    const id = props.id;

    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

    const [text, setText] = React.useState("")
    const [isStudent, setIsStudent] = React.useState(false);
    const [buttonClicked, setButtonClicked] = React.useState(false);
    const [showQuiz, setShowQuiz] = React.useState(false);

    const [user, setUser] = React.useState([]);
    const [enrolledIn, setEnrolledIn] = React.useState(false);

    const [quizPublished, setQuizPublished] = React.useState(false);
    const [quiz, setQuiz] = React.useState([])


    let userName = "none"
    let quizContent;
    // var condition = false;
    // var condition1;
    // var condition2;

    React.useEffect(() => {
        var jwtToken = JSON.parse(localStorage.getItem("jwtAuthToken"));
        API.getUser(jwtToken.access_token)
          .then(
            (result) => {
                // console.log("1")
                // console.log(result)
                setIsLoaded(true);
                //setCondition1(true);
                setUser(result);
                setIsStudent(result.roles.student)
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
          )

          API.getEnrolledCourses(jwtToken.access_token)
          .then(
            (result) => {
                // console.log("2")
                // console.log(result)
                // console.log(id)
                setIsLoaded(true);
                //setCondition2(true);

                for(var i = 0; i < result.length; i++){
                    if(result[i].id === id){
                        setEnrolledIn(true);
                    }
                }  
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
          )
      }, [])

    const handleClick = (event) => {
        setButtonClicked(!buttonClicked);
        setShowQuiz(!showQuiz);
        // console.log("inside handle click")
        var jwtToken = JSON.parse(localStorage.getItem("jwtAuthToken"));
        API.getQuizInfo(jwtToken.access_token, id)
        .then(
          (result) => {
            //   console.log("3")
            //   console.log(result)
              setIsLoaded(true);

              if(result === undefined || result.length == 0){
                setText("No quizzes published yet!")
              }else{
                  var arr = [];
                for(var i = 0; i < result.length; i++){
                    if(result[i].published){
                        arr = [...arr, result[i]]
                        setQuizPublished(true);
                        setText("Your instructor has posted quizzes!")
                    }
                    setQuiz(arr)
                }
              }

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

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
        return(
            <div>
                <div  style={{ display: enrolledIn && isStudent ? "block" : "none" }}>
                    <button aria-label="endorse-button" type="button" 
                    onClick={handleClick}>Quizzes
                    </button>
                    <div className="buttonText" >{text}</div>
  
                </div>
                    <div  style={{ display: buttonClicked && quizPublished ? "block" : "none" }}>
                        <QuizList quizzes={quiz} showQuiz={showQuiz} setShowQuiz={setShowQuiz}/>
                    </div>
            </div>
        )
    }
}


export const API = {

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
      },

      getEnrolledCourses: async (token) => {
        const url = 'http://localhost:5000/course/student/';
    
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
      },

      getQuizInfo: async (token, id) => {
        const url = `http://localhost:5000/quiz/course/${id}/`;
    
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


export default QuizButtonStudent