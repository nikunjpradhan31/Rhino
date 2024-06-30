import{Routes, Route, Navigate} from "react-router-dom"
import ChatPage from "./pages/Chat";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from "react-bootstrap";
import NavBar from "./components/Navbar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import BottomBar from "./components/BottomBar";
function App() {
  
  const {user} = useContext(AuthContext);
  return (
  <ChatContextProvider user={user}>
  <NavBar/>

  <Container>
  <Routes>
     <Route path = "/" element = {user ? <ChatPage/> : <LoginPage/>} /> 
     <Route path = "/register" element = {user ? <ChatPage/> : <RegisterPage/>} /> 
     <Route path = "/login" element = {user ? <ChatPage/>: <LoginPage/>} /> 
     <Route path = "*" element = {<Navigate to="/"/>} /> 

  </Routes>

  </Container>
  <BottomBar/>

  </ChatContextProvider>
  );
}

export default App
