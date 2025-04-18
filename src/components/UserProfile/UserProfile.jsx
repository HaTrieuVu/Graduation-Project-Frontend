import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import "./UserProfile.scss"
import avatarIcon from "../../assets/user.png"
import axios from '../../config/axios';
import _ from "lodash";
import Loader from '../Loader/Loader';
import CommonUtils from '../../utils/CommonUtils';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const UserProfile = () => {
    const user = useSelector(state => state.userInfo.user);
    const navigate = useNavigate();

    const [dataProfile, setDataProfile] = useState({
        id: "",
        email: '',
        phoneNumber: '',
        fullName: '',
        address: '',
    })
    const [dataAvatar, setDataAvatar] = useState({
        avatar: "",
        previewAvatar: ""
    })
    const [dataChange, setDataChange] = useState({
        isChangeName: false,
        isChangeEmail: false,
        isChangePhoneNumber: false,
        isChangeAddress: false,

    })
    const [isLoadingProfile, setIsLoadingProfile] = useState(false)

    const fetchUserInfo = async (userId) => {
        const res = await axios.get(`/api/v1/user/get-info?id=${userId}`)
        if (res?.errorCode === 0 && !_.isEmpty(res?.data)) {
            setDataProfile({
                id: res?.data?.PK_iKhachHangID,
                email: res?.data?.sEmail,
                phoneNumber: res?.data?.sSoDienThoai,
                fullName: res?.data?.sHoTen,
                address: res?.data?.sDiaChi,
            })
            setDataAvatar(prev => ({
                ...prev,
                avatar: res?.data?.sAvatar,
            }));
            setIsLoadingProfile(true)
        } else {
            setIsLoadingProfile(true)
        }
    }

    useEffect(() => {
        let userId = user?.userId
        fetchUserInfo(userId)
    }, [user])

    // hàm click chọn btn thay đổi
    const handleChange = (key) => {
        setDataChange(prev => ({
            ...prev,
            [key]: true
        }))
    }

    const handleChangeInput = (name, value) => {
        setDataProfile(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOnChangeAvatar = async (e) => {
        let data = e.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectURL = URL.createObjectURL(file);
            setDataAvatar(prev => ({
                ...prev,
                previewAvatar: objectURL,
                avatar: base64,
            }));
        }
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
                key: "address",
                valueErr: "Địa chỉ"
            },
        ]
        let check = true
        for (let i = 0; i < arr.length; i++) {
            let { key, valueErr, regex, regexErr } = arr[i];
            if (!dataProfile[key]) {
                toast.error(`${valueErr} không được để trống!`);
                check = false
                break;
            }

            // Kiểm tra regex nếu có
            if (regex && !regex.test(dataProfile[key])) {
                toast.error(regexErr);
                check = false;
                break;
            }
        }
        return check
    }

    const handleSaveChangeProfile = async () => {
        let checkValid = checkValidateInput()

        if (checkValid) {
            let dataUpdate = {
                id: dataProfile.id,
                email: dataProfile.email,
                phoneNumber: dataProfile.phoneNumber,
                fullName: dataProfile.fullName,
                address: dataProfile.address,
                avatar: dataAvatar.avatar
            }
            let response = await axios.put("/api/v1/user/update-profile", dataUpdate)

            if (response?.errorCode === 0) {
                toast.success("Cập nhật thông tin thành công!")
                setTimeout(() => {
                    navigate("/", { replace: true }); // chuyển hướng
                    navigate(0); // reload lại trang
                }, 1000);
            } else {
                toast.error(response?.errorMessage)
            }
        }
    }

    return (
        <div className='container-profile'>
            <div className='profile-header'>
                <h1>Thông tin Tài khoản</h1>
                <span>Quản lý thông tin cá nhân để bảo mật tài khoản</span>
            </div>
            {isLoadingProfile === false ? <Loader /> : <div className='profile-body'>
                <div className='box-profile'>
                    <div className='row main-profile'>
                        <div className="col-12 mb-3 form-group">
                            <label className='mb-3 label-title'>Họ tên</label>
                            <input
                                className="form-control"
                                type="text"
                                value={dataProfile?.fullName}
                                onChange={(e) => handleChangeInput("fullName", e.target.value)}
                                readOnly={dataChange.isChangeName === false}
                            />
                            <div className='btn-change'>
                                <button onClick={() => handleChange("isChangeName")}>thay đổi</button>
                            </div>
                        </div>
                        <div className="col-12 mb-3 form-group">
                            <label className='mb-3 label-title'>Email</label>
                            <input
                                className="form-control"
                                type="text"
                                value={dataProfile?.email}
                                onChange={(e) => handleChangeInput("email", e.target.value)}
                                readOnly={dataChange.isChangeEmail === false}
                            />
                            <div className='btn-change'>
                                <button onClick={() => handleChange("isChangeEmail")}>thay đổi</button>
                            </div>
                        </div>
                        <div className="col-12 mb-3 form-group">
                            <label className='mb-3 label-title'>Số điện thoại</label>
                            <input
                                className="form-control"
                                type="text"
                                value={dataProfile?.phoneNumber}
                                onChange={(e) => handleChangeInput("phoneNumber", e.target.value)}
                                readOnly={dataChange.isChangePhoneNumber === false}
                            />
                            <div className='btn-change'>
                                <button onClick={() => handleChange("isChangePhoneNumber")}>thay đổi</button>
                            </div>
                        </div>
                        <div className="col-12 mb-3 form-group">
                            <label className='mb-3 label-title'>Địa chỉ</label>
                            <input
                                className="form-control"
                                type="text"
                                value={dataProfile?.address}
                                onChange={(e) => handleChangeInput("address", e.target.value)}
                                readOnly={dataChange.isChangeAddress === false}
                            />
                            <div className='btn-change'>
                                <button onClick={() => handleChange("isChangeAddress")}>thay đổi</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='box-image'>
                    <div className='image-main'>
                        <img
                            src={
                                dataAvatar?.previewAvatar || dataAvatar?.avatar || avatarIcon
                            }
                            className="avatar"
                            alt="Avatar"
                        />
                        <label className='label-img' htmlFor="srcAvatar">Chọn ảnh</label>
                        <input onChange={(e) => handleOnChangeAvatar(e)} className='input-img' type="file" name="" id="srcAvatar" />
                        <span className='info-img'>Dung lượng file tối đa</span>
                    </div>
                </div>
            </div>}
            <div className='btn-save'>
                <button onClick={() => handleSaveChangeProfile()}>Lưu thay đổi</button>
            </div>

        </div>
    )
}

export default UserProfile