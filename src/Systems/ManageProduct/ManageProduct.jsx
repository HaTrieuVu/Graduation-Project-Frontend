import React, { useEffect, useState } from 'react'

import axios from '../../config/axios';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaPlusCircle } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import { IoReloadSharp } from "react-icons/io5";
import { BsSearch } from 'react-icons/bs'
import { toast } from 'react-toastify';

import "./ManageProduct.scss"
import ModalProduct from './ModalProduct';

const ManageProduct = () => {
    const [listProduct, setListProduct] = useState([])
    const [keywordSearch, setKeywordSearch] = useState("")

    const [currentPage, setCurrentPage] = useState(1);
    const currentLimit = 5
    const [totalPage, setTotalPage] = useState(0)

    const [isShowModel, setIsShowModel] = useState(false)   // state modal thêm, sửa sản phẩm
    const [isShowModelDelete, setIsShowModelDelete] = useState(false)
    const [dataModal, setDataModal] = useState({})  // data của modal delete
    const [actionModalProduct, setActionModalProduct] = useState("") //state action create or update
    const [dataModalProduct, setDataModalProduct] = useState({})

    useEffect(() => {
        fetchAllProduct()
    }, [currentPage])

    const fetchAllProduct = async () => {
        let response = await axios.get(`/api/v1/manage-product/get-all?page=${currentPage}&limit=${currentLimit}`)
        if (response?.data && response?.errorCode === 0) {
            setTotalPage(response?.data?.totalPage)
            setListProduct(response?.data?.products)
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    // hàm xóa sản phẩm (mở modal xóa sản phẩm)
    const handleDeleteProduct = async (product) => {
        setDataModal(product)
        setIsShowModelDelete(true)
    };

    // hàm xác nhận xóa sản phẩm
    const confirmDeleteUser = async () => {
        try {
            let response = await axios.delete("/api/v1/manage-product/delete", { data: { id: dataModal?.PK_iSanPhamID } });
            if (response?.errorCode === 0) {
                toast.success("Xóa Sản phẩm thành công!")
                await fetchAllProduct()
                setIsShowModelDelete(false)
            } else {
                toast.error("Xóa thất bại! Vui lòng thử lại.")
            }
        } catch (error) {
            console.error("Lỗi khi xóa ncc", error);
            toast.error("Xóa thất bại! Vui lòng thử lại.")
        }
    }

    // hàm đóng modal xóa category
    const handleCloseModalDelete = () => {
        setIsShowModelDelete(false);
        setDataModal({})
    }

    // hàm đóng modal thêm or sửa category
    const handleCloseModal = () => {
        setIsShowModel(false)
    }

    const handleCreateOrUpdateUser = (action, data) => {
        if (action === "UPDATE") {
            setIsShowModel(true)
            setActionModalProduct(action)
            if (data) {
                setDataModalProduct(data)
            }
        } else {
            setIsShowModel(true)
            setActionModalProduct(action)
            setDataModalProduct({})
        }

    }

    const handleSearch = async (e) => {
        if (e.key === "Enter" && keywordSearch.trim() !== "") {
            let response = await axios.get(`/api/v1/search-product?page=${currentPage}&limit=${currentLimit}&keywordSearch=${keywordSearch}`)
            if (response?.data && response?.errorCode === 0) {
                setTotalPage(response?.data?.totalPage)
                setListProduct(response?.data?.products)
            }
        }
    }

    return (
        <main className='manage-product-container'>
            <h2 className='title'>Quản lý Sản phẩm</h2>
            <div className='product-header'>
                <div className='product-title'>
                    <h3>Danh sách Sản phẩm</h3>
                </div>
                <div className='actions'>
                    <button className='btn btn-primary' onClick={() => handleCreateOrUpdateUser("CREATE")} >
                        <span>Tạo mới</span>
                        <span>
                            <FaPlusCircle />
                        </span>
                    </button>
                    <button className='btn btn-success'>
                        <span onClick={() => fetchAllProduct()}>Refesh</span>
                        <span>
                            <IoReloadSharp />
                        </span>
                    </button>
                </div>
            </div>
            <div className='product-search'>
                <div className='product-search-body'>
                    <BsSearch className='icon' />
                    <input
                        type="text"
                        placeholder='Tên sản phẩm...'
                        onChange={(e) => setKeywordSearch(e.target.value)}
                        onKeyDown={(e) => handleSearch(e)}
                    />
                </div>
            </div>
            <div className='product-body'>
                <table className="table table-hover table-bordered fs-20">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Mã sản phẩm</th>
                            <th scope="col">Tên sản phẩm</th>
                            <th scope="col">Tên danh mục</th>
                            <th scope="col">Tên nhãn hàng</th>
                            <th scope="col">Đánh giá (sao)</th>
                            <th scope="col">Tình trạng</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listProduct?.length > 0 ?
                            listProduct.map((item, i) => {
                                return (
                                    <tr key={`${item?.PK_iSanPhamID}-product-key-${i}`}>
                                        <td scope="row">{(currentPage - 1) * currentLimit + (i + 1)}</td>
                                        <td>{item?.PK_iSanPhamID}</td>
                                        <td>{item?.sTenSanPham}</td>
                                        <td>{item?.categoryData?.sTenDanhMuc}</td>
                                        <td>{item?.brandData?.sTenNhanHang}</td>
                                        <td>{item?.sDanhGia}</td>
                                        <td>{item?.sTinhTrangSanPham}</td>
                                        <td className='btn-action'>
                                            <button onClick={() => handleCreateOrUpdateUser("UPDATE", item)} title='Sửa'><FaRegEdit /></button>
                                            <button onClick={() => handleDeleteProduct(item)} title='Xóa'><FaRegTrashCan /></button>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td colSpan={8} className='text-center'>Danh sách Sản phẩm trống</td></tr>}
                    </tbody>
                </table>
            </div>
            {totalPage > 0 && <div className='product-footer'>
                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={totalPage}
                    previousLabel="< previous"
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
                title={"sản phẩm"}
                name={dataModal.sTenSanPham}
                handleCloseModalDelete={handleCloseModalDelete}
                confirmDeleteUser={confirmDeleteUser}
            />
            <ModalProduct
                show={isShowModel}
                handleCloseModal={handleCloseModal}
                action={actionModalProduct}
                dataModalProduct={dataModalProduct}
                fetchAllProduct={fetchAllProduct}
            />
        </main>
    )
}

export default ManageProduct