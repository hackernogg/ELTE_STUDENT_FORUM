import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const LoginReg = (props) => {
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("loggedInUsername");

    if (storedLoginStatus && storedUsername) {
      setLoginStatus(storedUsername);
      setUsername(storedUsername);
    }

    props.onChildData(loginStatus, username);
  }, [loginStatus, username, props]);

  const register = () => {
    Axios.post("http://localhost:3001/register", {
      username: usernameReg,
      password: passwordReg
    }).then((response) => {
      console.log(response);
    });
  };

  const login = () => {
    if (!username || !password) {
      setLoginStatus("Please enter both username and password.");
      return;
    }
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus(response.data[0].user_name);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("loggedInUsername", response.data[0].user_name);
      }
    });
  };

  return (
    <div className='loginReg'>
      <h1>Welcome to ELTE student forum</h1>
      <div className='registration'>
        <h2>Registration</h2>
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

      <div className='login'>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Usename..."
          onChange={(e) => {
            setUsername(e.target.value);
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