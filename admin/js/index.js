'use strict';
! function ($) {
	// 設定API基礎URL
	$.ApiBase = 'http://localhost:5000/api';

	$.Page = {
		wrapper: $('.index')
	};

	$.Module = {};
}(window.jQuery),
function ($) {
	const Index = function () {
		this.init = function () {
			// 載入儀表板統計數據
			this.loadDashboardStats();

			// 載入訂單圖表
			this.loadOrderChart();

			// 載入瀏覽圖表
			this.loadViewChart();
		};

		// 載入儀表板統計數據
		this.loadDashboardStats = function () {
			$.ajax({
				url: $.ApiBase + '/dashboard/stats',
				method: 'GET',
				success: function (res) {
					if (res.success) {
						const data = res.data;

						// 更新統計卡片
						$('.status-colum').eq(0).find('h2').text(data.order_count);
						$('.status-colum').eq(1).find('h2').text(data.product_count);
						$('.status-colum').eq(2).find('h2').text(data.contact_count);
						$('.status-colum').eq(3).find('h2').text(data.view_count);

						// 更新最新訂單表格
						if (data.latest_orders && data.latest_orders.length > 0) {
							let orderHtml = '';
							data.latest_orders.forEach(function (order) {
								let statusClass = 'badge-secondary';
								let statusText = order.status;

								switch (order.status) {
									case 'pending':
										statusClass = 'badge-warning';
										statusText = '待處理';
										break;
									case 'processing':
										statusClass = 'badge-info';
										statusText = '處理中';
										break;
									case 'shipping':
										statusClass = 'badge-primary';
										statusText = '配送中';
										break;
									case 'completed':
										statusClass = 'badge-success';
										statusText = '已完成';
										break;
									case 'cancelled':
										statusClass = 'badge-danger';
										statusText = '已取消';
										break;
								}

								orderHtml += `
									<tr>
										<td>${order.order_no}</td>
										<td>${order.created_at.substr(0, 10)}</td>
										<td><span class="badge ${statusClass}">${statusText}</span></td>
										<td>$${order.total}</td>
										<td>
											<a href="/admin/orders/${order.id}" class="btn btn-primary btn-xs">查看</a>
										</td>
									</tr>
								`;
							});
							$('.card-box:contains("最新訂單") tbody').html(orderHtml);
						}

						// 更新庫存近況表格
						if (data.low_stock_products && data.low_stock_products.length > 0) {
							let stockHtml = '';
							data.low_stock_products.forEach(function (product) {
								stockHtml += `
									<tr>
										<td>${product.name}</td>
										<td><span class="badge badge-danger">${product.stock} ${product.unit}</span></td>
										<td>
											<a href="/admin/products/${product.id}" class="btn btn-warning btn-xs">補貨</a>
										</td>
									</tr>
								`;
							});
							$('.card-box:contains("庫存近況") tbody').html(stockHtml);
						} else {
							$('.card-box:contains("庫存近況") tbody').html('<tr><td colspan="3" class="text-center">庫存充足</td></tr>');
						}
					}
				},
				error: function (xhr, status, error) {
					console.error('載入儀表板數據失敗:', error);
				}
			});
		};

		// 載入訂單統計圖表
		this.loadOrderChart = function () {
			$.ajax({
				url: $.ApiBase + '/dashboard/order-chart',
				method: 'GET',
				beforeSend: function () {
					$.Page.wrapper.find('.order-report-overlay').show();
				},
				success: function (res) {
					if (res.success && res.data) {
						Morris.Bar({
							element: 'morris-bar',
							data: res.data,
							xkey: 'month',
							ykeys: ['count'],
							labels: ['訂單數'],
							barColors: ['#5578eb'],
							hideHover: 'auto',
							hoverCallback: function (index, options, content, row) {
								return `<div>${row.month}</div><div><strong>${row.count} 筆</strong></div>`;
							},
							gridTextColor: '#444',
							barSizeRatio: .3,
							resize: true
						});
					}
				},
				complete: function () {
					$.Page.wrapper.find('.order-report-overlay').hide();
				},
				error: function (xhr, status, error) {
					console.error('載入訂單圖表失敗:', error);
					$.Page.wrapper.find('.order-report-overlay').hide();
				}
			});
		};

		// 載入瀏覽統計圖表
		this.loadViewChart = function () {
			$.ajax({
				url: $.ApiBase + '/dashboard/view-chart',
				method: 'GET',
				beforeSend: function () {
					$.Page.wrapper.find('.view-report-overlay').show();
				},
				success: function (res) {
					if (res.success && res.data) {
						Morris.Line({
							element: 'morris-line',
							data: res.data,
							xkey: 'month',
							ykeys: ['count'],
							labels: ['瀏覽次數'],
							lineColors: ['#2dce89'],
							pointSize: 3,
							pointFillColors: ['#fff'],
							pointStrokeColors: ['#2dce89'],
							hideHover: 'auto',
							hoverCallback: function (index, options, content, row) {
								return `<div>${row.month}</div><div><strong>${row.count} 次</strong></div>`;
							},
							parseTime: false,
							gridTextColor: '#444',
							fillOpacity: .2,
							resize: true,
							smooth: true
						});
					}
				},
				complete: function () {
					$.Page.wrapper.find('.view-report-overlay').hide();
				},
				error: function (xhr, status, error) {
					console.error('載入瀏覽圖表失敗:', error);
					$.Page.wrapper.find('.view-report-overlay').hide();
				}
			});
		};
	};

	$.Index = new Index;
}(window.jQuery),
function () {
	// DOM載入完成後執行
	$(document).ready(function () {
		$.Index.init();
	});
}();
