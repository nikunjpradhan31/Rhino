import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, InputGroup, Stack, Modal } from 'react-bootstrap';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import Select from 'react-select'; 

const ChatSettings = () => {
    const {
        isNewUserLoading,
        AddToChat,
        currentChat,
        allUsers,
        changeChatTitle,
        deleteGroupChat,
        leaveGroupChat,
        filteredUsersAdd,
        selectedUser,
        FilteredUsersAddLoading,
        SearchForUsersToAdd,
        setSelectedUser,
        setFilteredUsersAdd,
    } = useContext(ChatContext);
    const {user} = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [chat_title, setChatTitle] = useState("");

    // Adding a User
    const handleInputChangeAdd = (inputValue) => {
        setUsername(inputValue); 
        SearchForUsersToAdd(inputValue); 
    };

    const handleSearchClickAdd = async (e) => {
        e.preventDefault();
        if (selectedUser && !currentChat?.members.includes(selectedUser.value)) {
            await AddToChat(currentChat._id, selectedUser.value);
            setUsername("");
            setSelectedUser(null);
        }
    };

    const handleUserSelectAdd = (user) => {
        setSelectedUser(user); // user is now a single object { value: user._id, label: user.username }
        setUsername("");
    };

    const getOptionsFromUsers = (users) => {
        return users?.length > 0
            ? users.map(user => ({
                  value: user._id, // Adjusted to map to user._id instead of user object
                  label: user.username,
              }))
            : [];
    };

    // Modal Rendering
    const toggleUserModal = () => {
        setPopupVisible(!isPopupVisible);
        if(!isPopupVisible){
            setSelectedUser(null);
        }
    };

    const handleInputChangeTitle = (e) => {
        setChatTitle(e.target.value);
    };

    const handleSearchClickTitle = async (e) => {
        e.preventDefault();
        if (currentChat?.is_group && user?._id === currentChat?.chatOwner) {
            changeChatTitle(currentChat, chat_title);
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
                                        <Stack direction='horizontal' style={{ width: '30vh', justifyContent: 'flex-start' }}>
                                            <div style={{ flex: '1' }}>
                                                <Select
                                                    options={getOptionsFromUsers(filteredUsersAdd)} // Display the filtered users as options
                                                    onChange={handleUserSelectAdd} // Updated for single select
                                                    onInputChange={handleInputChangeAdd}
                                                    value={selectedUser} // Display the selected user
                                                    isLoading={isNewUserLoading} // Shows loading spinner if users are being fetched
                                                    placeholder="Search Users..."
                                                    noOptionsMessage={() => isNewUserLoading ? "Retrieving user..." : "No users found"}
                                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }} 
                                                    styles={{
                                                        control: (provided) => ({
                                                            ...provided,
                                                            border: '1px solid #ced4da',
                                                            borderRadius: '0.375rem',
                                                            minHeight: '38px',
                                                            display: 'flex',
                                                        }),
                                                        option: (provided) => ({
                                                            ...provided,
                                                            color: 'black', // Set the text color of filtered users to black
                                                        }),
                                                    }}
                                                />
                                            </div>
                                            <Button
                                                variant="primary"
                                                onClick={handleSearchClickAdd}
                                                disabled={!selectedUser}
                                                className="ms-2"
                                                style={{ whiteSpace: 'nowrap' }}
                                            >
                                                Add to Chat
                                            </Button>
                                        </Stack>
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
                            ) : (
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
