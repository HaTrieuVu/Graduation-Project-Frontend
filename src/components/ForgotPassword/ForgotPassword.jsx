import React, { useState } from 'react'

import "./ForgotPassword.scss"
import { FaRegUserCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'

import axios from '../../config/axios';
import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")

    const handleGetPassword = async () => {
        if (!email) {
            toast.info("Hãy nhập Email đã đăng ký tài khoản!")
            return
        }
        let response = await axios.post("/api/v1/user/forgot-password", { email })

        console.log(response)
        if (response?.errorCode === 0) {
            toast.success(response?.errorMessage)
            navigate("/")
        } else if (response?.errorCode === -1) {
            toast.error(response?.errorMessage)
        }
    }

    return (
        <div className="forgot-password-container my-5 pt-sm-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="text-center mb-5">
                            <h4 className='title'>Quên mật khẩu</h4>
                        </div>
                        <div className="card h-full">
                            <div className="card-body p-4">
                                <div className="p-3">
                                    <div>
                                        <div className="mb-5">
                                            <div className="input-group mb-3 bg-light-subtle rounded-3 ">
                                                <span className="input-group-text text-muted fs-24" id="basic-addon3">
                                                    <FaRegUserCircle />
                                                </span>
                                                <input
                                                    type="text"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="form-control fs-22"
                                                    placeholder="Nhập Email đăng ký tài khoản"
                                                />
                                            </div>

                                            <div className="d-grid">
                                                <button
                                                    className="btn btn-get-passwrod"
                                                    type="submit"
                                                    value="Lấy mật khẩu"
                                                    onClick={() => handleGetPassword()}
                                                >
                                                    Lấy mật khẩu
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword