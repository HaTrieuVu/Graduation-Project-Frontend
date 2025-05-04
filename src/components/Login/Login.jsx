import React, { useState } from 'react';

import './Login.scss';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { toast } from 'react-toastify';
import axios from '../../config/axios';
import { useDispatch } from 'react-redux';
import { setInfoUser } from '../../store/userSlice';

const Login = () => {
  const dispatch = useDispatch();

  const [valueLogin, setValueLogin] = useState("")
  const [password, setPassword] = useState("")

  const [isShowPassword, setIsShowPassword] = useState(false)

  const navigate = useNavigate()

  const fetchUserInfo = async () => {
    let response = await axios.get("/api/v1/account");
    if (response?.errorCode === 0) {
      dispatch(setInfoUser(response?.data?.user))
    }
  }

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  const handleLogin = async () => {
    if (!valueLogin) {
      toast.error("Hãy nhập Email hoặc Số điện thoại!")
      return
    }
    if (!password) {
      toast.error("Hãy nhập Mật khẩu!")
      return
    }
    let response = await axios.post("/api/v1/login", {
      valueLogin, password
    })

    if (response?.errorCode === 0) {
      toast.success(response?.errorMessage)
      fetchUserInfo()
      navigate("/")
    } else {
      toast.error(response?.errorMessage)
    }
  }

  return (
    <div className="account-pages my-5 pt-sm-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="text-center mb-5">
              <h4 className='title'>Đăng nhập</h4>
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
                          value={valueLogin}
                          onChange={(e) => setValueLogin(e.target.value)}
                          className="form-control fs-22"
                          placeholder="Email hoặc Số điện thoại"
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="input-group mb-3 bg-light-subtle rounded-3">
                        <span className="input-group-text text-muted fs-24" id="basic-addon4">
                          <RiLockPasswordLine />
                        </span>
                        <input
                          type={`${!isShowPassword ? "password" : "text"}`}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => handlePressEnter(e)}
                          className="form-control fs-22"
                          placeholder="Mật khẩu của bạn"
                        />
                        {!isShowPassword ?
                          <FaEye className='btn-eye' onClick={() => setIsShowPassword(prev => !prev)} size={20} /> :
                          <FaEyeSlash className='btn-eye' onClick={() => setIsShowPassword(prev => !prev)} size={20} />
                        }
                      </div>

                      <div className="float-end box-forget-password">
                        <Link to={"/user/forgot-password"} className="text-muted font-size-13">
                          Quên mật khẩu?
                        </Link>
                      </div>
                    </div>

                    <div className="form-check mb-5">
                      <input type="checkbox" className="form-check-input" id="remember-check" />
                      <label className="form-check-label" >
                        Nhớ mật khẩu
                      </label>
                    </div>

                    <div className="d-grid">
                      <button
                        className="btn btn-login"
                        type="submit"
                        value="Đăng nhập"
                        onClick={() => handleLogin()}
                      >
                        Đăng nhập
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 text-center">
              <p>
                Bạn chưa có tài khoản?
                <Link className="mx-2 text-primary" to={'/register'}>
                  Đăng ký ngay!
                </Link>{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
