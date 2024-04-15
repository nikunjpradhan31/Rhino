import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import app from './FireBaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/chat');  // Redirect to chat page upon successful login
      })
      .catch((err) => {
        alert('Failed to login: ' + err.message);
      });
  };

  return (
    <div id="LoginPage">
      <h1>RhinoHat</h1>
      <div id="app">
        <div id="account-box" className="account-container">
          <h2 id="create-account-title">Log In</h2>
          <form id="create-account-form" onSubmit={handleLogin}>
            <input type="email" id="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" id="password" placeholder="Master Password" required value={password} onChange={e => setPassword(e.target.value)} />
            <button id="create-acc-button" className="login" type="submit">Log In</button>
          </form>
          <div id="go-to-login">
            Don't have an account? Sign up <Link to="/create-account">here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

