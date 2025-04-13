import React, { useEffect, useState } from 'react';

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

import './ModalProduct.scss';


const ModalProduct = ({ action, show, handleCloseModal, dataModalProduct, fetchAllProduct }) => {
    const [productData, setProductData] = useState({
        id: "",
        categoryId: "",
        brandId: "",
        productName: "",
        description: "",
        evaluate: "",
        status: "",
    });

    const [listCategory, setListCategory] = useState([])
    const [listBrand, setListBrand] = useState([])

    useEffect(() => {
        fetchGetCategory()
        fetchGetBrand()
    }, [])


    useEffect(() => {
        if (action === 'CREATE') {
            setProductData({
                id: '',
                categoryId: '',
                brandId: '',
                productName: '',
                description: "",
                evaluate: "",
                status: "",
            });
        }
    }, [action]);

    useEffect(() => {
        if (action === 'UPDATE') {
            setProductData({
                id: dataModalProduct?.PK_iSanPhamID,
                categoryId: dataModalProduct?.FK_iDanhMucID,
                brandId: dataModalProduct?.FK_iNhanHangID,
                productName: dataModalProduct?.sTenSanPham,
                evaluate: dataModalProduct?.sDanhGia,
                status: dataModalProduct?.sTinhTrangSanPham,
            });
        }
    }, [dataModalProduct]);

    const fetchGetCategory = async () => {
        let response = await axios.get("/api/v1/manage-category/get-all")
        if (response?.errorCode === 0 && response?.data?.length > 0) {
            setListCategory(response?.data)
        }
    }

    const fetchGetBrand = async () => {
        let response = await axios.get("/api/v1/manage-brand/get-all")
        if (response?.errorCode === 0 && response?.data?.length > 0) {
            setListBrand(response?.data)
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
                key: 'productName',
                valueErr: 'Tên Sản phẩm',
            },
            {
                key: 'categoryId',
                valueErr: 'Danh mục sản phẩm',
            },
            {
                key: 'brandId',
                valueErr: 'Nhãn hàng',
            },
            {
                key: 'evaluate',
                valueErr: 'Đánh giá',
            },
            {
                key: 'status',
                valueErr: 'Tình trạng',
            },
        ];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            let { key, valueErr } = arr[i];

            if (!productData[key]) {
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
                    ? await axios.post('/api/v1/manage-product/create', productData)
                    : await axios.put('/api/v1/manage-product/update', productData);
            if (response?.errorCode === 0) {
                action === 'CREATE'
                    ? toast.success('Thêm mới Sản phẩm thành công!')
                    : toast.success('Câp nhật thông tin Sản phẩm thành công!');
                await fetchAllProduct();
                handleCloseModal();
                setProductData({
                    id: "",
                    categoryId: "",
                    brandId: "",
                    productName: "",
                    description: "",
                    evaluate: "",
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
                    {action === 'CREATE' ? <span>Thêm mới Sản phẩm</span> : <span>Sửa Sản phẩm</span>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <div className="content-body">
                    <div className="row">
                        <div className="col-12 mb-3 form-group">
                            <label>
                                Tên Sản phẩm (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'productName')}
                                value={productData.productName}
                                type="text"
                            />
                        </div>

                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Danh mục sản phẩm (<span className='red'>*</span>)</label>
                            <select value={productData.categoryId || ""} onChange={(e) => handleChangeSelect(e, "categoryId")} className='form-select'>
                                <option value="">Chọn</option>
                                {
                                    listCategory?.length > 0 && listCategory.map((item) => (
                                        <option key={`category-product-${item?.PK_iDanhMucID}`} value={item?.PK_iDanhMucID}>{item?.sTenDanhMuc}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Nhãn hàng (<span className='red'>*</span>)</label>
                            <select value={productData.brandId || ""} onChange={(e) => handleChangeSelect(e, "brandId")} className='form-select'>
                                <option value="">Chọn</option>
                                {
                                    listBrand?.length > 0 && listBrand.map((item) => (
                                        <option key={`brand-product-${item?.PK_iNhanHangID}`} value={item?.PK_iNhanHangID}>{item?.sTenNhanHang}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Đánh giá (sao) (<span className='red'>*</span>)</label>
                            <select value={productData.evaluate || ""} onChange={(e) => handleChangeSelect(e, "evaluate")} className='form-select'>
                                <option value="">Chọn</option>
                                <option value="5">5 Sao</option>
                                <option value="4">4 Sao</option>
                                <option value="3">3 Sao</option>
                                <option value="2">2 Sao</option>
                                <option value="1">1 Sao</option>
                            </select>
                        </div>

                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Tình trạng (<span className='red'>*</span>)</label>
                            <select value={productData.status || ""} onChange={(e) => handleChangeSelect(e, "status")} className='form-select'>
                                <option value="">Chọn</option>
                                <option value="Chờ bán">Chờ bán</option>
                                <option value="Đang bán">Đang bán</option>
                                <option value="Ngừng bán">Ngừng bán</option>
                            </select>
                        </div>

                        <div className="col-12 col-sm-12 mb-5 form-group">
                            <label>
                                Mô tả
                            </label>
                            <textarea
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'description')}
                                value={productData.description}
                                rows={3}
                                cols={50}
                            >
                            </textarea>
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

export default ModalProduct;
