import React from 'react'

import "./Sidebar.scss"
import {
    BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
    BsListCheck, BsMenuButtonWideFill, BsFillGearFill
}
    from 'react-icons/bs'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Link } from 'react-router-dom'

const Sidebar = ({ openSidebarToggle, OpenSidebar }) => {
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
                <li className='sidebar-list-item'>
                    <Link to={"/admin/manage-brand"}>
                        <BsPeopleFill className='icon' /> QL Nhãn hàng
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={"/admin/manage-supplier"}>
                        <BsPeopleFill className='icon' /> QL Nhà cung cấp
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={""}>
                        <BsFillArchiveFill className='icon' /> Products
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={""}>
                        <BsFillGrid3X3GapFill className='icon' /> Categories
                    </Link>
                </li>

                <li className='sidebar-list-item'>
                    <Link to={""}>
                        <BsListCheck className='icon' /> Inventory
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={""}>
                        <BsMenuButtonWideFill className='icon' /> Reports
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to={""}>
                        <BsFillGearFill className='icon' /> Setting
                    </Link>
                </li>
            </ul>
        </aside>
    )
}

export default Sidebar