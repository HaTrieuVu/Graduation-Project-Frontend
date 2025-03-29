import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './Header.scss';
import { MdOutlineSupportAgent } from "react-icons/md";
import _ from "lodash"

import userIcon from "../../assets/user.png"
import Navbar from '../Navbar/Navbar';
import UserModal from '../UserModal/UserModal';
import { FaFacebook } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import NotificationModal from '../NotificationModal/NotificationModal';
import axios from '../../config/axios';

const Header = () => {
    const user = useSelector(state => state.userInfo.user);

    const [userInfo, setUserInfo] = useState({})
    const [notifications, setNotifications] = useState(null)
    const [quantityNofification, setQuantityNofification] = useState(0)

    // lấy tất cả thông báo của người dùng
    const fetchAllNotification = async (id) => {
        const res = await axios.get(`/api/v1/notification/get-info?id=${id}`)

        if (res?.errorCode === 0 && !_.isEmpty(res?.data)) {
            setNotifications(res?.data)
            setQuantityNofification(res?.data?.length)
        }
    }

    useEffect(() => {
        let id = user?.userId
        setUserInfo(user)
        fetchAllNotification(id)
    }, [user])

    return (
        <div className="header text-white">
            <div className="container">
                {/* header top */}
                <div className="header-cnt">
                    <div className="header-cnt-top fs-13 py-2 flex align-center justify-between">
                        {/*header top left */}
                        <div className="header-cnt-top-l">
                            <ul className="flex fs-20 top-links align-center">
                                <li className="box-follow">
                                    <a href="www.facebook.com" className="fs-15">
                                        <span className="">Follow Us</span>
                                        <FaFacebook size={20} />
                                    </a>
                                </li>
                                <li className="vert-line"></li>
                                <li className='box-support'>
                                    <Link to="/" className="top-link-itm">
                                        <span className="top-link-itm-ico mx-2 fs-24">
                                            <MdOutlineSupportAgent />
                                        </span>
                                        <span className="top-link-itm-txt">Hỗ trợ</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        {/*header top right */}
                        <div className="header-cnt-top-r">
                            <ul className="flex fs-20 top-links align-center">
                                <li className='box-notify'>
                                    <Link to="/" className="top-link-itm">
                                        <span className="top-link-itm-txt">Thông báo</span>
                                        <span className="top-link-itm-ico mx-2 icon-notify">
                                            <IoNotifications size={30} />
                                            <span className='icon-notify-value'>{quantityNofification}</span>
                                        </span>
                                    </Link>
                                    <NotificationModal notifications={notifications} />
                                </li>
                                <li className="vert-line"></li>
                                {userInfo && !_.isEmpty(userInfo) ? <div className='box-user'>
                                    <div className='icon'>
                                        <img alt='avatar' src={userIcon} />
                                    </div>
                                    <span>{userInfo?.userName}</span>
                                    <UserModal />
                                </div> : <div className='box-action'>
                                    <li>
                                        <Link to="/register" className="top-link-itm">
                                            <span className="top-link-itm-txt text-3xl font-bold underline">Đăng ký</span>
                                        </Link>
                                    </li>
                                    <li className="vert-line"></li>
                                    <li>
                                        <Link to="/login" className="top-link-itm">
                                            <span className="top-link-itm-txt">Đăng nhập</span>
                                        </Link>
                                    </li>
                                </div>}

                            </ul>
                        </div>
                    </div>
                </div>
                {/* header bottom */}
                <div className="header-cnt-bottom">
                    <Navbar />
                </div>
            </div>
        </div>
    );
};

export default Header;
