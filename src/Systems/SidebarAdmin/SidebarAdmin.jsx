import React, { useState } from 'react'

import "./SidebarAdmin.scss"
import {
    BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
    BsChevronDown
}
    from 'react-icons/bs'
import { AiOutlineProduct } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdWarehouse } from "react-icons/md";
import { TbBrand4Chan } from "react-icons/tb";
import { RiImageAiFill, RiBillFill } from "react-icons/ri";
import { Link } from 'react-router-dom'

const SidebarAdmin = ({ openSidebarToggle, OpenSidebar }) => {
    const [isOpen, setIsOpen] = useState(false);
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
                <li className='sidebar-list-item'>
                    <Link to={"/admin/manage-user"}>
                        <BsPeopleFill className='icon' /> QL Người dùng
                    </Link>
                </li>
                {/* Dropdown QL Sản phẩm */}
                <li className='sidebar-list-item-dropdown'>
                    <button
                        className="dropdown-btn"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <BsFillArchiveFill className='icon' /> QL Sản phẩm
                        <BsChevronDown className={`dropdown-icon icon ${isOpen ? "rotate" : ""}`} />
                    </button>
                    {isOpen && (
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
                        <MdWarehouse className='icon' /> QL Nhập kho
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={"/admin/manage-brand"}>
                        <TbBrand4Chan className='icon' /> QL Nhãn hàng
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={"/admin/manage-supplier"}>
                        <BsPeopleFill className='icon' /> QL Nhà cung cấp
                    </Link>
                </li>

                <li className='sidebar-list-item'>
                    <Link to={"/admin/manage-category"}>
                        <BsFillGrid3X3GapFill className='icon' /> QL Danh mục sản phẩm
                    </Link>
                </li>
            </ul>
        </aside>
    )
}

export default SidebarAdmin