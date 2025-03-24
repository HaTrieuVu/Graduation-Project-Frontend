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
import { Buffer } from 'buffer';

const ProductSinglePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const product = useSelector(getProductSingle);
  const productSingleStatus = useSelector(getSingleProductStatus);

  const [quantity, setQuantity] = useState(1);
  const [listImage, setlistImage] = useState([])    //ds hình ảnh của sp
  const [listVersion, setlistVersion] = useState([]) //ds phiên bản của sp
  const [listColor, setListColor] = useState([])    // ds các thông tin của màu sắc được chọn(SL, tên, ảnh) theo phiên bản được chọn
  const [stock, setStock] = useState(0)      // SL theo màu sắc đã chọn

  const [selectedVersion, setSelectedVersion] = useState(null);   //version nào được chọn
  const [selectedImageProduct, setSelectedImageProduct] = useState(null)  // màu sắc nào được chọn

  const discountPercentage = product?.promotion?.fGiaTriKhuyenMai //giá trị khuyến mãi của sp


  // hàm tính giá sau khuyến mãi
  const calculateDiscountedPrice = (price, discountPercentage) => {
    if (!price || !discountPercentage) return price; // Nếu không có giảm giá, giữ nguyên giá

    let discountedPrice = price - price * (discountPercentage / 100)
    return discountedPrice.toLocaleString("vi-VN");
  };

  // hàm nhóm các phiên bản có cùng dung lượng thành 1 nhóm
  const groupVersionsByCapacity = (versions) => {
    return Object.values(
      versions?.reduce((acc, version) => {
        const { sDungLuong } = version;
        if (!acc[sDungLuong]) {
          // Nếu chưa có nhóm này, tạo mới
          acc[sDungLuong] = { ...version, groupedVersions: [version] };
        } else {
          // Nếu đã có nhóm, thêm vào danh sách groupedVersions
          acc[sDungLuong].groupedVersions.push(version);
        }
        return acc;
      }, {})
    );
  };

  // hàm convert ảnh từ buffer sang base 64
  const convertArrayImageToBase64 = (imageArray) => {
    return imageArray.map((item) => {
      let image = "";
      if (Array.isArray(item?.productImages?.sUrl?.data)) {
        image = new Buffer(item?.productImages?.sUrl?.data, "base64").toString("binary");
      }
      return {
        imageId: item?.FK_iHinhAnhID,
        image: image,
        moTa: item?.productImages?.sMoTa,
        stock: item?.iSoLuong
      };
    });
  };

  useEffect(() => {
    dispatch(fetchAsyncProductSingle(id));
  }, [id]);

  useEffect(() => {
    setlistImage(product?.images)

    if (product?.versions?.length > 0) {
      let arrVersionGroup = groupVersionsByCapacity(product?.versions)
      setlistVersion(arrVersionGroup)
    }

  }, [product])

  useEffect(() => {
    if (selectedVersion?.groupedVersions?.length > 0) {
      let arrImage = convertArrayImageToBase64(selectedVersion?.groupedVersions)
      setListColor(arrImage)
    }

  }, [selectedVersion])

  const increaseQty = () => {
    setQuantity((prevQty) => {
      if (selectedVersion !== null) {
        let tempQty = prevQty + 1;

        if (tempQty > stock) tempQty = stock;
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

  // hàm click chọn version nào?
  const handleClickChooseVersion = (version) => {
    setSelectedVersion(version)
    setSelectedImageProduct(null)
    setStock(0)
    setQuantity(1)
  }

  // hàm click chọn color nào?
  const handleClickChooseImageProduct = (color) => {
    setSelectedImageProduct(color)
    setStock(color?.stock)
    setQuantity(1)
  }

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
                      src={selectedImageProduct !== null  //dk1
                        ?
                        selectedImageProduct?.image  //true
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
                        Số lượng: <span> {stock > 0
                          ? stock
                          : "?"}</span>
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
                        {listColor?.length > 0 && listColor?.map((item, i) => (
                          <li
                            onClick={() => handleClickChooseImageProduct(item)}
                            key={`list-color-${i}-key-${item?.moTa}`}
                            className={`item-color ${selectedImageProduct?.imageId === item?.imageId ? "active" : ""}`}
                          >
                            <div className='box'>
                              <img className='img' src={item?.image} alt={item?.moTa} />
                              <strong>{item?.moTa}</strong>
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