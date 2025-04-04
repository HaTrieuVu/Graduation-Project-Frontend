import "./OrderPrint.scss"

const OrderPrint = ({ ref, data }) => {
    return (
        <div className="container-print">
            <div className="order-print" ref={ref}>
                <div className="header-print">
                    <h2>Phiếu mua hàng</h2>
                </div>
                <div className="info">
                    <span className="name">Cửa hàng Trần Huy Mobile</span>
                    <span className="adrress">Đ/C: 51A Đ 2, Khu 2, Sóc Sơn, Hà Nội</span>
                    <div className="more">
                        <span>Mã đơn mua hàng: #{data?.PK_iDonMuaHangID}</span>
                        <span>Ngày lập: {new Date(data?.dNgayLapDon).toLocaleDateString("vi-VN")}</span>
                    </div>
                </div>
                <div className="customer-info">
                    <h4>Thông tin khách hàng</h4>
                    <div className="info-more">
                        <span className="box">Tên khách hàng: {data?.customer?.sHoTen}</span>
                        <span className="box">Địa chỉ: {data?.customer?.sDiaChi}</span>
                    </div>
                    <div className="info-more">
                        <span className="box">Số điện thoại: {data?.customer?.sSoDienThoai}</span>
                        <span className="box">Email: {data?.customer?.sEmail}</span>
                    </div>
                </div>
                <div className="product-info">
                    <h4>Thông tin sản phẩm </h4>
                    <table className="table table-hover table-bordered fs-16">
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Tên sản phẩm</th>
                                <th scope="col">Dung lượng</th>
                                <th scope="col">Màu sắc</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Giá bán</th>
                                <th scope="col">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.orderDetails?.length > 0 && data?.orderDetails?.map((item, i) => (
                                <tr key={`${item?.FK_iPhienBanID}-print-order-key-${i}`}>
                                    <td scope="row">{(i + 1)}</td>
                                    <td>{item?.productVersion?.productData?.sTenSanPham}</td>
                                    <td>{item?.productVersion?.sDungLuong}</td>
                                    <td>{item?.productVersion?.productImages?.sMoTa}</td>
                                    <td>{item?.iSoLuong}</td>
                                    <td>{item?.fGiaBan.toLocaleString("vi-VN")} đ</td>
                                    <td>{item?.fThanhTien.toLocaleString("vi-VN")} đ</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="7" className="text-end fw-bold">Tổng tiền: {data?.fTongTien.toLocaleString("vi-VN")} đ</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                {/* <h4 className="order-info">Thời gian BH: {data?.sMota}</h4> */}
                <div className="box-signature">
                    <div className="box">
                        <span>Cửa hàng</span>
                        <span>(Ký, họ tên)</span>
                    </div>
                    <div className="box">
                        <span>Khách hàng</span>
                        <span>(Ký, họ tên)</span>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default OrderPrint;
