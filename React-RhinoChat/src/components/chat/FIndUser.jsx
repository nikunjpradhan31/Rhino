import React, { useState,useContext,useEffect  } from 'react';
import { Form, Button, InputGroup,Stack } from 'react-bootstrap';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import ErrorModal from '../ErrorModal';
const SearchOtherUsers = () => {
    const {user} = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const {findNewUser, newUserError, isNewUserLoading, otherUser,createChat,userChats,allUsers } = useContext(ChatContext);
    const [modalOpen, setModalOpen] = useState(false);  // State to manage modal visibility
    const [filteredUsers, setFilteredUsers] = useState([]);

    const handleInputChange = (e) => {
        setUsername(e.target.value);
      };
    const handleSearchClick = async (e) => {
        e.preventDefault();
        if (username.trim()) {
          await findNewUser(username);
          setUsername("");
        }
      };

      useEffect(() => {
        if (username.trim()) {
            const filtered = allUsers.filter(user =>
                user.username.toLowerCase().includes(username.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers([]);
        }
    }, [username, allUsers]);

    
      useEffect(() => {
        if (otherUser && user) {
            // const isExistingChat = userChats?.some(chat => 
            //     chat.members.indexOf(otherUser._id) !== -1
            // );
            const isExistingChat = userChats?.some(chat => 
                chat.members.length === 2 && 
                chat.members.includes(user._id) && 
                chat.members.includes(otherUser._id)
            );
            if (!isExistingChat) {
                createChat(user._id, otherUser._id);
            }        }
    }, [otherUser, user, createChat,userChats]);


    useEffect(() => {
        if (newUserError?.error) {
          setModalOpen(true);  // Assuming setModalOpen is defined; if not, define it similarly to newUserError
        }
      }, [newUserError]);
    
      const handleCloseModal = () => {
        setModalOpen(false);  // Function to close the modal and potentially clear errors if needed
    };

    return (      
    <>
            {newUserError?.error && (
                <ErrorModal show={modalOpen} onHide={handleCloseModal} />
            )}
        <InputGroup className="mb-3">
            <Form.Control
                type="text"
                placeholder={isNewUserLoading ? "Retrieving user..." : "Search Users"}
                value={username}
                onChange={handleInputChange}

            />
            <Button variant="primary" onClick={handleSearchClick} >
                Search
            </Button>
        </InputGroup>
        {filteredUsers.length > 0 && (
    <ul className="list-group">
        {filteredUsers.map(user => (
            <li
                key={user._id}
                className="list-group-item"
                onClick={() => setUsername(user.username)}
                style={{ cursor: 'pointer' }}
            >
                {user.username}
            </li>
        ))}
    </ul>
)}
    </>
);
}
 
export default SearchOtherUsers;