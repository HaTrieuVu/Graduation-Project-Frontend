import React, { useEffect, useState } from 'react'

import axios from '../../config/axios';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaPlusCircle } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import { IoReloadSharp } from "react-icons/io5";
import { toast } from 'react-toastify';

import "./ManagePromotion.scss"
import Select from "react-select";
import ModalPromotion from './ModalPromotion';

const ManagePromotion = () => {
    const [listPromotion, setListPromotion] = useState([])
    const [listProduct, setListProduct] = useState([])


    const [currentPage, setCurrentPage] = useState(1);
    const currentLimit = 15
    const [totalPage, setTotalPage] = useState(0)

    const [isShowModel, setIsShowModel] = useState(false)   // state modal thêm, sửa khuyến mãi
    const [isShowModelDelete, setIsShowModelDelete] = useState(false)
    const [dataModal, setDataModal] = useState({})  // data của modal delete
    const [actionModalPromotion, setActionModalPromotion] = useState("") //state action create or update
    const [dataModalPromotion, setDataModalPromotion] = useState({})

    const [valueSearch, setValueSearch] = useState("all")


    useEffect(() => {
        fetchAllPromotion()
    }, [currentPage, valueSearch])

    useEffect(() => {
        fetchGetProduct()
    }, [])

    const fetchAllPromotion = async () => {
        let response = await axios.get(`/api/v1/manage-promotion/get-all?page=${currentPage}&limit=${currentLimit}&valueSearch=${valueSearch}`)
        if (response?.data && response?.errorCode === 0) {
            setTotalPage(response?.data?.totalPage)
            setListPromotion(response?.data?.promotions)
        }
    }

    const fetchGetProduct = async () => {
        let response = await axios.get("/api/v1/manage-product/get-all")
        if (response?.errorCode === 0 && response?.data?.length > 0) {
            let dataBuild = buildOptions(response?.data)
            setListProduct(dataBuild)
        }
    }

    // lấy các thuộc tính cần thiết để sử dụng react-select
    const buildOptions = (data) => {
        return data.map(item => ({
            value: item.PK_iSanPhamID,
            label: item.sTenSanPham
        }));
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    // hàm xóa khuyến mãi (mở modal xóa khuyến mãi)
    const handleDeleteProduct = (product) => {
        setDataModal(product)
        setIsShowModelDelete(true)
    };

    console.log(dataModal)

    // hàm xác nhận xóa khuyến mãi
    const confirmDelete = async () => {
        try {
            let response = await axios.delete("/api/v1/manage-promotion/delete", { data: { id: dataModal?.PK_iKhuyenMaiID } });
            if (response?.errorCode === 0) {
                toast.success("Xóa khuyến mãi bản thành công!")
                await fetchAllPromotion()
                setIsShowModelDelete(false)
            } else {
                toast.error("Xóa thất bại! Vui lòng thử lại.")
            }
        } catch (error) {
            console.error("Lỗi khi xóa khuyến mãi", error);
            toast.error("Xóa thất bại! Vui lòng thử lại.")
        }
    }

    // hàm đóng modal xóa khuyến mãi
    const handleCloseModalDelete = () => {
        setIsShowModelDelete(false);
        setDataModal({})
    }

    // hàm đóng modal thêm or sửa khuyến mãi
    const handleCloseModal = () => {
        setIsShowModel(false)
    }

    const handleCreateOrUpdateUser = (action, data) => {
        if (action === "UPDATE") {
            setIsShowModel(true)
            setActionModalPromotion(action)
            if (data) {
                setDataModalPromotion(data)
            }
        } else {
            setIsShowModel(true)
            setActionModalPromotion(action)
            setDataModalPromotion({})
        }
    }

    return (
        <main className='manage-promotion-container'>
            <h2 className='title'>Quản lý Khuyến mãi</h2>
            <div className='promotion-header'>
                <div className='promotion-title'>
                    <h3>Danh sách khuyến mãi </h3>
                </div>
                <div className='actions'>
                    <button className='btn btn-primary' onClick={() => handleCreateOrUpdateUser("CREATE")} >
                        <span>Tạo mới</span>
                        <span>
                            <FaPlusCircle />
                        </span>
                    </button>
                    <button onClick={() => { fetchAllPromotion(), setValueSearch("all") }} className='btn btn-success'>
                        <span>Refesh</span>
                        <span>
                            <IoReloadSharp />
                        </span>
                    </button>
                </div>
            </div>
            <div className='search-box'>
                <label htmlFor="">Tìm sản phẩm</label>
                <Select
                    value={valueSearch === "all" ? null : listProduct.find(option => option.value === valueSearch)}
                    onChange={(selectedOption) => setValueSearch(selectedOption.value)}
                    options={listProduct}
                    placeholder="Tìm sản phẩm"
                    className='search'
                />
            </div>
            <div className='promotion-body'>
                <table className="table table-hover table-bordered fs-20">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Mã khuyến mãi</th>
                            <th scope="col">Tên sản phẩm</th>
                            <th scope="col">Giá trị(%)</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listPromotion?.length > 0 ?
                            listPromotion.map((item, i) => {
                                return (
                                    <tr key={`${item?.PK_iKhuyenMaiID}-promotion"-key`}>
                                        <td scope="row">{(currentPage - 1) * currentLimit + (i + 1)}</td>
                                        <td>{item?.PK_iKhuyenMaiID}</td>
                                        <td>{item?.product?.sTenSanPham}</td>
                                        <td>{item?.fGiaTriKhuyenMai}</td>
                                        <td>{item?.bTrangThai === 1 ? "Khuyến mãi" : "Hết khuyến mãi"}</td>
                                        <td className='btn-action'>
                                            <button onClick={() => handleCreateOrUpdateUser("UPDATE", item)} title='Sửa'><FaRegEdit /></button>
                                            <button onClick={() => handleDeleteProduct(item)} title='Xóa'><FaRegTrashCan /></button>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td colSpan={6} className='text-center'>Danh sách trống!</td></tr>}
                    </tbody>
                </table>
            </div>
            {totalPage > 0 && <div className='promotion-footer'>
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
                title={"khuyến mãi"}
                name={`${dataModal?.product?.sTenSanPham} - ${dataModal?.fGiaTriKhuyenMai} %`}
                handleCloseModalDelete={handleCloseModalDelete}
                confirmDelete={confirmDelete}
            />
            <ModalPromotion
                show={isShowModel}
                handleCloseModal={handleCloseModal}
                action={actionModalPromotion}
                dataModalPromotion={dataModalPromotion}
                listProduct={listProduct}
                fetchAllPromotion={fetchAllPromotion}
            />
        </main>
    )
}

export default ManagePromotion