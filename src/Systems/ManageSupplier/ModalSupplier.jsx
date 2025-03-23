import React, { useEffect, useState } from 'react'

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

import "./ModalSupplier.scss"

const ModalSupplier = ({ action, show, handleCloseModal, dataModalSupplier, fetchAllSupplier }) => {

    const [supplierData, setSupplierData] = useState({
        id: "",
        email: '',
        phoneNumber: '',
        nameSupplier: '',
        address: '',
    });

    useEffect(() => {
        if (action === "CREATE") {
            setSupplierData({
                id: "",
                email: '',
                phoneNumber: '',
                nameSupplier: '',
                address: '',
            })
        }
    }, [action])


    useEffect(() => {
        if (action === "UPDATE") {
            setSupplierData({
                id: dataModalSupplier.PK_iNhaCungCapID,
                email: dataModalSupplier.sEmail,
                phoneNumber: dataModalSupplier.sSoDienThoai,
                nameSupplier: dataModalSupplier.sTenNhaCungCap,
                address: dataModalSupplier.sDiaChi,
            })
        }
    }, [dataModalSupplier])

    const handleOnchangeInput = (value, name) => {
        setSupplierData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    console.log(supplierData)

    const checkValidateInput = () => {
        const regexEmail = /\S+@\S+\.\S+/;
        const regexPhoneNumber = /^(84|0[3|5|7|8|9])+([0-9]{8})$|^(1900|1800)[0-9]{4}$/;
        let arr = [
            {
                key: "email",
                valueErr: "Email",
                regex: regexEmail,
                regexErr: "Email không hợp lệ!"
            },
            {
                key: "phoneNumber",
                valueErr: "Số điện thoại",
                regex: regexPhoneNumber,
                regexErr: "Số điện thoại không hợp lệ!"
            }, {
                key: "nameSupplier",
                valueErr: "Tên ncc"
            }, {
                key: "address",
                valueErr: "Địa chỉ ncc"
            },
        ]
        let check = true
        for (let i = 0; i < arr.length; i++) {
            let { key, valueErr, regex, regexErr } = arr[i];

            if (!supplierData[key]) {
                toast.error(`${valueErr} không được để trống!`);
                check = false
                break;
            }

            // Kiểm tra regex nếu có
            if (regex && !regex.test(supplierData[key])) {
                toast.error(regexErr);
                check = false;
                break;
            }
        }
        return check
    }

    //hàm thêm mới hoặc sửa ncc
    const handleConfirmUser = async () => {
        let checkValid = checkValidateInput()

        if (checkValid) {
            let response = action === "CREATE" ?
                await axios.post("/api/v1/manage-supplier/create", supplierData)
                :
                await axios.put("/api/v1/manage-supplier/update", supplierData)
            if (response?.errorCode === 0) {
                action === "CREATE" ? toast.success("Thêm mới Nhà cung cấp thành công!") : toast.success("Câp nhật thông tin Nhà cung cấp thành công!")
                await fetchAllSupplier();
                handleCloseModal()
                setSupplierData({
                    id: "",
                    email: '',
                    phoneNumber: '',
                    nameSupplier: '',
                    address: '',
                })
            } else {
                toast.error(response?.errorMessage)
            }
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
                    {action === "CREATE" ? <span>Thêm mới Nhà cung cấp</span> : <span>Sửa Nhà cung cấp</span>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <div className='content-body'>
                    <div className='row'>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Email ncc (<span className='red'>*</span>)</label>
                            <input
                                className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "email")}
                                value={supplierData.email}
                                type="email"
                            // readOnly={action === "UPDATE"}
                            />

                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Số điện thoại ncc (<span className='red'>*</span>)</label>
                            <input
                                className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "phoneNumber")}
                                value={supplierData.phoneNumber}
                                type="text"
                            // readOnly={action === "UPDATE"}
                            />
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Tên nhà cung cấp (<span className='red'>*</span>)</label>
                            <input
                                className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "nameSupplier")}
                                value={supplierData.nameSupplier}
                                type="text"
                            />
                        </div>
                        <div className='col-12 form-group mb-3'>
                            <label>Địa chỉ ncc (<span className='red'>*</span>)</label>
                            <input className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "address")}
                                value={supplierData.address}
                                type="text"
                            />
                        </div>

                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant='secondary' onClick={handleCloseModal}>Hủy</Button>
                <Button variant='primary' onClick={() => handleConfirmUser()}>{action === "CREATE" ? "Thêm mới" : "Cập nhật"}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalSupplier