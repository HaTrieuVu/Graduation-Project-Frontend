import React, { useEffect, useState } from 'react';

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

import './ModalProductImage.scss';
import CommonUtils from '../../utils/CommonUtils';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { FaCloudUploadAlt } from "react-icons/fa";

const ModalProductImage = ({ action, show, handleCloseModal, dataModalProductImage, fetchAllProductImage }) => {
    const [productImageData, setProductImageData] = useState({
        id: '',
        productId: '',
        imgSource: '',
        description: '',
        previewImg: "",
    });

    const [listProductImage, setListProductImage] = useState([])
    const [isOpenPreviewImg, setIsOpenPreviewImg] = useState(false)

    useEffect(() => {
        fetchGetProduct()
    }, [])

    useEffect(() => {
        if (action === 'CREATE') {
            setProductImageData({
                id: '',
                productId: '',
                imgSource: '',
                description: '',
                previewImg: "",
            });
        }
    }, [action]);

    useEffect(() => {
        if (action === 'UPDATE') {
            setProductImageData({
                id: dataModalProductImage?.PK_iHinhAnhID,
                productId: dataModalProductImage?.FK_iSanPhamID,
                imgSource: dataModalProductImage?.sUrl,
                description: dataModalProductImage?.sMoTa,
            });
        }
    }, [dataModalProductImage]);

    const fetchGetProduct = async () => {
        let response = await axios.get("/api/v1/manage-product/get-all")
        if (response?.errorCode === 0 && response?.data?.length > 0) {
            setListProductImage(response?.data)
        }
    }

    const handleOnchangeInput = (value, name) => {
        setProductImageData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOnChangeImage = async (e) => {
        console.log(e.target.files[0])
        let data = e.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectURL = URL.createObjectURL(file);
            setProductImageData(prev => ({
                ...prev,
                previewImg: objectURL,
                imgSource: base64,
            }));
        }
    }

    const handleChangeSelect = (e, name) => {
        setProductImageData(prev => ({
            ...prev,
            [name]: e.target.value
        }))
    }

    const checkValidateInput = () => {
        let arr = [
            {
                key: 'productId',
                valueErr: 'Sản phẩm',
            },
            {
                key: 'imgSource',
                valueErr: 'Hình ảnh',
            },
        ];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            let { key, valueErr } = arr[i];

            if (!productImageData[key]) {
                toast.error(`${valueErr} không được để trống!`);
                check = false;
                break;
            }
        }
        return check;
    };

    //hàm thêm mới hoặc sửa Sản phẩm - hình ảnh
    const handleConfirmUser = async () => {
        let checkValid = checkValidateInput();

        if (checkValid) {
            let response =
                action === 'CREATE'
                    ? await axios.post('/api/v1/manage-product-image/create', productImageData)
                    : await axios.put('/api/v1/manage-product-image/update', productImageData);
            if (response?.errorCode === 0) {
                action === 'CREATE'
                    ? toast.success('Thêm mới Sản phẩm - hình ảnh thành công!')
                    : toast.success('Câp nhật thông tin Sản phẩm - hình ảnh thành công!');
                await fetchAllProductImage();
                handleCloseModal();
                setProductImageData({
                    id: '',
                    productId: '',
                    imgSource: '',
                    description: '',
                    previewImg: "",
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
                    {action === 'CREATE' ? <span>Thêm mới Sản phẩm - hình ảnh</span> : <span>Sửa Sản phẩm - hình ảnh</span>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <div className="content-body">
                    <div className="row">

                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Danh sách sản phẩm (<span className='red'>*</span>)</label>
                            <select value={productImageData.productId || ""} onChange={(e) => handleChangeSelect(e, "productId")} className='form-select'>
                                <option value="">Chọn sản phẩm</option>
                                {
                                    listProductImage?.length > 0 && listProductImage.map((item) => (
                                        <option key={`product-image-${item?.PK_iSanPhamID}`} value={item?.PK_iSanPhamID}>{item?.sTenSanPham}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="col-12 col-sm-12 mb-5 form-group">
                            <label>
                                Mô tả
                            </label>
                            <textarea
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'description')}
                                value={productImageData.description}
                                rows={3}
                                cols={50}
                            >
                            </textarea>
                        </div>

                        <div className="col-12 col-sm-12 mb-3 form-group">
                            <input
                                type="file"
                                id="inputImage"
                                className="form-control"
                                hidden
                                onChange={(e) => handleOnChangeImage(e)}
                            />
                            <label className='col-12 col-sm-12'>
                                Preview ảnh (<span className="red">*</span>)
                            </label>
                            {productImageData.imgSource !== "" && <div className="preview-image mt-3">
                                <img
                                    src={productImageData.imgSource}
                                    alt="imgSource"
                                    onClick={() =>
                                        setIsOpenPreviewImg(true)
                                    }
                                />
                            </div>}
                            <label className="px-4 py-2 label-Img" htmlFor="inputImage">
                                Tải lên <FaCloudUploadAlt />
                            </label>
                            {isOpenPreviewImg && productImageData.imgSource !== "" && (
                                <Lightbox
                                    open={isOpenPreviewImg}
                                    close={() => setIsOpenPreviewImg(false)}
                                    slides={[
                                        { src: productImageData.imgSource },
                                    ]}
                                />
                            )}
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

export default ModalProductImage;
