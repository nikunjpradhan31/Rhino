import React, { useState,useContext,useEffect  } from 'react';
import { Form, Button, InputGroup,Stack,Modal } from 'react-bootstrap';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import ErrorModal from './ErrorModal';
const AddUsersToChatModal = () => {
    const {user} = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const {findNewUser, newUserError, isNewUserLoading, otherUser,AddToChat,userChats,currentChat } = useContext(ChatContext);

    const handleInputChange = (e) => {
        setUsername(e.target.value);
      };
    const handleSearchClick2 = async (e) => {
        e.preventDefault();
        if (username.trim()) {
          await findNewUser(username);
          setUsername("");
        }
      };
      useEffect(() => {
        if (currentChat?._id && otherUser) {
            const isUserInChat = currentChat?.members.indexOf(otherUser?._id) !== -1;

            if (!isUserInChat) {
                AddToChat(currentChat?._id, otherUser?._id);
            }        }
    }, [otherUser, currentChat, AddToChat]);


    const [isPopupVisible, setPopupVisible] = useState(false);
    const UserModal = () => {
        setPopupVisible(!isPopupVisible);
    };
    return (      
    <>
    <strong style={{marginLeft: "auto", paddingRight:"2%"}} role="button" onClick={UserModal}>+</strong>
    <Modal show={isPopupVisible} onHide={UserModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add User to Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder={isNewUserLoading ? "Retrieving user..." : "Add User to Chat"}
                            value={username}
                            onChange={handleInputChange}
                        />
                        <Button variant="primary" onClick={handleSearchClick2}>
                            Add User
                        </Button>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={UserModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
    </>
);
}
 
export default AddUsersToChatModal;