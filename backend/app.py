"""
大灣藥局後台管理系統 - Flask 後端應用程式
"""

from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime, timedelta
import json
from functools import wraps

app = Flask(__name__,
            template_folder='../admin',
            static_folder='../admin',
            static_url_path='')

# 配置
app.config['SECRET_KEY'] = 'dawan-pharmacy-secret-key-2026'
app.config['DATABASE'] = os.path.join(os.path.dirname(__file__), 'dawan.db')
app.config['JSON_AS_ASCII'] = False  # 支援中文JSON

# 啟用CORS
CORS(app)

# ============================================
# 資料庫連接
# ============================================

def get_db():
    """獲取資料庫連接"""
    db = sqlite3.connect(app.config['DATABASE'])
    db.row_factory = sqlite3.Row  # 讓查詢結果可以像字典一樣訪問
    return db

def init_db():
    """初始化資料庫"""
    with app.app_context():
        db = get_db()
        with open(os.path.join(os.path.dirname(__file__), '../database_schema.sql'), 'r', encoding='utf-8') as f:
            db.executescript(f.read())
        db.commit()
        print("✅ 資料庫初始化完成")

# ============================================
# 登入驗證裝飾器
# ============================================

def login_required(f):
    """登入驗證裝飾器"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def api_login_required(f):
    """API登入驗證裝飾器"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return jsonify({'success': False, 'message': '請先登入'}), 401
        return f(*args, **kwargs)
    return decorated_function

# ============================================
# 路由 - 頁面
# ============================================

@app.route('/')
def index():
    """重定向到登入頁面或後台首頁"""
    if 'admin_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    """登入頁面"""
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        username = data.get('username')
        password = data.get('password')

        db = get_db()
        admin = db.execute(
            'SELECT * FROM admins WHERE name = ? AND password = ?',
            (username, password)
        ).fetchone()

        if admin:
            session['admin_id'] = admin['id']
            session['admin_name'] = admin['name']
            if request.is_json:
                return jsonify({'success': True, 'redirect': '/admin/dashboard'})
            return redirect(url_for('dashboard'))
        else:
            if request.is_json:
                return jsonify({'success': False, 'message': '帳號或密碼錯誤'})
            return render_template('login.html', error='帳號或密碼錯誤')

    return render_template('login.html')

@app.route('/logout')
def logout():
    """登出"""
    session.clear()
    return redirect(url_for('login'))

@app.route('/admin/dashboard')
@login_required
def dashboard():
    """後台首頁（儀表板）"""
    return render_template('index.html')

@app.route('/admin/products')
@login_required
def products():
    """商品管理頁面"""
    return render_template('products.html')

@app.route('/admin/orders')
@login_required
def orders():
    """訂單管理頁面"""
    return render_template('orders.html')

@app.route('/admin/users')
@login_required
def users():
    """會員管理頁面"""
    return render_template('users.html')

# ============================================
# API - 儀表板數據
# ============================================

@app.route('/api/dashboard/stats')
@api_login_required
def dashboard_stats():
    """獲取儀表板統計數據"""
    db = get_db()

    # 訂單總數
    order_count = db.execute('SELECT COUNT(*) as count FROM orders').fetchone()['count']

    # 商品總數
    product_count = db.execute('SELECT COUNT(*) as count FROM products WHERE status = 1').fetchone()['count']

    # 未回覆信件
    contact_count = db.execute('SELECT COUNT(*) as count FROM contacts WHERE is_replied = 0').fetchone()['count']

    # 瀏覽次數
    view_count = db.execute('SELECT COUNT(*) as count FROM page_views').fetchone()['count']

    # 最新訂單
    latest_orders = db.execute('''
        SELECT id, order_no, created_at, status, total, user_name
        FROM orders
        ORDER BY created_at DESC
        LIMIT 10
    ''').fetchall()

    # 庫存近況（庫存低於10的商品）
    low_stock_products = db.execute('''
        SELECT id, name, stock, unit
        FROM products
        WHERE stock < 10 AND status = 1
        ORDER BY stock ASC
        LIMIT 10
    ''').fetchall()

    return jsonify({
        'success': True,
        'data': {
            'order_count': order_count,
            'product_count': product_count,
            'contact_count': contact_count,
            'view_count': view_count,
            'latest_orders': [dict(row) for row in latest_orders],
            'low_stock_products': [dict(row) for row in low_stock_products]
        }
    })

@app.route('/api/dashboard/order-chart')
@api_login_required
def order_chart():
    """訂單數量統計圖表數據（按月份）"""
    db = get_db()

    # 獲取今年每月訂單數量
    year = datetime.now().year
    monthly_data = []

    for month in range(1, 13):
        count = db.execute('''
            SELECT COUNT(*) as count
            FROM orders
            WHERE strftime('%Y', created_at) = ?
            AND strftime('%m', created_at) = ?
        ''', (str(year), f'{month:02d}')).fetchone()['count']

        monthly_data.append({
            'month': f'{month}月',
            'count': count
        })

    return jsonify({
        'success': True,
        'data': monthly_data
    })

@app.route('/api/dashboard/view-chart')
@api_login_required
def view_chart():
    """瀏覽次數統計圖表數據（按月份）"""
    db = get_db()

    # 獲取今年每月瀏覽數
    year = datetime.now().year
    monthly_data = []

    for month in range(1, 13):
        count = db.execute('''
            SELECT COUNT(*) as count
            FROM page_views
            WHERE strftime('%Y', created_at) = ?
            AND strftime('%m', created_at) = ?
        ''', (str(year), f'{month:02d}')).fetchone()['count']

        monthly_data.append({
            'month': f'{month}月',
            'count': count
        })

    return jsonify({
        'success': True,
        'data': monthly_data
    })

# ============================================
# API - 商品管理
# ============================================

@app.route('/api/products')
@api_login_required
def api_products():
    """獲取商品列表"""
    db = get_db()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    offset = (page - 1) * per_page

    products = db.execute('''
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN product_categories c ON p.category_id = c.id
        ORDER BY p.id DESC
        LIMIT ? OFFSET ?
    ''', (per_page, offset)).fetchall()

    total = db.execute('SELECT COUNT(*) as count FROM products').fetchone()['count']

    return jsonify({
        'success': True,
        'data': {
            'products': [dict(row) for row in products],
            'total': total,
            'page': page,
            'per_page': per_page
        }
    })

@app.route('/api/products/<int:product_id>')
@api_login_required
def api_product_detail(product_id):
    """獲取商品詳情"""
    db = get_db()
    product = db.execute('SELECT * FROM products WHERE id = ?', (product_id,)).fetchone()

    if product:
        return jsonify({'success': True, 'data': dict(product)})
    return jsonify({'success': False, 'message': '商品不存在'}), 404

@app.route('/api/products', methods=['POST'])
@api_login_required
def api_product_create():
    """新增商品"""
    data = request.get_json()
    db = get_db()

    db.execute('''
        INSERT INTO products (category_id, name, sku, description, price, original_price, stock, unit, image, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('category_id'),
        data.get('name'),
        data.get('sku'),
        data.get('description'),
        data.get('price'),
        data.get('original_price'),
        data.get('stock', 0),
        data.get('unit', '個'),
        data.get('image'),
        data.get('status', 1)
    ))

    db.commit()

    return jsonify({'success': True, 'message': '商品新增成功'})

@app.route('/api/products/<int:product_id>', methods=['PUT'])
@api_login_required
def api_product_update(product_id):
    """更新商品"""
    data = request.get_json()
    db = get_db()

    db.execute('''
        UPDATE products
        SET category_id = ?, name = ?, sku = ?, description = ?,
            price = ?, original_price = ?, stock = ?, unit = ?,
            image = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (
        data.get('category_id'),
        data.get('name'),
        data.get('sku'),
        data.get('description'),
        data.get('price'),
        data.get('original_price'),
        data.get('stock'),
        data.get('unit'),
        data.get('image'),
        data.get('status'),
        product_id
    ))

    db.commit()

    return jsonify({'success': True, 'message': '商品更新成功'})

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@api_login_required
def api_product_delete(product_id):
    """刪除商品"""
    db = get_db()
    db.execute('DELETE FROM products WHERE id = ?', (product_id,))
    db.commit()

    return jsonify({'success': True, 'message': '商品刪除成功'})

# ============================================
# API - 訂單管理
# ============================================

@app.route('/api/orders')
@api_login_required
def api_orders():
    """獲取訂單列表"""
    db = get_db()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    offset = (page - 1) * per_page

    orders = db.execute('''
        SELECT * FROM orders
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    ''', (per_page, offset)).fetchall()

    total = db.execute('SELECT COUNT(*) as count FROM orders').fetchone()['count']

    return jsonify({
        'success': True,
        'data': {
            'orders': [dict(row) for row in orders],
            'total': total,
            'page': page,
            'per_page': per_page
        }
    })

@app.route('/api/orders/<int:order_id>')
@api_login_required
def api_order_detail(order_id):
    """獲取訂單詳情"""
    db = get_db()

    order = db.execute('SELECT * FROM orders WHERE id = ?', (order_id,)).fetchone()
    if not order:
        return jsonify({'success': False, 'message': '訂單不存在'}), 404

    items = db.execute('SELECT * FROM order_items WHERE order_id = ?', (order_id,)).fetchall()

    return jsonify({
        'success': True,
        'data': {
            'order': dict(order),
            'items': [dict(item) for item in items]
        }
    })

@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
@api_login_required
def api_order_update_status(order_id):
    """更新訂單狀態"""
    data = request.get_json()
    db = get_db()

    db.execute('''
        UPDATE orders
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (data.get('status'), order_id))

    db.commit()

    return jsonify({'success': True, 'message': '訂單狀態更新成功'})

# ============================================
# 錯誤處理
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'message': '頁面不存在'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'message': '伺服器錯誤'}), 500

# ============================================
# 主程式
# ============================================

if __name__ == '__main__':
    # 檢查資料庫是否存在，不存在則初始化
    if not os.path.exists(app.config['DATABASE']):
        print("🔨 資料庫不存在，開始初始化...")
        init_db()

    print("🚀 大灣藥局後台管理系統啟動中...")
    print("📍 訪問地址: http://localhost:5000")
    print("👤 預設帳號: kuma")
    print("🔑 預設密碼: kuma!2022")
    print("-" * 50)

    app.run(debug=True, host='0.0.0.0', port=5000)
