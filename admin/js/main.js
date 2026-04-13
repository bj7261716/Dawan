$(document).on('dblclick', '.edit-field', function (e) {
	let span = $(this);

	if (span.val().length > 0) {
		return;
	}

	const dataId = $(this).data('id');
	const field = $(this).data('field');
	const spanText = span.text();
	let ipt;

	const fieldArr = ['sort', 'name', 'title', 'article_number', 'price', 'special_price', 'stock'];
	const intArr = ['sort', 'price', 'special_price', 'stock'];

	if (!fieldArr.includes(field)) {
		return;
	}

	span.empty();

	if (intArr.includes(field)) {
		ipt = $("<input type='number' min='0'  max='99999'>");
	} else {
		ipt = $("<input type='text' maxlength='500'>");
	}

	ipt.val(spanText);
	span.text(spanText);

	if (['price', 'special_price', 'stock'].includes(field)) {
		ipt.width(80);
	} else {
		ipt.width(span.width());
	}

	ipt.height(30);
	span.append(ipt);
	ipt.trigger('select');

	ipt.keydown(function (e) {
		if (e.keyCode === 13) {
			if (!ipt.val().length) {
				alert('不可空值');

				return;
			}

			$.Common.ajax($.Url + '/edit-data', {
				id: dataId,
				field: field,
				value: ipt.val()
			}, function (output) {
				var notyf = new Notyf();

				notyf.success({
					message: '更新成功',
					position: {
						x: 'center',
					},
				});

				if (output.success === 2) {
					span.text(output.field);

					return;
				}

				span.text(ipt.val());
			});
		}
	});
});

$(document).on('click', '#dn', function () {
	$.Common.ajax($.App.browser.baseURL('admin/index/fix-change'), {
		checked: $(this).is(':checked')
	}, function (output) {
		$.Common.notyf('success', $.App.errSec, '更新成功');
	});
});
