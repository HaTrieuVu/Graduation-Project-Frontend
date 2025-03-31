import React, { useEffect, useState } from 'react'

import axios from '../../config/axios';

import "./ManageOrder.scss"
import _ from "lodash";
import { IoReloadSharp } from "react-icons/io5";
import { FaPlusCircle, FaRegEdit, FaPrint } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import ModalOrder from './ModalOrder';

const ManageOrder = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const currentLimit = 5
    const [totalPage, setTotalPage] = useState(0)

    const [listOrders, setListOrders] = useState([])
    const [isShowModel, setIsShowModel] = useState(false)
    const [actionModalOrder, setActionModalOrder] = useState("")
    const [dataModalOrder, setDataModalOrder] = useState({})
    const [statusOrder, setStatusOrder] = useState("all")

    useEffect(() => {
        fetchAllOrders()
    }, [currentPage, statusOrder])

    console.log(statusOrder)

    const fetchAllOrders = async () => {
        let response =
            await axios.get(`/api/v1/manage-order/get-orders-by-status?page=${currentPage}&limit=${currentLimit}&statusOrder=${statusOrder}`)

        if (!_.isEmpty(response?.data) && response?.errorCode === 0) {
            setTotalPage(response?.data?.totalPage)
            setListOrders(response?.data?.orders)
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    const handleCloseModal = () => {
        setIsShowModel(false)
    }

    const handleUpdateOrder = (data) => {
        setIsShowModel(true)
        setActionModalOrder("UPDATE")
        if (data) {
            setDataModalOrder(data)
        }
    }

    const handlePrintOrder = () => {

    }

    const handleChangeSelect = (e) => {
        setStatusOrder(e.target.value)
    }

    console.log(listOrders)

    return (
        <main className='manage-order-container'>
            <h2 className='title'>Quản lý Đơn mua hàng</h2>
            <div className='order-header'>
                <div className='order-title'>
                    <h3>Danh sách Đơn mua hàng</h3>
                </div>
                <div className='actions'>
                    <button className='btn btn-primary' >
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
            <div className='box-search'>
                <label>Trạng thái đơn hàng</label>
                <select value={statusOrder} onChange={(e) => handleChangeSelect(e)} className='select-search'>
                    <option value="all">Chọn</option>
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Xác nhận">Xác nhận</option>
                    <option value="Đang giao hàng">Đang giao hàng</option>
                </select>
            </div>
            <div className='order-body'>
                <table className="table table-hover table-bordered fs-20">
                    <thead>
                        <tr>
                            <th scope="col">Mã đơn mua</th>
                            <th scope="col">Thông tin KH</th>
                            <th scope="col">Thông tin SP</th>
                            <th scope="col">Tổng tiền</th>
                            <th scope="col">Trạng thái đơn hàng</th>
                            <th scope="col">Phương thức thanh toán</th>
                            <th scope="col">Trạng thái thanh toán</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listOrders?.length > 0 ?
                            listOrders.map((item, i) => {
                                return (
                                    <tr key={item?.PK_iDonMuaHangID - "order-item" - i}>
                                        <td scope="row">{`${item?.PK_iDonMuaHangID}`}</td>
                                        <td>{`${item?.customer?.sHoTen}-${item?.customer?.sSoDienThoai}-${item?.customer?.sDiaChi}`}</td>
                                        <td>{`${item?.orderDetails?.productVersion?.productData?.sTenSanPham}
                                            -${item?.orderDetails?.productVersion?.productImages?.sMoTa}`}
                                        </td>
                                        <td>{item?.fTongTien.toLocaleString("vi-VN")} đ</td>
                                        <td>{item?.sTrangThaiDonHang}</td>
                                        <td>{item?.sPhuongThucThanhToan === "COD" ? "Thanh toán khi nhận hàng" : "Thanh toán Online"}</td>
                                        <td>{item?.sTrangThaiThanhToan}</td>
                                        <td className='btn-action'>
                                            {(item?.sTrangThaiDonHang !== "Giao hàng thành công" && item?.sTrangThaiDonHang !== "Đã hủy") && (
                                                <button onClick={() => handleUpdateOrder(item)} title='Cập nhật'><FaRegEdit /></button>
                                            )}
                                            {item?.sTrangThaiDonHang !== "Đã hủy" && <button onClick={() => handlePrintOrder(item)} title='In hóa đơn'><FaPrint /></button>}
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td className='text-center' colSpan={8}>Danh sách Đơn mua hàng trống!</td></tr>}
                    </tbody>
                </table>
            </div>
            {totalPage > 0 && <div className='order-footer'>
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
            <ModalOrder
                show={isShowModel}
                handleCloseModal={handleCloseModal}
                action={actionModalOrder}
                dataModalOrder={dataModalOrder}
                fetchAllOrders={fetchAllOrders}
            />
        </main>
    )
}

export default ManageOrder