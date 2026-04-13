# 安裝指南

## 🚨 如果 start.bat 無法執行，請手動安裝

### 步驟1：檢查Python
打開命令提示字元（CMD），輸入：
```bash
python --version
```

**應該看到**：`Python 3.8.x` 或更高版本

**如果沒有Python**：
1. 前往 https://www.python.org/downloads/
2. 下載 Python 3.8 或以上版本
3. 安裝時**勾選** "Add Python to PATH"

---

### 步驟2：建立虛擬環境
在專案資料夾執行：
```bash
python -m venv venv
```

---

### 步驟3：啟動虛擬環境
```bash
venv\Scripts\activate
```

**成功會看到**：`(venv)` 出現在命令列前面

---

### 步驟4：安裝Flask
```bash
pip install Flask Flask-CORS
```

---

### 步驟5：初始化資料庫（只需第一次）
```bash
cd backend
python -c "from app import init_db; init_db()"
python seed_data.py
```

---

### 步驟6：啟動系統
```bash
python app.py
```

---

### 步驟7：開啟瀏覽器
訪問：http://localhost:5000

**登入資訊**：
- 帳號：`kuma`
- 密碼：`kuma!2022`

---

## 🔧 常見問題

### Q: 出現 "ModuleNotFoundError: No module named 'flask'"
**A**: 確認已啟動虛擬環境（看到 `(venv)`），然後執行：
```bash
pip install Flask Flask-CORS
```

### Q: 出現編碼錯誤
**A**: 在CMD執行：
```bash
chcp 65001
```

### Q: 虛擬環境無法啟動
**A**: 嘗試使用完整路徑：
```bash
D:\_In_progress\other\Dawan\venv\Scripts\activate
```

### Q: 端口5000已被佔用
**A**: 修改 `backend/app.py` 最後一行：
```python
app.run(debug=True, host='0.0.0.0', port=8080)  # 改為8080
```

---

## 📝 完整命令（複製貼上）

```bash
# 1. 切換到專案目錄
cd D:\_In_progress\other\Dawan

# 2. 建立虛擬環境
python -m venv venv

# 3. 啟動虛擬環境
venv\Scripts\activate

# 4. 安裝套件
pip install Flask Flask-CORS

# 5. 初始化資料庫
cd backend
python -c "from app import init_db; init_db()"
python seed_data.py

# 6. 啟動系統
python app.py
```

然後開啟瀏覽器訪問：http://localhost:5000

---

## ✅ 確認清單

啟動前確認：
- [ ] Python 3.8+ 已安裝
- [ ] 已建立虛擬環境 (venv資料夾存在)
- [ ] 已啟動虛擬環境 (看到 `(venv)`)
- [ ] Flask已安裝 (`pip list | findstr Flask`)
- [ ] 資料庫已初始化 (backend/dawan.db 存在)

全部打勾後，執行 `python app.py` 即可！
