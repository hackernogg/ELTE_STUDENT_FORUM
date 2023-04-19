import React from "react";
import { Link } from 'react-router-dom';

const Navbar = (props) => {
    const username = props.username;

    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInUsername");
        window.location.href = "/";
      };

    return (  
        <nav className="navbar">
            <h1>ELTE Student Forum</h1>
            <div className="links">
                <a className="type" href="/">Forum</a>
                <a className="type" href="/market">Market</a>
                <Link to="/createPost">
                    <button className="logout-button">+</button>
                </Link>
                <a href="/creat" className="username">{username}</a>
                <button className="logout-button" onClick={logout} >➮</button>
            </div>
        </nav>
    );
}
 
export default Navbar;