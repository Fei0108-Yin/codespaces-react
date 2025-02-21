require("dotenv").config(); // 加载环境变量
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises"); // 引入 Promise 风格的 fs 方法
const fss = require("fs"); // 引入原始的 fs 模块
const csvParser = require("csv-parser");

const app = express(); // 初始化 Express 应用
const PORT = process.env.PORT || 5003; // 设置端口

// 使用 cors 模块修改 CORS 配置
app.use(
  cors({
    origin: ["https://laughing-palm-tree-r46qq69jvx4gh549p-5173.app.github.dev", "https://fei0108-yin.github.io"], // 允许的前端 URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 允许的 HTTP 方法
    allowedHeaders: ["Content-Type", "Authorization"], // 允许的请求头
    credentials: true, // 如果需要传递 Cookie 或身份验证信息
  })
);

// 手动设置 OPTIONS 请求的 CORS 响应头
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin); // 动态设置允许的来源
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200); // 响应 OK 状态
});

// 使用 body-parser 解析 JSON 请求体
app.use(bodyParser.json());

// 连接 MongoDB 数据库
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB 连接成功！"))
  .catch((err) => {
    console.error("MongoDB 连接失败：", err.message);
    process.exit(1);
  });

// 定义 Schema 和 Model
const SalesDataSchema = new mongoose.Schema({}, { strict: false });
const SalesData = mongoose.model("SalesData", SalesDataSchema);

// 配置 multer
const uploadFolder = path.join(__dirname, "uploads");
(async () => {
  try {
    if (!(await fs.stat(uploadFolder).catch(() => false))) {
      await fs.mkdir(uploadFolder);
    }
  } catch (error) {
    console.error("创建上传目录时出错：", error);
    process.exit(1);
  }
})();
const upload = multer({ dest: uploadFolder });

// 查询数据（带分页）
app.get("/data", async (req, res) => {
  try {
    const { page, limit } = req.query;

    if (!page || !limit) {
      // 如果没有分页参数，返回所有数据
      const salesData = await SalesData.find();
      return res.status(200).json({
        data: salesData,
        total: salesData.length,
        currentPage: 1,
        totalPages: 1,
      });
    }

    // 分页逻辑
    const salesData = await SalesData.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await SalesData.countDocuments();

    res.status(200).json({
      data: salesData,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("查询数据时出错：", error);
    res.status(500).json({ message: "查询数据失败！", error: error.message });
  }
});

// 上传文件并解析 CSV
app.post("/upload-file", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "未上传文件！" });
  }

  const filePath = req.file.path; // 文件路径
  const results = []; // 存储解析后的数据

  try {
    // 解析 CSV 文件
    await new Promise((resolve, reject) => {
      fss.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    // 清空数据库中的旧数据
    await SalesData.deleteMany({});
    console.log("旧数据已清空！");

    // 将新数据插入数据库
    await SalesData.insertMany(results);
    console.log("CSV 数据已成功存储到数据库！");

    // 删除上传的临时文件
    await fs.unlink(filePath);

    res.status(200).json({
      message: "CSV 文件数据已成功存储到数据库！",
      data: results,
    });
  } catch (error) {
    console.error("处理文件时出错：", error);

    // 删除上传的临时文件
    await fs.unlink(filePath);

    res.status(500).json({ message: "处理文件失败！", error: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器正在运行：http://localhost:${PORT}`);
});

// 捕获未处理的异常
process.on("uncaughtException", (err) => {
  console.error("未捕获的异常：", err);
});

process.on("unhandledRejection", (err) => {
  console.error("未处理的 promise 拒绝：", err);
});

// 添加根路径的处理逻辑
app.get("/", (req, res) => {
  res.status(200).send("后端服务已启动！访问其他路径以获取功能。");
});