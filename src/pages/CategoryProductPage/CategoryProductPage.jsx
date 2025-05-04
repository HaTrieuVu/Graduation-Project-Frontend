import React, { useEffect, useState } from 'react';
import './CategoryProductPage.scss';
import ProductList from '../../components/ProductList/ProductList';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import { STATUS } from '../../utils/status';
import { fetchAsyncProductsOfCategory, getAllProductsByCategory, getCategoryProductsStatus } from '../../store/categorySlice';
import ReactPaginate from 'react-paginate';

const CategoryProductPage = () => {
    const dispatch = useDispatch();
    const { category } = useParams();
    const categoryProducts = useSelector(getAllProductsByCategory);
    const categoryProductsStatus = useSelector(getCategoryProductsStatus);

    const [currentPage, setCurrentPage] = useState(1);
    const currentLimit = 10;
    const [totalPage, setTotalPage] = useState(0);
    const [productList, setProductList] = useState([]);

    console.log(categoryProducts)

    useEffect(() => {
        dispatch(fetchAsyncProductsOfCategory({ categoryId: category, currentPage: currentPage, limitProduct: currentLimit }));
    }, [dispatch, category, currentPage]);

    useEffect(() => {
        setTotalPage(categoryProducts?.totalPage || 0)
        setProductList(categoryProducts?.products)
    }, [categoryProducts])

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1)
    };

    console.log(productList)

    return (
        <div className="cat-products py-5 bg-whitesmoke">
            <div className="cat-products py-5 bg-whitesmoke">
                <div className="container">
                    <div className="cat-products-content">
                        <div className="title-md">
                            <h3>
                                Danh mục sản phẩm - <span className="text-capitalize">{categoryProducts?.categoryName}</span>
                            </h3>
                        </div>
                        {categoryProductsStatus === STATUS.LOADING ? (
                            <Loader />
                        ) : (
                            productList?.length > 0 ? <ProductList products={productList} /> : <div className='no-product'>Chưa có sản phẩm nào được bán</div>
                        )}
                    </div>
                    {totalPage > 0 && <div className='category-product-footer'>
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
        </div>
    );
};

export default CategoryProductPage;
