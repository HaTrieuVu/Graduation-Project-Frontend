import React, { useEffect, useState } from 'react'

import axios from 'axios';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaPlusCircle } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import { IoReloadSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import ModalSupplier from './ModalSupplier';

import "./ManageSupplier.scss"

const ManageSupplier = () => {
    const [listSupplier, setListSupplier] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const currentLimit = 5
    const [totalPage, setTotalPage] = useState(0)

    const [isShowModel, setIsShowModel] = useState(false)   // state modal thêm, sửa ncc
    const [isShowModelDelete, setIsShowModelDelete] = useState(false)
    const [dataModal, setDataModal] = useState({})  // data của modal delete
    const [actionModalUser, setActionModalUser] = useState("") //state action create or update
    const [dataModalSupplier, setDataModalSupplier] = useState({})

    useEffect(() => {
        fetchAllSupplier()
    }, [currentPage])

    const fetchAllSupplier = async () => {
        let respone = await axios.get(`/manage-supplier/get-all?page=${currentPage}&limit=${currentLimit}`)
        if (respone?.data?.data && respone?.data?.errorCode === 0) {
            setTotalPage(respone?.data?.data?.totalPage)
            setListSupplier(respone?.data?.data?.suppliers)
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    // hàm xóa supplier (mở modal xóa supplier)
    const handleDeleteSupplier = async (supplier) => {
        setDataModal(supplier)
        setIsShowModelDelete(true)
    };

    // hàm xác nhận xóa supplier
    const confirmDeleteUser = async () => {
        try {
            let response = await axios.delete("/manage-supplier/delete", { data: { id: dataModal?.PK_iNhaCungCapID } });
            if (response?.data?.errorCode === 0) {
                toast.success("Xóa Nhà cung cấp thành công!")
                await fetchAllSupplier()
                setIsShowModelDelete(false)
            } else {
                toast.error("Xóa thất bại! Vui lòng thử lại.")
            }
        } catch (error) {
            console.error("Lỗi khi xóa ncc", error);
            toast.error("Xóa thất bại! Vui lòng thử lại.")
        }
    }

    // hàm đóng modal xóa supplier
    const handleCloseModalDelete = () => {
        setIsShowModelDelete(false);
        setDataModal({})
    }

    // hàm đóng modal thêm or sửa supplier
    const handleCloseModal = () => {
        setIsShowModel(false)
    }

    const handleCreateOrUpdateUser = (action, data) => {
        if (action === "UPDATE") {
            setIsShowModel(true)
            setActionModalUser(action)
            if (data) {
                setDataModalSupplier(data)
            }
        } else {
            setIsShowModel(true)
            setActionModalUser(action)
            setDataModalSupplier({})
        }

    }

    return (
        <main className='manage-supplier-container'>
            <h2 className='title'>Quản lý Nhà cung cấp</h2>
            <div className='supplier-header'>
                <div className='supplier-title'>
                    <h3>Danh sách Nhà cung cấp</h3>
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
            <div className='supplier-body'>
                <table className="table table-hover table-bordered fs-20">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Mã Nhà cung cấp</th>
                            <th scope="col">Tên nhà cung cấp</th>
                            <th scope="col">Địa chỉ NCC</th>
                            <th scope="col">Email</th>
                            <th scope="col">Số điện thoại</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listSupplier?.length > 0 ?
                            listSupplier.map((item, i) => {
                                return (
                                    <tr key={item?.PK_iNhaCungCapID}>
                                        <td scope="row">{(currentPage - 1) * currentLimit + (i + 1)}</td>
                                        <td>{item?.PK_iNhaCungCapID}</td>
                                        <td>{item?.sTenNhaCungCap}</td>
                                        <td>{item?.sDiaChi}</td>
                                        <td>{item?.sEmail}</td>
                                        <td>{item?.sSoDienThoai}</td>
                                        <td className='btn-action'>
                                            <button onClick={() => handleCreateOrUpdateUser("UPDATE", item)} title='Sửa'><FaRegEdit /></button>
                                            <button onClick={() => handleDeleteSupplier(item)} title='Xóa'><FaRegTrashCan /></button>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td>Danh sách Nhà cung cấp trống</td></tr>}
                    </tbody>
                </table>
            </div>
            {totalPage > 0 && <div className='supplier-footer'>
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
                title={"nguời dùng"}
                name={dataModal.sTenNhaCungCap}
                handleCloseModalDelete={handleCloseModalDelete}
                confirmDeleteUser={confirmDeleteUser}
            />
            <ModalSupplier
                show={isShowModel}
                handleCloseModal={handleCloseModal}
                action={actionModalUser}
                dataModalSupplier={dataModalSupplier}
                fetchAllSupplier={fetchAllSupplier}
            />
        </main>
    )
}

export default ManageSupplier