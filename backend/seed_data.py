"""
填充模擬數據腳本
"""

import sqlite3
import os
from datetime import datetime, timedelta
import random

DATABASE = os.path.join(os.path.dirname(__file__), 'dawan.db')

def seed_data():
    """填充模擬數據"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    print("🌱 開始填充模擬數據...")

    # 1. 管理員帳戶
    print("  ➤ 建立管理員帳戶...")
    cursor.execute('''
        INSERT OR IGNORE INTO admins (id, name, email, password, role)
        VALUES (1, 'kuma', 'kuma@dawan.com', 'kuma!2022', 'super_admin')
    ''')

    cursor.execute('''
        INSERT OR IGNORE INTO admins (name, email, password, role)
        VALUES ('admin', 'admin@dawan.com', 'admin123', 'admin')
    ''')

    # 2. 商品分類
    print("  ➤ 建立商品分類...")
    categories = [
        ('保健食品', 0),
        ('維生素', 1),
        ('益生菌', 1),
        ('營養補充', 1),
        ('個人護理', 0),
        ('護膚品', 5),
        ('口腔護理', 5),
        ('醫療器材', 0),
    ]

    for name, parent_id in categories:
        cursor.execute('''
            INSERT OR IGNORE INTO product_categories (name, parent_id)
            VALUES (?, ?)
        ''', (name, parent_id))

    # 3. 商品
    print("  ➤ 建立商品...")
    products = [
        (2, 'ADR-1益生菌膠囊', 'ADR001', '高濃度益生菌，幫助腸道健康', 1280, 1580, 100, '盒', '/images/products/adr1.jpg'),
        (2, '綜合維他命B群', 'VIT001', '提升精神活力，維持正常代謝', 680, 880, 150, '瓶', '/images/products/vitb.jpg'),
        (3, '力增飲', 'NUT001', '營養補充飲品，適合術後調養', 1200, 1500, 80, '箱', '/images/products/drink.jpg'),
        (2, '魚油軟膠囊', 'FISH001', '富含Omega-3，保護心血管', 980, 1280, 120, '瓶', '/images/products/fish-oil.jpg'),
        (6, '玻尿酸保濕精華', 'SKIN001', '深層保濕，恢復肌膚彈性', 1580, 1980, 60, '瓶', '/images/products/serum.jpg'),
        (7, '漱口水500ml', 'ORAL001', '清新口氣，預防牙周問題', 280, 350, 200, '瓶', '/images/products/mouthwash.jpg'),
        (8, '血壓計', 'MED001', '家用電子血壓計，操作簡單', 2200, 2800, 40, '台', '/images/products/bp-monitor.jpg'),
        (8, '額溫槍', 'MED002', '非接觸式測溫，快速準確', 980, 1280, 70, '支', '/images/products/thermometer.jpg'),
        (3, '鈣片+維生素D3', 'CAL001', '強化骨骼，預防骨質疏鬆', 580, 780, 130, '瓶', '/images/products/calcium.jpg'),
        (2, '葉黃素護眼膠囊', 'EYE001', '保護視力，減少藍光傷害', 1180, 1480, 90, '瓶', '/images/products/lutein.jpg'),
    ]

    for category_id, name, sku, description, price, original_price, stock, unit, image in products:
        cursor.execute('''
            INSERT OR IGNORE INTO products
            (category_id, name, sku, description, price, original_price, stock, unit, image, status, is_hot)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        ''', (category_id, name, sku, description, price, original_price, stock, unit, image, random.choice([0, 1])))

    # 4. 會員
    print("  ➤ 建立會員...")
    users = [
        ('王小明', 'wang@example.com', '0912345678', '123456', 500, 'vip'),
        ('李小華', 'lee@example.com', '0923456789', '123456', 300, 'normal'),
        ('陳大同', 'chen@example.com', '0934567890', '123456', 800, 'diamond'),
        ('林美麗', 'lin@example.com', '0945678901', '123456', 200, 'normal'),
        ('張三', 'zhang@example.com', '0956789012', '123456', 0, 'normal'),
    ]

    for name, email, phone, password, points, level in users:
        cursor.execute('''
            INSERT OR IGNORE INTO users (name, email, phone, password, points, level)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (name, email, phone, password, points, level))

    # 5. 訂單
    print("  ➤ 建立訂單...")
    order_statuses = ['pending', 'processing', 'shipping', 'completed']

    for i in range(50):
        order_date = datetime.now() - timedelta(days=random.randint(0, 365))
        order_no = order_date.strftime('%Y%m%d') + str(10000 + i)
        user_id = random.randint(1, 5)

        # 獲取用戶資訊
        cursor.execute('SELECT name, phone, email FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()

        total = random.randint(500, 5000)

        cursor.execute('''
            INSERT INTO orders
            (order_no, user_id, user_name, user_phone, user_email, status, total, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (order_no, user_id, user[0], user[1], user[2], random.choice(order_statuses), total, order_date))

        order_id = cursor.lastrowid

        # 訂單明細（隨機1-3個商品）
        for _ in range(random.randint(1, 3)):
            product_id = random.randint(1, 10)
            cursor.execute('SELECT name, sku, price FROM products WHERE id = ?', (product_id,))
            product = cursor.fetchone()

            if product:
                quantity = random.randint(1, 3)
                subtotal = product[2] * quantity

                cursor.execute('''
                    INSERT INTO order_items
                    (order_id, product_id, product_name, product_sku, price, quantity, subtotal)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (order_id, product_id, product[0], product[1], product[2], quantity, subtotal))

    # 6. 網站瀏覽記錄
    print("  ➤ 建立瀏覽記錄...")
    for i in range(600):
        view_date = datetime.now() - timedelta(days=random.randint(0, 365))
        cursor.execute('''
            INSERT INTO page_views (page, ip_address, created_at)
            VALUES (?, ?, ?)
        ''', (random.choice(['/index', '/products', '/about', '/contact']), f'192.168.1.{random.randint(1, 255)}', view_date))

    # 7. 聯絡紀錄
    print("  ➤ 建立聯絡紀錄...")
    for i in range(5):
        cursor.execute('''
            INSERT INTO contacts (name, email, phone, subject, message, is_replied)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (f'客戶{i+1}', f'customer{i+1}@example.com', f'09{random.randint(10000000, 99999999)}',
              '商品諮詢', '請問這個商品適合老年人嗎？', random.choice([0, 1])))

    # 8. Banner輪播
    print("  ➤ 建立輪播圖...")
    banners = [
        ('春季優惠活動', '/images/banners/spring.jpg', '/promotions/spring'),
        ('新品上市', '/images/banners/new.jpg', '/products/new'),
        ('健康講座', '/images/banners/lecture.jpg', '/events/lecture'),
    ]

    for title, image, link in banners:
        cursor.execute('''
            INSERT OR IGNORE INTO banners (title, image, link, status)
            VALUES (?, ?, ?, 1)
        ''', (title, image, link))

    # 9. 品牌連結
    print("  ➤ 建立品牌連結...")
    brands = [
        ('景岳生技', '/images/brands/genmont.png', 'https://www.genmont.com.tw'),
        ('癌症營養照護', '/images/brands/cancer-care.png', 'http://cancer-care.com.tw'),
        ('力增飲', '/images/brands/nutren.png', 'https://www.nutren.com.tw'),
    ]

    for name, logo, url in brands:
        cursor.execute('''
            INSERT OR IGNORE INTO brand_links (name, logo, url, status)
            VALUES (?, ?, ?, 1)
        ''', (name, logo, url))

    # 10. 網站設定
    print("  ➤ 建立網站設定...")
    settings = [
        ('site_name', '大灣藥局', 'text', '網站名稱'),
        ('maintenance_mode', '0', 'boolean', '維護模式'),
        ('contact_email', 'info@dawan.com', 'text', '聯絡信箱'),
        ('contact_phone', '06-1234567', 'text', '聯絡電話'),
        ('contact_address', '台南市大灣區大灣路123號', 'text', '地址'),
    ]

    for key, value, type_, description in settings:
        cursor.execute('''
            INSERT OR IGNORE INTO settings (key, value, type, description)
            VALUES (?, ?, ?, ?)
        ''', (key, value, type_, description))

    conn.commit()
    conn.close()

    print("✅ 模擬數據填充完成！")
    print("-" * 50)
    print("📊 數據統計:")
    print("  • 管理員帳戶: 2個")
    print("  • 商品分類: 8個")
    print("  • 商品: 10個")
    print("  • 會員: 5個")
    print("  • 訂單: 50筆")
    print("  • 瀏覽記錄: 600筆")
    print("  • 聯絡紀錄: 5筆")
    print("-" * 50)

if __name__ == '__main__':
    seed_data()
