import React from 'react'

import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

import "./UserModal.scss"
import axios from '../../config/axios';
import { toast } from 'react-toastify';

const UserModal = () => {
    const user = useSelector(state => state?.userInfo?.user);

    const handleLogOut = async () => {
        const response = await axios.post("/api/v1/logout");
        if (response?.errorCode === 0) {
            toast.success(response?.errorMessage)
            window.location.href = "/";
        }
    }

    return (
        <div className='user-modal'>
            <ul>
                <Link to={"/user/profile"} className='item'>Hồ sơ cá nhân</Link>
                <Link to={"/user/purchase?type=all"} className='item'>Đơn hàng</Link>
                {(user?.roleId === 1 || user?.roleId === 2) && <Link to={"/admin"} className='item'>Quản lý Website</Link>}
                <Link onClick={() => handleLogOut()} className='item'>Đăng xuất</Link>
            </ul>
        </div>
    )
}

export default UserModal