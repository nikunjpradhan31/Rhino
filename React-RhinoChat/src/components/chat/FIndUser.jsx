import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, InputGroup, Stack } from 'react-bootstrap';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { getRequest, baseUrl } from '../../utils/services';
const SearchOtherUsers = () => {
    const { user } = useContext(AuthContext);
    const {isNewUserLoading, createChat, userChats, allUsers } = useContext(ChatContext);

    const [SearchString, setUsername] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [FilteredUsersLoading, setFilteredUsersLoading] = useState("");
    const handleInputChange = (e) => {
        setUsername(e.target.value);
    };
    const handleSearchClick = async (e) => {
        e.preventDefault();
        if (selectedUsers.length > 0 && user) {
            const selectedUserIds = selectedUsers.map(user => user._id);
            const isExistingChat = userChats?.some(chat =>
                chat.members.length === selectedUsers.length + 1 &&
                chat.members.includes(user?._id) &&
                selectedUserIds.every(id => chat.members.includes(id))
            );
            if (!isExistingChat) {
                const members = [...selectedUserIds, user?._id];
                console.log(members);
                createChat(members);
            }
            setUsername("");
            setSelectedUsers([]);
        }
    };


    useEffect(() => {
        const getFilteredUsers = async () => {
            setFilteredUsersLoading(true);
            try {
                const response = await getRequest(`${baseUrl}/users/${SearchString}`);
                
                // Check for response error
                if (response.error) {
                    setFilteredUsers([]);
                } else {
                    // Filter users based on selectedUsers
                    const filtered = response.filter(user => 
                        !selectedUsers.some(Suser => Suser._id === user._id)
                    );
                    setFilteredUsers(filtered);
                }
            } catch (error) {
                setFilteredUsers([]);
            } finally {
                setFilteredUsersLoading(false);
            }
        };

        if (SearchString.trim()) {
            getFilteredUsers();
        } else {
            setFilteredUsers([]);
        }
    }, [SearchString, baseUrl, selectedUsers]);



    const handleUserSelect = (user) => {
        setSelectedUsers(prevSelectedUsers => 
            prevSelectedUsers.some(selectedUser => selectedUser._id === user._id)
                ? prevSelectedUsers
                : [...prevSelectedUsers, user]
        );        
        setUsername("");
        setFilteredUsers([]);

    };

    const handleUserRemove = (userId) => {
        setSelectedUsers(prevSelectedUsers =>
            prevSelectedUsers.filter(user => user._id !== userId)
        );
    };

    return (
        <Stack direction='horizontal'>
        <Stack direction= "horizontal">
            <InputGroup className="mb-3" style={{width: '30vh'}}>
                <Form.Control
                    type="text"
                    placeholder={isNewUserLoading ? "Retrieving user..." : "Search Users"}
                    value={SearchString}
                    onChange={handleInputChange}
                />
                <Button
                    variant="primary"
                    onClick={handleSearchClick}
                    disabled={selectedUsers.length === 0}
                >
                    Search
                </Button>
                {filteredUsers.length > 0 && (
                <ul className="list-group" style={{width: '30vh',zIndex: 10, position: 'absolute',top:"100%"}}>
                    {filteredUsers.map(user => (
                        <li
                            key={user._id}
                            className="list-group-item"
                            onClick={() => handleUserSelect(user)}
                            style={{ cursor: 'pointer' }}
                        >
                            {user.username}
                        </li>
                    ))}
                </ul>
            )}
            </InputGroup>
            </Stack>
            <Stack direction = "vertical" style={{flexDirection: 'row'}}>
                {selectedUsers.map(user => (
                    <div key={user._id} className="single-user" onClick={() => handleUserRemove(user._id)}
>
                        {user.username}
                    </div>
                ))}
            </Stack>

        </Stack>
    );
};

export default SearchOtherUsers;
