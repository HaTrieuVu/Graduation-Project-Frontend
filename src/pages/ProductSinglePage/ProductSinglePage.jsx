import React, { useEffect, useState } from 'react'

import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import './ProductSinglePage.scss';
import { fetchAsyncProductSingle, getProductSingle, getSingleProductStatus } from '../../store/productSlice';
import { STATUS } from '../../utils/status';
import Loader from '../../components/Loader/Loader';
import { FaMinus, FaPlus } from "react-icons/fa6";
import { FaCartPlus, FaShopify } from "react-icons/fa";
import RatingStar from '../../components/RatingStar/RatingStar';
import { toast } from 'react-toastify';

const ProductSinglePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const product = useSelector(getProductSingle);
  const productSingleStatus = useSelector(getSingleProductStatus);

  const [quantity, setQuantity] = useState(1);
  const [listImage, setlistImage] = useState([])    //ds hình ảnh của sp
  const [listVersion, setlistVersion] = useState([]) //ds phiên bản của sp

  const [selectedVersion, setSelectedVersion] = useState(null);   //version nào được chọn
  const [selectedImageProduct, setSelectedImageProduct] = useState(null)  // màu sắc nào được chọn

  const discountPercentage = product?.promotion?.fGiaTriKhuyenMai //giá trị khuyến mãi của sp


  // hàm tính giá sau khuyến mãi
  const calculateDiscountedPrice = (price, discountPercentage) => {
    if (!price || !discountPercentage) return price; // Nếu không có giảm giá, giữ nguyên giá

    let discountedPrice = price - price * (discountPercentage / 100)
    return discountedPrice.toLocaleString("vi-VN");
  };

  useEffect(() => {
    dispatch(fetchAsyncProductSingle(id));
  }, [id]);

  useEffect(() => {
    setlistImage(product?.images)
    setlistVersion(product?.versions)
  }, [product])

  const increaseQty = () => {
    setQuantity((prevQty) => {
      if (selectedVersion !== null) {
        let tempQty = prevQty + 1;

        if (tempQty > selectedVersion?.iSoLuong) tempQty = selectedVersion?.iSoLuong;
        return tempQty;
      } else {
        toast.warning("Hãy chọn phiên bản cần mua!")
        setQuantity(1)
      }
    });
  };

  const decreaseQty = () => {
    setQuantity((prevQty) => {
      let tempQty = prevQty - 1;
      if (tempQty < 1) tempQty = 1;
      return tempQty;
    });
  };

  // hàm click chọn version nào
  const handleClickChooseVersion = (version) => {
    setSelectedVersion(version)
  }

  // hàm click chọn version nào
  const handleClickChooseImageProduct = (color) => {
    setSelectedImageProduct(color)
  }

  console.log(selectedVersion)

  return (
    <main className="py-5 bg-whitesmoke">
      {productSingleStatus === STATUS.LOADING ? (
        <Loader />
      ) : (
        <div className="product-single">
          <div className="container">
            <div className="product-single-content bg-white grid">
              {/* left */}
              <div className="product-single-l">
                <div className="product-img">
                  <div className="product-img-zoom">
                    <img
                      className="img-cover"
                      src={selectedImageProduct && selectedImageProduct?.sUrl //dk1
                        ?
                        selectedImageProduct?.sUrl  //true
                        :
                        listImage?.length > 0 //false (dk2)
                          ?
                          (listImage[0]?.sUrl ? listImage[0]?.sUrl
                            :
                            '')
                          :
                          ''
                      }
                      alt=""
                    />
                  </div>
                  {product?.images?.length > 0 && (
                    <div className="product-img-thumbs flex align-center my-2">
                      {listImage?.map((item) => (
                        <div className="thumb-item" key={`thumb-image-${item?.PK_iHinhAnhID}`}>
                          <img className="img-cover" src={item?.sUrl} alt={item?.sMoTa} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* right */}
              <div className="product-single-r">
                <div className="product-details font-manrope">
                  <div className="title">{product?.sTenSanPham}</div>

                  <div className="info fs-18">
                    <div className="rating">
                      <span className="text-orange fw-5">Đánh giá:</span>
                      <div className="box-rating">
                        <RatingStar star={product?.sDanhGia} />
                      </div>
                    </div>
                    <div className="vert-line"></div>
                    <div className="brand">
                      <span className="text-orange fw-5">Nhãn hàng</span>
                      <span className="mx-1">{product?.brandData?.sTenNhanHang}</span>
                    </div>
                    <div className="vert-line"></div>
                    <div className="brand">
                      <span className="text-orange fw-5">Danh mục</span>
                      <span className="mx-1">{product?.categoryData ? product?.categoryData?.sTenDanhMuc : ''}</span>
                    </div>
                  </div>

                  {/* box giá bán */}
                  <div className="price">
                    <div className="flex align-center">
                      <div className="old-price text-gray">
                        {selectedVersion && selectedVersion?.fGiaBan ?
                          selectedVersion?.fGiaBan.toLocaleString("vi-VN")
                          :
                          (listVersion?.length > 0 ?
                            listVersion[0]?.fGiaBan.toLocaleString("vi-VN")
                            :
                            "Chưa xác định giá")} VNĐ
                      </div>
                    </div>

                    <div className='box-new-price'>
                      <div className='box-price'>
                        <div className="flex align-center my-1">
                          <div className="new-price fw-5 font-poppins fs-24 text-orange">
                            {selectedVersion && selectedVersion?.fGiaBan ?
                              calculateDiscountedPrice(selectedVersion?.fGiaBan, +discountPercentage)
                              :
                              (listVersion?.length > 0 ?
                                calculateDiscountedPrice(listVersion[0]?.fGiaBan, +discountPercentage)
                                :
                                "Chưa xác định giá")} VNĐ
                          </div>
                        </div>
                        <div className="discount bg-orange fs-13 text-white fw-6 font-poppins">
                          Giảm {product?.promotion?.fGiaTriKhuyenMai}%
                        </div>
                      </div>

                      <div className='box-stock'>
                        Số lượng: <span> {selectedVersion && selectedVersion?.iSoLuong
                          ? selectedVersion?.iSoLuong
                          : listVersion?.length > 0 ?
                            listVersion[0]?.iSoLuong : 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* box version product */}
                  <div className='box-version'>
                    <div className='list-version'>
                      {listVersion?.length > 0 && listVersion?.map((item, i) => (
                        <div
                          onClick={() => handleClickChooseVersion(item)}
                          key={`version-${item?.PK_iPhienBanID}-key-${i}`}
                          className={`item-version ${selectedVersion?.PK_iPhienBanID === item?.PK_iPhienBanID ? "active" : ""}`}
                        >
                          <strong>{item?.sDungLuong}</strong>
                          <span>{calculateDiscountedPrice(item?.fGiaBan, +discountPercentage)} VNĐ</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* box color product */}
                  <div className='box-product-color'>
                    <span className='title'>Chọn màu sắc</span>
                    <div className='box-content'>
                      <ul className='list-color'>
                        {listImage?.length > 0 && listImage?.map((item) => (
                          <li
                            onClick={() => handleClickChooseImageProduct(item)}
                            key={`color-${item?.PK_iHinhAnhID}-key-${item?.sMoTa}`}
                            className={`item-color ${selectedImageProduct?.PK_iHinhAnhID === item?.PK_iHinhAnhID ? "active" : ""}`}
                          >
                            <div className='box'>
                              <img className='img' src={item?.sUrl} alt={item?.sMoTa} />
                              <strong>{item?.sMoTa}</strong>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="qty flex align-center my-4">
                    <div className="qty-text">Số lượng: </div>
                    <div className="qty-change flex align-center mx-3">
                      <button
                        onClick={() => decreaseQty()}
                        type="button"
                        className="qty-decrease flex align-center justify-center"
                      >
                        <FaMinus />
                      </button>
                      <div className="qty-value flex align-center justify-center">
                        {quantity}
                      </div>
                      <button
                        onClick={() => increaseQty()}
                        type="button"
                        className="qty-increase flex align-center justify-center"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    {product?.stock === 0 ? (
                      <div className="qty-error text-uppercase bg-danger text-white fs-12 ls-1 mx-2 fw-5">
                        Hết hàng
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="btns">
                    <button className="add-to-cart-btn btn" type="button">
                      <FaCartPlus size={24} className='icon' />
                      <span className="btn-text mx-2">Thêm vào giỏ hàng</span>
                    </button>

                    <button className="buy-now btn" type="button">
                      <FaShopify size={24} />
                      <span className="btn-text mx-2">Mua ngay</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {CartMessageStatus && <CartMessage />} */}
    </main>
  )
}

export default ProductSinglePage