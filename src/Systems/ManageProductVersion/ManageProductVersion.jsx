import React, { useEffect, useState } from 'react'

import axios from '../../config/axios';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaPlusCircle } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import { IoReloadSharp } from "react-icons/io5";
import { toast } from 'react-toastify';

import "./ManageProductVersion.scss"
import ModalProductVersion from './ModalProductVersion';

const ManageProductVersion = () => {
    const [listProductVersion, setListProductVersion] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const currentLimit = 5
    const [totalPage, setTotalPage] = useState(0)

    const [isShowModel, setIsShowModel] = useState(false)   // state modal thêm, sửa sản phẩm
    const [isShowModelDelete, setIsShowModelDelete] = useState(false)
    const [dataModal, setDataModal] = useState({})  // data của modal delete
    const [actionModalProductVersion, setActionModalProductVersion] = useState("") //state action create or update
    const [dataModalProductVersion, setDataModalProductVersion] = useState({})

    useEffect(() => {
        fetchAllProductVersion()
    }, [currentPage])

    const fetchAllProductVersion = async () => {
        let response = await axios.get(`/api/v1/manage-product-version/get-all?page=${currentPage}&limit=${currentLimit}`)
        if (response?.data && response?.errorCode === 0) {
            setTotalPage(response?.data?.totalPage)
            setListProductVersion(response?.data?.productVersions)
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    // hàm xóa sản phẩm (mở modal xóa sản phẩm)
    const handleDeleteProduct = async (product) => {
        setDataModal(product)
        setIsShowModelDelete(true)
    };

    // hàm xác nhận xóa sản phẩm
    const confirmDeleteUser = async () => {
        try {
            let response = await axios.delete("/api/v1/manage-product-version/delete", { data: { id: dataModal?.PK_iPhienBanID } });
            if (response?.errorCode === 0) {
                toast.success("Xóa Sản phẩm - phiên bản thành công!")
                await fetchAllProductVersion()
                setIsShowModelDelete(false)
            } else {
                toast.error("Xóa thất bại! Vui lòng thử lại.")
            }
        } catch (error) {
            console.error("Lỗi khi xóa ncc", error);
            toast.error("Xóa thất bại! Vui lòng thử lại.")
        }
    }

    // hàm đóng modal xóa category
    const handleCloseModalDelete = () => {
        setIsShowModelDelete(false);
        setDataModal({})
    }

    // hàm đóng modal thêm or sửa category
    const handleCloseModal = () => {
        setIsShowModel(false)
    }

    const handleCreateOrUpdateUser = (action, data) => {
        if (action === "UPDATE") {
            setIsShowModel(true)
            setActionModalProductVersion(action)
            if (data) {
                setDataModalProductVersion(data)
            }
        } else {
            setIsShowModel(true)
            setActionModalProductVersion(action)
            setDataModalProductVersion({})
        }

    }

    return (
        <main className='manage-product-container'>
            <h2 className='title'>Quản lý Sản phẩm</h2>
            <div className='product-header'>
                <div className='product-title'>
                    <h3>Danh sách Sản phẩm - Phiên bản </h3>
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
            <div className='product-body'>
                <table className="table table-hover table-bordered fs-20">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Mã phiên bản</th>
                            <th scope="col">Tên sản phẩm</th>
                            <th scope="col">Màu sắc</th>
                            <th scope="col">Dung lượng</th>
                            <th scope="col">Giá bán</th>
                            <th scope="col">Số lượng</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listProductVersion?.length > 0 ?
                            listProductVersion.map((item, i) => {
                                return (
                                    <tr key={item?.PK_iPhienBanID - "productVersion"}>
                                        <td scope="row">{(currentPage - 1) * currentLimit + (i + 1)}</td>
                                        <td>{item?.PK_iPhienBanID}</td>
                                        <td>{item?.productData?.sTenSanPham}</td>
                                        <td>{item?.productImages?.sMoTa}</td>
                                        <td>{item?.sDungLuong}</td>
                                        <td>{item?.fGiaBan?.toLocaleString("vi-VN")} VNĐ</td>
                                        <td>{item?.iSoLuong}</td>
                                        <td>{item?.bTrangThai}</td>
                                        <td className='btn-action'>
                                            <button onClick={() => handleCreateOrUpdateUser("UPDATE", item)} title='Sửa'><FaRegEdit /></button>
                                            <button onClick={() => handleDeleteProduct(item)} title='Xóa'><FaRegTrashCan /></button>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td>Danh sách Sản phẩm trống</td></tr>}
                    </tbody>
                </table>
            </div>
            {totalPage > 0 && <div className='product-footer'>
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
                title={"sản phẩm - phiên bản"}
                name={`${dataModal?.productData?.sTenSanPham} - ${dataModal?.sDungLuong} - ${dataModal?.sMauSac}`}
                handleCloseModalDelete={handleCloseModalDelete}
                confirmDeleteUser={confirmDeleteUser}
            />
            <ModalProductVersion
                show={isShowModel}
                handleCloseModal={handleCloseModal}
                action={actionModalProductVersion}
                dataModalProductVersion={dataModalProductVersion}
                fetchAllProductVersion={fetchAllProductVersion}
            />
        </main>
    )
}

export default ManageProductVersion