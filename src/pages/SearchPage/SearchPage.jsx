import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import './SearchPage.scss';
import { STATUS } from '../../utils/status';
import Loader from '../../components/Loader/Loader';
import ProductList from '../../components/ProductList/ProductList';

import {
  fetchAsyncSearchProduct,
  getSearchProducts,
  getSearchProductsStatus,
  clearSearch,
} from '../../store/searchSlice';
import img from "../../assets/product_not_found.jpeg"

const SearchPage = () => {

  const dispatch = useDispatch();
  const { keywordSearch } = useParams();

  const [productList, setProductList] = useState([])

  const searchProducts = useSelector(getSearchProducts);
  const searchProductsStatus = useSelector(getSearchProductsStatus);

  useEffect(() => {
    dispatch(clearSearch());
    dispatch(fetchAsyncSearchProduct(keywordSearch));
  }, [keywordSearch]);

  useEffect(() => {
    setProductList(searchProducts?.products)
  }, [searchProducts])

  if (productList?.length === 0) {
    return (
      <div
        className="container error"
      >
        <div className="content-error fw-5 text-danger py-5">
          <h3>Không tìm thấy sản phẩm.</h3>
          <div className='img'>
            <img src={img} alt="img not found" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="search-content bg-whitesmoke">
        <div className="container">
          <div className="py-5">
            <div className="title-md">
              <h3>Kết quả tìm kiếm cho - <span className='keyword'>{keywordSearch}</span></h3>
            </div>
            <br />
            {searchProductsStatus === STATUS.LOADING ? (
              <Loader />
            ) : (
              <ProductList products={productList} />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default SearchPage