import React, { useState } from 'react';
import Axios from 'axios';

const Settings = () =>{

    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const storedUserName = localStorage.getItem("loggedInUsername");
    const storedUserid = localStorage.getItem("loggedInUserid");
    const [errorMsg, setErrorMsg] = useState('');

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if ( !username ) {
            setErrorMsg('All fields must be filled in');
            return;
          }
        Axios.post("http://localhost:3001/changeName", {
          userid: storedUserid,
          username: username,
        })
          .then((response) => {
            if (response.data.message) {
              localStorage.setItem("loggedInUsername",username);
              window.location.reload();
            } else {
              // ...
            }
          })
          .catch((error) => {
            setErrorMsg('Error updating username:', error);
          });
      };

      const handlePWDSubmit = (e) => {
        e.preventDefault();
      
        // Validate input values and handle errors
        if (!currentPassword || !newPassword || !confirmPassword) {
          setErrorMsg('All fields must be filled in');
          return;
        }
      
        if (newPassword !== confirmPassword) {
          setErrorMsg('New password and confirm password do not match');
          return;
        }
      
        // Verify the user's current password and update it with the new password
        Axios.post("http://localhost:3001/verifyAndUpdatePassword", {
          userid: storedUserid,
          currentPassword: currentPassword,
          newPassword: newPassword,
        })
          .then((response) => {
            if (response.data.message) {
                if (response.data.message ==='Password updated successfully'){
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("loggedInUsername");
                    localStorage.removeItem("isAdmin");
                    window.location.href = "/";
                } else{
                  setErrorMsg(response.data.message);
                }
            }
          })
          .catch((error) => {
            setErrorMsg('Error updating password:', error);
          });
      };

    return (
        <div>
        <h2>Settings</h2>
        <form onSubmit={handleNameSubmit}>
            <div>
                <input
                    id="username"
                    type="text"
                    required
                    maxLength={21}
                    placeholder={storedUserName}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <button type="submit" className='setting-button'>Change Username</button>
        </form>
        <form onSubmit={handlePWDSubmit}>
            <div>
            <input
                id="currentPassword"
                type="password"
                placeholder="Current Password..."
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            </div>
            <div>
            <input
                id="newPassword"
                type="password"
                placeholder="New Password..."
                required
                value={newPassword}
                minLength={8}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            </div>
            <div>
            <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm New Password..."
                required
                value={confirmPassword}
                minLength={8}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            </div>
            <button type="submit" className='setting-button'>Change Password</button>
        </form>
        {errorMsg && (
        <div className='error-msg'>
          <h3>{errorMsg}</h3>
        </div>
      )}
        </div>
    );
}

export default Settings;