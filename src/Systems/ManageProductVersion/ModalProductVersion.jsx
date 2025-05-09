import React, { useCallback, useEffect, useState } from 'react';

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import _ from "lodash";
import Select from "react-select";

import './ModalProductVersion.scss';


const ModalProductVersion = ({ action, show, handleCloseModal, dataModalProductVersion, fetchAllProductVersion, listProduct }) => {
    const [productVersionData, setProductVersionData] = useState({
        id: "",
        productId: "",
        productImageId: "",
        capacity: "",
        availableCapacity: "",
        price: "",
        quantity: "",
        status: "",
        warranty: ""
    });

    const [selectedProductId, setSelectedProductId] = useState(null)
    const [listColor, setlistColor] = useState({})          // list color của 1 sản phẩm (lấy theo productImage)

    //hàm lấy tất cả các màu của product
    const fetchAllColorOfProduct = useCallback(async () => {
        if (!selectedProductId) return;

        let response = await axios.get(`/api/v1/manage-product-version/get-all-image?id=${selectedProductId}`);
        if (response?.errorCode === 0 && !_.isEmpty(response?.data) && response?.data?.images?.length > 0) {
            setlistColor(response?.data?.images)
        }
    }, [selectedProductId]); // Chỉ thay đổi khi `selectedProductId` đổi

    useEffect(() => {
        if (action === 'CREATE') {
            setProductVersionData({
                id: "",
                productId: "",
                productImageId: "",
                capacity: "",
                availableCapacity: "",
                price: "",
                quantity: "",
                status: "",
                warranty: ""
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
                availableCapacity: dataModalProductVersion?.sDungLuongKhaDung,
                price: dataModalProductVersion?.fGiaBan,
                quantity: dataModalProductVersion?.iSoLuong,
                status: dataModalProductVersion?.bTrangThai,
                warranty: dataModalProductVersion.iThoiGianBaoHanh
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

    const handleChangeSelect = (value, field, isReactSelect = false) => {
        setProductVersionData(prevState => {
            const updatedData = {
                ...prevState,
                [field]: isReactSelect ? value?.value || "" : value.target.value
            };

            // Nếu field là "productId", cập nhật selectedProductId
            if (field === "productId") {
                setSelectedProductId(updatedData.productId);
            }

            return updatedData;
        });
    };

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
                key: 'availableCapacity',
                valueErr: 'Dung lượng khả dụng',
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
            {
                key: 'warranty',
                valueErr: 'Thời gian bảo hành',
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
    const handleConfirmProductVersion = async () => {
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
                    availableCapacity: "",
                    price: "",
                    quantity: "",
                    status: "",
                    warranty: ""
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
                            <Select
                                value={listProduct.find(option => option.value === productVersionData.productId)}
                                onChange={(selectedOption) => handleChangeSelect(selectedOption, "productId", true)}
                                options={listProduct}
                                placeholder="Chọn sản phẩm"
                            />

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
                                <option value="32 GB">32 GB</option>
                                <option value="64 GB">64 GB</option>
                                <option value="128 GB">128 GB</option>
                                <option value="256 GB">256 GB</option>
                                <option value="512 GB">512 GB</option>
                                <option value="1 TB">1 TB</option>
                            </select>
                        </div>

                        <div className="col-12 col-sm-6 mb-3 form-group">
                            <label>
                                Dung lượng khả dụng (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'availableCapacity')}
                                value={productVersionData.availableCapacity}
                            />
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

                        <div className="col-12 col-sm-6 mb-3 form-group">
                            <label>
                                Thời gian bảo hành (<span className="red">*</span>)
                            </label>
                            <select value={productVersionData.warranty || ""} onChange={(e) => handleChangeSelect(e, "warranty")} className='form-select'>
                                <option value="">Chọn</option>
                                <option value="6">6 tháng</option>
                                <option value="12">12 tháng</option>
                                <option value="18">18 tháng</option>
                                <option value="24">24 tháng</option>
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

export default ModalProductVersion;
