// src/components/DeleteConfirmationModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmationModal = ({ show, onHide, onConfirm, message }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận Xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;