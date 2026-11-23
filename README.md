# Vue3 Admin 后台管理系统

基于 Vue 3 + TypeScript 的后台管理系统模板，包含登录鉴权、路由守卫、Pinia 状态管理、axios 二次封装、表格增删改查和 ECharts 图表页。数据层内置本地 mock，克隆后无需后端即可运行。

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 构建 | Vite 5 |
| 框架 | Vue 3（script setup）+ TypeScript |
| UI | Element Plus |
| 路由 | Vue Router 4（路由守卫） |
| 状态 | Pinia |
| 请求 | axios（请求/响应拦截器） |
| 图表 | ECharts 5（按需引入） |
| 数据 | 本地 mock（开发环境走 Vite 中间件，生产环境走浏览器内适配） |

## 运行

需要 Node.js 18 或更高版本。项目自带 `.npmrc`，默认使用 npmmirror 国内镜像源。

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。演示账号：`admin`，密码：`123456`（登录页已预填）。

其他命令：

```bash
npm run type-check   # TypeScript 类型检查
npm run build        # 类型检查 + 生产构建，输出到 dist/
npm run preview      # 预览构建结果
```

## 功能页面

- **登录页**：表单校验、loading 状态、登录失败提示；已登录访问 `/login` 会跳转首页。
- **数据概览**：统计卡片，数据来自 mock 接口。
- **用户管理**：条件检索（关键字 + 状态）、分页、新增、编辑、删除确认、表单校验。
- **图表分析**：折线图、柱状图、环形图，窗口尺寸变化时自动重绘。

## 目录说明

```
src/
├─ api/          axios 封装与各业务模块接口
├─ components/   通用组件（ECharts 容器）
├─ layouts/      后台整体布局（侧边菜单、顶栏、退出登录）
├─ router/       路由表与权限守卫
├─ stores/       Pinia store（user / app）
├─ styles/       全局样式
├─ types/        公共 TypeScript 类型
├─ utils/        token 存取
└─ views/        登录、概览、用户管理、图表页面
mock/            mock 数据、接口处理函数、Vite 中间件插件
```

## 切换真实后端

接口地址统一由环境变量控制，见 `.env.development` 和 `.env.production`：

```dotenv
VITE_API_BASE_URL=https://your-domain.com/api
VITE_USE_MOCK=false
```

`VITE_USE_MOCK=false` 时不再加载浏览器内 mock 适配，请求直接发往真实地址。

真实后端需要实现以下接口，返回格式为 `{ code: 0, message: "success", data: ... }`，其中 `code` 为 0 表示成功：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/auth/login` | 登录，返回 token 与用户信息 |
| GET | `/auth/profile` | 当前用户信息 |
| GET | `/users` | 分页列表，参数 page / pageSize / keyword / status |
| POST | `/users` | 新增 |
| PUT | `/users/:id` | 更新 |
| DELETE | `/users/:id` | 删除 |
| GET | `/dashboard/stats` | 概览统计 |
| GET | `/charts/overview` | 图表数据 |

token 通过 `Authorization: Bearer <token>` 请求头发送；响应 `code` 为 401 时清除本地 token 并跳转登录页。

## 说明

- 生产环境的 `VITE_USE_MOCK` 默认为 `true`，这样静态部署后也能直接演示全部功能。
- Element Plus 采用全局注册方式，配置简单；如需进一步压缩体积，可改为按需引入。
- token 存在 localStorage，真实项目中建议改用 HttpOnly Cookie，并补充刷新 token 逻辑。
