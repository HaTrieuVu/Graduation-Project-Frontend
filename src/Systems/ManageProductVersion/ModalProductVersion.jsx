import React, { useEffect, useState } from 'react';

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

import './ModalProductVersion.scss';


const ModalProductVersion = ({ action, show, handleCloseModal, dataModalProductVersion, fetchAllProductVersion }) => {
    const [productVersionData, setProductData] = useState({
        id: "",
        productId: "",
        color: "",
        capacity: "",
        price: "",
        quantity: "",
        status: "",
    });

    const [listProduct, setListProduct] = useState([])

    useEffect(() => {
        fetchGetProduct()
    }, [])

    useEffect(() => {
        if (action === 'CREATE') {
            setProductData({
                id: "",
                productId: "",
                color: "",
                capacity: "",
                price: "",
                quantity: "",
                status: "",
            });
        }
    }, [action]);

    useEffect(() => {
        if (action === 'UPDATE') {
            setProductData({
                id: dataModalProductVersion?.PK_iPhienBanID,
                productId: dataModalProductVersion?.FK_iSanPhamID,
                color: dataModalProductVersion?.sMauSac,
                capacity: dataModalProductVersion?.sDungLuong,
                price: dataModalProductVersion?.fGiaBan,
                quantity: dataModalProductVersion?.iSoLuong,
                status: dataModalProductVersion?.bTrangThai,
            });
        }
    }, [dataModalProductVersion]);

    const fetchGetProduct = async () => {
        let respone = await axios.get("/api/v1/manage-product/get-all")
        if (respone?.data?.errorCode === 0 && respone?.data?.data?.length > 0) {
            setListProduct(respone?.data?.data)
        }
    }

    const handleOnchangeInput = (value, name) => {
        setProductData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeSelect = (e, name) => {
        setProductData(prev => ({
            ...prev,
            [name]: e.target.value
        }))
    }


    const checkValidateInput = () => {
        let arr = [
            {
                key: 'productId',
                valueErr: 'Tên Sản phẩm',
            },
            {
                key: 'color',
                valueErr: 'Màu sắc',
            },
            {
                key: 'capacity',
                valueErr: 'Dung lượng',
            },
            {
                key: 'price',
                valueErr: 'Giá bán',
            },
            {
                key: 'quantity',
                valueErr: 'Số lượng',
            },
            {
                key: 'status',
                valueErr: 'Tình trạng',
            },
        ];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            let { key, valueErr } = arr[i];

            if (!productVersionData[key]) {
                toast.error(`${valueErr} không được để trống!`);
                check = false;
                break;
            }
        }
        return check;
    };


    //hàm thêm mới hoặc sửa Sản phẩm
    const handleConfirmUser = async () => {
        let checkValid = checkValidateInput();

        if (checkValid) {
            let respone =
                action === 'CREATE'
                    ? await axios.post('/api/v1/manage-product-version/create', productVersionData)
                    : await axios.put('/api/v1/manage-product-version/update', productVersionData);
            if (respone?.data?.errorCode === 0) {
                action === 'CREATE'
                    ? toast.success('Thêm mới Sản phẩm - phiên bản thành công!')
                    : toast.success('Câp nhật thông tin Sản phẩm - phiên bản thành công!');
                await fetchAllProductVersion();
                handleCloseModal();
                setProductData({
                    id: "",
                    productId: "",
                    color: "",
                    capacity: "",
                    price: "",
                    quantity: "",
                    status: "",
                });
            } else {
                toast.error(respone?.data?.errorMessage);
            }
        }
    };

    return (
        <Modal size="xl" show={show} className="custom-modal" onHide={handleCloseModal}>
            <Modal.Header closeButton className="custom-modal-header">
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? <span>Thêm mới Sản phẩm - phiên bản</span> : <span>Sửa Sản phẩm - phiên bản</span>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <div className="content-body">
                    <div className="row">

                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Danh sách sản phẩm (<span className='red'>*</span>)</label>
                            <select value={productVersionData.productId || ""} onChange={(e) => handleChangeSelect(e, "productId")} className='form-select'>
                                <option value="">Chọn sản phẩm</option>
                                {
                                    listProduct?.length > 0 && listProduct.map((item) => (
                                        <option key={`product-version-${item?.PK_iSanPhamID}`} value={item?.PK_iSanPhamID}>{item?.sTenSanPham}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="col-12 col-sm-6 mb-3 form-group">
                            <label>
                                Màu sắc (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'color')}
                                value={productVersionData.color}
                                type="text"
                            />
                        </div>

                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Dung lượng (<span className='red'>*</span>)</label>
                            <select value={productVersionData.capacity || ""} onChange={(e) => handleChangeSelect(e, "capacity")} className='form-select'>
                                <option value="">Chọn dung lượng</option>
                                <option value="32GB">32GB</option>
                                <option value="64GB">64GB</option>
                                <option value="128GB">128GB</option>
                                <option value="256GB">256GB</option>
                                <option value="512GB">512GB</option>
                                <option value="1TB">1TB</option>
                            </select>
                        </div>

                        <div className="col-12 col-sm-6 mb-3 form-group">
                            <label>
                                Giá bán (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(parseFloat(e.target.value) || 0, 'price')}
                                value={productVersionData.price}
                                type="number"
                                step="0.01"
                            />
                        </div>

                        <div className="col-12 col-sm-6 mb-3 form-group">
                            <label>
                                Số lượng (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(parseInt(e.target.value) || 0, 'quantity')}
                                value={productVersionData.quantity}
                                type="number"
                                step="1"
                                min="1"
                                onKeyDown={(e) => e.key === "." && e.preventDefault()} // Chặn nhập dấu chấm
                            />
                        </div>

                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Trạng thái (<span className='red'>*</span>)</label>
                            <select value={productVersionData.status || ""} onChange={(e) => handleChangeSelect(e, "status")} className='form-select'>
                                <option value="">Chọn</option>
                                <option value="1">Còn hàng</option>
                                <option value="0">Hết hàng</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant="secondary" onClick={handleCloseModal}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={() => handleConfirmUser()}>
                    {action === 'CREATE' ? 'Thêm mới' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalProductVersion;
