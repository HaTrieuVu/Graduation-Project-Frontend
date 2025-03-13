import React from 'react'
import { Button, Modal } from 'react-bootstrap';

import "./ModalDelete.scss"

const ModalDelete = ({ show, dataModal, handleCloseModalDelete, confirmDeleteUser }) => {
  return (
    <div className='modal-delete'>
      <Modal show={show} fullscreen="xl-down" centered={true} onHide={handleCloseModalDelete} className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Xác nhân xóa người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">Bạn có chắc muốn xóa người dùng: {dataModal.sHoTen}</Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <Button variant="secondary" onClick={handleCloseModalDelete}>
            Không!
          </Button>
          <Button variant="primary" onClick={confirmDeleteUser}>
            Có!
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

}

export default ModalDelete