import React, { useEffect, useState } from 'react';

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

import './ModalBrand.scss';
import CommonUtils from '../../utils/CommonUtils';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { FaCloudUploadAlt } from "react-icons/fa";

const ModalBrand = ({ action, show, handleCloseModal, dataModalBrand, fetchAllBrand }) => {
    const [brandData, setBrandData] = useState({
        id: '',
        brandName: '',
        logo: '',
        description: '',
        previewImg: "",
    });

    const [isOpenPreviewImg, setIsOpenPreviewImg] = useState(false)

    useEffect(() => {
        if (action === 'CREATE') {
            setBrandData({
                id: '',
                brandName: '',
                logo: '',
                description: '',
                previewImg: "",
            });
        }
    }, [action]);

    useEffect(() => {
        if (action === 'UPDATE') {
            setBrandData({
                id: dataModalBrand?.PK_iNhanHangID,
                brandName: dataModalBrand?.sTenNhanHang,
                logo: dataModalBrand?.sLogo,
                description: dataModalBrand?.sMoTa,
            });
        }
    }, [dataModalBrand]);

    const handleOnchangeInput = (value, name) => {
        setBrandData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOnChangeImage = async (e) => {
        let data = e.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectURL = URL.createObjectURL(file);
            setBrandData(prev => ({
                ...prev,
                previewImg: objectURL,
                logo: base64,
            }));
        }
    }

    const checkValidateInput = () => {
        let arr = [
            {
                key: 'brandName',
                valueErr: 'Tên Nhãn hàng',
            },
            {
                key: 'logo',
                valueErr: 'Logo Nhãn hàng',
            },
        ];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            let { key, valueErr } = arr[i];

            if (!brandData[key]) {
                toast.error(`${valueErr} không được để trống!`);
                check = false;
                break;
            }
        }
        return check;
    };

    //hàm thêm mới hoặc sửa Nhãn hàng
    const handleConfirmUser = async () => {
        let checkValid = checkValidateInput();

        if (checkValid) {
            let response =
                action === 'CREATE'
                    ? await axios.post('/api/v1/manage-brand/create', brandData)
                    : await axios.put('/api/v1/manage-brand/update', brandData);
            if (response?.errorCode === 0) {
                action === 'CREATE'
                    ? toast.success('Thêm mới Nhãn hàng thành công!')
                    : toast.success('Câp nhật thông tin Nhãn hàng thành công!');
                await fetchAllBrand();
                handleCloseModal();
                setBrandData({
                    id: '',
                    brandName: '',
                    logo: '',
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
                    {action === 'CREATE' ? <span>Thêm mới Nhãn hàng</span> : <span>Sửa Nhãn hàng</span>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <div className="content-body">
                    <div className="row">
                        <div className="col-12 col-sm-6 mb-3 form-group">
                            <label>
                                Tên Nhãn hàng (<span className="red">*</span>)
                            </label>
                            <input
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'brandName')}
                                value={brandData.brandName}
                                type="text"
                            />
                        </div>

                        <div className="col-12 col-sm-12 mb-5 form-group">
                            <label>
                                Mô tả
                            </label>
                            <textarea
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'description')}
                                value={brandData.description}
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
                            {brandData.logo !== "" && <div className="preview-image mt-3">
                                <img
                                    src={brandData.logo}
                                    alt="img"
                                    onClick={() =>
                                        setIsOpenPreviewImg(true)
                                    }
                                />
                            </div>}
                            <label className="px-4 py-2 label-Img" htmlFor="inputImage">
                                Tải lên <FaCloudUploadAlt />
                            </label>
                            {isOpenPreviewImg && brandData.logo !== "" && (
                                <Lightbox
                                    open={isOpenPreviewImg}
                                    close={() => setIsOpenPreviewImg(false)}
                                    slides={[
                                        { src: brandData.logo },
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

export default ModalBrand;
