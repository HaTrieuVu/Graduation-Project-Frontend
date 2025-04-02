import React, { useEffect, useRef, useState } from 'react'

import "./ManageWarranty.scss"
import axios from '../../config/axios';
// import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { IoReloadSharp } from "react-icons/io5";
import { FaRegEdit, FaPlusCircle, FaPrint } from "react-icons/fa";
import { BsSearch } from 'react-icons/bs'
import ModalWarranty from './ModalWarranty';
import WarrantyPrint from './WarrantyPrint';
import { useReactToPrint } from "react-to-print";

const ManageWarranty = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const currentLimit = 5
    const [totalPage, setTotalPage] = useState(0)

    const [listWarranty, setListWarranty] = useState([])
    const [isShowModel, setIsShowModel] = useState(false)
    const [actionModalWarranty, setActionModalWarranty] = useState("") //state action create or update
    const [dataModalWarranty, setDataModalWarranty] = useState({})

    const [keywordSearch, setKeywordSearch] = useState("all")
    const [dateSearch, setDateSearch] = useState("")
    const [selectedWarranty, setSelectedWarranty] = useState(null);



    useEffect(() => {
        fetchAllWarranty("all")
    }, [currentPage])

    const fetchAllWarranty = async (valueSearch) => {
        let response = await axios.get(`/api/v1/manage-warranty/get-all?page=${currentPage}
            &limit=${currentLimit}&keywordSearch=${valueSearch}`
        )

        if (response?.data?.warranties?.length > 0 && response?.errorCode === 0) {
            setTotalPage(response?.data?.totalPage)
            setListWarranty(response?.data?.warranties)
        } else {
            setTotalPage(response?.data?.totalPage)
            setListWarranty([])
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

    const handleSearch = async (e) => {
        if (e.key === "Enter" && keywordSearch.trim() !== "") {
            fetchAllWarranty(keywordSearch)
        }
    }

    const handleSearchByDate = (e) => {
        const searchValue = e.target.value;
        if (!searchValue) return;
        const formattedSearchDate = new Date(searchValue).toISOString().split("T")[0]
        setDateSearch(formattedSearchDate)
        fetchAllWarranty(formattedSearchDate)
    }

    const contentRef = useRef(null);
    const printWarranty = useReactToPrint({ contentRef });

    const handlePrintWarranty = (data) => {
        setSelectedWarranty(data)


        setTimeout(() => {
            // printWarranty()
        }, 300);

    }

    console.log(selectedWarranty)

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
                    <button onClick={() => fetchAllWarranty("all")} className='btn btn-success'>
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
                        placeholder='Mã phiếu hoặc sđt hoặc tên KH...'
                        onChange={(e) => {
                            setKeywordSearch(e.target.value)
                            setDateSearch("")
                        }}
                        onKeyDown={(e) => handleSearch(e)}
                    />
                </div>
                <div className='date-search'>
                    <label>Ngày lập</label>
                    <input className='input-search' value={dateSearch} onChange={(e) => handleSearchByDate(e)} type="date" />
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
                            : <tr><td colSpan={8} className='text-center'>Danh sách Phiếu bảo hành trống</td></tr>}
                    </tbody>
                </table>
            </div>
            <div className='box-warranty'>
                <WarrantyPrint ref={contentRef} data={selectedWarranty} />
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