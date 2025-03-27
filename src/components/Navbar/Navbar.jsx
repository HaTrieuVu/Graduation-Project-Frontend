import React, { useEffect, useState } from 'react';


import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOn } from '../../store/sidebarSlice';
import { getAllCarts, getCartItemsCount, fetchAsyncCarts, getCartTotal } from '../../store/cartSlice';
import CartModal from '../CartModal/CartModal';

import { IoMenu, IoBag } from "react-icons/io5";
import { FaCartPlus } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";


import './Navbar.scss';


const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const user = useSelector(state => state.userInfo.user);

    const carts = useSelector(getAllCarts);
    const itemsCount = useSelector(getCartItemsCount);

    // lấy thông tin người dùng
    useEffect(() => {
        if (user && user?.userId && user?.cartId) {
            dispatch(fetchAsyncCarts({
                userId: user?.userId,
                cartId: user?.cartId,
            }));
        }

    }, [user])

    useEffect(() => {
        dispatch(getCartTotal());
    }, [carts]);

    const handleSearchTerm = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
    };

    const handleSearch = (e) => {
        if (e.code === 'Enter') {
            navigate(`search/${searchTerm}`);
        }
    };

    return (
        <nav className="navbar-container">
            <div className="navbar-cnt ">
                <div className="brand-and-toggler ">
                    <button
                        className="sidebar-show-btn"
                        type="button"
                        onClick={() => dispatch(setSidebarOn())}
                    >
                        <IoMenu />
                    </button>
                    <Link to="/" className="navbar-brand ">
                        <span className="navbar-brand-ico">
                            <IoBag />
                        </span>
                        <span className="navbar-brand-txt">
                            <span className="fw-7">Snap</span>Up.
                        </span>
                    </Link>
                </div>

                <div className="navbar-collapse-body">
                    <div className="navbar-search ">
                        <div className="flex align-center">
                            <input
                                type="text"
                                className="form-control fs-14 input-search"
                                onChange={(e) => handleSearchTerm(e)}
                                onKeyDown={(e) => handleSearch(e)}
                                placeholder="Tìm kiếm điện thoại..."
                            ></input>
                            <Link
                                to={`search/${searchTerm}`}
                                className="search-btn text-white flex align-center justify-center"
                            >
                                <FiSearch />
                            </Link>
                        </div>
                    </div>


                </div>

                <div className="navbar-cart flex align-center">
                    <div className="cart-btn">
                        <Link to="/cart">
                            <FaCartPlus />
                        </Link>
                        <div className="cart-items-value">{itemsCount ? itemsCount : 0}</div>
                        <CartModal carts={carts?.cartDetails} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
