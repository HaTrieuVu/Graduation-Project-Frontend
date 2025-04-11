import React, { useEffect, useState } from 'react'

import axios from '../../config/axios';
import "./ManageEmployee.scss"
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaPlusCircle } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import { IoReloadSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import ModalEmployee from './ModalEmployee';


const ManageEmployee = () => {
    const [listEmployee, setListEmployee] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    // const [currentLimit, setCurrentLimit] = useState(4);
    const currentLimit = 3
    const [totalPage, setTotalPage] = useState(0)

    const [isShowModel, setIsShowModel] = useState(false)   // state modal thêm, sửa employee
    const [isShowModelDelete, setIsShowModelDelete] = useState(false)
    const [dataModal, setDataModal] = useState({})  // data của modal delete
    const [actionModalEmployee, setActionModalEmployee] = useState("") //state action create or update
    const [dataModalEmployee, setDataModalEmployee] = useState({})


    useEffect(() => {
        fetchAllEmployee()
    }, [currentPage])

    const fetchAllEmployee = async () => {
        let response = await axios.get(`/api/v1/employee/get-all?page=${currentPage}&limit=${currentLimit}`)
        if (response?.data && response?.errorCode === 0) {
            setTotalPage(response?.data?.totalPage)
            setListEmployee(response?.data?.employees)
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    // hàm xóa employee (mở modal xóa employee)
    const handleDeleteEmployee = async (employee) => {
        setDataModal(employee)
        setIsShowModelDelete(true)
    };

    // hàm xác nhận xóa employee
    const confirmDeleteUser = async () => {
        try {
            let response = await axios.delete("/api/v1/employee/delete", { data: { id: dataModal?.PK_iNhanVienID } });
            if (response?.errorCode === 0) {
                toast.success("Xóa nhân viên thành công!")
                console.log("ok")
                await fetchAllEmployee()
                setIsShowModelDelete(false)
            } else {
                toast.error("Xóa thất bại! Vui lòng thử lại.")
            }
        } catch (error) {
            console.error("Lỗi khi xóa nhân viên:", error);
            toast.error("Xóa thất bại! Vui lòng thử lại.")
        }
    }

    // hàm đóng modal xóa employee
    const handleCloseModalDelete = () => {
        setIsShowModelDelete(false);
        setDataModal({})
    }

    // hàm đóng modal thêm or sửa employee
    const handleCloseModal = () => {
        setIsShowModel(false)
    }

    const handleCreateOrUpdateEmployee = (action, data) => {
        if (action === "UPDATE") {
            setIsShowModel(true)
            setActionModalEmployee(action)
            if (data) {
                setDataModalEmployee(data)
            }
        } else {
            setIsShowModel(true)
            setActionModalEmployee(action)
            setDataModalEmployee({})
        }
    }

    return (
        <main className='manage-employee-container'>
            <h2 className='title'>Quản lý Nhân viên</h2>
            <div className='employee-header'>
                <div className='employee-title'>
                    <h3>Danh sách nhân viên</h3>
                </div>
                <div className='actions'>
                    <button className='btn btn-primary' onClick={() => handleCreateOrUpdateEmployee("CREATE")} >
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
            <div className='employee-body'>
                <table className="table table-hover table-bordered fs-20">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Mã nhân viên</th>
                            <th scope="col">Họ tên</th>
                            <th scope="col">Địa chỉ</th>
                            <th scope="col">Email</th>
                            <th scope="col">Số điện thoại</th>
                            <th scope="col">Role</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listEmployee?.length > 0 ?
                            listEmployee.map((item, i) => {
                                return (
                                    <tr key={`${item?.PK_iNhanVienID}-employee-${i}-key`}>
                                        <td scope="row">{(currentPage - 1) * currentLimit + (i + 1)}</td>
                                        <td>{item?.PK_iNhanVienID}</td>
                                        <td>{item?.sHoTen}</td>
                                        <td>{item?.sDiaChi}</td>
                                        <td>{item?.sEmail}</td>
                                        <td>{item?.sSoDienThoai}</td>
                                        <td>{item?.role?.sMoTa}</td>
                                        <td className='btn-action'>
                                            <button onClick={() => handleCreateOrUpdateEmployee("UPDATE", item)} title='Sửa'><FaRegEdit /></button>
                                            <button onClick={() => handleDeleteEmployee(item)} title='Xóa'><FaRegTrashCan /></button>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td>Danh sách nhân viên trống</td></tr>}
                    </tbody>
                </table>
            </div>
            {totalPage > 0 && <div className='employee-footer'>
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
                title={"nhân viên"}
                name={dataModal.sHoTen}
                handleCloseModalDelete={handleCloseModalDelete}
                confirmDeleteUser={confirmDeleteUser}
            />
            <ModalEmployee
                show={isShowModel}
                handleCloseModal={handleCloseModal}
                action={actionModalEmployee}
                dataModalEmployee={dataModalEmployee}
                fetchAllEmployee={fetchAllEmployee}
            />
        </main>
    )
}

export default ManageEmployee