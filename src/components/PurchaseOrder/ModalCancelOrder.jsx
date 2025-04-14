import React from 'react'

import { Button, Modal } from 'react-bootstrap';
import "./ModalCancelOrder.scss"

const ModalCancelOrder = ({ show, orderId, handleCloseModalCancel, confirmCancelOrder }) => {
    return (
        <Modal show={show} onHide={handleCloseModalCancel} className="custom-modal-cancel-order">
            <Modal.Header closeButton className="custom-modal-cancel-order-header">
                <Modal.Title>Xác nhân hủy</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-cancel-order-body">Bạn có chắc muốn hủy đơn hàng: <span className="red">#1111{orderId}</span> </Modal.Body>
            <Modal.Footer className="custom-modal-cancel-order-footer">
                <Button variant="secondary" onClick={handleCloseModalCancel}>
                    Hủy!
                </Button>
                <Button variant="primary" onClick={confirmCancelOrder}>
                    Xác nhận!
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalCancelOrder