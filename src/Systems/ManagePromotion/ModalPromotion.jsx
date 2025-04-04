import React, { useEffect, useState } from 'react';

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import _ from "lodash";
import Select from "react-select";

import './ModalPromotion.scss';


const ModalPromotion = ({ action, show, handleCloseModal, dataModalPromotion, fetchAllPromotion, listProduct }) => {
    const [promotionData, setPromotionData] = useState({
        id: "",
        productId: "",
        valuePromotion: "",
        status: "",
    });

    useEffect(() => {
        if (action === 'CREATE') {
            setPromotionData({
                id: "",
                productId: "",
                valuePromotion: "",
                status: "",
            });
        }
    }, [action]);

    useEffect(() => {
        if (action === 'UPDATE') {
            setPromotionData({
                id: dataModalPromotion?.PK_iKhuyenMaiID,
                productId: dataModalPromotion?.FK_iSanPhamID,
                valuePromotion: dataModalPromotion?.fGiaTriKhuyenMai,
                status: dataModalPromotion?.bTrangThai,
            });
        }
    }, [dataModalPromotion]);

    const handleOnchangeInput = (value, name) => {
        setPromotionData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeSelect = (value, name) => {
        setPromotionData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    console.log(promotionData)

    const checkValidateInput = () => {
        let arr = [
            {
                key: 'productId',
                valueErr: 'Sản phẩm',
            },
            {
                key: 'valuePromotion',
                valueErr: 'Giá trị khuyến mãi',
            },
            {
                key: 'status',
                valueErr: 'Trạng thái',
            },
        ];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            let { key, valueErr } = arr[i];

            if (!promotionData[key]) {
                toast.error(`${valueErr} không được để trống!`);
                check = false;
                break;
            }
        }
        return check;
    };


    //hàm thêm mới hoặc sửa Sản phẩm
    const handleConfirmProductVersion = async () => {
        let checkValid = checkValidateInput();

        if (checkValid) {
            let response =
                action === 'CREATE'
                    ? await axios.post('/api/v1/manage-promotion/create', promotionData)
                    : await axios.put('/api/v1/manage-promotion/update', promotionData);
            if (response?.errorCode === 0) {
                action === 'CREATE'
                    ? toast.success('Thêm mới khuyến mãi thành công!')
                    : toast.success('Câp nhật thông tin khuyến mãi thành công!');
                await fetchAllPromotion();
                handleCloseModal();
                setPromotionData({
                    id: "",
                    productId: "",
                    valuePromotion: "",
                    status: "",
                });
            } else {
                toast.error(response?.errorMessage);
            }
        }
    };

    return (
        <Modal size="xl" show={show} className="custom-modal" onHide={handleCloseModal}>
            <Modal.Header closeButton className="custom-modal-header">
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? <span>Thêm mới khuyến mãi</span> : <span>Sửa khuyến mãi</span>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <div className="content-body">
                    <div className="row">
                        {action !== "UPDATE" && <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Danh sách sản phẩm (<span className='red'>*</span>)</label>
                            <Select
                                value={listProduct.find(option => option.value === promotionData.productId)}
                                onChange={(selectedOption) => handleChangeSelect(selectedOption.value, "productId", true)}
                                options={listProduct}
                                placeholder="Chọn sản phẩm"
                            />
                        </div>}
                        <div className="col-12 col-sm-6 mb-3 form-group">
                            <label>
                                Giá trị khuyến mãi - % (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(parseFloat(e.target.value) || 0, 'valuePromotion')}
                                value={`${promotionData.valuePromotion}`}
                                type="number"
                                step="0.01"
                            />
                        </div>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Trạng thái (<span className='red'>*</span>)</label>
                            <select value={promotionData.status || ""} onChange={(e) => handleChangeSelect(e.target.value, "status")} className='form-select'>
                                <option value="">Chọn</option>
                                <option value="1">Khuyến mãi</option>
                                <option value="0">Hết khuyến mãi</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant="secondary" onClick={handleCloseModal}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={() => handleConfirmProductVersion()}>
                    {action === 'CREATE' ? 'Thêm mới' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalPromotion;
