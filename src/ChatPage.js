import React from 'react';
import './ChatPage.css'

function ChatPage() {
  return (
    <body id="ChatHistory">
      <div id="topnav">
        <a href="./settings.html">Settings</a>
        <a href="./login.html">Logout</a>
        <h2 id="title" style={{ paddingLeft: '195px' }}>RhinoHat</h2>
      </div>

      <div id="sidebar">
        <h2 style={{ textAlign: 'center', color: 'aliceblue' }}><u>Existing Chats</u></h2>
        <div id="existing-chats"></div>
      </div>

      <div id="sidebar-right">
        <h2 style={{ textAlign: 'center', color: 'aliceblue' }}><u>Find User</u></h2>
        <div>
          <input type="text" id="search" placeholder="Find people . . ." />
          <button type="submit" className="peoplesearch">Start Chat</button>
        </div>

        <div id="searchResults"></div>
      </div>

      <div id="results">
        {/* This area will be populated with search results */}
      </div>
    </body>
  );
}

export default ChatPage;
