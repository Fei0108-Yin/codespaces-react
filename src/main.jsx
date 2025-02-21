import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 修改挂载点为 Tampermonkey 注入的容器
const rootElement = document.getElementById("react-chart-root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("React 容器未找到：请确保容器已正确注入！");
}