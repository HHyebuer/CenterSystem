#!/bin/bash
# 推栏AI中枢管理后台 - 启动脚本

echo "推栏AI中枢管理后台启动中..."
echo "项目目录: $(pwd)"

# 检查必要的工具
if ! command -v python3 &> /dev/null; then
    echo "错误: 需要 Python3"
    exit 1
fi

echo "1. 启动前端开发服务器..."
cd frontend
echo "前端服务运行在: http://localhost:8000"
echo "按 Ctrl+C 停止服务器"
echo ""
python3 -m http.server 8000