import{Container, Nav, Navbar, Stack} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import logoRhino from "../assets/logo.png";

const NavBar  = () => {
    const {user, logoutUser} = useContext(AuthContext)

    return (  
<Navbar className='mb-4' 
    style={{ height: "7rem",
             background: "#060550"

    }}>
        <Container>
         <h3>
        <Link to = "/" className="link-light text-decoration-none">
            <img src = {logoRhino} alt="rhino" style = {{height: "7rem"}}/>
        </Link>
        </h3>   
        <span className = "text-warning">{user ? `Logged in as ${user.username}` : ""}</span>
        <Nav>
            <Stack direction="horizontal" gap={5}>
            {
    !user ? (
        <>
            <Link to="/login" className="link-light text-decoration-none">Login</Link>
            <Link to="/register" className="link-light text-decoration-none">Register</Link>
        </>
    ) : (
        <>
        {/* <Link  to="/settings" className="link-light text-decoration-none">
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="square" strokeLinejoin="round" strokeWidth="2" d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            </svg>
        </Link> */}

        <Link onClick={logoutUser} to="/login" className="link-light text-decoration-none">Logout</Link>
        </>
    )
}

            </Stack>
        </Nav>
        </Container>
    </Navbar>
    
    
    );
}
 
export default NavBar;