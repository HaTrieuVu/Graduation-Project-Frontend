import React, { useEffect, useState } from 'react';

import { Button, Modal } from 'react-bootstrap';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import { FaPlusCircle } from "react-icons/fa";
import { Link } from 'react-router-dom'

import './ImportReceiptNote.scss';
import { useSelector } from 'react-redux';


const ImportReceiptNote = ({ action, handleCloseImportNote, fetchAllImportReceipt }) => {
    const user = useSelector(state => state.userInfo.user);

    const [importReceiptData, setImportReceiptData] = useState({
        supplierId: "",
        userId: "",
        products: [], // Lưu danh sách sản phẩm
        note: "",
    });
    const [listSupplier, setListSupplier] = useState([])

    // Mẫu sản phẩm mới
    const emptyProduct = {
        productName: "",
        capacity: "",
        color: "",
        importPrice: "",
        quantity: "",
    };

    useEffect(() => {
        const userId = user?.userId
        fetchGetAllSupplier()
        setImportReceiptData({ ...importReceiptData, userId: userId })
    }, [])

    const fetchGetAllSupplier = async () => {
        let response = await axios.get("/api/v1/manage-supplier/get-all?page=1&limit=20")
        if (response?.errorCode === 0 && response?.data?.suppliers?.length > 0) {
            setListSupplier(response?.data?.suppliers)
        }
    }

    // Thêm sản phẩm mới vào danh sách
    const addProduct = () => {
        setImportReceiptData(prev => ({
            ...prev,
            products: [...prev.products, { ...emptyProduct }],
        }));
    };

    // Cập nhật giá trị của từng sản phẩm
    const handleOnchangeProduct = (index, value, name) => {
        setImportReceiptData(prev => {
            const updatedProducts = [...prev.products];
            updatedProducts[index][name] = value;
            return { ...prev, products: updatedProducts };
        });
    };

    // Xóa sản phẩm khỏi danh sách
    const removeProduct = (index) => {
        setImportReceiptData(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index),
        }));
    };

    const checkValidateInput = () => {
        let requiredFields = [
            { key: 'productName', label: 'Tên Sản phẩm' },
            { key: 'capacity', label: 'Dung lượng' },
            { key: 'color', label: 'Màu sắc' },
            { key: 'quantity', label: 'Số lượng' },
            { key: 'importPrice', label: 'Giá nhập' },
        ];

        // Kiểm tra nhà cung cấp
        if (!importReceiptData.supplierId) {
            toast.error("Nhà cung cấp không được để trống!");
            return false;
        }

        if (importReceiptData?.products?.length < 1) {
            toast.error("Chưa nhập sản phẩm!");
            return false;
        }

        // Kiểm tra danh sách sản phẩm
        for (let i = 0; i < importReceiptData.products.length; i++) {
            let product = importReceiptData.products[i];

            for (let { key, label } of requiredFields) {
                if (!product[key] || product[key].toString().trim() === "") {
                    toast.error(`Sản phẩm ${i + 1}: ${label} không được để trống!`);
                    return false;
                }
            }

            // Kiểm tra số lượng và giá nhập phải là số dương
            if (product.quantity <= 0) {
                toast.error(`Sản phẩm ${i + 1}: Số lượng phải lớn hơn 0!`);
                return false;
            }

            if (product.importPrice <= 0) {
                toast.error(`Sản phẩm ${i + 1}: Giá nhập phải lớn hơn 0!`);
                return false;
            }
        }

        return true;
    };

    // Gửi dữ liệu nhập kho
    const handleConfirm = async () => {
        if (!checkValidateInput()) {
            return;
        }

        const response = await axios.post('/api/v1/manage-import-receipt/create', importReceiptData)
        if (response?.errorCode === 0) {
            handleCloseImportNote()
            await fetchAllImportReceipt()
            toast.success(response?.errorMessage)
            setImportReceiptData({
                supplierId: "",
                userId: "",
                products: [],
                note: "",
            })
            await fetchAllImportReceipt()
        }
    };

    return (
        <div className="import-receipt-note">
            <div className="import-receipt-note-header">
                <div className="title-import">
                    {action === 'CREATE' ? <span>Thêm mới Phiếu nhập Kho</span> : <span>Sửa Phiếu nhập Kho</span>}
                </div>
            </div>
            <div className="import-receipt-note-body">
                <div className="content-body">
                    <div className="row">
                        {/* Nhà cung cấp */}
                        <div className='col-12 col-sm-6 mb-4 form-group'>
                            <label>Nhà cung cấp (<span className='red'>*</span>)</label>
                            <div className='flex'>
                                <select
                                    value={importReceiptData.supplierId || ""}
                                    onChange={(e) => setImportReceiptData({ ...importReceiptData, supplierId: e.target.value })}
                                    className='form-select'
                                >
                                    <option value="">Chọn</option>
                                    {
                                        listSupplier?.length > 0 && listSupplier.map((item) => (
                                            <option key={`item-supplier-receipt-${item?.PK_iNhaCungCapID}`} value={item?.PK_iNhaCungCapID}>{item?.sTenNhaCungCap}</option>
                                        ))
                                    }
                                </select>
                                <Link to={"/admin/manage-supplier"} className='btn-add-supplier'>
                                    <FaPlusCircle size={25} title='Thêm mới nhà cung cấp' />
                                </Link>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="col-12 list-product">
                            <h3>Danh sách sản phẩm</h3>
                            {importReceiptData.products.map((product, index) => (
                                <div key={`item-add-product-${index}`} className="row mb-3 border p-3">
                                    <div className="col-12 col-sm-6 mb-3 form-group">
                                        <label>Tên Sản phẩm (<span className="red">*</span>)</label>
                                        <input
                                            className="form-control"
                                            onChange={(e) => handleOnchangeProduct(index, e.target.value, 'productName')}
                                            value={product.productName}
                                            type="text"
                                        />
                                    </div>

                                    <div className='col-12 col-sm-3 mb-3 form-group'>
                                        <label>Dung lượng (<span className='red'>*</span>)</label>
                                        <select value={product.capacity || ""} onChange={(e) => handleOnchangeProduct(index, e.target.value, 'capacity')} className='form-select'>
                                            <option value="">Chọn dung lượng</option>
                                            <option value="32GB">32GB</option>
                                            <option value="64GB">64GB</option>
                                            <option value="128GB">128GB</option>
                                            <option value="256GB">256GB</option>
                                            <option value="512GB">512GB</option>
                                            <option value="1TB">1TB</option>
                                        </select>
                                    </div>

                                    <div className='col-12 col-sm-3 mb-3 form-group'>
                                        <label>Màu sắc (<span className='red'>*</span>)</label>
                                        <input
                                            className="form-control"
                                            onChange={(e) => handleOnchangeProduct(index, e.target.value, 'color')}
                                            value={product.color}
                                            type="text"
                                        />
                                    </div>

                                    <div className='col-12 col-sm-3 mb-3 form-group'>
                                        <label>Số lượng (<span className='red'>*</span>)</label>
                                        <input
                                            className="form-control"
                                            onChange={(e) => handleOnchangeProduct(index, e.target.value, 'quantity')}
                                            value={product.quantity}
                                            type="number"
                                            step={1}
                                            min={1}
                                        />
                                    </div>

                                    <div className='col-12 col-sm-6 mb-3 form-group'>
                                        <label>Giá nhập (<span className='red'>*</span>)</label>
                                        <input
                                            className="form-control"
                                            onChange={(e) => handleOnchangeProduct(index, e.target.value, 'importPrice')}
                                            value={product.importPrice}
                                            type="number"
                                            min={1000}
                                        />
                                    </div>

                                    <div className="col-12 col-sm-12 d-flex align-items-end ">
                                        <button className="btn btn-danger btn-remove" onClick={() => removeProduct(index)}>Xóa</button>
                                    </div>
                                </div>
                            ))}

                            <button className="btn btn-primary btn-add" onClick={addProduct}>+ Thêm sản phẩm</button>
                        </div>

                        <div className="col-12 col-sm-6 mb-5 form-group box-note">
                            <label>Ghi chú</label>
                            <textarea
                                className="form-control"
                                onChange={(e) => setImportReceiptData({ ...importReceiptData, note: e.target.value })}
                                value={importReceiptData.note}
                                rows={5}
                                cols={50}
                            >
                            </textarea>
                        </div>

                    </div>
                </div>
            </div>
            <div className="import-receipt-note-footer">
                <button className='btn btn-secondary' onClick={handleCloseImportNote}>
                    Hủy
                </button>
                <button className='btn btn-primary' onClick={() => handleConfirm()}>
                    {action === 'CREATE' ? 'Thêm mới' : 'Cập nhật'}
                </button>
            </div>
        </div>
    );
};

export default ImportReceiptNote;
