import React from 'react'
import { Button, Modal } from 'react-bootstrap';

import "./ModalDelete.scss"

const ModalDelete = ({ show, title, name, handleCloseModalDelete, confirmDelete }) => {
  return (
    <div className='modal-delete'>
      <Modal show={show} fullscreen="xl-down" centered={true} onHide={handleCloseModalDelete} className="custom-modal-delete">
        <Modal.Header closeButton className="custom-modal-delete-header">
          <Modal.Title>Xác nhân xóa {title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-delete-body">Bạn có chắc muốn xóa {title}: <span className="red">{name}</span> </Modal.Body>
        <Modal.Footer className="custom-modal-delete-footer">
          <Button variant="secondary" onClick={handleCloseModalDelete}>
            Hủy!
          </Button>
          <Button variant="primary" onClick={confirmDelete}>
            Xác nhận!
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

}

export default ModalDelete