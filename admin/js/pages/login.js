'use strict';
! function ($) {
	$.Page = {
		form: $('.authentication form'),
		btnSubmit: $('#form').find('button[type="submit"]')
	};
}(window.jQuery),
function ($) {
	const login = function () {
		let username = $.Page.form.find('input[name="username"]');
		let password = $.Page.form.find('input[name="password"]');

		this.init = function () {
			$.Page.form.validate({
				highlight: function (e) {
					$(e).closest('.input-group').addClass('has-error');
					$.Page.form.find('button[type="submit"]').prop('disabled', true);
				},
				success: function (e) {
					e.closest('.input-group').removeClass('has-error');
					e.remove();
				},
				rules: {
					username: {
						required: true
					},
					password: {
						required: true,
						minlength: 3
					}
				}
			});

			this.event();
		};

		this.event = function () {
			$.Page.form.find('.form-control').on('focus', function (e) {
				$(e.target).parent('.input-group').addClass('input-group-focus');
			}).on('blur', function (e) {
				$(e.target).parent(".input-group").removeClass('input-group-focus');
			});

			username.on('keyup', function () {
				if ($(this).val() !== '' && password.val() !== '' && password.val().length > 2) {
					$.Page.btnSubmit.prop('disabled', false);
				} else {
					$.Page.btnSubmit.prop('disabled', true);
				}
			});

			password.on('keyup', function () {
				if ($(this).val() !== '' && $(this).val().length > 2 && username.val() !== '') {
					$.Page.btnSubmit.prop('disabled', false);
				} else {
					$.Page.btnSubmit.prop('disabled', true);
				}
			});
		};
	};

	$.Page.login = new login;
}(window.jQuery),
function ($) {
	$.Page.login.init();
}(window.jQuery);
