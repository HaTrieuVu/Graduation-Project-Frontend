import React, { useEffect, useState } from 'react'

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

import "./ModalUser.scss"

const ModalUser = ({ action, show, handleCloseModal, dataModalUser, fetchAllUser }) => {

    const [listRole, setListRole] = useState([])
    const [userData, setUserData] = useState({
        id: "",
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

    useEffect(() => {
        if (action === "CREATE") {
            setUserData({
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
            setUserData({
                id: dataModalUser.PK_iKhachHangID,
                email: dataModalUser.sEmail,
                phoneNumber: dataModalUser.sSoDienThoai,
                fullName: dataModalUser.sHoTen,
                password: "",
                address: dataModalUser.sDiaChi,
                role: dataModalUser.role.PK_iQuyenHanID
            })
        }
    }, [dataModalUser])

    const fetchGetRole = async () => {
        let respone = await axios.get("/api/v1/manage-role/get-all")

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
        setUserData(prev => ({
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

                if (!userData[key]) {
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
    }

    //hàm thêm mới hoặc sửa user /user/update
    const handleConfirmUser = async () => {
        let checkValid = checkValidateInput()

        if (checkValid) {
            let respone = action === "CREATE" ?
                await axios.post("/api/v1/user/create", userData)
                :
                await axios.put("/api/v1/user/update", userData)
            if (respone?.data?.errorCode === 0) {
                action === "CREATE" ? toast.success("Thêm mới người dùng thành công!") : toast.success("Câp nhật thông tin người dùng thành công!")
                await fetchAllUser();
                handleCloseModal()
                setUserData({
                    id: "",
                    email: '',
                    phoneNumber: '',
                    fullName: '',
                    password: '',
                    address: '',
                    role: ""
                })
            } else {
                toast.error(respone?.data?.errorMessage)
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
                    {action === "CREATE" ? <span>Thêm mới người dùng</span> : <span>Sửa người dùng</span>}
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
                                value={userData.email}
                                type="email"
                                readOnly={action === "UPDATE"}
                            />

                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Số điện thoại (<span className='red'>*</span>)</label>
                            <input
                                className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "phoneNumber")}
                                value={userData.phoneNumber}
                                type="text"
                                readOnly={action === "UPDATE"}
                            />
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Họ tên (<span className='red'>*</span>)</label>
                            <input
                                className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "fullName")}
                                value={userData.fullName}
                                type="text"
                            />
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Mật khẩu (<span className='red'>*</span>)</label>
                            <input
                                className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "password")}
                                value={userData.password}
                                type="password"
                                readOnly={action === "UPDATE"}
                            />
                        </div>
                        <div className='col-12 form-group mb-3'>
                            <label>Địa chỉ (<span className='red'>*</span>)</label>
                            <input className='form-control' onChange={(e) => handleOnchangeInput(e.target.value, "address")} value={userData.address} type="text" />
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Role (<span className='red'>*</span>)</label>
                            <select value={userData.role} onChange={(e) => handleChangeSelect(e)} className='form-select'>
                                {
                                    listRole?.length > 0 && listRole.map((item) => (
                                        <option key={`role-user-${item?.PK_iQuyenHanID}`} value={item?.PK_iQuyenHanID}>{item?.sMoTa}</option>
                                    ))
                                }
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

export default ModalUser
