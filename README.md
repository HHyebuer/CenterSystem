# 推栏小程序AI中枢管理后台

基于Phase 1-4完整设计方案实现的中枢控制系统，整合项目管理、知识管理、AI代理调度、工作流自动化与历史记忆系统。

## 项目结构

```
center-system/
├── frontend/           # 前端应用
│   ├── index.html     # 主页面
│   ├── css/           # 样式文件
│   ├── js/            # JavaScript文件
│   └── assets/        # 静态资源
├── backend/           # 后端服务
│   ├── api/           # API接口
│   ├── models/        # 数据模型
│   └── services/      # 业务服务
├── docs/              # 文档
│   ├── api.md         # API文档
│   └── architecture.md # 架构文档
├── scripts/           # 工具脚本
└── package.json       # 项目配置
```

## 功能模块

### Phase 1: 基础框架 (已实现)
- 项目管理仪表盘
- 知识库浏览器
- 基础AI需求分析
- 用户界面框架

### Phase 2: AI增强 (已实现)
- 多模型集成与调度
- 工作流编排引擎
- Skill仓库与执行器
- 自动化任务处理

### Phase 3: 记忆系统 (已实现)
- 历史记忆存储与检索
- 上下文管理系统
- 智能推荐与学习
- 经验知识网络

### Phase 4: 高级功能 (已实现)
- 高级工作流设计器
- 团队协作功能
- 分析与报告系统
- 智能决策支持

## 快速开始

### 使用启动脚本（推荐）
```bash
# 进入项目目录
cd /Users/hhyebuer/tuilan/center-system

# 运行启动脚本
./start.sh
```

### 手动启动前端
1. 进入项目目录：`cd frontend`
2. 启动开发服务器：`python -m http.server 8000`
3. 访问：http://localhost:8000

### 后端运行
1. 安装依赖：`npm install`
2. 启动服务：`npm start`
3. API地址：http://localhost:3000/api

## 技术栈

### 前端
- HTML5/CSS3/JavaScript
- Tailwind CSS (UI框架)
- Chart.js (数据可视化)
- Monaco Editor (代码编辑器)

### 后端
- Node.js + Express
- PostgreSQL (主数据库)
- Redis (缓存)
- Milvus (向量存储)
- RabbitMQ (消息队列)

### AI集成
- Hermes Agent API
- OpenAI/Anthropic/DeepSeek API
- LangChain (AI编排)
- 自定义技能库

## 部署指南

### 开发环境
```bash
# 克隆仓库
git clone <repository-url>
cd center-system

# 安装依赖
npm install

# 启动服务
npm run dev
```

### 生产环境
```bash
# 构建前端
npm run build

# 启动生产服务
npm start
```

## API文档

详细API文档参见 `docs/api.md`。

## 许可证

MIT License