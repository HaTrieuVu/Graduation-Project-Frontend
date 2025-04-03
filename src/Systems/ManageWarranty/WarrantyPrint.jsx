import "./WarrantyPrint.scss"

const WarrantyPrint = ({ ref, data }) => {
    return (
        <div className="container-print">
            <div className="warranty-print" ref={ref}>
                <div className="header-print">
                    <h2>Phiếu bảo hành</h2>
                </div>
                <div className="info">
                    <span className="name">Cửa hàng Trần Huy Mobile</span>
                    <span className="adrress">Đ/C: 51A Đ 2, Khu 2, Sóc Sơn, Hà Nội</span>
                    <div className="more">
                        <span>Mã phiếu bảo hành: #{data?.PK_iPhieuBaoHanhID}</span>
                        <span>Ngày lập: {new Date(data?.dNgayLap).toLocaleDateString("vi-VN")}</span>
                    </div>
                </div>
                <div className="customer-info">
                    <h4>Thông tin khách hàng</h4>
                    <div className="info-more">
                        <span className="box">Tên khách hàng: {data?.order?.customer?.sHoTen}</span>
                        <span className="box">Địa chỉ: {data?.order?.customer?.sDiaChi}</span>
                    </div>
                    <div className="info-more">
                        <span className="box">Số điện thoại: {data?.order?.customer?.sSoDienThoai}</span>
                        <span className="box">Email: {data?.order?.customer?.sEmail}</span>
                    </div>
                </div>
                <div className="product-info">
                    <h4>Thông tin sản phẩm </h4>
                    <div className="info-more">
                        <span className="box">Tên sản phẩm: {data?.productVersion?.productData?.sTenSanPham}</span>
                        <span className="box">Dung lượng: {data?.productVersion?.sDungLuong}</span>
                    </div>
                    <div className="info-more">
                        <span className="box">Màu sắc: {data?.productVersion?.productImages?.sMoTa}</span>
                        <span className="box">Số lượng: {data?.order?.orderDetails[0]?.iSoLuong}</span>
                    </div>
                    <div className="info-more">
                        <span className="box">Giá bán: {data?.order?.orderDetails[0]?.fGiaBan.toLocaleString("vi-VN")} đ</span>
                    </div>
                </div>
                <h4 className="warranty-info">Thời gian BH: {data?.sMota}</h4>
                <div className="box-signature">
                    <span>Khách hàng</span>
                    <span>Cửa hàng</span>
                </div>

            </div>

        </div>
    );
};

export default WarrantyPrint;
