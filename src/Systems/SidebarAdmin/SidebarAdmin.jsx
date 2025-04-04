import React, { useState } from 'react'

import "./SidebarAdmin.scss"
import {
    BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
    BsChevronDown
}
    from 'react-icons/bs'
import { AiOutlineProduct } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdWarehouse, MdDiscount } from "react-icons/md";
import { TbBrand4Chan } from "react-icons/tb";
import { RiImageAiFill, RiBillFill } from "react-icons/ri";
import { FcOvertime } from "react-icons/fc";
import { FaTruck } from "react-icons/fa6";
import { Link } from 'react-router-dom'

const SidebarAdmin = ({ openSidebarToggle, OpenSidebar }) => {
    const [isOpenProduct, setIsOpenProduct] = useState(false);
    const [isOpenUser, setIsOpenUser] = useState(false);
    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <Link to={"/"}>
                        <BsCart3 className='icon_header' /> SHOP
                    </Link>
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>
                    <IoIosCloseCircleOutline />
                </span>
            </div>

            <ul className='sidebar-list'>
                <li className='sidebar-list-item'>
                    <Link to={"/admin"}>
                        <BsGrid1X2Fill className='icon' /> Dashboard
                    </Link>
                </li>
                {/* Dropdown QL User */}
                <li className='sidebar-list-item-dropdown'>
                    <button
                        className="dropdown-btn"
                        onClick={() => setIsOpenUser(!isOpenUser)}
                    >
                        <BsFillArchiveFill className='icon' /> QL Người dùng
                        <BsChevronDown className={`dropdown-icon icon ${isOpenUser ? "rotate" : ""}`} />
                    </button>
                    {isOpenUser && (
                        <ul className="dropdown-content">
                            <li >
                                <Link to={"/admin/manage-customer"}>
                                    <BsPeopleFill className='icon' /> QL Khách hàng
                                </Link>
                            </li>
                            <li >
                                <Link to={"/admin/manage-employee"}>
                                    <BsPeopleFill className='icon' /> QL Nhân viên
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                {/* Dropdown QL Sản phẩm */}
                <li className='sidebar-list-item-dropdown'>
                    <button
                        className="dropdown-btn"
                        onClick={() => setIsOpenProduct(!isOpenProduct)}
                    >
                        <BsFillArchiveFill className='icon' /> QL Sản phẩm
                        <BsChevronDown className={`dropdown-icon icon ${isOpenProduct ? "rotate" : ""}`} />
                    </button>
                    {isOpenProduct && (
                        <ul className="dropdown-content">
                            <li>
                                <Link to="/admin/manage-product">
                                    <AiOutlineProduct className='icon' /> QL Sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/manage-product-version">
                                    <TbBrand4Chan className='icon' />QL Phiên bản
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/manage-product-image">
                                    <RiImageAiFill className='icon' />QL Hình ảnh
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                <li className='sidebar-list-item'>
                    <Link to={"/admin/manage-order"}>
                        <RiBillFill className='icon' /> QL Đơn mua
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={"/admin/manage-import-receipt"}>
                        <MdWarehouse className='icon' /> QL Nhập Kho
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={"/admin/manage-warranty"}>
                        <FcOvertime className='icon' /> QL Bảo hành
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={"/admin/manage-brand"}>
                        <TbBrand4Chan className='icon' /> QL Nhãn hàng
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={"/admin/manage-supplier"}>
                        <FaTruck className='icon' /> QL Nhà cung cấp
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={"/admin/manage-category"}>
                        <BsFillGrid3X3GapFill className='icon' /> QL Danh mục SP
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={"/admin/manage-promition"}>
                        <MdDiscount className='icon' /> QL Khuyến mãi
                    </Link>
                </li>
            </ul>
        </aside>
    )
}

export default SidebarAdmin