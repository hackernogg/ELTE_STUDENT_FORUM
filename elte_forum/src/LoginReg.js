import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const LoginReg = (props) => {
  const [useridReg, setUseridReg] = useState("");
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [confirmPasswordReg, setConfirmPasswordReg] = useState("");
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
    props.onChildData(loginStatus, username);
  }, [loginStatus, username, userid, props]);

  const register = (e) => {
    e.preventDefault();
    if (!useridReg || !usernameReg || !passwordReg) {
      setRegStatus("Please enter userid, username and password.");
      return;
    }
    if (passwordReg !== confirmPasswordReg) {
      setRegStatus('Password and confirm password do not match');
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
    });
  };

  const login = (e) => {
    e.preventDefault();
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
        localStorage.setItem("isAdmin", false);
        localStorage.setItem("loggedInUsername", response.data[0].user_name);
        localStorage.setItem("loggedInUserid", response.data[0].user_id);
        props.onChildData(response.data[0].user_name, response.data[0].user_name, response.data[0].user_id); // Pass the user_id as the third argument
        // Check if the user is an admin
        Axios.get(`http://localhost:3001/admins/${userid}`)
          .then((adminResponse) => {
            if (adminResponse.data.length > 0){
              localStorage.setItem("isAdmin", true);
            }
          })
          .catch((error) => {
            console.error("Error checking admin status:", error);
        });
      }
    });
  };

  return (
    <div className='loginReg'>
      <h1>Welcome to ELTE student forum</h1>
      <div className='registration'>
        <h2>Registration</h2>
        <form onSubmit={(e) => register(e)}>
          <input
            type="text"
            required
            maxLength={21}
            placeholder="User ID..."
            onChange={(e) => {
              setUseridReg(e.target.value);
            }}
          />
          <input
            type="text"
            required
            maxLength={21}
            placeholder="User name..."
            onChange={(e) => {
              setUsernameReg(e.target.value);
            }}
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Password..."
            onChange={(e) => {
              setPasswordReg(e.target.value);
            }}
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Confirm Password..."
            onChange={(e) => {
              setConfirmPasswordReg(e.target.value);
            }}
          />
          <button type="submit"> Register </button>
        </form>
      </div>
      {regStatus && (
        <div className='error-msg'> 
          <h3>{regStatus}</h3>
        </div>
      )}

      <div className='login'>
        <h2>Login</h2>
        <form onSubmit={(e) => {login(e)}}>
          <input
            type="text"
            placeholder="User ID..."
            required
            onChange={(e) => {
              setUserid(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password..."
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button type="submit"> Login </button>
        </form>
      </div>
      {loginStatus && (
        <div className='error-msg'>
          <h3>{loginStatus}</h3>
        </div>
      )}
    </div>
  );
};

export default LoginReg;