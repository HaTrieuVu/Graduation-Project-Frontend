import React, { useEffect, useState } from 'react'

import './BrandProductPage.scss';
import ProductList from '../../components/ProductList/ProductList';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    fetchAsyncProductOfBrand,
    getAllProductsByBrand,
    getBrandProductsStatus,
} from '../../store/brandSlice';

import Loader from '../../components/Loader/Loader';
import { STATUS } from '../../utils/status';
import { Buffer } from 'buffer';
import _ from "lodash";
import BrandList from '../../components/BrandList/BrandList';

const BrandProductPage = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const [productList, setProductList] = useState([]);

    const productBrandResponse = useSelector(getAllProductsByBrand);
    const productBrandStatus = useSelector(getBrandProductsStatus);

    let logo = ""

    if (Array.isArray(productBrandResponse?.sLogo?.data)) {
        logo = new Buffer(productBrandResponse?.sLogo?.data, "base64").toString("binary");
    }

    useEffect(() => {
        dispatch(fetchAsyncProductOfBrand(id))
    }, [id, dispatch])

    useEffect(() => {
        if (!_.isEmpty(productBrandResponse)) {
            setProductList(productBrandResponse?.products || []);
        }
    }, [productBrandResponse]);  // Chạy lại khi productsResponse thay đổi

    return (
        <div className="brand-products bg-whitesmoke">
            <div className="container">
                <BrandList />
                <div className="brand-products-content">
                    <div className="title-md box-header">
                        <h3>
                            Sản phẩm - Nhãn hàng
                        </h3>
                        <div className='icon'>
                            <img src={logo} alt={`logo-${productBrandResponse?.sTenNhanHang}`} />
                        </div>
                    </div>
                    {productBrandStatus === STATUS.LOADING ? (
                        <Loader />
                    ) : (
                        <ProductList products={productList} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default BrandProductPage