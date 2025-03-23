import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import './Register.scss';
import { FaInfoCircle } from 'react-icons/fa';
import { MdOutlineEmail, MdOutlinePhoneIphone } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';

import { toast } from 'react-toastify';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAdress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const isValidInputs = () => {
    const regexEmail = /\S+@\S+\.\S+/;
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

    if (!fullName) {
      toast.error("Bạn hãy nhập Họ tên!");
      return false;
    }
    if (!email) {
      toast.error("Bạn hãy nhập Email!")
      return false;
    }
    if (!regexEmail.test(email)) {
      toast.error("Email không đúng định dạng!")
      return false;
    }
    if (!phoneNumber) {
      toast.error("Bạn hãy nhập Số điện thoại!")
      return false;
    }
    if (!regexPhoneNumber.test(phoneNumber)) {
      toast.error("Số điện thoại không hợp lệ!")
      return false;
    }
    if (!address) {
      toast.error("Bạn hãy nhập Địa chỉ!")
      return false;
    }
    if (!password) {
      toast.error("Bạn hãy nhập Mật khẩu!")
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Nhập lại mật khẩu không trùng khớp!")
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    let check = isValidInputs();
    if (check === true) {
      try {
        let response = await axios.post("/api/v1/register", {
          fullName, email, phoneNumber, address, password, confirmPassword
        }, {
          headers: { "Content-Type": "application/json" }
        });

        if (response?.errorCode === 0) {
          toast.success("Đăng ký tài khoản thành công!");
          navigate("/login");
        } else {
          toast.error(response?.errorMessage || "Có lỗi xảy ra!");
        }
      } catch (error) {
        console.error("Lỗi API:", error);
        toast.error("Lỗi kết nối API!");
      }
    }
  };


  return (
    <div className="account-pages pt-sm-5">
      <div className="container">
        <div className="row col-12 justify-content-center">
          <div className="col-md-8 col-lg-10 col-xl-12">
            <div className="text-center mb-5">
              <h4 className="title">Đăng ký</h4>
            </div>

            <div className="card">
              <div className="card-body p-4">
                <div className="p-3">
                  <div>
                    <div className="row col-12 lg:mb-4">
                      <div className="mb-4 col-md-12 col-lg-6 col-xl-6">
                        <div className="input-group bg-light-subtle rounded-3 mb-3">
                          <span className="input-group-text text-muted fs-24" id="fullname">
                            <FaInfoCircle />
                          </span>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="form-control fs-22"
                            placeholder="Họ và tên..."
                          />
                        </div>
                      </div>

                      <div className="mb-4 col-md-12 col-lg-6 col-xl-6">
                        <div className="input-group bg-light-subtle rounded-3  mb-3">
                          <span className="input-group-text text-muted fs-24" id="eamil">
                            <MdOutlineEmail />
                          </span>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control fs-22"
                            placeholder="Email..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row col-12 lg:mb-4">
                      <div className="mb-4 col-md-12 col-lg-6 col-xl-6">
                        <div className="input-group bg-light-subtle mb-3 rounded-3">
                          <span className="input-group-text text-muted fs-24" id="phone">
                            <MdOutlinePhoneIphone />
                          </span>
                          <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="form-control fs-22"
                            placeholder="Số điện thoại..."
                          />
                        </div>
                      </div>
                      <div className="mb-4 col-md-12 col-lg-6 col-xl-6">
                        <div className="input-group bg-light-subtle mb-3 rounded-3">
                          <span className="input-group-text text-muted fs-24" id="phone">
                            <FaHome />
                          </span>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAdress(e.target.value)}
                            className="form-control fs-22"
                            placeholder="Địa chỉ..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row col-12 lg:mb-4">
                      <div className="mb-4 col-md-12 col-lg-6 col-xl-6">
                        <div className="input-group bg-light-subtle mb-3 rounded-3">
                          <span className="input-group-text text-muted fs-24" >
                            <RiLockPasswordLine />
                          </span>
                          <input
                            type="password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="form-control fs-22"
                            placeholder="Mật khẩu..."
                          />
                        </div>
                      </div>

                      <div className="mb-4 col-md-12 col-lg-6 col-xl-6">
                        <div className="input-group bg-light-subtle mb-3 rounded-3">
                          <span
                            className="input-group-text text-muted fs-24"
                          >
                            <RiLockPasswordLine />
                          </span>
                          <input
                            type="password"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-control fs-22"
                            placeholder="Xác nhận mật khẩu..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row col-6 mx-auto mt-5">
                      <button className="btn btn-register" onClick={() => handleRegister()}>
                        Đăng ký!
                      </button>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-muted mb-0">
                        Bằng cách đăng ký, bạn đồng ý với chính sách của cửa hàng
                        <a href="#" className="text-primary mx-3">
                          Chính sách!
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <p>
                Bạn đã có tài khoản?{' '}
                <Link to={'/login'} className="mx-2 text-primary">
                  Đăng nhập!
                </Link>{' '}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
