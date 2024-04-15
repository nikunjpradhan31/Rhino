import React from 'react';
import LoginPage from './LoginPage';
import CreateAccountPage from './CreateAccountPage'; 
import ChatPage from './ChatPage'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
}


export default App;
