import React, { useEffect, useState } from 'react'

import HeaderSlider from '../../components/HeaderSlider/HeaderSlider'
import "./HomePage.scss"
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, getAllProductsStatus, fetchAsyncProducts, setValueFilterProduct } from '../../store/productSlice';
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
  const [priceFilterValue, setPriceFilterValue] = useState("all");


  const dispatch = useDispatch();

  const productsResponse = useSelector(getAllProducts);
  const productStatus = useSelector(getAllProductsStatus);

  useEffect(() => {
    dispatch(fetchAsyncProducts({ page: currentPage, limitProduct: currentLimit, valueFilter: valueFilter }));
  }, [currentPage, valueFilter]);

  useEffect(() => {
    if (productsResponse?.products) {
      // Clone sâu từng product và versions
      let sortedProducts = productsResponse.products.map(product => ({
        ...product,
        versions: product.versions ? [...product.versions] : [],
      }));

      const calculatePrice = (version, promotion = 0) => {
        return version.fGiaBan - (version.fGiaBan * (promotion / 100));
      };

      if (valueFilter === "ASC") {
        sortedProducts.forEach(product => {
          const promotion = product?.promotion?.fGiaTriKhuyenMai || 0;

          product.versions.sort((a, b) => {
            const priceA = calculatePrice(a, promotion);
            const priceB = calculatePrice(b, promotion);
            return priceA - priceB;
          });
        });

        sortedProducts.sort((a, b) => {
          const priceA = calculatePrice(a.versions?.[0] || {}, a?.promotion?.fGiaTriKhuyenMai || 0);
          const priceB = calculatePrice(b.versions?.[0] || {}, b?.promotion?.fGiaTriKhuyenMai || 0);
          return priceA - priceB;
        });
      }

      if (valueFilter === "DESC") {
        sortedProducts.forEach(product => {
          const promotion = product?.promotion?.fGiaTriKhuyenMai || 0;

          product.versions.sort((a, b) => {
            const priceA = calculatePrice(a, promotion);
            const priceB = calculatePrice(b, promotion);
            return priceB - priceA;
          });
        });

        sortedProducts.sort((a, b) => {
          const priceA = calculatePrice(a.versions?.[0] || {}, a?.promotion?.fGiaTriKhuyenMai || 0);
          const priceB = calculatePrice(b.versions?.[0] || {}, b?.promotion?.fGiaTriKhuyenMai || 0);
          return priceB - priceA;
        });
      }

      setProductList(sortedProducts);
      setTotalPage(productsResponse.totalPage || 0);
    }
  }, [productsResponse, valueFilter]);

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1)
  };

  const handleFilterProduct = (value) => {
    setValueFilter(value);
    dispatch(setValueFilterProduct(value));

    if (value === "ASC" || value === "DESC" || value === "RERCENT") {
      setPriceFilterValue("all");
    }
  };

  return (
    <main>
      <div className="slider-wrapper">
        <HeaderSlider />
      </div>
      <div className="main-content bg-whitesmoke">
        <div className="container">
          <BrandList />

          <div className='box-filter'>
            <div className='filter-character'>
              <span className='filter-title'><FaFilter /> Sắp xếp theo</span>
              <div className='filter-content'>
                <button onClick={() => handleFilterProduct("DESC")} className={valueFilter === "DESC" ? "active" : ''} ><BsSortDown size={20} /> Giá Cao - Thấp</button>
                <button onClick={() => handleFilterProduct("ASC")} className={valueFilter === "ASC" ? "active" : ''}><BsSortDownAlt size={20} /> Giá Thấp - Cao</button>
                <button onClick={() => handleFilterProduct("RERCENT")} className={valueFilter === "RERCENT" ? "active" : ''}><MdPercent size={20} /> Khuyến mãi hot</button>
              </div>
            </div>
            <div className='filter-price'>
              <select
                value={priceFilterValue}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setPriceFilterValue(selectedValue);
                  handleFilterProduct(selectedValue);
                }}
              >
                <option value="all">Chọn khoảng giá</option>
                <option value="typePrice0">{`Dưới 1 triệu`}</option>
                <option value="typePrice1">{`Từ 1 -> 5 triệu`}</option>
                <option value="typePrice2">{`Từ 5 -> 10 triệu`}</option>
                <option value="typePrice3">{`Từ 10 -> 15 triệu`}</option>
                <option value="typePrice4">{`Từ 15 -> 25 triệu`}</option>
                <option value="typePrice5">{`Lớn hơn 25 triệu`}</option>
              </select>

            </div>
          </div>

          <div className="categories py-5">
            <div className="categories-item">
              <div className="title-md">
                <h3>Sản phẩm </h3>
              </div>
              {productList?.length > 0 ? productStatus === STATUS.LOADING ? <Loader /> : <ProductList products={productList} /> : <div className='product-no'>Không tìm thấy sản phẩm phù hợp</div>}
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