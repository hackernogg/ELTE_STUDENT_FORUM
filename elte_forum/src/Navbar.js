import React from "react";
import { Link } from 'react-router-dom';

const Navbar = (props) => {
    const username = props.username;

    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInUsername");
        window.location.reload();
      };

    return (  
        <nav className="navbar">
            <h1>ELTE Student Forum</h1>
            <div className="links">
                <a href="/">Forum</a>
                <a href="/market">Market</a>
                <Link to="/createPost">
                    <button className="logout-button">+</button>
                </Link>
                <a href="/creat" style={{
                    color:  "white",
                    backgroundColor: '#b235f1',
                    borderRadius: '8px'
                }}>{username}</a>
                <button className="logout-button" onClick={logout} >➮</button>
            </div>
        </nav>
    );
}
 
export default Navbar;