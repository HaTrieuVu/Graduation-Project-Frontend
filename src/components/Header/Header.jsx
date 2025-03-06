import React from 'react';
import { Link } from 'react-router-dom';

import './Header.scss';
import { MdOutlineSupportAgent } from "react-icons/md";
// import Navbar from '../Navbar/Navbar';

const Header = () => {
    return (
        <div className="header text-white">
            <div className="container">
                {/* header top */}
                <div className="header-cnt">
                    <div className="header-cnt-top fs-13 py-2 flex align-center justify-between">
                        {/*header top left */}
                        <div className="header-cnt-top-l">
                            <ul className="flex fs-20 top-links align-center">
                                <li>
                                    <Link to="/seller">Seller center</Link>
                                </li>
                                <li className="vert-line"></li>
                                <li>
                                    <Link to="/download">Download</Link>
                                </li>
                                <li className="vert-line"></li>
                                <li className="flex align-center">
                                    <span className="">Theo dõi chúng tôi</span>
                                    <ul className="social-links flex align-center">
                                        <li className="mx-2">
                                            <a href="www.facebook.com" className="fs-15">
                                                <i className="fab fa-facebook"></i>
                                            </a>
                                        </li>
                                        <li className="mx-2">
                                            <a href="www.instagram.com" className="fs-15">
                                                <i className="fab fa-instagram"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        {/*header top right */}
                        <div className="header-cnt-top-r">
                            <ul className="flex fs-20 top-links align-center">
                                <li className='box-support'>
                                    <Link to="/" className="top-link-itm">
                                        <span className="top-link-itm-ico mx-2 fs-24">
                                            <MdOutlineSupportAgent />
                                        </span>
                                        <span className="top-link-itm-txt">Hỗ trợ</span>
                                    </Link>
                                </li>
                                <li className="vert-line"></li>
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
                            </ul>
                        </div>
                    </div>
                </div>
                {/* header bottom */}
                {/* <div className="header-cnt-bottom">
                    <Navbar />
                </div> */}
            </div>
        </div>
    );
};

export default Header;
