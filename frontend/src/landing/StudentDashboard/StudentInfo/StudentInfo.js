import React from 'react';
import './StudentInfo.css';
import defaultPic from './defaultPP.png';
import {useHistory} from "react-router-dom";

export default function StudentInfo(props) {

  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [user, setUser] = React.useState([]);
  const history = useHistory();

  const onChangeHandler =(event)=> {
    console.log(event.target.files[0]);
    let pic = event.target.files[0];

    if (pic) {
        const reader = new FileReader();

        reader.onload = _handleReaderLoaded.bind(this)

        reader.readAsBinaryString(pic)
    }
  }

  const _handleReaderLoaded = (readerEvt) => {
    let binaryString = readerEvt.target.result
    setUser({
        ...user,
        image: btoa(binaryString)

      })
  }

  const updateHandler =()=> {
    var jwtToken = JSON.parse(localStorage.getItem("jwtAuthToken"));
    if (jwtToken === null) {
        history.push("./login")
    } else {
        API.putProfilePic(user, jwtToken.access_token).then(
            (result) => {
              alert("Profile Picture has been Updated");
            },
            (error) => {
              alert(JSON.stringify(error));
            }
        );
      }
  }

  React.useEffect(() => {
    var jwtToken = JSON.parse(localStorage.getItem("jwtAuthToken"));
    API.getUser(jwtToken.access_token)
      .then(
        (result) => {
          setIsLoaded(true);
          console.log(result)
          setUser(result);
          console.log(user.name)
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

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    var PP = "data:image/png;base64," + user.image;
    return (
      <div>
        <div className="profilePictureContainer">
          <img src={PP} className="profilePicture"/>
        </div>
        <div className="upload-section">
          <label>Update Profile Picture</label>
          <input type="file" name="file" accept="image/png" className="file-upload" onChange={onChangeHandler}/>
          <button type="button" className="update-button" onClick={updateHandler}>Update</button>
        </div>
        <div className="info-header">
          <strong>Welcome back!</strong>
        </div>
        <div className="info-text">
          <strong>User:</strong>
          &nbsp;
          <i>{user.name}</i>
        </div>
        <div className="info-text">
          <strong>Email:</strong>
          &nbsp;
          {user.email}
        </div>
        <div className="info-text">
          <strong>Phone:</strong>
          &nbsp;
          {user.phone}
        </div>
      </div>
    );
  
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
  putProfilePic(user, token) {
    const url = 'http://localhost:5000/user/self/';
    // Default options are marked with *
    return fetch(url, {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(user) // body data type must match "Content-Type" header
    }).then( res => {
      // check to see if the server responded with a 200 request (ok)
      // if not, then reject the promise so that proper error handling can take place
      return res.json().then(json => {
          return res.ok ? json : Promise.reject(json);
      });
  });
  },
}
