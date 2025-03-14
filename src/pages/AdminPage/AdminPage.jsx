import React, { useState } from 'react'
import HeaderAdmin from '../../Systems/HeaderAdmin/HeaderAdmin'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../Systems/Sidebar/Sidebar'

import "./AdminPage.scss"
import { ToastContainer } from 'react-toastify';



const AdminPage = () => {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }
    return (
        <div className='body-admin'>
            <div className='grid-container'>
                <HeaderAdmin OpenSidebar={OpenSidebar} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
                <Outlet />
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss={false} // Tắt tính năng tạm dừng khi mất focus
                    pauseOnHover={false}
                    draggable
                    theme="light"
                />
            </div>
        </div>
    )
}

export default AdminPage