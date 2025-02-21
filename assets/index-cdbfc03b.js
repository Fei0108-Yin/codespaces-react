import{r as o,j as e,T as L,R as S,L as D,C as b,X as C,Y as F,a as T,b as N,c as p,S as R,d as E,e as A}from"./vendor-249dbdc8.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))d(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&d(i)}).observe(document,{childList:!0,subtree:!0});function c(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function d(t){if(t.ep)return;t.ep=!0;const r=c(t);fetch(t.href,r)}})();function O(){const[f,n]=o.useState([]),[c,d]=o.useState(""),[t,r]=o.useState(""),[i,u]=o.useState(!0),j=o.useRef(null),x="https://laughing-palm-tree-r46qq69jvx4gh549p-5003.app.github.dev",m=async()=>{try{const s=await fetch(`${x}/data`,{method:"GET",headers:{"Content-Type":"application/json"}});if(!s.ok)throw new Error(`HTTP error! status: ${s.status}`);const a=await s.json();Array.isArray(a.data)?(n(a.data),console.log("Fetched Sales Data Length:",a.data.length)):console.error("后端返回的数据格式不正确：",a),u(!1)}catch(s){console.error("请求出错：",s),alert("无法连接到服务器，请检查后端服务！"),u(!1)}},v=async s=>{const a=s.target.files[0];if(!a){alert("请上传一个有效的 CSV 文件！");return}d(a.name);const g=new FormData;g.append("file",a);try{const l=await fetch(`${x}/upload-file`,{method:"POST",body:g});l.ok?(alert("文件上传成功！"),m()):(console.error("文件上传失败，状态码：",l.status),alert(`文件上传失败，状态码：${l.status}`))}catch(l){console.error("文件上传失败：",l),alert("无法连接到服务器，请检查后端服务！")}},h=t?f.filter(s=>{var a;return(a=s.title)==null?void 0:a.toLowerCase().includes(t.toLowerCase())}):f;console.log("Filtered Data Length:",h.length),o.useEffect(()=>{m()},[]);const w=h.map(s=>({name:s.title,price:parseFloat(s.price),rating:parseFloat(s.rating),reviews:parseInt(s.reviews||"0"),sales:parseInt(s.sales||"0")}));return e.jsxs("div",{style:{padding:"20px",fontFamily:"Arial, sans-serif"},children:[e.jsx("h2",{children:"Sales Dashboard"}),e.jsx("input",{type:"file",accept:".csv",ref:j,onChange:v,style:{marginBottom:"10px",display:"block"}}),c&&e.jsxs("p",{children:["已选择文件：",c]}),e.jsx("input",{type:"text",placeholder:"搜索...",value:t,onChange:s=>r(s.target.value),style:{marginBottom:"10px",padding:"5px",width:"300px"}}),e.jsxs("div",{style:{width:"100%",height:400,marginBottom:"20px"},children:[e.jsxs("h3",{className:"text-2xl font-bold flex items-center gap-2",children:[e.jsx(L,{className:"text-blue-500"})," 销售数据图表"]}),i?e.jsx("p",{children:"数据加载中..."}):e.jsx(S,{children:e.jsxs(D,{data:w,children:[e.jsx(b,{strokeDasharray:"3 3"}),e.jsx(C,{dataKey:"name"}),e.jsx(F,{domain:[0,5e3]})," ",e.jsx(T,{}),e.jsx(N,{}),e.jsx(p,{type:"monotone",dataKey:"price",stroke:"#8884d8",activeDot:{r:8}}),e.jsx(p,{type:"monotone",dataKey:"sales",stroke:"#82ca9d"}),e.jsx(p,{type:"monotone",dataKey:"rating",stroke:"#ffc658"}),e.jsx(p,{type:"monotone",dataKey:"reviews",stroke:"#ff7300"})]})})]}),e.jsxs("div",{className:"mt-4 flex items-center gap-4",children:[e.jsx(R,{className:"text-green-500"}),e.jsxs("span",{children:["总商品数：",h.length]})]})]})}function K(){return e.jsxs("div",{children:[e.jsx("h1",{children:"React 前端示例"}),e.jsx(O,{})]})}const y=document.getElementById("react-chart-root");y?E.createRoot(y).render(e.jsx(A.StrictMode,{children:e.jsx(K,{})})):console.error("React 容器未找到：请确保容器已正确注入！");
