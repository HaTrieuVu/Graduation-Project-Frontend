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
    const [avatar, setAvatar] = useState(null)
    const [notifications, setNotifications] = useState(null)
    const [quantityNofification, setQuantityNofification] = useState(0)

    // lấy tất cả thông báo của người dùng
    const fetchAllNotification = async (id) => {
        const res = await axios.get(`/api/v1/notification/get-info?id=${id}`)

        if (res?.errorCode === 0 && !_.isEmpty(res?.data)) {
            setNotifications(res?.data)
            setQuantityNofification(res?.data?.length)
        } else {
            setNotifications([]); // Reset nếu không có dữ liệu
            setQuantityNofification(0);
        }
    }

    const fetchUserInfo = async (userId) => {
        const res = await axios.get(`/api/v1/user/get-info?id=${userId}`)
        if (res?.errorCode === 0 && !_.isEmpty(res?.data)) {
            setAvatar(res?.data?.sAvatar,);
        }
    }

    useEffect(() => {
        let id = user?.userId
        setUserInfo(user)
        fetchAllNotification(id)
        fetchUserInfo(id)
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
                                    <a href="https://web.facebook.com/TranHuymobile/?_rdc=1&_rdr#" target="_blank"
                                        rel="noopener noreferrer" className="fs-20">
                                        <span className="">Theo dõi</span>
                                        <FaFacebook size={20} />
                                    </a>
                                </li>
                                <li className="vert-line"></li>
                                <li className='box-support'>
                                    <Link to="/user/feedback" className="top-link-itm">
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
                                    <NotificationModal notifications={notifications} userId={user?.userId} fetchAllNotification={fetchAllNotification} />
                                </li>
                                <li className="vert-line"></li>
                                {userInfo && !_.isEmpty(userInfo) ? <div className='box-user'>
                                    <div className='icon'>
                                        <img alt='avatar' src={avatar !== null ? avatar : userIcon} />
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
