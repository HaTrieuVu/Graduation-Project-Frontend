import React, { useEffect, useState } from 'react'

import "./HomeAdmin.scss"
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill }
    from 'react-icons/bs'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line }
    from 'recharts';

import axios from '../../config/axios';

const HomeAdmin = () => {
    const [dataRevenue, setDataRevenue] = useState([])
    const [mode, setMode] = useState("month"); // "month" | "week"
    const [monthSelected, setMonthSelected] = useState(1);
    const [dataImportReceipt, setDataImportReceipt] = useState("")
    const [dataTotal, setDataTotal] = useState({
        totalProduct: 0,
        totalCategory: 0,
        totalUser: 0
    })

    useEffect(() => {
        fetchStatistic()
    }, [])

    const renderCustomBarLabel = ({ x, y, width, value }) => {
        if (parseFloat(value) > 0) {
            return (
                <text
                    x={x + width / 2}
                    y={y}
                    fill="#f94e30"
                    textAnchor="middle"
                    fontSize={14}
                >
                    <tspan x={x + width / 2} dy={-20}>{value}</tspan>
                    <tspan x={x + width / 2} dy={15}>(triệu đồng)</tspan>
                </text>
            );
        } else {
            return (
                <text
                    x={x + width / 2}
                    y={y}
                    fill="#f94e30"
                    textAnchor="middle"
                    fontSize={14}
                >
                    <tspan x={x + width / 2} dy={-10}>{value}</tspan>
                </text>
            );
        }
    };

    const fetchData = async () => {
        try {
            const url =
                mode === "month"
                    ? "/api/v1/statistics/revenue-month"
                    : `/api/v1/statistics/revenue-week?month=${monthSelected}&year=2025`;
            const res = await axios.get(url);
            if (res?.errorCode === 0) {
                setDataRevenue(res?.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [mode, monthSelected]);

    // hàm fetch thống kê (bán hàng, nhập hàng)
    const fetchStatistic = async () => {
        try {
            const [resImportReceipt, resGetAllProduct, resGetAllCategory, resGetAllUser] = await Promise.all([
                axios.get("/api/v1/statistical/statistic-import-receipt"),
                axios.get("/api/v1/manage-product/get-all"),
                axios.get("/api/v1/manage-category/get-all"),
                axios.get("/api/v1/user/get-all"),
            ]);

            if (resImportReceipt?.errorCode === 0) {
                setDataImportReceipt(resImportReceipt?.data)
            }
            if (resGetAllProduct?.errorCode === 0 && resGetAllCategory?.errorCode === 0 && resGetAllUser?.errorCode === 0) {
                setDataTotal({
                    totalProduct: resGetAllProduct?.data?.length || 0,
                    totalCategory: resGetAllCategory?.data?.length || 0,
                    totalUser: resGetAllUser?.data?.length || 0,

                })
            }

        } catch (error) {
            console.log(error)
        }
    }

    console.log(dataRevenue)

    return (
        <main className='main-container'>
            <div className='main-cards'>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>Tổng sản phẩm</h3>
                        <BsFillArchiveFill className='card_icon' />
                    </div>
                    <h1>{dataTotal?.totalProduct}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>Danh mục sản phẩm</h3>
                        <BsFillGrid3X3GapFill className='card_icon' />
                    </div>
                    <h1>{dataTotal?.totalCategory}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>Khách hàng</h3>
                        <BsPeopleFill className='card_icon' />
                    </div>
                    <h1>{dataTotal?.totalUser}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>Thông báo</h3>
                        <BsFillBellFill className='card_icon' />
                    </div>
                    <h1>0</h1>
                </div>
            </div>

            <div className="charts">
                <span className="title-charts">
                    {mode === "month"
                        ? "Bảng tổng tiền bán hàng theo tháng (2025)"
                        : `Bảng tổng tiền bán hàng theo tuần (Tháng ${monthSelected} - 2025)`}
                </span>

                <div className='box-select-revenue'>
                    <select className='select-mode' value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="month">Theo từng tháng trong năm</option>
                        <option value="week">Theo tuần của tháng</option>
                    </select>
                    {mode === "week" && <select value={monthSelected} onChange={(e) => setMonthSelected(Number(e.target.value))}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                Tháng {i + 1}
                            </option>
                        ))}
                    </select>}
                </div>

                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={dataRevenue} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === "revenue") name = "Tổng tiền";
                                return [`${value} triệu đồng`, name];
                            }}
                        />
                        <Legend formatter={(value) => (value === "revenue" ? "Tổng tiền bán hàng" : value)} />
                        <Bar dataKey="revenue" barSize={30} fill="#82ca9d" label={renderCustomBarLabel} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className='charts'>
                <span className='title-charts'>{`Bảng tổng tiền nhập hàng (2025)`}</span>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={dataImportReceipt}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === "totalImport") name = "Tổng nhập";
                                return [`${value} triệu đồng`, name];
                            }}
                        />
                        <Legend
                            formatter={(value) => {
                                if (value === "totalImport") return "Tổng tiền nhập hàng";
                                return value;
                            }}
                        />
                        {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} /> */}
                        <Line type="monotone" dataKey="totalImport" stroke="#000" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </main>
    )
}

export default HomeAdmin