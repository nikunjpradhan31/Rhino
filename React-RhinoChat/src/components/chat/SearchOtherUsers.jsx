import React, { useState, useContext, useEffect } from 'react';
import Select from 'react-select'; 
import { Button, Stack } from 'react-bootstrap';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const SearchOtherUsers = () => {
    const { user } = useContext(AuthContext);
    const { isNewUserLoading, createChat, userChats, filteredUsers, selectedUsers, FilteredUsersLoading, SearchForUsers, setSelectedUsers, setFilteredUsers } = useContext(ChatContext);
    const [SearchString, setUsername] = useState("");

    const handleSearchChange = (inputValue) => {
        setUsername(inputValue);
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
                createChat(members);
            }
            setUsername("");
            setSelectedUsers([]);
        }
    };

    useEffect(() => {
        SearchForUsers(SearchString);
    }, [SearchString]);

    const handleUserSelect = (selectedOptions) => {
        setSelectedUsers(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const getOptionsFromUsers = (users) => {
        return users.map(user => ({
            value: user,
            label: user.username
        }));
    };

    return (
        <Stack direction='horizontal' style={{ width: '30vh', justifyContent: 'flex-start' }}>
            <div style={{ flex: '1' }}>
                <Select
                    isMulti
                    options={getOptionsFromUsers(filteredUsers)} // Display the filtered users as options
                    onChange={handleUserSelect}
                    onInputChange={handleSearchChange}
                    value={getOptionsFromUsers(selectedUsers)} // Display the selected users as tags
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
                        multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: '#007bff',
                            color: '#fff',
                        }),
                        multiValueLabel: (provided) => ({
                            ...provided,
                            color: '#fff',
                        }),
                        multiValueRemove: (provided) => ({
                            ...provided,
                            color: '#fff',
                            cursor: 'pointer',
                            ':hover': {
                                backgroundColor: '#0056b3',
                                color: 'white',
                            },
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
                onClick={handleSearchClick}
                disabled={selectedUsers.length === 0}
                className="ms-2"
                style={{ whiteSpace: 'nowrap' }}
            >
                Create Chat
            </Button>
        </Stack>
    );
};

export default SearchOtherUsers;
