// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, collection, getDocs, addDoc, setDoc,doc,query,where,getDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword,getAuth, signOut, signInWithEmailAndPassword,onAuthStateChanged, setPersistence} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyDCFS2QFhhuXk5yrYloknJKcBTs0xcd4nc",
  authDomain: "rhino-84f91.firebaseapp.com",
  projectId: "rhino-84f91",
  storageBucket: "rhino-84f91.appspot.com",
  messagingSenderId: "33811917307",
  appId: "1:33811917307:web:32a6e44d4e56648bdac35e",
  measurementId: "G-WW2SQ3MQYQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

if( document.body.id === "LoginPage"){
    const loginButton = document.querySelector('.login');
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
    
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        signInWithEmailAndPassword(auth, email, password)
            .then((cred) => {
                console.log('user logged in:', cred.user);
                window.location.assign('chat_history.html');
            })
            .catch((err) => {
                console.error('Error Signing In:', err.message);
            });
    });
}
if(document.body.id === "AccountPage"){
const addUserForm = document.querySelector('#create-account-form');
addUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value; // Assuming this is the correct ID for the username field

  try {
      const exists = await usernameExists(username);
      if (exists) {
          throw new Error('Username is already taken.');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user);
      const user = userCredential.user;
      user.displayName = username;
      //console.log(user.displayName)


      await setDoc(doc(db, "UserData", user.uid), {
          username: user.displayName,
          email: user.email,
          uid: user.uid
      });
      console.log("Username is unique, and new user has been added to Firestore");
      //const canTalkDocumentRef = doc(collection(db, "UserData", user.uid, "CanTalk"));
      //await setDoc(canTalkDocumentRef, {});
      window.location.assign('chat_history.html');

  } catch (error) {
      console.error("Error:", error.message);
      // Handle errors, such as showing a message to the user
  }
  function usernameExists(username) {
    const usersRef = collection(db, "UserData");
    const q = query(usersRef, where("username", "==", username));
    return getDocs(q).then((querySnapshot) => {
        return !querySnapshot.empty; // Returns true if username exists, false otherwise
    });
}
});
}
if (document.body.id === "ChatHistory") {
  onAuthStateChanged(auth, async (user) => {
    if (auth.currentUser) {
      console.log(user.uid);
      const canTalkRef = collection(db, "UserData", user.uid, "CanTalk");

      try {
        const querySnapshot = await getDocs(canTalkRef);
        if (!querySnapshot.empty) {
          console.log("Collection 'CanTalk' exists.");
          const references = querySnapshot.docs.map(doc => doc.data().respondto);
          fetchUsernamesFromRefs(references).then(results => {
            const sidebar = document.getElementById("sidebar");
            results.forEach(result => {
              const listItem = document.createElement("button");
              listItem.classList.add("ResultItem");
              listItem.textContent = result;
              sidebar.appendChild(listItem);
            });
          });
        } else {
          console.log("Collection 'CanTalk' does not exist.");
          // Collection does not exist
        }
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    } else {
      window.location.assign("chat_history.html");
    }
  });


  const fetchUsernamesFromRefs = async (refs) => {
    try {
      const docsFetchPromises = refs.map(ref => getDoc(ref)); // Create a promise for each doc fetch
      const docsSnapshots = await Promise.all(docsFetchPromises); // Wait for all fetches to complete
      
      const results = docsSnapshots.map(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data(); // Access the document data
          return data.username; // Assuming 'username' is the field you need
        } else {
          console.log("Referenced document does not exist.");
          return null; // Return null or some placeholder for non-existing documents
        }
      }).filter(username => username !== null); // Remove any null values if document didn't exist
      
      // 'results' now contains the usernames of all fetched documents
      return results;
    } catch (error) {
      console.error("Error fetching documents:", error);
      return []; // Return an empty array or handle the error as needed
    }
  };

}

// getDocs(colRef)
//    .then((snapshot) => {
//       let users = [];
//       snapshot.docs.forEach((doc) => {
//           users.push({...doc.data(), id: doc.id});
//       });
//       console.log(users);
//    }).catch((error) => {
//       console.error('Error fetching users: ', error);
//    });
  
//    const logoutButton = document.querySelector('.logout')
//    logoutButton.addEventListener('click', ()=> {

//    })
//    const loginButton = document.querySelector('.login')
//    logoutButton.addEventListener('click', ()=> {
    
//    })



// const StartChatButton = document.querySelector('.submit-people');
// StartChatButton.addEventListener('click', async (e) => {
//   e.preventDefault();
//   const username = document.getElementById('peoplesearch').value;
//   console.log(username)
//   const userDataRef = collection(db, "UserData");
//   const querySnapshot = await getDocs(query(userDataRef, where("username", "==", username)));
//   if (!querySnapshot.empty) {
//     querySnapshot.forEach(async (doc) => {
//       const otherID = doc.id;
//       const userData = doc.data().username;

//       const canTalkRef = collection(db, "UserData", user.uid, "CanTalk");
//       await addDoc(canTalkRef, { respondto: userData });
//       const canTalkRef2 = collection(db, "UserData", otherID, "CanTalk");
//       await addDoc(canTalkRef2, { respondto: myusername });
//   });
//   } else {
//     console.log("No user found with that username.");
//   }
// });