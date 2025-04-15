import React, { useState } from 'react'

import "./FeedbackPage.scss"
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import axios from '../../config/axios';
import { useNavigate } from 'react-router-dom';


const FeedbackPage = () => {
    const [feedback, setFeedback] = useState("")

    const user = useSelector(state => state.userInfo.user);
    const navigate = useNavigate()

    const handleChangeInput = (value) => {
        setFeedback(value)
    }

    console.log(user)

    const handleSendFeedback = async () => {
        if (feedback === "") {
            toast.info("Hãy nhập phản hồi của bạn!")
        }

        const response = await axios.post("/api/v1/user/send-feedback", { id: user?.userId, dataFeedback: feedback });
        if (response?.errorCode === 0) {
            toast.success("Phản hồi của bạn đã được ghi nhận!")
            navigate("/")
        } else {
            toast.error("Đã xảy ra lỗi. Hãy thử lại sau!")
        }
    }

    return (
        <div className='container-feedback'>
            <div className="feedback-box">
                <h2 className='feedback-title'>Hãy gửi phản hồi cho chúng tôi!</h2>
                <span className='text-gray'>{"(Phản hồi của bạn sẽ giúp chúng tôi cải thiện hệ thống của mình!)"}</span>
                <div className='body-content'>
                    <textarea onChange={(e) => handleChangeInput(e.target.value)} name="message" rows="5" cols={70} placeholder="Phản hồi của bạn..." required></textarea>
                </div>
                <button onClick={() => handleSendFeedback()} className='btn-feedback' type="submit">Gửi phản hồi</button>
            </div>

        </div>
    )
}

export default FeedbackPage