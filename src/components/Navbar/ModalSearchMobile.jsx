import React, { useState } from 'react'

import { Button, Modal } from 'react-bootstrap';

import "./ModalSearchMobile.scss"
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";

const ModalSearchMobile = ({ show, setIsShowModalSearch }) => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchTerm = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
    };

    const handleSearch = (e) => {
        if (e.code === 'Enter') {
            setIsShowModalSearch(false)
            navigate(`search/${searchTerm}`);
        }
    };

    const handleClickSearch = () => {
        setIsShowModalSearch(false)
        navigate(`search/${searchTerm}`);
    }

    return (
        <Modal show={show} centered fullscreen="xl-down" onHide={() => setIsShowModalSearch(false)} className="custom-modal-search">
            <Modal.Body className="custom-modal-search-body">
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
                                onClick={() => handleClickSearch()}
                                to={`search/${searchTerm}`}
                                className="search-btn text-white flex align-center justify-center"
                            >
                                <FiSearch />
                            </Link>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalSearchMobile