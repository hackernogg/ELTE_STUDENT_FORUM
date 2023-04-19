import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const LoginReg = (props) => {
  const [useridReg, setUseridReg] = useState("");
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [regStatus, setRegStatus] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userid, setUserid] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("loggedInUsername");
    const storedUserid = localStorage.getItem("loggedInUserid");

    

    if (storedLoginStatus && storedUsername && storedUserid) {
      setLoginStatus(storedUsername);
      setUsername(storedUsername);
      setUserid(storedUserid);
    }
    props.onChildData(loginStatus, username, userid);
  }, [loginStatus, username, userid, props]);

  const register = () => {
    if (!useridReg || !usernameReg || !passwordReg) {
      setRegStatus("Please enter userid, username and password.");
      return;
    }
    Axios.post("http://localhost:3001/register", {
      userid: useridReg,
      username: usernameReg,
      password: passwordReg
    }).then((response) => {
      if (response.data.message){
        setRegStatus(response.data.message);
      } else {
        setRegStatus("Successfully registered");
      }
      console.log(response);
    });
  };

  const login = () => {
    if (!userid || !password) {
      setLoginStatus("Please enter both userid and password.");
      return;
    }
    Axios.post("http://localhost:3001/login", {
      userid: userid,
      password: password
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus(response.data[0].user_name);
        setUserid(response.data[0].user_id);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("loggedInUsername", response.data[0].user_name);
        localStorage.setItem("loggedInUserid", response.data[0].user_id);
        props.onChildData(response.data[0].user_name, response.data[0].user_name, response.data[0].user_id); // Pass the user_id as the third argument
      }
    });
  };

  return (
    <div className='loginReg'>
      <h1>Welcome to ELTE student forum</h1>
      <div className='registration'>
        <h2>Registration</h2>
        <label>User ID</label>
        <input
          type="text"
          onChange={(e) => {
            setUseridReg(e.target.value);
          }}
        />
        <label>Username</label>
        <input
          type="text"
          onChange={(e) => {
            setUsernameReg(e.target.value);
          }}
        />
        <label>Password</label>
        <input
          type="text"
          onChange={(e) => {
            setPasswordReg(e.target.value);
          }}
        />
        <button onClick={register}> Register </button>
      </div>
      {regStatus && (
        <div>
          <h1>{regStatus}</h1>
        </div>
      )}

      <div className='login'>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="User ID..."
          onChange={(e) => {
            setUserid(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password..."
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button onClick={login}> Login </button>
      </div>
      {loginStatus && (
        <div>
          <h1>{loginStatus}</h1>
        </div>
      )}
    </div>
  );
};

export default LoginReg;