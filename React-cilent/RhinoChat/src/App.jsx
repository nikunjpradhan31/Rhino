import{Routes, Route, Navigate} from "react-router-dom"
import ChatPage from "./pages/Chat";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from "react-bootstrap";
import NavBar from "./components/Navbar";

function App() {
  return (
  <>
  <NavBar/>
  <Container>
  <Routes>
     <Route path = "/" element = {<ChatPage/>} /> 
     <Route path = "/register" element = {<RegisterPage/>} /> 
     <Route path = "/login" element = {<LoginPage/>} /> 
     <Route path = "*" element = {<Navigate to="/"/>} /> 

  </Routes>
  </Container>
  </>
  
  );
}

export default App
