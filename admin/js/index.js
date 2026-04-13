'use strict';
! function ($) {
	$.Url = $.App.browser.baseURL('admin/index');

	$.Page = {
		wrapper: $('.index')
	};

	$.Module = {};
}(window.jQuery),
	function ($) {
		const Index = function () {
			this.init = function () {
				$.ajax({
					url: $.Url + '/order-report',
					method: 'get',
					beforeSend: function () {
						$.Page.wrapper.find('.order-report-overlay').show();
					},
					success: function (res) {
						Morris.Bar({
							element: 'morris-bar',
							data: res.data,
							xkey: 'label',
							ykeys: res.value,
							labels: res.text,
							barColors: res.color,
							hideHover: 'auto',
							hoverCallback: function (index, options, content, row) {
								return `<div>${row.label}</div><div>
									<strong>${row.value} 筆</strong></div>`;
							},
							gridTextColor: '#444',
							barSizeRatio: .2,
							resize: true
						});
					},
					complete: function (res) {
						$.Page.wrapper.find('.order-report-overlay').hide();
					}
				});

				$.ajax({
					url: $.Url + '/view-report',
					method: 'get',
					beforeSend: function () {
						$.Page.wrapper.find('.view-report-overlay').show();
					},
					success: function (res) {
						Morris.Line({
							element: 'morris-line',
							data: res.data,
							xkey: 'label',
							ykeys: res.value,
							labels: res.text,
							lineColors: res.color,
							pointSize: 0,
							pointFillColors: ['#eee'],
							pointStrokeColors: ['#999'],
							hideHover: 'auto',
							hoverCallback: function (index, options, content, row) {
								return `<div>${row.label}</div>
									<div><strong>${options.labels[0]} ${row.recipes} 次</strong></div>
									<div><strong>${options.labels[1]} ${row.healthies} 次</strong></div>
									<div><strong>${options.labels[2]} ${row.product} 次</strong></div>`;
							},
							parseTime: false,
							gridTextColor: '#444',
							fillOpacity: .9,
							resize: true
						});
					},
					complete: function (res) {
						$.Page.wrapper.find('.view-report-overlay').hide();
					}
				});
			};
		};

		$.Index = new Index;
	}(window.jQuery),
	function () {
		$.Index.init();
	}();
