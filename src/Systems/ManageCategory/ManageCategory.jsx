import React, { useEffect, useState } from 'react'

import axios from '../../config/axios';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaPlusCircle } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import { IoReloadSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import ModalSupplier from './ModalCategory';

import "./ManageCategory.scss"

const ManageCategory = () => {
    const [listCategory, setListCategory] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const currentLimit = 5
    const [totalPage, setTotalPage] = useState(0)

    const [isShowModel, setIsShowModel] = useState(false)   // state modal thêm, sửa ncc
    const [isShowModelDelete, setIsShowModelDelete] = useState(false)
    const [dataModal, setDataModal] = useState({})  // data của modal delete
    const [actionModalCategory, setActionModalCategory] = useState("") //state action create or update
    const [dataModalCategory, setDataModalCategory] = useState({})

    useEffect(() => {
        fetchAllCategory()
    }, [currentPage])

    const fetchAllCategory = async () => {
        let response = await axios.get(`/api/v1/manage-category/get-all?page=${currentPage}&limit=${currentLimit}`)
        if (response?.data && response?.errorCode === 0) {
            setTotalPage(response?.data?.totalPage)
            setListCategory(response?.data?.categories)
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    // hàm xóa category (mở modal xóa category)
    const handleDeleteCategory = async (category) => {
        setDataModal(category)
        setIsShowModelDelete(true)
    };

    // hàm xác nhận xóa category
    const confirmDeleteUser = async () => {
        try {
            let response = await axios.delete("/api/v1/manage-category/delete", { data: { id: dataModal?.PK_iDanhMucID } });
            if (response?.errorCode === 0) {
                toast.success("Xóa Danh mục sản phẩm thành công!")
                await fetchAllCategory()
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
            setActionModalCategory(action)
            if (data) {
                setDataModalCategory(data)
            }
        } else {
            setIsShowModel(true)
            setActionModalCategory(action)
            setDataModalCategory({})
        }

    }

    return (
        <main className='manage-category-container'>
            <h2 className='title'>Quản lý Danh mục sản phẩm</h2>
            <div className='category-header'>
                <div className='category-title'>
                    <h3>Danh sách Danh mục sản phẩm</h3>
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
            <div className='category-body'>
                <table className="table table-hover table-bordered fs-20">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Mã Danh mục sản phẩm</th>
                            <th scope="col">Tên danh mục</th>
                            <th scope="col">Mô tả</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listCategory?.length > 0 ?
                            listCategory.map((item, i) => {
                                return (
                                    <tr key={`${item?.PK_iDanhMucID}-category-key`}>
                                        <td scope="row">{(currentPage - 1) * currentLimit + (i + 1)}</td>
                                        <td>{item?.PK_iDanhMucID}</td>
                                        <td>{item?.sTenDanhMuc}</td>
                                        <td>{item?.sMoTa}</td>
                                        <td className='btn-action'>
                                            <button onClick={() => handleCreateOrUpdateUser("UPDATE", item)} title='Sửa'><FaRegEdit /></button>
                                            <button onClick={() => handleDeleteCategory(item)} title='Xóa'><FaRegTrashCan /></button>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td>Danh sách Danh mục sản phẩm trống</td></tr>}
                    </tbody>
                </table>
            </div>
            {totalPage > 0 && <div className='category-footer'>
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
                title={"danh mục sản phẩm"}
                name={dataModal.sTenDanhMuc}
                handleCloseModalDelete={handleCloseModalDelete}
                confirmDeleteUser={confirmDeleteUser}
            />
            <ModalSupplier
                show={isShowModel}
                handleCloseModal={handleCloseModal}
                action={actionModalCategory}
                dataModalCategory={dataModalCategory}
                fetchAllCategory={fetchAllCategory}
            />
        </main>
    )
}

export default ManageCategory