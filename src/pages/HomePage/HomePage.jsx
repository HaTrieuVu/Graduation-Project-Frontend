import React, { useEffect, useState } from 'react'

import HeaderSlider from '../../components/HeaderSlider/HeaderSlider'
import "./HomePage.scss"
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, getAllProductsStatus, fetchAsyncProducts } from '../../store/productSlice';
import { STATUS } from '../../utils/status';
import ReactPaginate from 'react-paginate';
import ProductList from '../../components/ProductList/ProductList';
import Loader from '../../components/Loader/Loader'
import BrandList from '../../components/BrandList/BrandList';
import { FaFilter } from "react-icons/fa";
import { BsSortDown, BsSortDownAlt } from "react-icons/bs";
import { MdPercent } from "react-icons/md";

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const currentLimit = 10;
  const [totalPage, setTotalPage] = useState(0);
  const [productList, setProductList] = useState([]);
  const [valueFilter, setValueFilter] = useState("all")

  const dispatch = useDispatch();

  const productsResponse = useSelector(getAllProducts);
  const productStatus = useSelector(getAllProductsStatus);

  useEffect(() => {
    dispatch(fetchAsyncProducts({ page: currentPage, limitProduct: currentLimit, valueFilter: valueFilter }));
  }, [currentPage, valueFilter]);

  useEffect(() => {
    if (productsResponse) {
      setTotalPage(productsResponse.totalPage || 0);
      setProductList(productsResponse.products || []);
    }
  }, [productsResponse]);  // Chạy lại khi productsResponse thay đổi

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1)
  };

  const handleClickFilter = (value) => {
    setValueFilter(value)
    console.log(value)
  }

  return (
    <main>
      <div className="slider-wrapper">
        <HeaderSlider />
      </div>
      <div className="main-content bg-whitesmoke">
        <div className="container">
          <BrandList />

          <div className='box-filter'>
            <span className='filter-title'><FaFilter /> Sắp xếp theo</span>
            <div className='filter-content'>
              <button onClick={() => handleClickFilter("DESC")} className={valueFilter === "DESC" ? "active" : ''} ><BsSortDown size={20} /> Giá Cao - Thấp</button>
              <button onClick={() => handleClickFilter("ASC")} className={valueFilter === "ASC" ? "active" : ''}><BsSortDownAlt size={20} /> Giá Thấp - Cao</button>
              <button onClick={() => handleClickFilter("RERCENT")} className={valueFilter === "RERCENT" ? "active" : ''}><MdPercent size={20} /> Khuyến mãi hot</button>
            </div>
          </div>

          <div className="categories py-5">
            <div className="categories-item">
              <div className="title-md">
                <h3>Sản phẩm </h3>
              </div>
              {productStatus === STATUS.LOADING ? <Loader /> : <ProductList products={productList} />}
            </div>
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
        </div>
      </div>
    </main>

  )
}

export default HomePage