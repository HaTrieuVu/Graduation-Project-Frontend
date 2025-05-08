import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';

import "./ModalOrder.scss"
import { FaLocationDot } from "react-icons/fa6";
import axios from '../../config/axios';
import _ from "lodash";
import { toast } from 'react-toastify';

import zaloIcon from "../../assets/Logo-ZaloPay-Square.webp"
import momoIcon from "../../assets/MoMo_Logo.png"
import vnPayIcon from "../../assets/vnpay-logo-vinadesign-25-12-57-55.jpg"
import Loader from '../Loader/Loader';
import { FaRegEdit } from "react-icons/fa";



const ModalOrder = ({ show, setIsShowModalOrder, dataOrder }) => {
    let id = dataOrder?.userId

    const [userInfo, setUserInfo] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState(null)
    const [statusPayment, setStatusPayment] = useState(null)    // trạng thái thanh toán với thanh toán online

    const [dataUrlPayment, setDataUrlPayment] = useState(null)          // lưu các đường dẫn thanh toán
    const [isLoadingDataUrl, setIsLoadingDataUrl] = useState(false)     // trạng thái xem load xong data thanh toán từ server
    const [paymentSelected, setPaymentSelected] = useState(null)          // lưu xem thanh toán bằng thẻ nào
    const [appTransIdZaloPay, setAppTransIdZaloPay] = useState(null)        // id đơn giao dịch của zalopay
    const [appOrderIdMoMo, setAppOrderIdMoMo] = useState(null)                      // id đơn giao dịch của momo
    const [dataOrderVnPay, setDataOrderVnPay] = useState(null)                     // id, createDate của đơn giao dịch của vnpay
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
    const [deliveryAddress, setDeliveryAddress] = useState(null)
    const [isShowEditAddrees, setIsShowEditAddrees] = useState(false)

    const fetchUserInfo = async () => {
        const res = await axios.get(`/api/v1/user/get-info?id=${id}`)
        if (res?.errorCode === 0 && !_.isEmpty(res?.data)) {
            setUserInfo(res?.data)
        }
    }

    useEffect(() => {
        fetchUserInfo()
    }, [id])

    // chọn phương thức thanh toán nào
    const handleChangeSelect = async (e) => {
        const method = e.target.value;
        setPaymentMethod(method);

        if (method === "None") return;

        if (method === "COD") {
            setStatusPayment("Chưa thanh toán");
            return;
        }

        if (method === "TTOL") {
            const data = dataOrder?.orderDetails.map(({ thumbnail, color, productName, ...rest }) => rest);

            const order = {
                items: data,
                totalPrice: dataOrder?.totalPrice,
            };

            try {
                const [resZaloPay, resMomo, resVnPay] = await Promise.all([
                    axios.post("/api/v1/payment-zalo-pay/order", order),
                    axios.post("/api/v1/payment-momo/order", order),
                    axios.post("/api/v1/payment-vnpay/order", {
                        "amount": dataOrder?.totalPrice,
                        "bankCode": "NCB",
                        "orderDescription": "Thanh toán đơn hàng",
                        "orderType": "other",
                        "language": "vn"
                    }),
                ]);
                if (
                    resZaloPay?.data?.return_code === 1 &&
                    resMomo?.data?.resultCode === 0 &&
                    resVnPay?.result_code === 0
                ) {
                    setDataUrlPayment({
                        orderURLZaloPay: resZaloPay?.data?.order_url,
                        orderURLMoMo: resMomo?.data?.shortLink,
                        orderURLVnPay: resVnPay?.paymentUrl,
                    });
                    setAppTransIdZaloPay(resZaloPay?.app_trans_id);
                    setAppOrderIdMoMo(resMomo?.data?.orderId);
                    setDataOrderVnPay({ orderId: resVnPay?.orderId, transDate: resVnPay?.createDate });
                    setIsLoadingDataUrl(true);
                }
            } catch (error) {
                console.error("Lỗi khi khởi tạo thanh toán:", error);
                toast.error("Không thể tạo đơn thanh toán. Vui lòng thử lại.");
            }
        }
    };

    // xác nhận đơn hàng
    const handleConfirmOrder = async () => {
        if (paymentMethod === "None") {
            toast.info("Bạn hãy chọn phương thức thanh toán!")
            return
        }
        if (isShowEditAddrees && (deliveryAddress === null || deliveryAddress === "")) {
            toast.info("Bạn hãy nhập địa chỉ giao hàng mới!")
            return
        }
        if (paymentMethod !== null) {

            if (paymentMethod === "TTOL") {
                if (paymentSelected === null) {
                    toast.info("Hãy chọn cổng thành toán!")
                    return
                }
                if (!isPaymentSuccess) {
                    toast.warning("Đơn hàng của bạn chưa được thanh toán. Hãy cập nhật!")
                    return
                }
            }

            let data = dataOrder?.orderDetails.map((
                { thumbnail, color, productName, ...rest }) => rest
            )

            let dataOrderConfirm = {
                userId: dataOrder?.userId,
                totalPrice: dataOrder?.totalPrice,
                shipFee: 0,
                paymentMethod: paymentMethod,
                statusPayment: statusPayment,
                paymentGateway: paymentSelected,
                orderDetails: data,
                deliveryAddress
            }
            const res = await axios.post(`/api/v1/order/order-product`, dataOrderConfirm)

            if (res.errorCode === 0) {
                setIsShowModalOrder(false)
                await toast.success("Đơn hàng được đặt thành công!")
                window.location.href = "/";
            }

            if (res?.errorCode === -2) {
                setIsShowModalOrder(false)
                toast.error("Số lượng mua của bạn không đủ tồn kho!")
            }
        } else {
            toast.info("Bạn hãy chọn phương thức thanh toán!")
        }
    }

    // click chọn thanh toán qua cổng nào
    const handlePayment = (payment) => {
        if (paymentSelected !== null) {
            toast.info("Bạn đã chọn cổng thanh toán rồi!");
            return
        }
        setPaymentSelected(payment);
        const paymentUrls = {
            zalopay: dataUrlPayment?.orderURLZaloPay,
            momo: dataUrlPayment?.orderURLMoMo,
            vnpay: dataUrlPayment?.orderURLVnPay,
        };

        const url = paymentUrls[payment];
        if (url) {
            window.open(url, "_blank");
        } else {
            console.warn(`Không có đường dẫn thanh toán cho ${payment}.`);
        }
    };

    // cập nhật trạng thái đơn hàng
    const handleUpdateStatusPayment = async () => {
        if (paymentSelected === "zalopay") {
            const resStatusOrderZaloPay = await axios.post(`/api/v1/payment-zalo-pay/check-status`, { app_trans_id: appTransIdZaloPay })

            if (resStatusOrderZaloPay?.return_code === 1) {
                setStatusPayment("Đã thanh toán")
                setIsPaymentSuccess(true)
                toast.success("Đơn hàng của bạn đã được thành toán thành công!")
            }
            if (resStatusOrderZaloPay?.return_code === 3) {
                toast.error("Đơn hàng chưa được thanh toán. Hãy thanh toán!")
            }
        }

        if (paymentSelected === "momo") {
            const resStatusOrderMoMo = await axios.post(`/api/v1/payment-momo/check-status`, { orderId: appOrderIdMoMo })

            if (resStatusOrderMoMo?.resultCode === 0) {
                setStatusPayment("Đã thanh toán")
                setIsPaymentSuccess(true)
                toast.success("Đơn hàng của bạn đã được thành toán thành công!")
            }
            if (resStatusOrderMoMo?.resultCode === 1000) {
                toast.error("Đơn hàng chưa được thanh toán. Hãy thanh toán!")
            }
        }

        if (paymentSelected === "vnpay") {
            const resStatusOrderVnPay = await axios.post(`/api/v1/payment-vnpay/check-status`, dataOrderVnPay)

            if (resStatusOrderVnPay?.success === true && resStatusOrderVnPay?.data?.vnp_TransactionStatus === "00") {
                setStatusPayment("Đã thanh toán")
                setIsPaymentSuccess(true)
                toast.success("Đơn hàng của bạn đã được thành toán thành công!")
            }
            if (resStatusOrderVnPay?.success === true && resStatusOrderVnPay?.data?.vnp_TransactionStatus === "01") {
                toast.error("Đơn hàng chưa được thanh toán. Hãy thanh toán!")
            }
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
                        {!isShowEditAddrees ? <span>{userInfo?.sHoTen} - {userInfo?.sSoDienThoai} - {userInfo?.sDiaChi}</span> : <span>{userInfo?.sHoTen} - {userInfo?.sSoDienThoai} - {deliveryAddress}</span>}
                        <button onClick={() => setIsShowEditAddrees(prev => !prev)} className='btn-edit-address' title="Sửa địa chỉ nhận hàng">
                            <FaRegEdit />
                        </button>
                    </div>
                    {isShowEditAddrees && <input className='input-change-address' onChange={(e) => setDeliveryAddress(e.target.value.trim())} type="text" placeholder='Địa chỉ giao hàng...' />}
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
                        <option value="None">Chọn phương thức</option>
                        <option value="COD">Thanh toán khi nhận hàng</option>
                        <option value="TTOL">Thanh toán Online</option>
                    </select>
                </div>

                {isPaymentSuccess ? <div className='payment-success'>
                    <span>Đơn hàng đã được thành toán thành công. Hãy chọn xác nhận!</span>
                </div> : isLoadingDataUrl === false && paymentMethod === "TTOL" ? <Loader />
                    :
                    dataUrlPayment !== null && paymentMethod === "TTOL" && <div className='paymeny-logo'>
                        <div className='box-img'>
                            <div onClick={() => handlePayment("zalopay")} className={`box-img-payment ${paymentSelected === "zalopay" ? "active" : ""}`}>
                                <img src={zaloIcon} alt="" />
                            </div>
                            <div onClick={() => handlePayment("momo")} className={`box-img-payment ${paymentSelected === "momo" ? "active" : ""}`}>
                                <img src={momoIcon} alt="" />
                            </div>
                            <div onClick={() => handlePayment("vnpay")} className={`box-img-payment ${paymentSelected === "vnpay" ? "active" : ""}`}>
                                <img src={vnPayIcon} alt="" />
                            </div>
                        </div>

                        {paymentSelected !== null && <div className='update-box'>
                            <button onClick={() => handleUpdateStatusPayment()} className='update-btn'>Cập nhật</button>
                        </div>}
                    </div>
                }

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