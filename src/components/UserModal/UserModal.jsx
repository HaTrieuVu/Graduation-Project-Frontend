import React from 'react'

import "./UserModal.scss"
import { Link } from 'react-router-dom'

const UserModal = () => {
    return (
        <div className='user-modal'>
            <ul>
                <Link className='item'>Hồ sơ cá nhân</Link>
                <Link className='item'>Đăng xuất</Link>
            </ul>
        </div>
    )
}

export default UserModal