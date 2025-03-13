import React, { useEffect, useState } from 'react'

import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

import "./ModalUser.scss"

const ModalUser = ({ title, show, handleCloseModal }) => {
    const [listRole, setListRole] = useState([])

    const [userData, setUserData] = useState({
        email: '',
        phoneNumber: '',
        fullName: '',
        password: '',
        address: '',
        role: ""
    });

    useEffect(() => {
        fetchGetRole()
    }, [])

    const fetchGetRole = async () => {
        let respone = await axios.get("/manage-role/get-all")

        if (respone?.data?.errorCode === 0 && respone?.data?.data?.length > 0) {
            setListRole(respone?.data?.data)
        }
    }

    const handleOnchangeInput = (value, name) => {
        setUserData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleChangeSelect = (e) => {
        console.log(e.target.value)
        setUserData(prev => ({
            ...prev,
            role: e.target.value
        }))
    }

    const checkValidateInput = () => {
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

            if (!userData[key]) {
                toast.error(`${valueErr} không được để trống!`);
                check = false
                break;
            }

            // Kiểm tra regex nếu có
            if (regex && !regex.test(userData[key])) {
                toast.error(regexErr);
                check = false;
                break;
            }
        }
        return check
    }

    //hàm thêm mới hoặc sửa user
    const handleConfirmUser = async () => {
        let checkValid = checkValidateInput()

        if (checkValid) {
            let respone = await axios.post("/user/create", userData)
            if (respone?.data?.errorCode === 0) {
                toast.success("Thêm mới người dùng thành công!")
                handleCloseModal()
                setUserData({
                    email: '',
                    phoneNumber: '',
                    fullName: '',
                    password: '',
                    address: '',
                    role: ""
                })
            } else {
                toast.error("Đã xảy ra lỗi khi thêm mới!")
            }
            // console.log(respone) 
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
                    <span>{title}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <div className='content-body'>
                    <div className='row'>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Email (<span className='red'>*</span>)</label>
                            <input className='form-control' onChange={(e) => handleOnchangeInput(e.target.value, "email")} value={userData.email} type="email" />
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Số điện thoại (<span className='red'>*</span>)</label>
                            <input className='form-control' onChange={(e) => handleOnchangeInput(e.target.value, "phoneNumber")} value={userData.phoneNumber} type="text" />
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Họ tên (<span className='red'>*</span>)</label>
                            <input className='form-control' onChange={(e) => handleOnchangeInput(e.target.value, "fullName")} value={userData.fullName} type="text" />
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Mật khẩu (<span className='red'>*</span>)</label>
                            <input className='form-control' onChange={(e) => handleOnchangeInput(e.target.value, "password")} value={userData.password} type="password" />
                        </div>
                        <div className='col-12 form-group mb-3'>
                            <label>Địa chỉ (<span className='red'>*</span>)</label>
                            <input className='form-control' onChange={(e) => handleOnchangeInput(e.target.value, "address")} value={userData.address} type="text" />
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Role (<span className='red'>*</span>)</label>
                            <select defaultValue={userData.role} onChange={(e) => handleChangeSelect(e)} className='form-select'>
                                {
                                    listRole?.length > 0 && listRole.map((item) => (
                                        <option key={`role-${item?.PK_iQuyenHanID}`} value={item?.PK_iQuyenHanID}>{item?.sMoTa}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant='secondary' onClick={handleCloseModal}>Hủy</Button>
                <Button variant='primary' onClick={() => handleConfirmUser()}>Thêm mới</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalUser
