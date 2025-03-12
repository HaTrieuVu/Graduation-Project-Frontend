import React, { useEffect, useState } from 'react'
import axios from "axios"

import "./ManageUser.scss"
import _ from "lodash"
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import { FaPlusCircle } from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import ModalDelete from '../../components/ModalDelete/ModalDelete';


const ManageUser = () => {
    const [listUser, setListUser] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    // const [currentLimit, setCurrentLimit] = useState(4);
    const [totalPage, setTotalPage] = useState(0)
    const currentLimit = 3
    const [isShowModelDelete, setIsShowModelDelete] = useState(false)
    const [dataModal, setDataModal] = useState({})

    useEffect(() => {
        fetchAllUser()
    }, [currentPage])

    const fetchAllUser = async () => {
        let respone = await axios.get(`/user/get-all?page=${currentPage}&limit=${currentLimit}`)
        if (respone?.data?.data && respone?.data?.errorCode === 0) {
            setTotalPage(respone?.data?.data?.totalPage)
            setListUser(respone?.data?.data?.users)
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    const handleDeleteUser = async (user) => {
        setDataModal(user)
        setIsShowModelDelete(true)
        console.log(dataModal)
    };

    const confirmDeleteUser = async () => {
        try {
            let response = await axios.delete("/user/delete", { data: { id: dataModal?.PK_iKhachHangID } });
            if (response?.data?.errorCode === 0) {
                toast.success("Xóa người dùng thành công!")
                console.log("ok")
                await fetchAllUser()
                setIsShowModelDelete(false)
            } else {
                toast.error("Xóa thất bại! Vui lòng thử lại.")
            }
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            toast.error("Xóa thất bại! Vui lòng thử lại.")
        }
    }

    const handleCloseModelDelete = () => {
        setIsShowModelDelete(false);
        setDataModal({})
    }

    return (
        <main className='manage-user-container'>
            <h2 className='title'>Quản lý Khách hàng</h2>
            <div className='user-header'>
                <div className='user-title'>
                    <h3>Danh sách khách hàng</h3>
                </div>
                <div className='actions'>
                    <button className='btn btn-primary'>
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
            <div className='user-body'>
                <table className="table table-hover table-bordered fs-20">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Mã khách hàng</th>
                            <th scope="col">Họ tên</th>
                            <th scope="col">Địa chỉ</th>
                            <th scope="col">Email</th>
                            <th scope="col">Số điện thoại</th>
                            <th scope="col">Role</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listUser?.length > 0 ?
                            listUser.map((item, i) => {
                                return (
                                    <tr key={item?.PK_iKhachHangID}>
                                        <td scope="row">{i + 1}</td>
                                        <td>{item?.PK_iKhachHangID}</td>
                                        <td>{item?.sHoTen}</td>
                                        <td>{item?.sDiaChi}</td>
                                        <td>{item?.sEmail}</td>
                                        <td>{item?.sSoDienThoai}</td>
                                        <td>{item?.role?.sMoTa}</td>
                                        <td className='btn-action'>
                                            <button title='Sửa'><FaRegEdit /></button>
                                            <button onClick={() => handleDeleteUser(item)} title='Xóa'><FaRegTrashCan /></button>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td>Danh sách khách hàng trống</td></tr>}
                    </tbody>
                </table>
            </div>
            {totalPage > 0 && <div className='user-footer'>
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
            <ModalDelete show={isShowModelDelete} dataModal={dataModal} handleCloseModelDelete={handleCloseModelDelete} confirmDeleteUser={confirmDeleteUser} />
        </main>
    )
}

export default ManageUser