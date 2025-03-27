import React from 'react'

import "./UserModal.scss"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

const UserModal = () => {
    const user = useSelector(state => state?.userInfo?.user);

    const handleLogOut = () => {
        alert("logout")
    }

    return (
        <div className='user-modal'>
            <ul>
                <Link className='item'>Hồ sơ cá nhân</Link>
                <Link className='item'>Đơn hàng</Link>
                {(user?.roleId === 1 || user?.roleId === 2) && <Link to={"/admin"} className='item'>Quản lý Website</Link>}
                <Link onClick={() => handleLogOut()} className='item'>Đăng xuất</Link>
            </ul>
        </div>
    )
}

export default UserModal