import React, { useEffect, useState } from 'react'

import HeaderSlider from '../../components/HeaderSlider/HeaderSlider'
import "./HomePage.scss"
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, getAllProductsStatus, fetchAsyncProducts } from '../../store/productSlice';
import { STATUS } from '../../utils/status';
import ReactPaginate from 'react-paginate';
import ProductList from '../../components/ProductList/ProductList';
import Loader from '../../components/Loader/Loader';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const currentLimit = 10;
  const [totalPage, setTotalPage] = useState(0);
  const [productList, setProductList] = useState([]);
  const [brandList, setBrandList] = useState([])

  const dispatch = useDispatch();

  const productsResponse = useSelector(getAllProducts);
  const productStatus = useSelector(getAllProductsStatus);

  const fetchGetBrand = async () => {
    let respone = await axios.get("/manage-brand/get-all")
    if (respone?.data?.errorCode === 0 && respone?.data?.data?.length > 0) {
      setBrandList(respone?.data?.data)
    }
  }

  useEffect(() => {
    fetchGetBrand()
  }, [])


  useEffect(() => {
    dispatch(fetchAsyncProducts({ page: currentPage, limitProduct: currentLimit }));
  }, [currentPage]);

  useEffect(() => {
    if (productsResponse) {
      setTotalPage(productsResponse.totalPage || 0);
      setProductList(productsResponse.products || []);
    }
  }, [productsResponse]);  // Chạy lại khi productsResponse thay đổi

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1)
  };

  console.log(brandList)

  return (
    <main>
      <div className="slider-wrapper">
        <HeaderSlider />
      </div>
      <div className="main-content bg-whitesmoke">
        <div className="container">
          <div className='list-brand'>
            {brandList?.map((item, i) => (
              <Link className='list-brand_item' key={`keyBrand-${item?.PK_iNhanHangID}-${i}`} to={`${item?.PK_iNhanHangID}`}>
                <img src={item?.sLogo} alt={item?.sTenNhanHang} />
              </Link>
            ))}
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
        </div>
      </div>
    </main>

  )
}

export default HomePage