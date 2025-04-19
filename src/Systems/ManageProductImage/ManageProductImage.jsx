import React, { useEffect, useState } from 'react'

import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaPlusCircle } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import { IoReloadSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import axios from '../../config/axios';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import ModalProductImage from './ModalProductImage';
import Select from "react-select";

import "./ManageProductImage.scss"

const ManageProductImage = () => {
    const [listProductImage, setListProductImage] = useState([])
    const [listProduct, setListProduct] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const currentLimit = 4
    const [totalPage, setTotalPage] = useState(0)

    const [isShowModel, setIsShowModel] = useState(false)   // state modal thêm, sửa ncc
    const [isShowModelDelete, setIsShowModelDelete] = useState(false)
    const [dataModal, setDataModal] = useState({})  // data của modal delete
    const [actionModaProductImage, setActionModalProductImage] = useState("") //state action create or update
    const [dataModalProductImage, setDataModalProductImage] = useState({})

    const [valueSearch, setValueSearch] = useState("all")

    useEffect(() => {
        fetchGetProduct()
    }, [])

    useEffect(() => {
        fetchAllProductImage()
    }, [currentPage, valueSearch])

    const fetchAllProductImage = async () => {
        let response = await axios.get(`/api/v1/manage-product-image/get-all?page=${currentPage}&limit=${currentLimit}&valueSearch=${valueSearch}`)
        if (response?.data && response?.errorCode === 0) {
            setTotalPage(response?.data?.totalPage)
            setListProductImage(response?.data?.productImages)
        }
    }

    const fetchGetProduct = async () => {
        let response = await axios.get("/api/v1/manage-product/get-all")
        if (response?.errorCode === 0 && response?.data?.length > 0) {
            let dataBuild = buildOptions(response?.data)
            setListProduct(dataBuild)
        }
    }

    // lấy các thuộc tính cần thiết để sử dụng react-select
    const buildOptions = (data) => {
        return data.map(item => ({
            value: item.PK_iSanPhamID,
            label: item.sTenSanPham
        }));
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    // hàm xóa sản phẩm - hình ảnh (mở modal xóa sản phẩm - hình ảnh)
    const handleDeleteBrand = async (productImage) => {
        setDataModal(productImage)
        setIsShowModelDelete(true)
    };

    // hàm xác nhận xóa sản phẩm - hình ảnh
    const confirmDelete = async () => {
        try {
            let response = await axios.delete("/api/v1/manage-product-image/delete", { data: { id: dataModal?.PK_iHinhAnhID } });
            if (response?.errorCode === 0) {
                toast.success("Xóa Nhãn hàng thành công!")
                await fetchAllProductImage()
                setIsShowModelDelete(false)
            } else {
                toast.error("Xóa thất bại! Vui lòng thử lại.")
            }
        } catch (error) {
            console.error("Lỗi khi xóa ncc", error);
            toast.error("Xóa thất bại! Vui lòng thử lại.")
        }
    }

    // hàm đóng modal xóa sản phẩm - hình ảnh
    const handleCloseModalDelete = () => {
        setIsShowModelDelete(false);
        setDataModal({})
    }

    // hàm đóng modal thêm or sửa sản phẩm - hình ảnh
    const handleCloseModal = () => {
        setIsShowModel(false)
    }

    const handleCreateOrUpdateUser = (action, data) => {
        if (action === "UPDATE") {
            setIsShowModel(true)
            setActionModalProductImage(action)
            if (data) {
                setDataModalProductImage(data)
            }
        } else {
            setIsShowModel(true)
            setActionModalProductImage(action)
            setDataModalProductImage({})
        }
    }

    return (
        <main className='manage-product-image-container'>
            <h2 className='title'>Quản lý Sản phẩm</h2>
            <div className='product-image-header'>
                <div className='product-image-title'>
                    <h3>Danh sách Sản phẩm - Hình ảnh</h3>
                </div>
                <div className='actions'>
                    <button className='btn btn-primary' onClick={() => handleCreateOrUpdateUser("CREATE")} >
                        <span>Tạo mới</span>
                        <span>
                            <FaPlusCircle />
                        </span>
                    </button>
                    <button className='btn btn-success'>
                        <span>Refesh</span>
                        <span>
                            <IoReloadSharp />
                        </span>
                    </button>
                </div>
            </div>
            <div className='search-box'>
                <label htmlFor="">Tìm sản phẩm</label>
                <Select
                    value={valueSearch === "all" ? null : listProduct.find(option => option.value === valueSearch)}
                    onChange={(selectedOption) => setValueSearch(selectedOption.value)}
                    options={listProduct}
                    placeholder="Tìm sản phẩm"
                    className='search'
                />
            </div>
            <div className='product-image-body'>
                <table className="table table-hover table-bordered fs-20">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Mã Hình ảnh</th>
                            <th scope="col">Tên Sản phẩm</th>
                            <th scope="col">Hình ảnh</th>
                            <th scope="col">Mô tả</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listProductImage?.length > 0 ?
                            listProductImage.map((item, i) => {
                                return (
                                    <tr key={`${item?.PK_iHinhAnhID}-productImage-key`}>
                                        <td scope="row">{(currentPage - 1) * currentLimit + (i + 1)}</td>
                                        <td>{item?.PK_iHinhAnhID}</td>
                                        <td>{item?.product?.sTenSanPham}</td>
                                        <td className='box-image'>
                                            <img
                                                src={item?.sUrl}
                                                alt="img"
                                            />
                                        </td>
                                        <td>{item?.sMoTa}</td>
                                        <td className='btn-action'>
                                            <button onClick={() => handleCreateOrUpdateUser("UPDATE", item)} title='Sửa'><FaRegEdit /></button>
                                            <button onClick={() => handleDeleteBrand(item)} title='Xóa'><FaRegTrashCan /></button>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td colSpan={6} className='text-center'>Danh sách trống</td></tr>}
                    </tbody>
                </table>
            </div>
            {totalPage > 0 && <div className='product-image-footer'>
                <ReactPaginate
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={totalPage}
                    previousLabel="<"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                />
            </div>}
            <ModalDelete show={isShowModelDelete}
                title={"sản phẩm - hình ảnh"}
                name={dataModal?.product?.sTenSanPham}
                handleCloseModalDelete={handleCloseModalDelete}
                confirmDelete={confirmDelete}
            />
            <ModalProductImage
                show={isShowModel}
                handleCloseModal={handleCloseModal}
                action={actionModaProductImage}
                dataModalProductImage={dataModalProductImage}
                listProduct={listProduct}
                fetchAllProductImage={fetchAllProductImage}
            />
        </main>
    )
}

export default ManageProductImage