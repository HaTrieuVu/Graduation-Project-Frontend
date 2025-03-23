import React, { useEffect, useState } from 'react'

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

import "./ModalCategory.scss"

const ModalCategory = ({ action, show, handleCloseModal, dataModalCategory, fetchAllCategory }) => {

    const [categoryData, setCategoryData] = useState({
        id: "",
        nameCategory: '',
        description: '',
    });

    useEffect(() => {
        if (action === "CREATE") {
            setCategoryData({
                id: "",
                nameCategory: '',
                description: '',
            })
        }
    }, [action])


    useEffect(() => {
        if (action === "UPDATE") {
            setCategoryData({
                id: dataModalCategory.PK_iDanhMucID,
                nameCategory: dataModalCategory.sTenDanhMuc,
                description: dataModalCategory.sMoTa,
            })
        }
    }, [dataModalCategory])

    const handleOnchangeInput = (value, name) => {
        setCategoryData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    //hàm thêm mới hoặc sửa danh mục sản phẩm
    const handleConfirmUser = async () => {
        if (!categoryData.nameCategory) {
            toast.error(`Tên danh mục không được để trống!`);
        } else if (!categoryData.description) {
            toast.error(`Mô tả không được để trống!`);
        } else {
            let respone = action === "CREATE" ?
                await axios.post("/api/v1/manage-category/create", categoryData)
                :
                await axios.put("/api/v1/manage-category/update", categoryData)
            if (respone?.data?.errorCode === 0) {
                action === "CREATE" ? toast.success("Thêm mới Danh mục sản phẩm thành công!") : toast.success("Câp nhật thông tin Danh mục sản phẩm thành công!")
                await fetchAllCategory();
                handleCloseModal()
                setCategoryData({
                    id: "",
                    nameCategory: '',
                    description: '',
                })
            } else {
                toast.error(respone?.data?.errorMessage)
            }
        }

    }

    return (
        <Modal
            size="xl"
            show={show}
            className="custom-modal"
            onHide={handleCloseModal}
        >
            <Modal.Header closeButton className="custom-modal-header">
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === "CREATE" ? <span>Thêm mới Danh mục sản phẩm</span> : <span>Sửa Danh mục sản phẩm</span>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <div className='content-body'>
                    <div className='row'>
                        <div className='col-12 col-sm-6 mb-3 form-group'>
                            <label>Tên danh mục sản phẩm (<span className='red'>*</span>)</label>
                            <input
                                className='form-control'
                                onChange={(e) => handleOnchangeInput(e.target.value, "nameCategory")}
                                value={categoryData.nameCategory}
                                type="email"
                            />
                        </div>
                        <div className="col-12 col-sm-12 mb-5 form-group">
                            <label>
                                Mô tả (<span className='red'>*</span>)
                            </label>
                            <textarea
                                className="form-control"
                                onChange={(e) => handleOnchangeInput(e.target.value, 'description')}
                                value={categoryData.description}
                                rows={3}
                                cols={50}
                            >
                            </textarea>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant='secondary' onClick={handleCloseModal}>Hủy</Button>
                <Button variant='primary' onClick={() => handleConfirmUser()}>{action === "CREATE" ? "Thêm mới" : "Cập nhật"}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalCategory