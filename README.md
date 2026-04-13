# 大灣藥局後台管理系統

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com/)

大灣藥局後台管理系統是一個基於 Flask 的全端管理系統，提供訂單管理、商品管理、會員管理、數據統計等完整功能。

## ✨ 主要功能

- 🔐 **登入系統** - 安全的 Session 認證機制
- 📊 **數據儀表板** - 即時統計數據與圖表
- 📦 **訂單管理** - 完整的訂單處理流程
- 🛍️ **商品管理** - 商品分類與庫存管理
- 👥 **會員管理** - 會員資料與積分系統
- 📝 **內容管理** - 健康文章、食譜、影片
- 🎁 **促銷活動** - 優惠券、贈品活動

## 🏗️ 技術架構

**前端**
- Bootstrap 5, jQuery, Morris.js, SweetAlert2, Material Design Icons

**後端**
- Python 3.8+, Flask 3.0, SQLite, Flask-CORS, Werkzeug

## 📁 專案結構

```
Dawan/
├── admin/                   # 前端管理介面
│   ├── css/                # 樣式表
│   ├── js/                 # JavaScript 檔案
│   ├── fonts/              # 字體檔案
│   ├── images/             # 圖片資源
│   ├── index.html          # 主控台首頁
│   └── login.html          # 登入頁面
├── backend/                # Python Flask 後端
│   ├── models/             # 資料模型（預留）
│   ├── routes/             # API 路由（預留）
│   ├── app.py              # Flask 應用主程式
│   ├── seed_data.py        # 資料庫種子資料
│   └── dawan.db            # SQLite 資料庫（執行後生成）
├── docs/                   # 文檔
├── database_schema.sql     # 資料庫架構
├── requirements.txt        # Python 依賴套件
├── start.bat              # Windows 啟動腳本
├── run.bat                # 快速啟動腳本
├── INSTALL.md             # 安裝指南
└── README.md              # 本文件
```

## 🚀 快速開始

### 系統需求

- Python 3.8+
- pip (Python 套件管理工具)
- 現代瀏覽器 (Chrome, Firefox, Edge)

### 安裝步驟

**Windows 用戶（推薦）**

```bash
# 1. 下載專案
git clone https://github.com/bj7261716/Dawan.git
cd Dawan

# 2. 執行啟動腳本（會自動完成所有設定）
start.bat

# 3. 開啟瀏覽器訪問
http://localhost:5000
```

**手動安裝**

```bash
# 1. 建立虛擬環境
python -m venv venv

# 2. 啟動虛擬環境
venv\Scripts\activate          # Windows
source venv/bin/activate       # Linux/Mac

# 3. 安裝依賴套件
pip install -r requirements.txt

# 4. 初始化資料庫
cd backend
python -c "from app import init_db; init_db()"
python seed_data.py

# 5. 啟動系統
python app.py
```

## 🔑 登入資訊

- 帳號：`kuma`
- 密碼：`kuma!2022`

## 📊 資料庫架構

系統使用 SQLite 資料庫，包含 23 個資料表：

**核心功能表**
- admins, products, product_categories, orders, order_items
- users, companies, point_records

**內容管理表**
- promotions, coupons, health_articles, recipes, videos

**系統設定表**
- banners, brand_links, giveaways, contacts, settings, page_views

完整架構請參考 [database_schema.sql](database_schema.sql)

## 🛠️ API 端點

**認證**
- `POST /login` - 登入
- `GET /logout` - 登出

**儀表板**
- `GET /admin/dashboard` - 儀表板頁面
- `GET /api/dashboard/stats` - 統計數據
- `GET /api/dashboard/order-chart` - 訂單圖表
- `GET /api/dashboard/view-chart` - 瀏覽量圖表

**資料管理**
- `GET /api/products` - 商品列表
- `GET /api/orders` - 訂單列表
- `GET /api/users` - 會員列表

## 📝 文檔

- [安裝指南](INSTALL.md) - 詳細的安裝步驟
- [系統使用說明](docs/系統使用說明.md) - 功能說明
- [開發進度報告](docs/開發進度報告.md) - 開發紀錄

## 🐛 常見問題

**Q: 啟動時出現 "ModuleNotFoundError: No module named 'flask'"**

A: 確認已啟動虛擬環境（看到 `(venv)`），然後執行 `pip install Flask Flask-CORS`

**Q: 端口 5000 已被佔用**

A: 修改 `backend/app.py` 最後一行改為其他端口（如 8080）

更多問題請參考 [INSTALL.md](INSTALL.md)

## 📄 授權

© 2005 - 2026, 大灣藥局 版權所有 KUMA All Rights Reserved.

---

**Last Updated:** 2026-04-13  
**Made with ❤️ by Dawan Pharmacy Team**
