import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CreateAccountPage.css';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import app from './FireBaseConfig';  // Assuming Firebase is correctly configured in this file

function CreateAccountPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);

  async function usernameExists(username) {
    const usersRef = collection(db, "UserData");
    const q = query(usersRef, where("username", "==", username));
    return getDocs(q).then((querySnapshot) => {
      return !querySnapshot.empty; // Returns true if username exists, false otherwise
    });
  }

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    try {
      const exists = await usernameExists(username);
      if (exists) {
        throw new Error('Username is already taken.');
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "UserData", user.uid), {
        username: username,
        email: email,
        uid: user.uid
      });
      console.log("Username is unique, and new user has been added to Firestore");
      navigate('/chat');  // Adjust the path as needed
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div id="AccountPage" className="account-container">
      <h1>RhinoHat</h1>
      <h2>Create Account</h2>
      <form id="create-account-form" onSubmit={handleCreateAccount}>
        <input type="text" id="username" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" id="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" id="password" placeholder="Master Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button id="create-acc-button" className="button" type="submit">Create Account</button>
      </form>
      <div id="go-to-login">
        Already have an account? Log in <Link to="/">here</Link>
      </div>
    </div>
  );
}

export default CreateAccountPage;

