import React, { useEffect, useState } from 'react'

import "./BrandList.scss"
import axios from 'axios';
import { Link } from 'react-router-dom';



const BrandList = () => {
    const [brandList, setBrandList] = useState([])

    const fetchGetBrand = async () => {
        let respone = await axios.get("/manage-brand/get-all")
        if (respone?.data?.errorCode === 0 && respone?.data?.data?.length > 0) {
            setBrandList(respone?.data?.data)
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