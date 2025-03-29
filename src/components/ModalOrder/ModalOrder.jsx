import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';

import "./ModalOrder.scss"
import { FaLocationDot } from "react-icons/fa6";
import axios from '../../config/axios';
import _ from "lodash";
import { toast } from 'react-toastify';


const ModalOrder = ({ show, setIsShowModalOrder, dataOrder }) => {
    let id = dataOrder?.userId

    const [userInfo, setUserInfo] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState(null)
    const [statusPayment, setStatusPayment] = useState(null)    // trạng thái thanh toán với thanh toán online

    const fetchUserInfo = async () => {
        const res = await axios.get(`/api/v1/user/get-info?id=${id}`)
        if (res?.errorCode === 0 && !_.isEmpty(res?.data)) {
            setUserInfo(res?.data)
        }
    }

    useEffect(() => {
        fetchUserInfo()
    }, [id])

    const handleChangeSelect = (e) => {
        if (e.target.value === "COD") {
            setPaymentMethod(e.target.value)
            setStatusPayment("Chưa thanh toán")
        }
    }

    console.log(dataOrder)

    const handleConfirmOrder = async () => {
        if (paymentMethod !== null) {

            let data = dataOrder?.orderDetails.map((
                { thumbnail, color, productName, ...rest }) => rest
            )

            let dataOrderConfirm = {
                userId: dataOrder?.userId,
                totalPrice: dataOrder?.totalPrice,
                shipFee: 0,
                paymentMethod: paymentMethod,
                statusPayment: statusPayment,
                orderDetails: data
            }

            console.log(dataOrderConfirm)

            const res = await axios.post(`/api/v1/order/order-product`, dataOrderConfirm)

            if (res.errorCode === 0) {
                setIsShowModalOrder(false)
                await toast.success("Đơn hàng được đặt thành công!")
                window.location.href = "/";
            }

        } else {
            toast.info("Bạn hãy chọn phương thức thanh toán!")
        }
    }

    return (
        <Modal show={show} fullscreen="xl-down" onHide={() => setIsShowModalOrder(false)} className="custom-modal-order">
            <Modal.Header closeButton className="custom-modal-order-header">
                <Modal.Title>Xác nhận thông tin đơn hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-order-body">
                <div className='location'>
                    <div className='location-title'>
                        <FaLocationDot />
                        <span>Địa chỉ nhận hàng</span>
                    </div>
                    <div className='location-info'>
                        <span>{userInfo?.sHoTen} - {userInfo?.sSoDienThoai}, {userInfo?.sDiaChi}</span>
                    </div>
                </div>
                <div className='product-order'>
                    <div className='order-item order-header'>
                        <div className="order-cth">
                            <span className="order-ctxt">Sản phẩm</span>
                        </div>
                        <div className="order-cth">
                            <span className="order-ctxt">Đơn giá</span>
                        </div>
                        <div className="order-cth">
                            <span className="order-ctxt">Số lượng</span>
                        </div>
                        <div className="order-cth">
                            <span className="order-ctxt">Số tiền</span>
                        </div>
                    </div>
                    {dataOrder?.orderDetails?.length > 0 && dataOrder?.orderDetails?.map((item, i) => (
                        <div key={`item-order-${item?.productVersionId}-${i}`} className='order-item order-body'>
                            <div className="order-ctd">
                                <div className="order-product-img">
                                    <img src={item?.thumbnail} className="img-cover" alt="img" />
                                </div>
                                <div className='product-info'>
                                    <span className='name'>{item?.productName}</span>
                                    <span className='color'>{item?.color}</span>
                                </div>
                            </div>
                            <div className="order-ctd">
                                <span className="cart-ctxt text-orange price-new">{item?.priceNew?.toLocaleString("vi-VN")} đ</span>
                            </div>
                            <div className="order-ctd">
                                <span className="cart-ctxt ">{item?.quantity} </span>
                            </div>
                            <div className="order-ctd">
                                <span className="cart-ctxt text-orange">{item?.amount?.toLocaleString("vi-VN")} đ</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='payment'>
                    <span>Phương thức thanh toán</span>
                    <select onChange={(e) => handleChangeSelect(e)}>
                        <option value="">Chọn phương thức</option>
                        <option value="COD">Thanh toán khi nhận hàng</option>
                        <option value="TTOL">Thanh toán Online</option>
                    </select>
                </div>

                <div className="total mt-5 flex align-center justify-end">
                    <div className="font-manrope fw-5">Tổng tiền ({dataOrder?.quantityProduct} sp:)</div>
                    <span className="text-orange fs-22 mx-2 fw-6">{dataOrder?.totalPrice.toLocaleString("vi-VN")} đ</span>
                </div>
            </Modal.Body>
            <Modal.Footer className="custom-modal-order-footer">
                <Button variant="secondary" onClick={() => setIsShowModalOrder(false)}>
                    Quay lại!
                </Button>
                <Button variant="primary" onClick={() => handleConfirmOrder()}>
                    Xác nhận!
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalOrder