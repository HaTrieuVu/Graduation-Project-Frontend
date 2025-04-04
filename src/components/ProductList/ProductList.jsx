import React from 'react';
import './ProductList.scss';
import Product from '../Product/Product';

const ProductList = ({ products }) => {
    return (
        <div className="product-lists grid bg-whitesmoke my-3">
            {products?.length > 0 && products?.map((product) => {
                return <Product key={`${product?.PK_iSanPhamID}-product-KEY-list`} product={product} />;
            })}
        </div>
    );
};

export default ProductList;
