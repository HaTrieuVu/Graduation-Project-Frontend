import React, { useCallback, useEffect, useState } from 'react';

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import _ from "lodash";

import './ModalProductVersion.scss';


const ModalProductVersion = ({ action, show, handleCloseModal, dataModalProductVersion, fetchAllProductVersion }) => {
    const [productVersionData, setProductVersionData] = useState({
        id: "",
        productId: "",
        productImageId: "",
        capacity: "",
        price: "",
        quantity: "",
        status: "",
    });

    const [selectedProductId, setSelectedProductId] = useState(null)
    const [listProduct, setListProduct] = useState([])
    const [listColor, setlistColor] = useState({})          // list color của 1 sản phẩm (lấy theo productImage)

    const fetchGetProduct = async () => {
        let response = await axios.get("/api/v1/manage-product/get-all")
        if (response?.errorCode === 0 && response?.data?.length > 0) {
            setListProduct(response?.data)
        }
    }

    //hàm lấy tất cả các màu của product
    const fetchAllColorOfProduct = useCallback(async () => {
        if (!selectedProductId) return;

        let response = await axios.get(`/api/v1/manage-product-version/get-all-image?id=${selectedProductId}`);
        if (response?.errorCode === 0 && !_.isEmpty(response?.data) && response?.data?.images?.length > 0) {
            setlistColor(response?.data?.images)
        }
    }, [selectedProductId]); // Chỉ thay đổi khi `selectedProductId` đổi

    useEffect(() => {
        fetchGetProduct()
    }, [])

    useEffect(() => {
        if (action === 'CREATE') {
            setProductVersionData({
                id: "",
                productId: "",
                productImageId: "",
                capacity: "",
                price: "",
                quantity: "",
                status: "",
            });
        }
    }, [action]);

    useEffect(() => {
        if (action === 'UPDATE') {
            setProductVersionData({
                id: dataModalProductVersion?.PK_iPhienBanID,
                productId: dataModalProductVersion?.FK_iSanPhamID,
                productImageId: dataModalProductVersion?.FK_iHinhAnhID,
                capacity: dataModalProductVersion?.sDungLuong,
                price: dataModalProductVersion?.fGiaBan,
                quantity: dataModalProductVersion?.iSoLuong,
                status: dataModalProductVersion?.bTrangThai,
            });
        }
    }, [dataModalProductVersion]);

    useEffect(() => {
        fetchAllColorOfProduct();
    }, [fetchAllColorOfProduct]);

    // Theo dõi productVersionData và cập nhật selectedProductId
    useEffect(() => {
        if (productVersionData?.productId) {
            setSelectedProductId(productVersionData.productId);
        }
    }, [productVersionData]);

    const handleOnchangeInput = (value, name) => {
        setProductVersionData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeSelect = (e, name) => {
        setProductVersionData((prev) => {
            const updatedData = {
                ...prev,
                [name]: e.target.value
            };

            // Cập nhật selectedProductId sau khi state đã được cập nhật
            if (name === "productId") {
                setSelectedProductId(updatedData.productId);
            }

            return updatedData;
        });
    }

    const checkValidateInput = () => {
        let arr = [
            {
                key: 'productId',
                valueErr: 'Tên Sản phẩm',
            },
            {
                key: 'productImageId',
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
            let response =
                action === 'CREATE'
                    ? await axios.post('/api/v1/manage-product-version/create', productVersionData)
                    : await axios.put('/api/v1/manage-product-version/update', productVersionData);
            if (response?.errorCode === 0) {
                action === 'CREATE'
                    ? toast.success('Thêm mới Sản phẩm - phiên bản thành công!')
                    : toast.success('Câp nhật thông tin Sản phẩm - phiên bản thành công!');
                await fetchAllProductVersion();
                handleCloseModal();
                setProductVersionData({
                    id: "",
                    productId: "",
                    productImageId: "",

                    capacity: "",
                    price: "",
                    quantity: "",
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
                                DS màu sắc của sản phẩm (<span className="red">*</span>)
                            </label>
                            <select value={productVersionData.productImageId || ""} onChange={(e) => handleChangeSelect(e, "productImageId")} className='form-select'>
                                <option value="">Chọn màu</option>
                                {
                                    listColor?.length > 0 && listColor.map((item) => (
                                        <option key={`product-color-${item?.PK_iHinhAnhID}-key`} value={item?.PK_iHinhAnhID}>{item?.sMoTa}</option>
                                    ))
                                }
                            </select>
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
                                <option value="true">Còn hàng</option>
                                <option value="false">Hết hàng</option>
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
