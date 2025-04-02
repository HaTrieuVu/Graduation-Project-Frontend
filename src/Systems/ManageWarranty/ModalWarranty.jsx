import React, { useEffect, useState } from 'react'

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

import "./ModalWarranty.scss"

const ModalWarranty = ({ action, show, handleCloseModal, dataModalWarranty, fetchAllWarranty }) => {

    const [warrantyData, setWarrantyData] = useState({
        id: "",
        status: '',
        createDate: '',
        endDate: '',
        description: '',
    });

    useEffect(() => {
        if (action === "CREATE") {
            setWarrantyData({
                id: "",
                status: '',
                createDate: '',
                endDate: '',
                description: '',
            })
        }
    }, [action])


    useEffect(() => {
        if (action === "UPDATE") {
            setWarrantyData({
                id: dataModalWarranty.PK_iPhieuBaoHanhID,
                status: dataModalWarranty.sTrangThaiXuLy,
                createDate: dataModalWarranty.dNgayLap,
                endDate: dataModalWarranty.dNgayKetThucBaoHanh,
                description: dataModalWarranty.sMota,
            })
        }
    }, [dataModalWarranty])

    const handleOnchangeInput = (value, name) => {
        setWarrantyData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleConfirmWarranty = async () => {
        const response = await axios.put("/api/v1/manage-warranty/update", warrantyData)

        if (response?.errorCode === 0) {
            await fetchAllWarranty();
            handleCloseModal()
            toast.success(response?.errorMessage)
            setWarrantyData({
                id: "",
                status: '',
                createDate: '',
                endDate: '',
                description: '',
            })
        }
        console.log(warrantyData)
    }

    return (
        <Modal
            size="xl"
            show={show}
            className="custom-modal-warranty"
            onHide={handleCloseModal}
        >
            <Modal.Header closeButton className="custom-modal-warranty-header">
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === "CREATE" ? <span>Thêm mới Phiếu bảo hành</span> : <span>Cập nhật Phiếu bảo hành</span>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-warranty-body">
                <div className='content-body'>
                    <div className='row'>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Trạng thái (<span className='red'>*</span>)</label>
                            <select value={warrantyData.status} onChange={(e) => handleOnchangeInput(e.target.value, "status")} className='form-select'>
                                <option>Chọn</option>
                                <option value="Đang bảo hành">Đang bảo hành</option>
                                <option value="Hết bảo hành">Hết bảo hành</option>
                            </select>
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Ngày lập (<span className='red'>*</span>)</label>
                            <input
                                className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "createDate")}
                                value={warrantyData.createDate ? warrantyData.createDate.split("T")[0] : ""}
                                type="date"
                            />
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Ngày kết thúc (<span className='red'>*</span>)</label>
                            <input
                                className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "endDate")}
                                value={warrantyData.endDate ? warrantyData.endDate.split("T")[0] : ""}
                                type="date"
                            />
                        </div>
                        <div className='col-12 form-group mb-3'>
                            <label>
                                Mô tả (<span className='red'>*</span>)
                            </label>
                            <textarea
                                className="form-control box-description"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'description')}
                                value={warrantyData.description}
                                rows={3}
                                cols={50}
                            >
                            </textarea>
                        </div>

                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="custom-modal-warranty-footer">
                <Button variant='secondary' onClick={handleCloseModal}>Hủy</Button>
                <Button variant='primary' onClick={() => handleConfirmWarranty()}>{action === "CREATE" ? "Thêm mới" : "Cập nhật"}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalWarranty