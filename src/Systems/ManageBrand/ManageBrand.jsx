import React, { useEffect, useState } from 'react'

import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaPlusCircle } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import { IoReloadSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import axios from '../../config/axios';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import ModalBrand from './ModalBrand';

import "./ManageBrand.scss"

const ManageBrand = () => {
    const [listBrand, setListBrand] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const currentLimit = 5
    const [totalPage, setTotalPage] = useState(0)

    const [isShowModel, setIsShowModel] = useState(false)   // state modal thêm, sửa ncc
    const [isShowModelDelete, setIsShowModelDelete] = useState(false)
    const [dataModal, setDataModal] = useState({})  // data của modal delete
    const [actionModaBrand, setActionModalBrand] = useState("") //state action create or update
    const [dataModalBrand, setDataModalBrand] = useState({})

    useEffect(() => {
        fetchAllBrand()
    }, [currentPage])

    const fetchAllBrand = async () => {
        let response = await axios.get(`/api/v1/manage-brand/get-all?page=${currentPage}&limit=${currentLimit}`)
        if (response?.data && response?.errorCode === 0) {
            setTotalPage(response?.data?.totalPage)
            setListBrand(response?.data?.brands)
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    // hàm xóa brand (mở modal xóa brand)
    const handleDeleteBrand = async (brand) => {
        setDataModal(brand)
        setIsShowModelDelete(true)
    };

    // hàm xác nhận xóa brand
    const confirmDeleteUser = async () => {
        try {
            let response = await axios.delete("/api/v1/manage-brand/delete", { data: { id: dataModal?.PK_iNhanHangID } });
            if (response?.errorCode === 0) {
                toast.success("Xóa Nhãn hàng thành công!")
                await fetchAllBrand()
                setIsShowModelDelete(false)
            } else {
                toast.error("Xóa thất bại! Vui lòng thử lại.")
            }
        } catch (error) {
            console.error("Lỗi khi xóa ncc", error);
            toast.error("Xóa thất bại! Vui lòng thử lại.")
        }
    }

    // hàm đóng modal xóa brand
    const handleCloseModalDelete = () => {
        setIsShowModelDelete(false);
        setDataModal({})
    }

    // hàm đóng modal thêm or sửa brand
    const handleCloseModal = () => {
        setIsShowModel(false)
    }

    const handleCreateOrUpdateUser = (action, data) => {
        if (action === "UPDATE") {
            setIsShowModel(true)
            setActionModalBrand(action)
            if (data) {
                setDataModalBrand(data)
            }
        } else {
            setIsShowModel(true)
            setActionModalBrand(action)
            setDataModalBrand({})
        }

    }

    return (
        <main className='manage-brand-container'>
            <h2 className='title'>Quản lý Nhãn hàng</h2>
            <div className='brand-header'>
                <div className='brand-title'>
                    <h3>Danh sách Nhãn hàng</h3>
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
            <div className='brand-body'>
                <table className="table table-hover table-bordered fs-20">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Mã Nhãn hàng</th>
                            <th scope="col">Tên Nhãn hàng</th>
                            <th scope="col">Logo</th>
                            <th scope="col">Mô tả</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listBrand?.length > 0 ?
                            listBrand.map((item, i) => {
                                return (
                                    <tr key={`${item?.PK_iNhanHangID}-brand-key`}>
                                        <td scope="row">{(currentPage - 1) * currentLimit + (i + 1)}</td>
                                        <td>{item?.PK_iNhanHangID}</td>
                                        <td>{item?.sTenNhanHang}</td>
                                        <td className='box-logo'>
                                            <img
                                                src={item?.sLogo}
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
                            : <tr><td>Danh sách Nhãn hàng trống</td></tr>}
                    </tbody>
                </table>
            </div>
            {totalPage > 0 && <div className='brand-footer'>
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
                title={"nhãn hàng"}
                name={dataModal.sTenNhanHang}
                handleCloseModalDelete={handleCloseModalDelete}
                confirmDeleteUser={confirmDeleteUser}
            />
            <ModalBrand
                show={isShowModel}
                handleCloseModal={handleCloseModal}
                action={actionModaBrand}
                dataModalBrand={dataModalBrand}
                fetchAllBrand={fetchAllBrand}
            />
        </main>
    )
}

export default ManageBrand