#!/bin/bash

echo "================================================"
echo "  大灣藥局後台管理系統 - 啟動腳本"
echo "================================================"
echo ""

# 檢查Python是否安裝
if ! command -v python3 &> /dev/null; then
    echo "❌ 錯誤：找不到 Python3，請先安裝 Python 3.8 或以上版本"
    exit 1
fi

echo "✅ Python 已安裝"
echo ""

# 檢查虛擬環境是否存在
if [ ! -d "venv" ]; then
    echo "🔨 建立虛擬環境..."
    python3 -m venv venv
    echo "✅ 虛擬環境建立完成"
    echo ""
fi

# 啟動虛擬環境
echo "🚀 啟動虛擬環境..."
source venv/bin/activate

# 安裝依賴
echo "📦 檢查並安裝依賴套件..."
pip install -q -r requirements.txt
echo "✅ 依賴套件安裝完成"
echo ""

# 檢查資料庫是否存在
if [ ! -f "backend/dawan.db" ]; then
    echo "🔨 初始化資料庫..."
    cd backend
    python3 -c "import sys; sys.path.insert(0, '.'); from app import init_db; init_db()"
    echo "✅ 資料庫初始化完成"
    echo ""

    echo "🌱 填充模擬數據..."
    python3 seed_data.py
    echo ""
    cd ..
fi

# 啟動Flask應用
echo "================================================"
echo "  🎉 系統啟動中..."
echo "================================================"
echo ""
echo "  📍 訪問地址: http://localhost:5000"
echo "  👤 預設帳號: kuma"
echo "  🔑 預設密碼: kuma!2022"
echo ""
echo "  按 Ctrl+C 停止服務器"
echo "================================================"
echo ""

cd backend
python3 app.py
