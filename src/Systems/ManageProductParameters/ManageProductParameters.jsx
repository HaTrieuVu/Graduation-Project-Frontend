import React, { useEffect, useState } from 'react'

import axios from '../../config/axios';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaPlusCircle } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import { IoReloadSharp } from "react-icons/io5";
import { toast } from 'react-toastify';

import "./ManageProductParameters.scss"
import ModalProductVersion from './ModalProductParameters';
import Select from "react-select";

const ManageProductParameters = () => {
    const [listProductParameters, setListProductParameters] = useState([])
    const [listProduct, setListProduct] = useState([])


    const [currentPage, setCurrentPage] = useState(1);
    const currentLimit = 8
    const [totalPage, setTotalPage] = useState(0)

    const [isShowModel, setIsShowModel] = useState(false)   // state modal thêm, sửa sản phẩm
    const [isShowModelDelete, setIsShowModelDelete] = useState(false)
    const [dataModal, setDataModal] = useState({})  // data của modal delete
    const [actionModalProductParameters, setActionModalProductParameters] = useState("") //state action create or update
    const [dataModalProductParameters, setDataModalProductParameters] = useState({})

    const [valueSearch, setValueSearch] = useState("all")


    useEffect(() => {
        fetchAllProductParameters()
    }, [currentPage, valueSearch])

    useEffect(() => {
        fetchGetProduct()
    }, [])


    const fetchAllProductParameters = async () => {
        let response = await axios.get(`/api/v1/manage-product-parameters/get-all?page=${currentPage}&limit=${currentLimit}&valueSearch=${valueSearch}`)
        if (response?.data && response?.errorCode === 0) {
            setTotalPage(response?.data?.totalPage)
            setListProductParameters(response?.data?.productParameters)
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

    // hàm xóa sản phẩm (mở modal xóa sản phẩm)
    const handleDeleteProduct = async (product) => {
        setDataModal(product)
        setIsShowModelDelete(true)
    };

    // hàm xác nhận xóa sản phẩm - thông số
    const confirmDelete = async () => {
        try {
            let response = await axios.delete("/api/v1/manage-product-parameters/delete", { data: { id: dataModal?.PK_iThongSoID } });
            if (response?.errorCode === 0) {
                toast.success("Xóa Sản phẩm - thông số thành công!")
                await fetchAllProductParameters()
                setIsShowModelDelete(false)
            } else {
                toast.error("Xóa thất bại! Vui lòng thử lại.")
            }
        } catch (error) {
            console.error("Lỗi khi xóa sp- thông số", error);
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
            setActionModalProductParameters(action)
            if (data) {
                setDataModalProductParameters(data)
            }
        } else {
            setIsShowModel(true)
            setActionModalProductParameters(action)
            setDataModalProductParameters({})
        }
    }

    return (
        <main className='manage-product-container'>
            <h2 className='title'>Quản lý Sản phẩm</h2>
            <div className='product-header'>
                <div className='product-title'>
                    <h3>Danh sách Sản phẩm - Thông số </h3>
                </div>
                <div className='actions'>
                    <button className='btn btn-primary' onClick={() => handleCreateOrUpdateUser("CREATE")} >
                        <span>Tạo mới</span>
                        <span>
                            <FaPlusCircle />
                        </span>
                    </button>
                    <button onClick={() => { fetchAllProductParameters(), setValueSearch("all") }} className='btn btn-success'>
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
            <div className='product-body'>
                <table className="table table-hover table-bordered fs-20">
                    <thead>
                        <tr>
                            <th scope="col">Tên sản phẩm</th>
                            <th scope="col">Hệ điều hành</th>
                            <th scope="col">CPU</th>
                            <th scope="col">GPU</th>
                            <th scope="col">RAM</th>
                            <th scope="col">Camera sau</th>
                            <th scope="col">Camera trước</th>
                            <th scope="col">Màn hình</th>
                            <th scope="col">Pin</th>
                            <th scope="col">Loại Pin</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listProductParameters?.length > 0 ?
                            listProductParameters.map((item) => {
                                return (
                                    <tr key={`${item?.PK_iThongSoID}-product-parameter"-key`}>
                                        <td>{item?.product?.sTenSanPham}</td>
                                        <td>{item?.sHeDieuHanh}</td>
                                        <td>{item?.sCPU}</td>
                                        <td>{item?.sGPU}</td>
                                        <td>{item?.sRAM}</td>
                                        <td>{item?.sCameraSau}</td>
                                        <td>{item?.sCameraTruoc}</td>
                                        <td>{item?.sManHinh}</td>
                                        <td>{item?.sPin}</td>
                                        <td>{item?.sLoaiPin}</td>
                                        <td className='btn-action'>
                                            <button onClick={() => handleCreateOrUpdateUser("UPDATE", item)} title='Sửa'><FaRegEdit /></button>
                                            <button onClick={() => handleDeleteProduct(item)} title='Xóa'><FaRegTrashCan /></button>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td colSpan={9} className='text-center'>Danh sách trống!</td></tr>}
                    </tbody>
                </table>
            </div>
            {totalPage > 0 && <div className='product-footer'>
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
                title={"thông số sản phẩm của "}
                name={`điện thoại: ${dataModal?.product?.sTenSanPham}`}
                handleCloseModalDelete={handleCloseModalDelete}
                confirmDelete={confirmDelete}
            />
            <ModalProductVersion
                show={isShowModel}
                handleCloseModal={handleCloseModal}
                action={actionModalProductParameters}
                dataModalProductParameters={dataModalProductParameters}
                listProduct={listProduct}
                fetchAllProductParameters={fetchAllProductParameters}
            />
        </main>
    )
}

export default ManageProductParameters