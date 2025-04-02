import React, { useEffect, useState } from 'react'

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import "./ModalManageOrder.scss"

const ModalManageOrder = ({ show, handleCloseModal, action, dataModalOrder, fetchAllOrders }) => {

    const [orderStatus, setOrderStatus] = useState("")
    const [paymentStatus, setPaymentStatus] = useState("")

    useEffect(() => {
        if (show === false) {
            setOrderStatus("")
            setPaymentStatus("")
        }
    }, [show])

    const handleConfirm = async () => {
        if (orderStatus !== "" || paymentStatus !== "") {
            let data = {
                orderId: dataModalOrder?.PK_iDonMuaHangID,
                orderStatus,
                paymentStatus,
                orderDetails: dataModalOrder?.orderDetails
            }

            console.log(data)

            let res = await axios.put('/api/v1/manage-order/update', data)

            if (res?.errorCode === 0) {
                handleCloseModal()
                toast.success("Cập nhật trạng thái đơn hàng thành công!")
                await fetchAllOrders()
            }

        } else {
            toast.info("Hãy chọn trạng thái cập nhật!")
        }
    }

    const handleChangeSelect = (e, status) => {
        if (status === "orderStatus") {
            setOrderStatus(e.target.value)
        } else {
            setPaymentStatus(e.target.value)
        }
    }

    return (
        <Modal
            size="xl"
            show={show}
            className="custom-modal"
            onHide={handleCloseModal}
        >
            <Modal.Header closeButton className="custom-modal-header">
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === "CREATE" ? <span>Thêm mới Danh mục sản phẩm</span> : <span>Cập nhật trạng thái đơn mua hàng</span>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <div className='content-body'>
                    <div className='row'>
                        <div className='col-12 col-sm-12 mb-3 form-group'>
                            <label>Trạng thái đơn hàng (<span className='red'>*</span>)</label>
                            <select value={orderStatus} onChange={(e) => handleChangeSelect(e, "orderStatus")} className='form-select'>
                                <option>Chọn</option>
                                <option value="Xác nhận">Xác nhận</option>
                                <option value="Đang giao hàng">Đang giao hàng</option>
                                <option value="Giao hàng thành công">Giao hàng thành công</option>
                                <option value="Đã hủy">Đã hủy</option>
                            </select>
                        </div>
                        <div className='col-12 col-sm-12 mb-3 form-group'>
                            <label>Trạng thái thanh toán (<span className='red'>*</span>)</label>
                            <select value={paymentStatus} onChange={(e) => handleChangeSelect(e, "paymentStatus")} className='form-select'>
                                <option>Chọn</option>
                                <option value="Đã thanh toán">Đã thanh toán</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant='secondary' onClick={handleCloseModal}>Hủy</Button>
                <Button variant='primary' onClick={() => handleConfirm()}>{action === "CREATE" ? "Thêm mới" : "Cập nhật"}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalManageOrder