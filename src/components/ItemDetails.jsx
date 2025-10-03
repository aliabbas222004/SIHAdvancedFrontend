import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

export default function ItemDetails() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [barData, setBarData] = useState([]);

    if (!state?.item) {
        return <p>No item data found!</p>;
    }

    const { item } = state;
    let tQ = 0;
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/items/findDetails?q=${state.item.itemId}`
                );
                const data = await res.json();
                const item = data[0];
                tQ = item.totalQuantity;
                const data1 = [
                    { name: "Selling Price", value: item.totalSellingPrice },
                    { name: "Cost Price", value: item.totalCostPrice - item.stockPrice },
                    { name: "Profit", value: item.totalSellingPrice - (item.totalCostPrice - item.stockPrice) },
                    { name: "Stock Price", value: item.stockPrice }
                ];
                setBarData(data1);
            } catch (err) {
                console.error("Error fetching details:", err);
            }
        };

        fetchDetails();
    }, [state.item.itemId]);

    return (
        <div className="card mt-3 shadow text-center">
            <div className="card-body">
                <h4>Item Details</h4>
                <p><strong>ID:</strong> {item.itemId}</p>
                <p><strong>Name:</strong> {item.itemName}</p>
                <p><strong>Available Quantity:</strong> {item.availableQuantity}</p>
                <p><strong>Total Quantity Sold:</strong> {item.availableQuantity}</p>


            </div>

            {/* Render chart only when barData is available */}
            {barData.length > 0 && (
                <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={barData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#82ca9d" barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="text-center mb-3 mt-3">
                <button onClick={() => navigate(-1)} className="btn btn-primary">
                    Go Back
                </button>
            </div>
        </div>
    );
}
