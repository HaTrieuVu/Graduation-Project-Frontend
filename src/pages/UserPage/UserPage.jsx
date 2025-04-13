import React from 'react'

import "./UserPage.scss"
import { Outlet } from 'react-router-dom'

const UserPage = () => {
    return (
        <div className='bg-whitesmoke'>
            <div className='container py-4'>
                <Outlet />
            </div>
        </div>
    )
}

export default UserPage