import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ShoppingCart, TrendingUp } from "lucide-react";

function SalesDashboard() {
  const [salesData, setSalesData] = useState([]); // 存储商品数据
  const [fileName, setFileName] = useState(""); // 存储上传文件名
  const [filterText, setFilterText] = useState(""); // 搜索框文本
  const [loading, setLoading] = useState(true); // 加载状态
  const fileInputRef = useRef(null);

  const backendUrl = "https://laughing-palm-tree-r46qq69jvx4gh549p-5003.app.github.dev";

  // 从后端获取数据
  const fetchData = async () => {
    try {
      const response = await fetch(`${backendUrl}/data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (Array.isArray(result.data)) {
        setSalesData(result.data); // 确保 data 是数组
        console.log("Fetched Sales Data Length:", result.data.length); // 调试：打印后端返回的数据长度
      } else {
        console.error("后端返回的数据格式不正确：", result);
      }
      setLoading(false);
    } catch (error) {
      console.error("请求出错：", error);
      alert("无法连接到服务器，请检查后端服务！");
      setLoading(false);
    }
  };

  // 上传文件到后端
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("请上传一个有效的 CSV 文件！");
      return;
    }
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${backendUrl}/upload-file`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("文件上传成功！");
        fetchData(); // 上传成功后重新获取数据
      } else {
        console.error("文件上传失败，状态码：", response.status);
        alert(`文件上传失败，状态码：${response.status}`);
      }
    } catch (error) {
      console.error("文件上传失败：", error);
      alert("无法连接到服务器，请检查后端服务！");
    }
  };

  // 确保显示所有数据
  const filteredData = filterText
    ? salesData.filter((item) =>
        item.title?.toLowerCase().includes(filterText.toLowerCase())
      )
    : salesData;

  // 调试：打印过滤后的数据长度
  console.log("Filtered Data Length:", filteredData.length);

  useEffect(() => {
    fetchData();
  }, []);

  // 准备图表数据
  const chartData = filteredData.map((item) => ({
    name: item.title,
    price: parseFloat(item.price),
    rating: parseFloat(item.rating),
    reviews: parseInt(item.reviews || "0"),
    sales: parseInt(item.sales || "0"),
  }));

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Sales Dashboard</h2>

      {/* 文件上传 */}
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ marginBottom: "10px", display: "block" }}
      />
      {fileName && <p>已选择文件：{fileName}</p>}

      {/* 搜索框 */}
      <input
        type="text"
        placeholder="搜索..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
      />

      {/* 图表可视化 */}
      <div style={{ width: "100%", height: 400, marginBottom: "20px" }}>
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="text-blue-500" /> 销售数据图表
        </h3>
        {loading ? (
          <p>数据加载中...</p>
        ) : (
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5000]} /> {/* 设置 Y 轴范围 */}
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
              <Line type="monotone" dataKey="rating" stroke="#ffc658" />
              <Line type="monotone" dataKey="reviews" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 总商品数 */}
      <div className="mt-4 flex items-center gap-4">
        <ShoppingCart className="text-green-500" />
        <span>总商品数：{filteredData.length}</span>
      </div>
    </div>
  );
}

export default SalesDashboard;