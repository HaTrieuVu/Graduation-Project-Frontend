import React, { useState } from 'react'

import "./ProductParameter.scss"
import _ from "lodash";


const ProductParameter = ({ dataProductParameters, dataselectedVersion }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
        setActiveIndex(prevIndex => prevIndex === index ? null : index);
    };

    let dataParameters = []

    if (!_.isEmpty(dataProductParameters)) {
        dataParameters = [
            {
                title: "Cấu hình & Bộ nhớ",
                items: [
                    { label: "Hệ điều hành:", value: dataProductParameters?.sHeDieuHanh },
                    { label: "Chip xử lý (CPU):", value: dataProductParameters?.sCPU },
                    { label: "Tốc độ CPU:", value: dataProductParameters?.sTocDoCPU },
                    { label: "Chip đồ họa (GPU):", value: dataProductParameters?.sGPU },
                    { label: "RAM:", value: dataProductParameters?.sRAM },
                    { label: "Dung lượng lưu trữ:", value: !_.isEmpty(dataselectedVersion) ? dataselectedVersion?.sDungLuong : "?" },
                    { label: "Dung lượng còn lại (khả dụng) khoảng:", value: !_.isEmpty(dataselectedVersion) ? dataselectedVersion?.sDungLuongKhaDung : "?" },
                ]
            },
            {
                title: "Camera & Màn hình",
                items: [
                    { label: "Độ phân giải camera sau:", value: dataProductParameters?.sCameraSau },
                    { label: "Độ phân giải camera trước:", value: dataProductParameters?.sCameraTruoc },
                    { label: "Màn hình rộng:", value: dataProductParameters?.sManHinh },
                ]
            },
            {
                title: "Pin & Sạc",
                items: [
                    { label: "Dung lượng pin:", value: dataProductParameters?.sPin },
                    { label: "Loại pin:", value: dataProductParameters?.sLoaiPin },
                    { label: "Hỗ trợ sạc tối đa:", value: dataProductParameters?.sSac },
                ]
            },
        ];
    } else {
        dataParameters = [
            {
                title: "Cấu hình & Bộ nhớ",
            },
            {
                title: "Camera & Màn hình",
            },
            {
                title: "Pin & Sạc",
            },
        ];
    }

    return (
        <div className='product-parameter-main'>
            <h2 className='title-parameter'>Thông số kỹ thuật</h2>
            <div className='specification-item'>
                <div className='box-specifi'>
                    {dataParameters?.length > 0 && dataParameters?.map((section, index) => (
                        <div className='item-specifi' key={`item-specifi-key-${index}`}>
                            <span
                                className={`title-specifi ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => handleToggle(index)}
                            >
                                {section.title}
                            </span>
                            <ul className={`text-specifi ${activeIndex === index ? 'active' : ''}`}>
                                {section?.items?.map((item, idx) => (
                                    <li className='text-specifi-item' key={`specifi-item-key-${idx}`}>
                                        <aside>{item?.label}</aside>
                                        <aside>{item?.value}</aside>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductParameter