import React, { useEffect, useState } from 'react'

import "./NotificationModal.scss"

import img from "../../assets/user.png"
import { IoMdClose } from "react-icons/io";
import { Buffer } from 'buffer';

const NotificationModal = ({ notifications }) => {
    const [notificationData, setNotificationData] = useState([])

    // hàm convert ảnh từ buffer sang base 64 và sửa lại data
    const convertArrayData = (data) => {
        if (Array.isArray(data)) {
            return data?.map((item) => {
                let image = "";
                if (Array.isArray(item?.order?.orderDetails?.productVersion?.productImages?.sUrl?.data)) {
                    image = new Buffer(item?.order?.orderDetails?.productVersion?.productImages?.sUrl?.data, "base64").toString("binary");
                }
                return {
                    notification: item?.sNoiDung,
                    thumbnail: image,
                    productName: item?.order?.orderDetails?.productVersion?.productData?.sTenSanPham,
                };
            });
        }
    };

    useEffect(() => {
        let arrNotification = convertArrayData(notifications)

        setNotificationData(arrNotification)

    }, [notifications])

    console.log(notificationData)



    return (
        <div className='notification-modal'>
            <ul className='body'>
                {notificationData?.length > 0 && notificationData?.map((item, i) => (
                    <li key={`notification-key-${i}`} className='notify-item'>
                        <img className='img' src={item?.thumbnail} alt="img" />
                        <div className='content'>
                            <div className='content-body'>
                                <span className='title-noti'>{item?.notification}</span>
                                <span className='title-product'>{item?.productName}</span>
                            </div>
                            <span className='icon-remove'><IoMdClose size={15} /></span>
                        </div>
                    </li>
                ))}

            </ul>
        </div>
    )
}

export default NotificationModal