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
        <Link onClick={logoutUser} to="/login" className="link-light text-decoration-none">Logout</Link>
    )
}

            </Stack>
        </Nav>
        </Container>
    </Navbar>
    
    
    );
}
 
export default NavBar;