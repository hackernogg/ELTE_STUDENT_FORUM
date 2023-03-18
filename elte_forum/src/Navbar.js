const Navbar = (props) => {
    const username = props.username;
    return (  
        <nav className="navbar">
            <h1>ELTE Student Forum</h1>
            <div className="links">
                <a href="/">Forum</a>
                <a href="/market">Market</a>
                <a href="/creat" style={{
                    color:  "white",
                    backgroundColor: '#b235f1',
                    borderRadius: '8px'
                }}>{username}</a>
            </div>
        </nav>
    );
}
 
export default Navbar;