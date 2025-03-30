import React, { useEffect, useState } from 'react'

import "./NotificationModal.scss"

import { IoMdClose } from "react-icons/io";
import { Buffer } from 'buffer';
import axios from '../../config/axios';

const NotificationModal = ({ notifications, fetchAllNotification }) => {
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
                    notificationId: item?.PK_iThongBaoID,
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

    const handleRemoveNotification = async (notifi) => {
        let response = await axios.delete("/api/v1/notification/delete-notify", { data: { notificationId: notifi?.notificationId } });

        if (response?.errorCode === 0) {
            await fetchAllNotification()
        }

    }

    return (
        <div className='notification-modal'>
            {notificationData?.length > 0
                ?
                <ul className='body'>
                    {notificationData?.length > 0 && notificationData?.map((item, i) => (
                        <li key={`notification-key-${i}`} className='notify-item'>
                            <img className='img' src={item?.thumbnail} alt="img" />
                            <div className='content'>
                                <div className='content-body'>
                                    <span className='title-noti'>{item?.notification}</span>
                                    <span className='title-product'>{item?.productName}</span>
                                </div>
                                <span onClick={() => handleRemoveNotification(item)} className='icon-remove'><IoMdClose size={15} /></span>
                            </div>
                        </li>
                    ))}
                </ul>
                :
                <div className='no-notifi'>Không có thông báo</div>
            }

        </div>
    )
}

export default NotificationModal