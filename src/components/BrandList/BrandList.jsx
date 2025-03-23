import React, { useEffect, useState } from 'react'

import "./BrandList.scss"
import axios from '../../config/axios';
import { Link } from 'react-router-dom';



const BrandList = () => {
    const [brandList, setBrandList] = useState([])

    const fetchGetBrand = async () => {
        let response = await axios.get("/api/v1/manage-brand/get-all")
        if (response?.errorCode === 0 && response?.data?.length > 0) {
            setBrandList(response?.data)
        }
    }

    useEffect(() => {
        fetchGetBrand()
    }, [])

    return (
        <div className='list-brand'>
            {brandList?.map((item, i) => (
                <Link to={`/brand/${item?.PK_iNhanHangID}/${item?.sTenNhanHang}`} className='list-brand_item' key={`keyBrand-${item?.PK_iNhanHangID}-${i}`} >
                    <img src={item?.sLogo} alt={item?.sTenNhanHang} />
                </Link>
            ))}
        </div>
    )
}

export default BrandList