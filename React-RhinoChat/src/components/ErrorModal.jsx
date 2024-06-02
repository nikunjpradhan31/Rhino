import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
const ErrorModal = ({ show, onHide }) => {
    const { newUserError } = useContext(ChatContext);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
      <Modal.Title style={{ color: 'black' }}>{newUserError?.message}</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
