import React, { useEffect, useState } from 'react';

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import _ from "lodash";
import Select from "react-select";

import './ModalProductParameters.scss';


const ModalProductParameters = ({ action, show, handleCloseModal, dataModalProductParameters, fetchAllProductParameters, listProduct }) => {
    const [productParametersData, setProductParametersData] = useState({
        id: "",
        productId: "",
        operatingSystem: "",
        cpu: "",
        cpuSpeed: "",
        gpu: "",
        ram: "",
        rearCamera: "",
        frontCamera: "",
        screen: "",
        batteryCapacity: "",
        batteryType: "",
        charger: "",
    });

    useEffect(() => {
        if (action === 'CREATE') {
            setProductParametersData({
                id: "",
                productId: "",
                operatingSystem: "",
                cpu: "",
                cpuSpeed: "",
                gpu: "",
                ram: "",
                rearCamera: "",
                frontCamera: "",
                screen: "",
                batteryCapacity: "",
                batteryType: "",
                charger: "",
            });
        }
    }, [action]);

    useEffect(() => {
        if (action === 'UPDATE') {
            setProductParametersData({
                id: dataModalProductParameters?.PK_iThongSoID,
                productId: dataModalProductParameters?.FK_iSanPhamID,
                operatingSystem: dataModalProductParameters?.sHeDieuHanh,
                cpu: dataModalProductParameters?.sCPU,
                cpuSpeed: dataModalProductParameters?.sTocDoCPU,
                gpu: dataModalProductParameters?.sGPU,
                ram: dataModalProductParameters?.sTocDoCPU,
                availableCapacity: dataModalProductParameters?.sDungLuongKhaDung,
                rearCamera: dataModalProductParameters?.sCameraSau,
                frontCamera: dataModalProductParameters?.sCameraTruoc,
                screen: dataModalProductParameters?.sManHinh,
                batteryCapacity: dataModalProductParameters?.sPin,
                batteryType: dataModalProductParameters?.sLoaiPin,
                charger: dataModalProductParameters?.sSac,
            });
        }
    }, [dataModalProductParameters]);

    const handleOnchangeInput = (value, name) => {
        setProductParametersData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeSelect = (value, field) => {
        setProductParametersData(prevState => ({
            ...prevState,
            [field]: value?.value
        }));
    };

    const checkValidateInput = () => {
        let arr = [
            {
                key: 'productId',
                valueErr: 'Sản phẩm',
            },
            {
                key: 'operatingSystem',
                valueErr: 'Hệ điều hành',
            },
            {
                key: 'cpu',
                valueErr: 'Chip xử lý (CPU)',
            },
            {
                key: 'cpuSpeed',
                valueErr: 'Tốc độ CPU',
            },
            {
                key: 'gpu',
                valueErr: 'Chip đồ họa (GPU)',
            },
            {
                key: 'ram',
                valueErr: 'RAM',
            },
            {
                key: 'rearCamera',
                valueErr: 'Camera sau',
            },
            {
                key: 'frontCamera',
                valueErr: 'Camera trước',
            },
            {
                key: 'screen',
                valueErr: 'Màn hình',
            },
            {
                key: 'batteryCapacity',
                valueErr: 'Dung lượng Pin',
            },
            {
                key: 'batteryType',
                valueErr: 'Loại pin',
            },
            {
                key: 'charger',
                valueErr: 'Hỗ trợ sạc',
            },
        ];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            let { key, valueErr } = arr[i];

            if (!productParametersData[key]) {
                toast.error(`Thông số "${valueErr}" không được để trống!`);
                check = false;
                break;
            }
        }
        return check;
    };

    //hàm thêm mới hoặc sửa Sản phẩm - Thông số
    const handleConfirmProductParameters = async () => {
        let checkValid = checkValidateInput();

        if (checkValid) {
            let response =
                action === 'CREATE'
                    ? await axios.post('/api/v1/manage-product-parameters/create', productParametersData)
                    : await axios.put('/api/v1/manage-product-parameters/update', productParametersData);
            if (response?.errorCode === 0) {
                action === 'CREATE'
                    ? toast.success('Thêm mới Sản phẩm - thông số thành công!')
                    : toast.success('Câp nhật thông tin Sản phẩm - thông số thành công!');
                await fetchAllProductParameters();
                handleCloseModal();
                setProductParametersData({
                    id: "",
                    productId: "",
                    operatingSystem: "",
                    cpu: "",
                    cpuSpeed: "",
                    gpu: "",
                    ram: "",
                    rearCamera: "",
                    frontCamera: "",
                    screen: "",
                    batteryCapacity: "",
                    batteryType: "",
                    charger: "",
                });
            } else {
                toast.error(response?.errorMessage);
            }
        }
    };

    return (
        <Modal size="xl" show={show} className="custom-modal-product-parameter" onHide={handleCloseModal}>
            <Modal.Header closeButton className="custom-modal-header-product-parameter">
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? <span>Thêm mới Sản phẩm - Thông số</span> : <span>Sửa Sản phẩm - Thông số</span>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body-product-parameter">
                <div className="content-body">
                    <div className='row mb-3'>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Danh sách sản phẩm (<span className='red'>*</span>)</label>
                            <Select
                                value={listProduct.find(option => option.value === productParametersData.productId)}
                                onChange={(selectedOption) => handleChangeSelect(selectedOption, "productId")}
                                options={listProduct}
                                placeholder="Chọn sản phẩm"
                            />

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-4 mb-3 form-group">
                            <label>
                                Hệ điều hành (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'operatingSystem')}
                                value={productParametersData.operatingSystem}
                            />
                        </div>
                        <div className="col-12 col-sm-4 mb-3 form-group">
                            <label>
                                CPU - Chip xử lý (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'cpu')}
                                value={productParametersData.cpu}
                            />
                        </div>
                        <div className="col-12 col-sm-4 mb-3 form-group">
                            <label>
                                Tốc độ CPU (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'cpuSpeed')}
                                value={productParametersData.cpuSpeed}
                            />
                        </div>
                        <div className="col-12 col-sm-4 mb-3 form-group">
                            <label>
                                GPU - Chip đồ họa (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'gpu')}
                                value={productParametersData.gpu}
                            />
                        </div>
                        <div className="col-12 col-sm-4 mb-3 form-group">
                            <label>
                                RAM (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'ram')}
                                value={productParametersData.ram}
                            />
                        </div>
                        {/* <div className="col-12 col-sm-4 mb-3 form-group">
                            <label>
                                Dung lượng khả dụng (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'availableCapacity')}
                                value={productParametersData.availableCapacity}
                            />
                        </div> */}
                        <div className="col-12 col-sm-4 mb-3 form-group">
                            <label>
                                Camera trước (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'frontCamera')}
                                value={productParametersData.frontCamera}
                            />
                        </div>
                        <div className="col-12 col-sm-6 mb-3 form-group">
                            <label>
                                Camera sau (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'rearCamera')}
                                value={productParametersData.rearCamera}
                            />
                        </div>
                        <div className="col-12 col-sm-6 mb-3 form-group">
                            <label>
                                Màn hình (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'screen')}
                                value={productParametersData.screen}
                            />
                        </div>
                        <div className="col-12 col-sm-4 mb-3 form-group">
                            <label>
                                Dung lượng Pin (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'batteryCapacity')}
                                value={productParametersData.batteryCapacity}
                            />
                        </div>
                        <div className="col-12 col-sm-4 mb-3 form-group">
                            <label>
                                Loại pin (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'batteryType')}
                                value={productParametersData.batteryType}
                            />
                        </div>
                        <div className="col-12 col-sm-4 mb-3 form-group">
                            <label>
                                Hỗ trợ sạc (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'charger')}
                                value={productParametersData.charger}
                            />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant="secondary" onClick={handleCloseModal}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={() => handleConfirmProductParameters()}>
                    {action === 'CREATE' ? 'Thêm mới' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalProductParameters;
