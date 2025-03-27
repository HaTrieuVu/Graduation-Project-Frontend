import React, { useEffect, useState } from 'react'

import "./CartModal.scss"
import img_shopping_cart from "../../assets/shopping_cart.png"
import { Buffer } from 'buffer';
import { Link } from 'react-router-dom';

// hàm convert ảnh từ buffer sang base 64 và lấy các thuộc tính cần thiết của cartData
const convertArrayData = (cartsData) => {
    if (Array.isArray(cartsData)) {
        return cartsData?.map((item) => {
            let image = "";
            if (Array.isArray(item?.productVersions?.productImages?.sUrl?.data)) {
                image = new Buffer(item?.productVersions?.productImages?.sUrl?.data, "base64").toString("binary");
            }
            return {
                cartDetailId: item?.PK_iChiTietGioHangID,
                thumbnail: image,
                productName: item?.productVersions?.productData?.sTenSanPham,
                price: item?.productVersions?.fGiaBan,
                quantity: item?.iSoLuong,
                promotion: item?.productVersions?.productData?.promotion?.fGiaTriKhuyenMai,
                color: item?.productVersions?.productImages?.sMoTa
            };
        });
    }
};

const CartModal = ({ carts }) => {
    const [cartsData, setCartsData] = useState([])

    useEffect(() => {
        let cartsArr = convertArrayData(carts)

        setCartsData(cartsArr)
    }, [carts])

    return (
        <div className="cart-modal">
            <h5 className="cart-modal-title font-manrope text-center">Sản phẩm trong giỏ hàng</h5>
            {cartsData?.length > 0 ? (
                <div className="cart-modal-list grid">
                    {cartsData?.map((cart) => (
                        <Link to="/cart" key={`key-cart-modal-${cart?.cartDetailId}`}>
                            <div className="cart-modal-item grid align-center font-manrope py-2">
                                <div className="cart-modal-item-img">
                                    <img src={cart?.thumbnail} className="img-cover" alt="img-cart" />
                                </div>
                                <div className='cart-modal-item-body'>
                                    <div className="cart-modal-item-title font-manrope text-capitalize">
                                        {cart?.productName}
                                    </div>
                                    <div className="cart-modal-item-price text-orange fs-14 fw-6">
                                        {(cart?.price - cart?.price * (cart?.promotion / 100)).toLocaleString("vi-VN")} VNĐ
                                    </div>
                                </div>
                                <div className="cart-modal-item-info fs-14 fw-6">
                                    <span className='text-orange'>x{cart?.quantity}</span>
                                    <span>{cart?.color}</span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    <Link
                        to={'/cart'}
                        className="view-cart-btn text-capitalize bg-orange fs-15 font-manrope text-center"
                    >
                        Đến giỏ hàng
                    </Link>
                </div>
            ) : (
                <div className="cart-modal-empty flex flex-column align-center justify-center">
                    <img src={img_shopping_cart} alt="shopping_cart-img" />
                    <h6 className="text-dark fw-4">Không có sản phẩm</h6>
                </div>
            )}
        </div>
    )
}

export default CartModal