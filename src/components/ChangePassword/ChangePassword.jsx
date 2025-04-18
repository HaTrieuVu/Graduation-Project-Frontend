import React, { useState } from 'react'

import "./ChangePassword.scss"
import { Link, useNavigate } from 'react-router-dom';
import { RiLockPasswordLine } from "react-icons/ri";
import { toast } from 'react-toastify';
import axios from '../../config/axios';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useSelector } from 'react-redux';


const ChangePassword = () => {
    const user = useSelector(state => state.userInfo.user);
    const navigate = useNavigate()

    const [dataPassword, setDataPassword] = useState({
        passwordOld: "",
        passwordNew: "",
        confirmPasswordNew: "",
    })

    const [isShowPassword, setIsShowPassword] = useState({
        isShowPasswordOld: false,
        isShowPasswordNew: false,
        isShowConfirmPasswordNew: false,
    })

    const handleSetShowPassword = (name) => {
        setIsShowPassword(prev => ({
            ...prev,
            [name]: !prev[name],
        }))
    }

    const handleChangeInputPassword = (name, value) => {
        setDataPassword(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const checkValidateInput = () => {
        let arr = [
            {
                key: "passwordOld",
                valueErr: "Mật khẩu hiện tai"
            }, {
                key: "passwordNew",
                valueErr: "Mật khẩu mới"
            }, {
                key: "confirmPasswordNew",
                valueErr: "Xác nhân mật khẩu mới"
            },
        ]
        let check = true
        for (let i = 0; i < arr.length; i++) {
            let { key, valueErr } = arr[i];

            if (!dataPassword[key]) {
                toast.error(`${valueErr} không được để trống!`);
                check = false
                break;
            }
        }
        return check
    }

    const handleChangePassword = async () => {
        const checkValid = checkValidateInput()

        if (checkValid) {
            if (dataPassword?.passwordNew !== dataPassword?.confirmPasswordNew) {
                toast.info("Mật khẩu nhập lại không trùng khớp")
                return
            }

            let dataChangePassword = {
                id: user?.userId,
                passwordOld: dataPassword?.passwordOld,
                passwordNew: dataPassword?.passwordNew
            }

            const res = await axios.put("/api/v1/user/change-password", dataChangePassword)
            if (res?.errorCode === 0) {
                toast.success("Thay đổi mật khẩu thành công!")
                navigate("/")
            } else {
                toast.error(res?.errorMessage)
            }

            console.log(res)
        }


    }

    return (
        <div className="box-change-password my-5 pt-sm-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="text-center mb-5">
                            <h4 className='title'>Đổi mật khẩu</h4>
                        </div>
                        <div className="card h-full">
                            <div className="card-body p-4">
                                <div className="p-3">
                                    <div>
                                        <div className="mb-5">
                                            <div className="input-group mb-3 bg-light-subtle rounded-3 ">
                                                <span className="input-group-text text-muted fs-24" id="basic-addon3">
                                                    <RiLockPasswordLine />
                                                </span>
                                                <input
                                                    type={`${!isShowPassword.isShowPasswordOld ? "password" : "text"}`}
                                                    value={dataPassword.passwordOld}
                                                    onChange={(e) => handleChangeInputPassword("passwordOld", e.target.value)}
                                                    className="form-control fs-22"
                                                    placeholder="Mật khẩu hiện tại"
                                                />
                                                {!isShowPassword?.isShowPasswordOld ?
                                                    <FaEye className='btn-eye' onClick={() => handleSetShowPassword("isShowPasswordOld")} size={20} /> :
                                                    <FaEyeSlash className='btn-eye' onClick={() => handleSetShowPassword("isShowPasswordOld")} size={20} />
                                                }
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <div className="input-group mb-3 bg-light-subtle rounded-3">
                                                <span className="input-group-text text-muted fs-24" id="basic-addon4">
                                                    <RiLockPasswordLine />
                                                </span>
                                                <input
                                                    type={`${!isShowPassword.isShowPasswordNew ? "password" : "text"}`}
                                                    value={dataPassword.passwordNew}
                                                    onChange={(e) => handleChangeInputPassword("passwordNew", e.target.value)}
                                                    className="form-control fs-22"
                                                    placeholder="Mật khẩu mới"
                                                />
                                                {!isShowPassword?.isShowPasswordNew ?
                                                    <FaEye className='btn-eye' onClick={() => handleSetShowPassword("isShowPasswordNew")} size={20} /> :
                                                    <FaEyeSlash className='btn-eye' onClick={() => handleSetShowPassword("isShowPasswordNew")} size={20} />
                                                }
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <div className="input-group mb-3 bg-light-subtle rounded-3">
                                                <span className="input-group-text text-muted fs-24" id="basic-addon4">
                                                    <RiLockPasswordLine />
                                                </span>
                                                <input
                                                    type={`${!isShowPassword.isShowConfirmPasswordNew ? "password" : "text"}`}
                                                    value={dataPassword.confirmPasswordNew}
                                                    onChange={(e) => handleChangeInputPassword("confirmPasswordNew", e.target.value)}
                                                    className="form-control fs-22"
                                                    placeholder="Xác nhận mật khẩu "
                                                />
                                                {!isShowPassword?.isShowConfirmPasswordNew ?
                                                    <FaEye className='btn-eye' onClick={() => handleSetShowPassword("isShowConfirmPasswordNew")} size={20} /> :
                                                    <FaEyeSlash className='btn-eye' onClick={() => handleSetShowPassword("isShowConfirmPasswordNew")} size={20} />
                                                }
                                            </div>
                                        </div>
                                        <div className="d-grid">
                                            <button
                                                className="btn btn-login"
                                                type="submit"
                                                value="Đăng nhập"
                                                onClick={() => handleChangePassword()}
                                            >
                                                Đổi mật khẩu
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 text-center">
                            <p>
                                Đã có tài khoản,
                                <Link className="mx-2 text-primary" to={'/'}>
                                    Quên mật khẩu!
                                </Link>{' '}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword