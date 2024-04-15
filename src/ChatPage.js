import React, { useEffect, useState } from 'react';
import './ChatPage.css';
import app from './FireBaseConfig';
import { getFirestore, collection, getDocs, addDoc, setDoc,doc,query,where,getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword,getAuth, signOut, signInWithEmailAndPassword,onAuthStateChanged, setPersistence } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function ChatPage() {
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  const [usernames, setUsernames] = useState([]);
  const [searchuser, FindUser] = useState('');
  
  const handleStartChat = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log(searchuser);
    const userDataRef = collection(db, "UserData");
    const userQuery = query(userDataRef, where("username", "==", searchuser));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (doy) => {
      establishCanTalkRelationship(auth.currentUser.uid, doy.id);

        // Navigate to chat page or update UI upon successful chat initialization
        navigate('/chat');
      });
    } else {
      console.log("No user found with that username.");
    }
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user.uid);
        const canTalkRef = collection(db, "UserData", user.uid, "CanTalk");

        try {
          const querySnapshot = await getDocs(canTalkRef);
          if (!querySnapshot.empty) {
            console.log("Collection 'CanTalk' exists.");
            const references = querySnapshot.docs.map(doc => doc.data().respondto);
            fetchUsernamesFromRefs(references).then(results => {
              setUsernames(results);
            });
          } else {
            console.log("Collection 'CanTalk' does not exist.");
          }
        } catch (error) {
          console.error("Error getting documents: ", error);
        }
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe(); // Cleanup the subscription on component unmount
  }, []);

  const fetchUsernamesFromRefs = async (refs) => {
    try {
      const docsFetchPromises = refs.map(ref => getDoc(ref));
      const docsSnapshots = await Promise.all(docsFetchPromises);
      const results = docsSnapshots.map(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          return data.username;
        } else {
          console.log("Referenced document does not exist.");
          return null;
        }
      }).filter(username => username !== null);
      return results;
    } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
  };

  async function establishCanTalkRelationship(currentUserUid, otherUserUid) {
    try {
      // Document references for both users
      const currentUserRef = doc(db, "UserData", currentUserUid);
      const otherUserRef = doc(db, "UserData", otherUserUid);
      const canTalkRef = doc(collection(db, "UserData", currentUserUid, "CanTalk"), otherUserUid);
      await setDoc(canTalkRef, { respondto: otherUserRef });
      const canTalkRef2 = doc(collection(db, "UserData", otherUserUid, "CanTalk"), currentUserUid);
      await setDoc(canTalkRef2, { respondto: currentUserRef });
  
  
      console.log("CanTalk relationships established successfully.");
    } catch (e) {
      console.error("Error establishing CanTalk relationships:", e);
    }
  }
  

  return (
    <div id="ChatHistory">
      <div id="topnav">
        <a href="./settings.html">Settings</a>
        <a href="./login.html">Logout</a>
        <h2 id="title" style={{ paddingLeft: '195px' }}>RhinoHat</h2>
      </div>

      <div id="sidebar">
      <h2 style={{ textAlign: 'center', color: 'aliceblue' }}><u>Find User</u></h2>
        <div>
        <form onSubmit={handleStartChat}>
          <input
            type="text"
            id="peoplesearch"
            placeholder="Find people . . ."
            value={searchuser}
            onChange={(e) => FindUser(e.target.value)}
          />
          <button type="submit" className="peoplesearch">Start Chat</button>
        </form>
        </div>
        <h2 style={{ textAlign: 'center', color: 'aliceblue' }}><u>Existing Chats</u></h2>
        <div id="existing-chats">
          {usernames.map(username => (
            <button key={username} className="ResultItem">{username}</button>
          ))}
        </div>
      </div>


      <div id="results">
        {/* This area will be populated with search results */}
      </div>
    </div>
  );
}

export default ChatPage;
