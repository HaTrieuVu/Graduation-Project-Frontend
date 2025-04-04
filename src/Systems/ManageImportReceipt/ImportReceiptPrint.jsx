import "./ImportReceiptPrint.scss"

const ImportReceiptPrint = ({ ref, data }) => {
    return (
        <div className="container-print">
            <div className="import-receipt-print" ref={ref}>
                <div className="header-print">
                    <h2>Phiếu Nhập Kho</h2>
                </div>
                <div className="info">
                    <span className="name">Cửa hàng Trần Huy Mobile</span>
                    <span className="adrress">Đ/C: 51A Đ 2, Khu 2, Sóc Sơn, Hà Nội</span>
                    <div className="more">
                        <span>Mã phiếu nhập kho: #{data?.PK_iPhieuNhapID}</span>
                        <span>Ngày lập: {new Date(data?.dNgayLap).toLocaleDateString("vi-VN")}</span>
                    </div>
                </div>
                <div className="info-supplier">
                    <div className="info-more">
                        <span className="box">Người giao hàng:....................</span>
                        <span className="box">Đơn vị: {data?.supplier?.sTenNhaCungCap}</span>
                    </div>
                    <div className="info-more">
                        <span className="box-all">Địa chỉ: {data?.supplier?.sDiaChi}</span>
                    </div><div className="info-more">
                        <span className="box">Số điện thoại: {data?.supplier?.sSoDienThoai}</span>
                        <span className="box">Email: {data?.supplier?.sEmail}</span>
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
                                <th scope="col">Đơn giá</th>
                                <th scope="col">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.importDetails?.length > 0 && data?.importDetails?.map((item, i) => (
                                <tr key={`${item?.FK_iPhienBanID}-print-import-receipt-key-${i}`}>
                                    <td scope="row">{(i + 1)}</td>
                                    <td>{item?.productVersion?.productData?.sTenSanPham}</td>
                                    <td>{item?.productVersion?.sDungLuong}</td>
                                    <td>{item?.productVersion?.productImages?.sMoTa}</td>
                                    <td>{item?.iSoLuongNhap}</td>
                                    <td>{item?.fGiaNhap.toLocaleString("vi-VN")} đ</td>
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

                <div className="box-signature">
                    <div className="box">
                        <span>Người lập phiếu</span>
                        <span>(Ký, họ tên)</span>
                    </div>
                    <div className="box">
                        <span>Người giao hàng</span>
                        <span>(Ký, họ tên)</span>
                    </div>
                    <div className="box">
                        <span>Người nhận hàng</span>
                        <span>(Ký, họ tên)</span>
                    </div>
                    <div className="box">
                        <span>Người vận chuyển</span>
                        <span>(Ký, họ tên)</span>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default ImportReceiptPrint;
