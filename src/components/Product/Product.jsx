import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { Buffer } from 'buffer';
import './Product.scss';

const Product = ({ product }) => {

    const [listImage, setListImage] = useState([])
    const [listVersion, setListVersion] = useState([])
    let image = ""

    useEffect(() => {
        setListImage(product?.images)
        setListVersion(product?.versions)
    }, [product])

    if (Array.isArray(listImage[0]?.sUrl?.data)) {
        image = new Buffer(listImage[0]?.sUrl?.data, "base64").toString("binary");
    }

    let newPrice = listVersion[0]?.fGiaBan - listVersion[0]?.fGiaBan * (product?.promotion?.fGiaTriKhuyenMai / 100);

    return (
        <Link to={`/product/${product?.PK_iSanPhamID}`} key={product?.PK_iSanPhamID - "key"}>
            <div className="product-item bg-white">
                <div className="category">{product?.categoryData?.sTenDanhMuc}</div>
                <div className="promotion">Giảm {product?.promotion?.fGiaTriKhuyenMai} %</div>
                <div className="product-item-img">
                    <img src={image} className="img-cover" alt="product-img" />
                </div>
                <div className="product-item-info fs-14">
                    <div className="brand">
                        <span>Nhãn hàng: </span>
                        <span className="fw-7">{product?.brandData?.sTenNhanHang}</span>
                    </div>
                    <div className="title py-2">{product?.sTenSanPham}</div>
                    <div className="price flex align-center justify-center">
                        <span className="old-price">{listVersion[0]?.fGiaBan.toLocaleString("vi-VN")} VNĐ</span>
                        <span className="new-price">{newPrice.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Product;
