import React, { useEffect, useRef, useState } from 'react'

import "./ManageImportReceipt.scss"
import ReactPaginate from 'react-paginate';
import { IoReloadSharp } from "react-icons/io5";
import { FaPlusCircle, FaRegEdit, FaPrint } from "react-icons/fa";
import ImportReceiptNote from './ImportReceiptNote';
import axios from '../../config/axios';
import { useReactToPrint } from 'react-to-print';
import ImportReceiptPrint from './ImportReceiptPrint';

const ManageImportReceipt = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const currentLimit = 4
    const [totalPage, setTotalPage] = useState(0)

    const [listImportReceipt, setListImportReceipt] = useState([])
    const [isShowImportNote, setIsShowImportNote] = useState(false)   // state modal thêm, sửa sản phẩm
    const [actionModalImportReceipt, setActionModalImportReceipt] = useState("") //state action create or update
    const [dataModalImportReceipt, setDataModalImportReceipt] = useState({})
    const [valueSearch, setValueSearch] = useState("all")

    const [selectedImportReceipt, setSelectedImportReceipt] = useState(null);        // thông tin phiếu nhập kho nào dc chọn để in

    useEffect(() => {
        fetchAllImportReceipt()
    }, [currentPage, valueSearch])

    const fetchAllImportReceipt = async () => {
        let response = await axios.get(`/api/v1/manage-import-receipt/get-all?page=${currentPage}&limit=${currentLimit}&valueSearch=${valueSearch}`)

        if (response?.data?.importReceipts?.length > 0 && response?.errorCode === 0) {
            setTotalPage(response?.data?.totalPage)
            setListImportReceipt(response?.data?.importReceipts)
        } else {
            setTotalPage(response?.data?.totalPage)
            setListImportReceipt([])
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    // hàm đóng modal thêm or sửa category
    const handleCloseImportNote = () => {
        setIsShowImportNote(false)
    }

    const handleCreateOrUpdateUser = (action, data) => {
        if (action === "UPDATE") {
            setIsShowImportNote(true)
            setActionModalImportReceipt(action)
            if (data) {
                setDataModalImportReceipt(data)
            }
        } else {
            setIsShowImportNote(true)
            setActionModalImportReceipt(action)
            setDataModalImportReceipt({})
        }
    }

    const contentRef = useRef(null);
    const printImportReceiptNote = useReactToPrint({ contentRef });

    const handlePrintImportReceipt = (data) => {
        setSelectedImportReceipt(data)

        setTimeout(() => {
            printImportReceiptNote()
        }, 300);
    }

    const handleOnChangeSearch = (e) => {
        const searchValue = e.target.value;
        if (!searchValue) return;
        const formattedSearchDate = new Date(searchValue).toISOString().split("T")[0]
        setValueSearch(formattedSearchDate)
    }

    return (
        <main className='manage-import-receipt-container'>
            <h2 className='title'>Quản lý Nhập Kho</h2>
            <div className='import-receipt-header'>
                <div className='import-receipt-title'>
                    <h3>Danh sách Đơn nhập kho</h3>
                </div>
                <div className='actions'>
                    <button className='btn btn-primary' onClick={() => handleCreateOrUpdateUser("CREATE")} >
                        <span>Tạo mới</span>
                        <span>
                            <FaPlusCircle />
                        </span>
                    </button>
                    <button className='btn btn-success' onClick={() => setValueSearch("all")} >
                        <span>Refesh</span>
                        <span>
                            <IoReloadSharp />
                        </span>
                    </button>
                </div>
            </div>
            <div className='box-search'>
                <label>Ngày lập đơn</label>
                <input className='input-search' value={valueSearch === "all" ? "" : valueSearch} onChange={(e) => handleOnChangeSearch(e)} type="date" />
            </div>
            {!isShowImportNote ? <>
                <div className='import-receipt-body'>
                    <table className="table table-hover table-bordered fs-20">
                        <thead>
                            <tr>
                                <th scope="col">Mã đơn nhập</th>
                                <th scope="col">Thông tin SP</th>
                                <th scope="col">Thông tin NV</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Giá nhập</th>
                                <th scope="col">Tổng tiền</th>
                                <th scope="col">NCC</th>
                                <th scope="col">Ngày lập</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listImportReceipt?.length > 0 ? (
                                listImportReceipt.map((item) =>
                                    item?.importDetails?.map((product, index) => (
                                        <tr key={`${item?.PK_iPhieuNhapID}-${index}-key`}>
                                            {index === 0 && (
                                                <td rowSpan={item?.importDetails?.length}>{item?.PK_iPhieuNhapID}</td>
                                            )}
                                            <td>
                                                {`${product?.productVersion?.productData?.sTenSanPham} - ${product?.productVersion?.sDungLuong} - 
                                                    ${product?.productVersion?.productImages?.sMoTa}`}
                                            </td>
                                            {index === 0 && (
                                                <td rowSpan={item?.importDetails?.length}>{`${item?.employee?.sHoTen} - ${item?.employee?.sSoDienThoai}`}</td>
                                            )}
                                            <td>{product?.iSoLuongNhap}</td>
                                            <td>{product?.fGiaNhap.toLocaleString("vi-VN")} đ</td>

                                            {index === 0 && (
                                                <>
                                                    <td rowSpan={item?.importDetails?.length}>
                                                        {item?.fTongTien.toLocaleString("vi-VN")} đ
                                                    </td>
                                                    <td rowSpan={item?.importDetails?.length}>
                                                        {item?.supplier?.sTenNhaCungCap}
                                                    </td>
                                                    <td rowSpan={item?.importDetails?.length}>
                                                        {new Date(item?.dNgayLap).toLocaleDateString("vi-VN")}
                                                    </td>
                                                    <td rowSpan={item?.importDetails?.length} className="btn-action">
                                                        <button onClick={() => handlePrintImportReceipt(item)} title="In phiếu nhập">
                                                            <FaPrint />
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                )
                            ) : (
                                <tr>
                                    <td className="text-center" colSpan={8}>
                                        Danh sách Đơn nhập kho trống!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className='box-import-receipt'>
                    <ImportReceiptPrint ref={contentRef} data={selectedImportReceipt} />
                </div>
                {totalPage > 0 && <div className='import-receipt-footer'>
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
            </> : <ImportReceiptNote
                show={isShowImportNote}
                handleCloseImportNote={handleCloseImportNote}
                action={actionModalImportReceipt}
                dataModalImportReceipt={dataModalImportReceipt}
                fetchAllImportReceipt={fetchAllImportReceipt}
            />}
        </main>
    )
}

export default ManageImportReceipt