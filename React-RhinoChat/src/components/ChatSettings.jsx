import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, InputGroup, Stack, Modal } from 'react-bootstrap';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

const ChatSettings = () => {
    const {
        isNewUserLoading,
        AddToChat,
        currentChat,
        allUsers,
        changeChatTitle,
        deleteGroupChat,
        leaveGroupChat,
    } = useContext(ChatContext);
    const {user} = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [chat_title, setChatTitle] = useState("");


    //Adding a User
    const handleInputChangeAdd = (e) => {
        setUsername(e.target.value);
    };

    const handleSearchClickAdd = async (e) => {
        e.preventDefault();
        if (selectedUser && !currentChat?.members.includes(selectedUser._id)) {
            await AddToChat(currentChat._id, selectedUser._id);
            setUsername("");
            setSelectedUser(null);
        }
    };

    const handleUserSelectAdd = (user) => {
        setSelectedUser(user);
        setUsername("");
    };

    const handleUserRemoveAdd = () => {
        setSelectedUser(null);
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

    //

    //Modal Rendering
    const toggleUserModal = () => {
        setPopupVisible(!isPopupVisible);
    };
    //


    const handleInputChangeTitle = (e) => {
        setChatTitle(e.target.value);
    };
    const handleSearchClickTitle = async (e) => {
        e.preventDefault();

        if (currentChat?.is_group && user?._id === currentChat?.chatOwner) {

            changeChatTitle(currentChat,chat_title);
            //function to change a chat title
            //MAKE SURE ITS ONLY ALPHA NUMERIC
            setChatTitle("");
        }
    };

    const handleSearchClickDelete = async (e) => {
        e.preventDefault();
        if (currentChat?.is_group && user?._id === currentChat?.chatOwner) {
            deleteGroupChat(currentChat);
            setPopupVisible(false); 

        }
    };

    const handleSearchClickLeave = async (e) => {
        e.preventDefault();
        if(currentChat?.is_group && user?._id !== currentChat?.chatOwner){
            leaveGroupChat(currentChat);
            setPopupVisible(false);
        }
    };

    return (

        <>
        {currentChat?.is_group && (
            <>
            <strong style={{ marginLeft: "auto", paddingRight: "2%" }} role="button" onClick={toggleUserModal}>+</strong>
            <Modal show={isPopupVisible} onHide={toggleUserModal} className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Chat Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentChat?.chatOwner === user?._id ? (
                <Stack>
                <strong>Add User to Chat</strong>
                    <Stack direction="horizontal">
                        <Stack direction="horizontal">
                            <InputGroup className="mb-3" style={{ width: '30vh' }}>
                                <Form.Control
                                    type="text"
                                    placeholder={isNewUserLoading ? "Retrieving user..." : "Search Users"}
                                    value={username}
                                    onChange={handleInputChangeAdd}
                                />
                                <Button
                                    variant="primary"
                                    onClick={handleSearchClickAdd}
                                    disabled={!selectedUser}
                                >
                                    Add User
                                </Button>
                                {filteredUsers.length > 0 && (
                                    <ul className="list-group" style={{ width: '30vh', zIndex: 10, position: 'absolute', top: "100%" }}>
                                        {filteredUsers.map(user => (
                                            <li
                                                key={user._id}
                                                className="list-group-item"
                                                onClick={() => handleUserSelectAdd(user)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {user.username}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </InputGroup>
                        </Stack>
                        {selectedUser && (
                            <div className="single-user" onClick={handleUserRemoveAdd}>
                                {selectedUser.username}
                            </div>
                        )}
                    </Stack>
                <strong>Change Chat Title</strong>
                <Stack direction="horizontal">
                            <InputGroup className="mb-3" style={{ width: '35vh' }}>
                                <Form.Control
                                    type="text"
                                    placeholder= "Change Chat Title" 
                                    value={chat_title}
                                    onChange={handleInputChangeTitle}
                                />
                                <Button
                                    variant="primary"
                                    onClick={handleSearchClickTitle}
                                >
                                    Change Title
                                </Button>
                            </InputGroup>
                        </Stack>
                <strong>Delete Chat</strong>
                <Button
                variant="primary"
                onClick={handleSearchClickDelete}
                style={{ width: '15vh', background: "red", borderWidth: "0"}}
                >
                    Delete Chat
                </Button>
                </Stack>
                ):
                 (
                    <Stack>
                    <Button
                    variant="primary"
                    onClick={handleSearchClickLeave}
                    style={{ width: '15vh', background: "red", borderWidth: "0"}}
                    >
                        Leave Chat
                    </Button>
                    </Stack>
                 )}
                </Modal.Body>

            </Modal>
            </>
        )}
        </>
    );
};

export default ChatSettings;
