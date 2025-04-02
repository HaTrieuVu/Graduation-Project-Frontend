import React, { useEffect, useState } from 'react'

import "./ManageWarranty.scss"
import axios from '../../config/axios';
// import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { IoReloadSharp } from "react-icons/io5";
import { FaRegEdit, FaPlusCircle, FaPrint } from "react-icons/fa";
import { BsSearch } from 'react-icons/bs'
import ModalWarranty from './ModalWarranty';

const ManageWarranty = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const currentLimit = 5
    const [totalPage, setTotalPage] = useState(0)

    const [listWarranty, setListWarranty] = useState([])
    const [isShowModel, setIsShowModel] = useState(false)
    const [actionModalWarranty, setActionModalWarranty] = useState("") //state action create or update
    const [dataModalWarranty, setDataModalWarranty] = useState({})

    const [keywordSearch, setKeywordSearch] = useState("")

    useEffect(() => {
        fetchAllWarranty()
    }, [currentPage])

    const fetchAllWarranty = async () => {
        let response = await axios.get(`/api/v1/manage-warranty/get-all?page=${currentPage}&limit=${currentLimit}`)

        if (response?.data?.warranties?.length > 0 && response?.errorCode === 0) {
            setTotalPage(response?.data?.totalPage)
            setListWarranty(response?.data?.warranties)
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    const handleCloseModal = () => {
        setIsShowModel(false)
    }

    const handleCreateOrUpdateWarranty = (action, data) => {
        if (action === "UPDATE") {
            setIsShowModel(true)
            setActionModalWarranty(action)
            if (data) {
                setDataModalWarranty(data)
            }
        } else {
            setIsShowModel(true)
            setActionModalWarranty(action)
            setDataModalWarranty({})
        }
    }

    const handlePrintWarranty = () => {

    }

    const handleSearch = async (e) => {
        if (e.key === "Enter" && keywordSearch.trim() !== "") {
            let response = await axios.get(`/api/v1/search-product?page=${currentPage}&limit=${currentLimit}&keywordSearch=${keywordSearch}`)
            if (response?.data && response?.errorCode === 0) {
                setTotalPage(response?.data?.totalPage)
                setListWarranty(response?.data?.products)
            }
        }
    }

    return (
        <main className='manage-warranty-container'>
            <h2 className='title'>Quản lý Phiếu bảo hành</h2>
            <div className='warranty-header'>
                <div className='warranty-title'>
                    <h3>Danh sách Phiếu bảo hành</h3>
                </div>
                <div className='actions'>
                    {/* <button className='btn btn-primary' onClick={() => handleCreateOrUpdateWarranty("CREATE")} >
                        <span>Tạo mới</span>
                        <span>
                            <FaPlusCircle />
                        </span>
                    </button> */}
                    <button className='btn btn-success'>
                        <span>Refesh</span>
                        <span>
                            <IoReloadSharp />
                        </span>
                    </button>
                </div>
            </div>
            <div className='warranty-search'>
                <div className='warranty-search-body'>
                    <BsSearch className='icon' />
                    <input
                        type="text"
                        placeholder='Mã phiếu hoặc tên khác hàng...'
                        onChange={(e) => setKeywordSearch(e.target.value)}
                        onKeyDown={(e) => handleSearch(e)}
                    />
                </div>
            </div>
            <div className='warranty-body'>
                <table className="table table-hover table-bordered fs-20">
                    <thead>
                        <tr>
                            <th scope="col">Mã phiếu</th>
                            <th scope="col">Thông tin KH</th>
                            <th scope="col">Thông tin SP</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Ngày lập</th>
                            <th scope="col">Ngày kết thúc</th>
                            <th scope="col">Mô tả</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listWarranty?.length > 0 ?
                            listWarranty.map((item, i) => {
                                return (
                                    <tr key={`${item?.PK_iPhieuBaoHanhID}-warranty-item-${i}-key`}>
                                        <td>{item?.PK_iPhieuBaoHanhID}</td>
                                        <td>{`${item?.order?.customer?.sHoTen} - ${item?.order?.customer?.sSoDienThoai}`}</td>
                                        <td>{`${item?.productVersion?.productData?.sTenSanPham} -
                                            ${item?.productVersion?.sDungLuong} - ${item?.productVersion?.productImages?.sMoTa}`}</td>
                                        <td>{item?.sTrangThaiXuLy}</td>
                                        <td>{new Date(item?.dNgayLap).toLocaleDateString("vi-VN")}</td>
                                        <td>{new Date(item?.dNgayKetThucBaoHanh).toLocaleDateString("vi-VN")}</td>
                                        <td>{item?.sMota}</td>
                                        <td className='btn-action'>
                                            <button onClick={() => handleCreateOrUpdateWarranty("UPDATE", item)} title='Sửa'><FaRegEdit /></button>
                                            <button onClick={() => handlePrintWarranty(item)} title="In phiếu bảo hành">
                                                <FaPrint />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td>Danh sách Phiếu bảo hành trống</td></tr>}
                    </tbody>
                </table>
            </div>
            {totalPage > 0 && <div className='warranty-footer'>
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
            <ModalWarranty
                show={isShowModel}
                handleCloseModal={handleCloseModal}
                action={actionModalWarranty}
                dataModalWarranty={dataModalWarranty}
                fetchAllWarranty={fetchAllWarranty}
            />

        </main>
    )
}

export default ManageWarranty