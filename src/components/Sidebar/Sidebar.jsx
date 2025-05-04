import React, { useEffect } from 'react';


import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSidebarStatus, setSidebarOff } from '../../store/sidebarSlice';
import { fetchAsyncCategories, getAllCategories } from '../../store/categorySlice';

import { IoCloseCircleSharp } from "react-icons/io5";
import './Sidebar.scss';

const Sidebar = () => {
    const dispatch = useDispatch();
    const isSidebarOn = useSelector(getSidebarStatus);
    const categories = useSelector(getAllCategories);

    useEffect(() => {
        dispatch(fetchAsyncCategories());
    }, [dispatch]);

    return (
        <aside className={`sidebar ${isSidebarOn ? 'hide-sidebar' : ''}`}>
            <button type="button" className="sidebar-hide-btn" onClick={() => dispatch(setSidebarOff())}>
                <IoCloseCircleSharp />
            </button>
            <div className="sidebar-cnt">
                <div className="cat-title fs-17 text-uppercase fw-6 ls-1h">Danh mục sản phẩm</div>
                <ul className="cat-list">
                    {categories.map((category, index) => (
                        <li key={`${index}-category-sidebar-key`} onClick={() => dispatch(setSidebarOff())}>
                            <Link to={`category/${category?.PK_iDanhMucID}`} className="cat-list-link text-capitalize">
                                {category?.sTenDanhMuc}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
