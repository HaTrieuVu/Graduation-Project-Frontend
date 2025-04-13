import React, { useEffect, useState } from 'react'

import "./PurchaseOrder.scss"

import { Link, useLocation } from 'react-router-dom';
import { FaTruckFast } from "react-icons/fa6";
import imgNoOrder from "../../assets/no-order.png"
import { useSelector } from 'react-redux';
import axios from '../../config/axios';
import _ from "lodash"
import Loader from '../Loader/Loader';
import { Buffer } from 'buffer';

const PurchaseOrder = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");

    const user = useSelector(state => state.userInfo.user);

    const [orderList, setOrderList] = useState([])
    const [isLoadingOrderList, setIsLoadingOrderList] = useState(false)

    // convert lại data trả về (chuyển ảnh từ buffer sang base64)
    const convertOrdersImageToBase64 = (orders) => {
        return orders.map(order => {
            return {
                ...order,
                orderDetails: order.orderDetails.map(detail => {
                    const productVersion = detail.productVersion;
                    const productImages = productVersion?.productImages;

                    if (productImages && productImages.sUrl && productImages.sUrl.data) {
                        const byteArray = productImages.sUrl.data;
                        const base64String = new Buffer(byteArray, "base64").toString("binary");

                        return {
                            ...detail,
                            productVersion: {
                                ...productVersion,
                                productImages: {
                                    ...productImages,
                                    sUrl: base64String
                                }
                            }
                        };
                    }
                    return detail; // Trường hợp không có ảnh
                })
            };
        });
    };

    // hàm lấy tất cả đơn hàng của 1 người dùng
    const fetchAllOrderList = async (id, type) => {
        const res = await axios.get(`/api/v1/order/get-all-purchase?userId=${id}&type=${type}`)

        if (res?.errorCode === 0 && !_.isEmpty(res?.data)) {
            let data = convertOrdersImageToBase64(res?.data)
            setOrderList(data)
            setIsLoadingOrderList(true)
        } else {
            setOrderList([])
            setIsLoadingOrderList(true)
        }
    }

    useEffect(() => {
        let userId = user?.userId
        fetchAllOrderList(userId, type)
    }, [user, type])

    return (
        <div className='container container-purchase'>
            <section className='purchase-header'>
                <Link className={`item-header ${type === "all" ? "selected" : ""}`} to="/user/purchase?type=all">Tất cả</Link>
                <Link className={`item-header ${type === "1" ? "selected" : ""}`} to="/user/purchase?type=1">Chờ xác nhận</Link>
                <Link className={`item-header ${type === "2" ? "selected" : ""}`} to="/user/purchase?type=2">Đang giao hàng</Link>
                <Link className={`item-header ${type === "3" ? "selected" : ""}`} to="/user/purchase?type=3">Hoàn thành</Link>
                <Link className={`item-header ${type === "4" ? "selected" : ""}`} to="/user/purchase?type=4">Đã hủy</Link>
            </section>
            <main className='purchase-main'>
                {isLoadingOrderList === false ? <Loader />
                    :
                    (orderList?.length > 0
                        ? orderList?.map((item, i) => (
                            <div key={`purchase-item-${i}-key`} className='purchase-item'>
                                <div className='purchase-item-info'>
                                    <div className='info-header'>
                                        <span>Mã đơn hàng: #1111{item?.PK_iDonMuaHangID}</span>
                                        <div className='more-info'>
                                            {(item?.sTrangThaiDonHang === "Giao hàng thành công" || item?.sTrangThaiDonHang === "Đang giao hàng") && <span className='info-1'><FaTruckFast />{item?.sTrangThaiDonHang}</span>}
                                            <span className='info-2'>{item?.sTrangThaiDonHang === "Giao hàng thành công" ? "Hoàn thành" : item?.sTrangThaiDonHang}</span>
                                        </div>
                                    </div>
                                    <div className='info-body'>
                                        {item?.orderDetails?.length > 0 && item?.orderDetails?.map((order, index) => (
                                            <div key={`order-item-${index}-key`} className='item'>
                                                <div className='item-left'>
                                                    <img src={order?.productVersion?.productImages?.sUrl || null} alt="img" />
                                                    <div className='item-left-box'>
                                                        <div className='item-left-title'>
                                                            <span>{order?.productVersion?.productData?.sTenSanPham}</span>
                                                        </div>
                                                        <div className='item-left-info'>
                                                            <span className='color'>Màu sắc: {order?.productVersion?.productImages?.sMoTa}</span>
                                                            <span className='quantity'>Số lượng: {order?.iSoLuong}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='item-right'>
                                                    <span className='price-old'>{order?.productVersion?.fGiaBan.toLocaleString("vi-VN")} đ</span>
                                                    <span className='price-new'>{order?.fGiaBan.toLocaleString("vi-VN")} đ</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='purchase-item-price'>
                                    <div className='box-price'>
                                        <label>Thành tiền: </label>
                                        <span>{item?.fTongTien?.toLocaleString("vi-VN")} đ</span>
                                    </div>
                                </div>
                            </div>
                        )) :
                        <div className='no-list'>
                            <img src={imgNoOrder} alt="no-order" />
                            <span>Không có đơn hàng!</span>
                        </div>
                    )
                }
            </main>
        </div>
    )
}

export default PurchaseOrder