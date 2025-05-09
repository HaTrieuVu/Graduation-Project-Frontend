import React, { useEffect, useState } from 'react'

import axios from '../../config/axios';
import "./ManageCustomer.scss"
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaPlusCircle } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import { IoReloadSharp } from "react-icons/io5";
import { BsSearch } from 'react-icons/bs'
import { toast } from 'react-toastify';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import ModalUser from './ModalCustomer';


const ManageCustomer = () => {
    const [listUser, setListUser] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    // const [currentLimit, setCurrentLimit] = useState(4);
    const currentLimit = 3
    const [totalPage, setTotalPage] = useState(0)

    const [isShowModel, setIsShowModel] = useState(false)   // state modal thêm, sửa user
    const [isShowModelDelete, setIsShowModelDelete] = useState(false)
    const [dataModal, setDataModal] = useState({})  // data của modal delete
    const [actionModalUser, setActionModalUser] = useState("") //state action create or update
    const [dataModalUser, setDataModalUser] = useState({})

    const [keywordSearch, setKeywordSearch] = useState("all")

    useEffect(() => {
        fetchAllUser()
    }, [currentPage, keywordSearch])

    const fetchAllUser = async () => {
        let response = await axios.get(`/api/v1/user/get-all?page=${currentPage}&limit=${currentLimit}&keywordSearch=${keywordSearch}`)
        if (response?.data && response?.errorCode === 0) {
            setTotalPage(response?.data?.totalPage)
            setListUser(response?.data?.users)
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    // hàm xóa user (mở modal xóa user)
    const handleDeleteUser = async (user) => {
        setDataModal(user)
        setIsShowModelDelete(true)
    };

    // hàm xác nhận xóa user
    const confirmDelete = async () => {
        try {
            let response = await axios.delete("/api/v1/user/delete", { data: { id: dataModal?.PK_iKhachHangID } });
            if (response?.errorCode === 0) {
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

    // hàm đóng modal xóa user
    const handleCloseModalDelete = () => {
        setIsShowModelDelete(false);
        setDataModal({})
    }

    // hàm đóng modal thêm or sửa user
    const handleCloseModal = () => {
        setIsShowModel(false)
    }

    const handleCreateOrUpdateUser = (action, data) => {
        if (action === "UPDATE") {
            setIsShowModel(true)
            setActionModalUser(action)
            if (data) {
                setDataModalUser(data)
            }
        } else {
            setIsShowModel(true)
            setActionModalUser(action)
            setDataModalUser({})
        }

    }

    const handleSearch = async (e) => {
        if (e.key === "Enter") {
            setKeywordSearch(e.target.value.trim())
        }
    }

    console.log(keywordSearch)

    return (
        <main className='manage-user-container'>
            <h2 className='title'>Quản lý Khách hàng</h2>
            <div className='user-header'>
                <div className='user-title'>
                    <h3>Danh sách khách hàng</h3>
                </div>
                <div className='actions'>
                    <button className='btn btn-primary' onClick={() => handleCreateOrUpdateUser("CREATE")} >
                        <span>Tạo mới</span>
                        <span>
                            <FaPlusCircle />
                        </span>
                    </button>
                    <button onClick={() => { fetchAllUser, setKeywordSearch("all") }} className='btn btn-success'>
                        <span>Refesh</span>
                        <span>
                            <IoReloadSharp />
                        </span>
                    </button>
                </div>
            </div>
            <div className='user-search'>
                <div className='user-search-body'>
                    <BsSearch className='icon' />
                    <input
                        type="text"
                        placeholder='Tên KH hoặc SĐT hoặc Email...'
                        onKeyDown={(e) => handleSearch(e)}
                    />
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
                                    <tr key={`${item?.PK_iKhachHangID}-customer-key`}>
                                        <td scope="row">{(currentPage - 1) * currentLimit + (i + 1)}</td>
                                        <td>{item?.PK_iKhachHangID}</td>
                                        <td>{item?.sHoTen}</td>
                                        <td>{item?.sDiaChi}</td>
                                        <td>{item?.sEmail}</td>
                                        <td>{item?.sSoDienThoai}</td>
                                        <td>{item?.role?.sMoTa}</td>
                                        <td className='btn-action'>
                                            <button onClick={() => handleCreateOrUpdateUser("UPDATE", item)} title='Sửa'><FaRegEdit /></button>
                                            <button onClick={() => handleDeleteUser(item)} title='Xóa'><FaRegTrashCan /></button>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td colSpan={8} className='text-center'>Danh sách Khách hàng trống!</td></tr>}
                    </tbody>
                </table>
            </div>
            {totalPage > 0 && <div className='user-footer'>
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
                title={"nguời dùng"}
                name={dataModal.sHoTen}
                handleCloseModalDelete={handleCloseModalDelete}
                confirmDelete={confirmDelete}
            />
            <ModalUser
                show={isShowModel}
                handleCloseModal={handleCloseModal}
                action={actionModalUser}
                dataModalUser={dataModalUser}
                fetchAllUser={fetchAllUser}
            />
        </main>
    )
}

export default ManageCustomer