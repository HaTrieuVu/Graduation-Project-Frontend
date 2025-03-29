import React, { useEffect, useState } from 'react'
import HeaderAdmin from '../../Systems/HeaderAdmin/HeaderAdmin'
import { Outlet, useNavigate } from 'react-router-dom'
import SidebarAdmin from '../../Systems/SidebarAdmin/SidebarAdmin'

import "./AdminPage.scss"
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { clearUser, setInfoUser } from '../../store/userSlice'
import axios from '../../config/axios';


const AdminPage = () => {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

    const user = useSelector(state => state.userInfo.user);
    const isUserLoaded = useSelector(state => state?.userInfo?.isUserLoaded);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        fetchUserInfo()
    }, [])

    useEffect(() => {
        // Chỉ kiểm tra khi Redux đã tải xong user
        if (!isUserLoaded) return;

        if (!user?.userId) {
            navigate("/login");
            window.scrollTo(0, 0);
        }
    }, [user, isUserLoaded, navigate]);

    const fetchUserInfo = async () => {
        try {
            let response = await axios.get("/api/v1/account");
            if (response?.errorCode === 0) {
                dispatch(setInfoUser(response?.data?.user));
            } else {
                dispatch(clearUser());
            }
        } catch (error) {
            console.log(error)
            dispatch(clearUser());
        }
        setIsChecking(false);
    };

    // 🔹 Kiểm tra ngay khi có user
    useEffect(() => {
        if (!isChecking && user?.roleId === 3) {
            navigate("/", { replace: true });
        }
    }, [user, isChecking, navigate]);

    // 🔹 Chặn render nếu chưa kiểm tra xong
    if (isChecking) {
        console.log(isChecking)
        return null;
    }

    console.log(isChecking)
    console.log(user)

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }
    return (
        <div className='body-admin'>
            <div className='grid-container'>
                <HeaderAdmin OpenSidebar={OpenSidebar} />
                <SidebarAdmin openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
                <Outlet />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
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