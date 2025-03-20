import React from 'react'

import "./HeaderAdmin.scss"
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify }
    from 'react-icons/bs'

import img from "../../assets/admin.png"

const HeaderAdmin = ({ OpenSidebar }) => {
    return (
        <header className='header-admin'>
            <div className='menu-icon'>
                <BsJustify className='icon' onClick={OpenSidebar} />
            </div>
            <div className='header-left'>
                <img src={img} alt="imgAdmin" />
            </div>
            <div className='header-right'>
                <BsFillBellFill className='icon' />
                <BsFillEnvelopeFill className='icon' />
                <BsPersonCircle className='icon' />
            </div>
        </header>
    )
}

export default HeaderAdmin