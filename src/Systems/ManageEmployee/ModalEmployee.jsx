import React, { useEffect, useState } from 'react'

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

import "./ModalEmployee.scss"

const ModalEmployee = ({ action, show, handleCloseModal, dataModalEmployee, fetchAllEmployee }) => {

    const [employeeData, setEmployeeData] = useState({
        id: "",
        email: '',
        phoneNumber: '',
        fullName: '',
        password: '',
        address: '',
        role: ""
    });

    useEffect(() => {
        if (action === "CREATE") {
            setEmployeeData({
                id: "",
                email: '',
                phoneNumber: '',
                fullName: '',
                password: '',
                address: '',
                role: ""
            })
        }
    }, [action])


    useEffect(() => {
        if (action === "UPDATE") {
            setEmployeeData({
                id: dataModalEmployee.PK_iNhanVienID,
                email: dataModalEmployee.sEmail,
                phoneNumber: dataModalEmployee.sSoDienThoai,
                fullName: dataModalEmployee.sHoTen,
                password: "",
                address: dataModalEmployee.sDiaChi,
                role: dataModalEmployee.role.PK_iQuyenHanID
            })
        }
    }, [dataModalEmployee])

    const handleOnchangeInput = (value, name) => {
        setEmployeeData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleChangeSelect = (e) => {
        setEmployeeData(prev => ({
            ...prev,
            role: e.target.value
        }))
    }

    const checkValidateInput = () => {
        if (action === "UPDATE") {
            let arr = [
                {
                    key: "fullName",
                    valueErr: "Họ tên"
                }, {
                    key: "address",
                    valueErr: "Địa chỉ"
                }, {
                    key: "role",
                    valueErr: "Quyền hạn"
                },
            ]
            let check = true
            for (let i = 0; i < arr.length; i++) {
                let { key, valueErr } = arr[i];

                if (!employeeData[key]) {
                    toast.error(`${valueErr} không được để trống!`);
                    check = false
                    break;
                }
            }
            return check
        }
        if (action === "CREATE") {
            const regexEmail = /\S+@\S+\.\S+/;
            const regexPhoneNumber = /^(84|0[3|5|7|8|9])+([0-9]{8})$/;
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
                    key: "fullName",
                    valueErr: "Họ tên"
                }, {
                    key: "password",
                    valueErr: "Mật khẩu"
                }, {
                    key: "address",
                    valueErr: "Địa chỉ"
                }, {
                    key: "role",
                    valueErr: "Quyền hạn"
                },
            ]
            let check = true
            for (let i = 0; i < arr.length; i++) {
                let { key, valueErr, regex, regexErr } = arr[i];

                if (!employeeData[key]) {
                    toast.error(`${valueErr} không được để trống!`);
                    check = false
                    break;
                }

                // Kiểm tra regex nếu có
                if (regex && !regex.test(employeeData[key])) {
                    toast.error(regexErr);
                    check = false;
                    break;
                }
            }
            return check
        }
    }

    console.log(employeeData)

    //hàm thêm mới hoặc sửa employee
    const handleConfirmUser = async () => {
        let checkValid = checkValidateInput()

        console.log(employeeData)

        if (checkValid) {
            let response = action === "CREATE" ?
                await axios.post("/api/v1/employee/create", employeeData)
                :
                await axios.put("/api/v1/employee/update", employeeData)
            if (response?.errorCode === 0) {
                action === "CREATE" ? toast.success("Thêm mới nhân viên thành công!") : toast.success("Câp nhật thông tin nhân viên thành công!")
                await fetchAllEmployee();
                handleCloseModal()
                setEmployeeData({
                    id: "",
                    email: '',
                    phoneNumber: '',
                    fullName: '',
                    password: '',
                    address: '',
                    role: ""
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
                    {action === "CREATE" ? <span>Thêm mới Nhân viên</span> : <span>Sửa Nhân viên</span>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <div className='content-body'>
                    <div className='row'>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Email (<span className='red'>*</span>)</label>
                            <input
                                className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "email")}
                                value={employeeData.email}
                                type="email"
                            />

                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Số điện thoại (<span className='red'>*</span>)</label>
                            <input
                                className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "phoneNumber")}
                                value={employeeData.phoneNumber}
                                type="text"
                            />
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Họ tên (<span className='red'>*</span>)</label>
                            <input
                                className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "fullName")}
                                value={employeeData.fullName}
                                type="text"
                            />
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Mật khẩu (<span className='red'>*</span>)</label>
                            <input
                                className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "password")}
                                value={employeeData.password}
                                type="password"
                            />
                        </div>
                        <div className='col-12 form-group mb-3'>
                            <label>Địa chỉ (<span className='red'>*</span>)</label>
                            <input className='form-control' onChange={(e) => handleOnchangeInput(e.target.value, "address")} value={employeeData.address} type="text" />
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Role (<span className='red'>*</span>)</label>
                            <select value={employeeData.role} onChange={(e) => handleChangeSelect(e)} className='form-select'>
                                <option value="1">Quản trị viên</option>
                                <option value="2">Nhân viên</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant='secondary' onClick={handleCloseModal}>Hủy</Button>
                <Button variant='primary' onClick={() => handleConfirmUser()}>{action === "CREATE" ? "Thêm mới" : "Cập nhật"}</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalEmployee
