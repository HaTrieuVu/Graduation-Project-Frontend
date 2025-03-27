import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { Buffer } from 'buffer';
import { Link, useNavigate } from 'react-router-dom';

import { fetchAsyncCarts, getAllCarts } from '../../store/cartSlice';
import "./CartPage.scss"
import img_shopping_cart from "../../assets/shopping_cart.png"
import { FaRegTrashCan, FaMinus, FaPlus } from "react-icons/fa6";
import Loader from '../../components/Loader/Loader';
import axios from '../../config/axios';
import { STATUS } from '../../utils/status';


// hàm convert ảnh từ buffer sang base 64 và lấy các thuộc tính cần thiết của cartData
const convertArrayData = (cartsData) => {
  if (Array.isArray(cartsData)) {
    return cartsData?.map((item) => {
      let image = "";
      let priceNew =
        item?.productVersions?.fGiaBan - item?.productVersions?.fGiaBan *
        (item?.productVersions?.productData?.promotion?.fGiaTriKhuyenMai / 100)

      if (Array.isArray(item?.productVersions?.productImages?.sUrl?.data)) {
        image = new Buffer(item?.productVersions?.productImages?.sUrl?.data, "base64").toString("binary");
      }
      return {
        cartDetailId: item?.PK_iChiTietGioHangID,
        productVersionId: item?.FK_iPhienBanID,
        thumbnail: image,
        productName: item?.productVersions?.productData?.sTenSanPham,
        price: item?.productVersions?.fGiaBan,
        priceNew: priceNew,
        quantity: item?.iSoLuong,
        promotion: item?.productVersions?.productData?.promotion?.fGiaTriKhuyenMai,
        color: item?.productVersions?.productImages?.sMoTa,
        brandName: item?.productVersions?.productData?.brandData?.sTenNhanHang,
      };
    });
  }
};

const CartPage = () => {
  const [cartsData, setCartsData] = useState([])

  const user = useSelector(state => state?.userInfo?.user);
  const isUserLoaded = useSelector(state => state?.userInfo?.isUserLoaded);
  const cartsStatus = useSelector(state => state.cart.cartsStatus);

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const carts = useSelector(getAllCarts);

  useEffect(() => {
    if (!isUserLoaded) return;

    if (!user?.userId) {
      navigate("/login");
      window.scrollTo(0, 0);
    }
  }, [user, isUserLoaded, navigate]);

  useEffect(() => {
    let cartsArr = convertArrayData(carts?.cartDetails)
    setCartsData(cartsArr)
  }, [carts])

  //hàm tăng, giảm số lượng sản phẩm
  const handleToggleCartQuantity = async (data) => {
    console.log(data)
    let dataCart = {
      userId: user?.userId,
      cartId: user?.cartId,
      cartDetailId: data?.cart?.cartDetailId,
      productVersionId: data?.cart?.productVersionId,
      type: data?.type
    }
    const response = await axios.post("/api/v1/cart/toggle-cart-quantity", dataCart)
    if (response?.errorCode === 0) {
      if (user && user?.userId && user?.cartId) {
        dispatch(fetchAsyncCarts({
          userId: user?.userId,
          cartId: user?.cartId,
        }));
      }
    }
  }

  // hàm xóa sản phẩm khỏi giỏ hàng
  const handleRemoveFromCart = async (cartDetailId) => {
    let dataRemoveCart = {
      userId: user?.userId,
      cartId: user?.cartId,
      cartDetailId: cartDetailId,
    }

    const response = await axios.post("/api/v1/cart/remove-produt-from-cart", dataRemoveCart)

    if (response?.errorCode === 0) {
      if (user && user?.userId && user?.cartId) {
        dispatch(fetchAsyncCarts({
          userId: user?.userId,
          cartId: user?.cartId,
        }));
      }
    }

  }

  if (carts?.cartDetails?.length === 0) {
    return (
      <div className="container my-5">
        <div className="empty-cart flex align-center justify-center flex-column font-manrope">
          <img src={img_shopping_cart} alt="" />
          <span className="fw-6 fs-15 text-gray">Giỏ hàng của bạn trống!</span>
          <Link to="/" className="shopping-btn bg-orange">
            Mua sắm ngay!
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart bg-whitesmoke">
      <div className="container">
        {!isUserLoaded || cartsStatus === STATUS.LOADING ?
          <Loader /> :
          <div className="cart-ctable">
            <div className="cart-chead bg-white">
              <div className="cart-ctr font-manrope ">
                <div className="cart-cth">
                  <span className="cart-ctxt"></span>
                </div>
                <div className="cart-cth">
                  <span className="cart-ctxt">Sản phẩm</span>
                </div>
                <div className="cart-cth">
                  <span className="cart-ctxt">Đơn giá</span>
                </div>
                <div className="cart-cth">
                  <span className="cart-ctxt">Số lượng</span>
                </div>
                <div className="cart-cth">
                  <span className="cart-ctxt">Số tiền</span>
                </div>
                <div className="cart-cth">
                  <span className="cart-ctxt">Thao tác</span>
                </div>
              </div>
            </div>

            <div className="cart-cbody bg-white">
              {cartsData?.length > 0 && cartsData?.map((cart) => (
                <div className="cart-ctr py-4" key={`list-cart-item-${cart?.cartDetailId}-key`}>
                  <div className="cart-ctd">
                    <input type="checkbox" />
                  </div>
                  <div className="cart-ctd">
                    <div className="cart-product-img">
                      <img src={cart?.thumbnail} className="img-cover" alt="img" />
                    </div>
                    <div className='cart-title-content'>
                      <span className="cart-ctxt">{cart?.productName}</span>
                      <span className="cart-ctxt title-brand">Nhãn hàng: {cart?.brandName}</span>
                    </div>
                  </div>
                  <div className="cart-ctd box-price">
                    <span className="cart-ctxt price-old">{cart?.price?.toLocaleString("vi-VN")} đ</span>
                    <span className="cart-ctxt text-orange price-new">{cart?.priceNew?.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="cart-ctd">
                    <div className="qty-change flex align-center">
                      <button
                        type="button"
                        onClick={() => handleToggleCartQuantity({ cart, type: "DEC" })}
                        className="qty-decrease flex align-center justify-center"
                      >
                        <FaMinus />
                      </button>
                      <div className="qty-value flex align-center justify-center">
                        {cart?.quantity}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleCartQuantity({ cart, type: "INC" })}
                        className="qty-decrease flex align-center justify-center"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="cart-ctd">
                    <span className="cart-ctxt text-orange fw-5">{(cart?.priceNew * cart?.quantity).toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="cart-ctd">
                    <button
                      className="delete-btn text-orange"
                      onClick={() => handleRemoveFromCart(cart?.cartDetailId)}
                      type="button"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-cfoot flex align-center justify-between py-3 bg-white">
              <div className="cart-cfoot-l">
                <button
                  className="clear-cart-btn text-danger fs-15 text-uppercase fw-4"
                  type="button"
                >
                  <FaRegTrashCan />
                  <span className="mx-1">Xóa giỏ hàng</span>
                </button>
              </div>
              <div className="cart-cfoot-r flex flex-column justify-end">
                <div className="total-txt flex align-center justify-end">
                  <div className="font-manrope fw-5">Tổng {cartsData?.length} sản phẩm:</div>
                  <span className="text-orange fs-22 mx-2 fw-6">0đ</span>
                </div>
                <button className="checkout-btn text-white bg-orange fs-16">Mua hàng</button>
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  )
}

export default CartPage