'use strict';
! function ($) {
	let edge = 'Microsoft Edge',
		ie10 = 'Internet Explorer 10',
		ie11 = 'Internet Explorer 11',
		opera = 'Opera',
		firefox = 'Mozilla Firefox',
		chrome = 'Google Chrome',
		safari = 'Safari';

	$.App = {
		alertSec: 2000,
		warnSec: 4000,
		errSec: 5000,
		errMsg: '請檢查網路連接，如仍提示此信息，請通知系統管理員。',
		token: $('meta[name="csrf-token"]').attr('content'),
		options: {
			leftSideBar: {
				scrollColor: 'rgba(0,0,0,0.5)',
				scrollWidth: '4px',
				scrollAlwaysVisible: !1,
				scrollBorderRadius: '0',
				scrollRailBorderRadius: '0'
			},
			dropdownMenu: {
				effectIn: 'fadeIn',
				effectOut: 'fadeOut'
			}
		},
		leftSideBar: {
			activate: function () {
				let a = this,
					b = $('body'),
					c = $('.overlay');
				$(window).on('click', function (d) {
					let e = $(d.target);
					'i' === d.target.nodeName.toLowerCase() && (e = $(d.target).parent()), !e.hasClass('bars') && a.isOpen() && 0 === e.parents('#leftsidebar').length && (e.hasClass('js-right-sidebar') || c.fadeOut(), b.removeClass('overlay-open'))
				}), $.each($('.menu-toggle.toggled'), function (a, b) {
					$(b).next().slideToggle(0)
				}), $.each($('.menu .list li.active'), function (a, b) {
					let c = $(b).find('a:eq(0)');
					c.addClass('toggled'), c.next().show()
				}), $('.menu-toggle').on('click', function (a) {
					let b = $(this),
						c = b.next();
					if ($(b.parents('ul')[0]).hasClass('list')) {
						let d = $(a.target).hasClass('menu-toggle') ? a.target : $(a.target).parents('.menu-toggle');
						$.each($('.menu-toggle.toggled').not(d).next(), function (a, b) {
							$(b).is(':visible') && ($(b).prev().toggleClass('toggled'), $(b).slideUp())
						})
					}
					b.toggleClass('toggled'), c.slideToggle(320)
				}), a.checkStatuForResize(!0), $(window).resize(function () {
					a.checkStatuForResize(!1)
				}), Waves.attach('.menu .list a', ['waves-block waves-classic waves-ripple']), Waves.init()
			},
			checkStatuForResize: (a) => {
				let b = $('body'),
					c = $('.navbar .navbar-header .bars'),
					d = b.width();

				a && b.find('.content, .sidebar').addClass('no-animate').delay(1e3).queue(() => {
					$(this).removeClass('no-animate').dequeue();
				}), d < 1170 ? (b.addClass('ls-closed'), c.fadeIn()) : (b.removeClass('ls-closed'), c.fadeOut());
			},
			isOpen: () => $('body').hasClass('overlay-open'),
		},
		navbar: {
			activate: function () {
				let a = $('body'),
					b = $('.overlay');

				if (a.hasClass('index2')) {
					$('.menu > ul > li:has( > ul)').addClass('menu-dropdown-icon');
					$('.menu > ul > li > ul:not(:has(ul))').addClass('normal-sub');
					$('.menu > ul > li').hover((e) => {
						if ($(window).width() > 943) {
							$(this).children('ul').stop(true, false).fadeToggle(0);
							e.preventDefault();
						}
					});

					$('.menu > ul > li').click(() => {
						if ($(window).width() <= 943) {
							$(this).children('ul').fadeToggle(0);
						}
					});

					$('.h-bars').click((e) => {
						$('.menu > ul').toggleClass('show-on-mobile');
						e.preventDefault();
					});
				}

				let scrollTop = $('#back-top');

				if (scrollTop.length > 0) {
					$(window).on('scroll', () => {
						if ($(this).scrollTop() > 350) {
							scrollTop.fadeIn();
						} else {
							scrollTop.fadeOut(200);
						}
					});

					scrollTop.find('>a').on('click', () => {
						$('body, html').animate({
							scrollTop: 0
						}, 350);

						return false;
					});
				}

				$('.bars').on('click', () => {
					a.toggleClass('overlay-open'), a.hasClass('overlay-open') ? b.fadeIn() : b.fadeOut();
				}), $('.nav [data-close="true"]').on('click', () => {
					let a = $('.navbar-toggle').is(':visible'),
						b = $('.navbar-collapse');

					a && b.slideUp(() => {
						b.removeClass('in').removeAttr('style');
					})
				});
			}
		},
		browser: {
			activate: function () {
				let a = this;

				'' !== a.getClassName() && $('html').addClass(a.getClassName());
			},
			getBrowser: function () {
				let a = navigator.userAgent.toLowerCase();

				return /edge/i.test(a) ? edge : /rv:11/i.test(a) ? ie11 : /msie 10/i.test(a) ? ie10 : /opr/i.test(a) ? opera : /chrome/i.test(a) ? chrome : /firefox/i.test(a) ? firefox : navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) ? safari : void 0;
			},
			getClassName: function () {
				let a = this.getBrowser();

				return a === edge ? 'edge' : a === ie11 ? 'ie11' : a === ie10 ? 'ie10' : a === opera ? 'opera' : a === chrome ? 'chrome' : a === firefox ? 'firefox' : a === safari ? 'safari' : '';
			},
			baseURL: function (path) {
				return window.location.protocol + '//' + window.location.hostname + '/' + ((window.location.host.indexOf('info') >= 0) ? window.location.pathname.split('/')[1] + '/' : '') + (path ? path : '');
			}
		},
		component: {
			activate: () => {
				if ($('.mdatepicker').length > 0) {
					$('.mdatepicker').bootstrapMaterialDatePicker({
						format: 'YYYY-MM-DD',
						weekStart: 1,
						time: false,
						switchOnClick: true
					});
				}

				if ($('.datetimepicker').length > 0) {
					$('.datetimepicker').bootstrapMaterialDatePicker({
						currentDate: new Date(),
						format: 'YYYY-MM-DD HH:mm',
						clearButton: true,
						weekStart: 1
					});
				}

				if ($('.timepicker').length > 0) {
					$('.timepicker').bootstrapMaterialDatePicker({
						format: 'HH:mm',
						clearButton: true,
						date: false
					});
				}

				if ($('.input-select2-multiple').length > 0) {
					$('.input-select2-multiple').select2({
						tags: true,
						closeOnSelect: false,
						createTag: function (params) {
							if (/[;]/.test(params.term)) {
								let str = params.term.trim().replace(/[;]*$/, '');

								return {
									id: str,
									text: str
								}
							}
						}
					});

					$(document).on('keyup', '.select2-selection--multiple .select2-search__field', (event) => {
						if (event.keyCode == 13) {
							let $this = $(event.target);
							let optionText = $this.val();

							if (optionText != "" && $this.find("option[value='" + optionText + "']").length === 0) {
								let $select = $this.parents('.select2-container').prev("select");
								let newOption = new Option(optionText, optionText, true, true);

								$select.append(newOption).trigger('change');
								$this.val('');
							}
						}
					});
				}

				if ($('#form').length > 0) {
					$('#form').validate();
				}
			},
			setSwitchery: (switchElement, checkedBool) => {
				if ((checkedBool && !switchElement.isChecked()) || (!checkedBool && switchElement.isChecked())) {
					switchElement.setPosition(true);
					switchElement.handleOnchange(true);
				}
			}
		},
		bsModalPre: (el, status) => {
			if (status) {
				el.find('.card-box.auth-box').addClass('loading');
			} else if (!status) {
				el.find('.card-box.auth-box').removeClass('loading');
			}
		}
	}, $('.boxs-close').on('click', () => {
		$(this).parents('.card').addClass('closed').fadeOut();
	});

	$(() => {
		$.App.component.activate(), $.App.browser.activate(), $.App.leftSideBar.activate(), $.App.navbar.activate();
	});
}(window.jQuery),
	function ($) {
		const Scrollbar = function () { };
		Scrollbar.prototype.sidebarMenuList = function () {
			$('.sidebar .menu .list').slimscroll({
				height: 'calc(100vh - 60px)',
				color: 'rgba(0,0,0,0.2)',
				position: 'left',
				size: '2px',
				alwaysVisible: !1,
				borderRadius: '3px',
				railBorderRadius: '0'
			});
		},
			Scrollbar.prototype.navbarLeftMenu = function () {
				$('.navbar-left .dropdown-menu .body .menu').slimscroll({
					height: '300px',
					color: 'rgba(0,0,0,0.2)',
					size: '3px',
					alwaysVisible: !1,
					borderRadius: '3px',
					railBorderRadius: '0'
				});
			},
			Scrollbar.prototype.rightSidebar = function () {
				$('.right-sidebar .slim_scroll').slimscroll({
					height: 'calc(100vh - 60px)',
					color: 'rgba(0,0,0,0.4)',
					size: '2px',
					alwaysVisible: !1,
					borderRadius: '3px',
					railBorderRadius: '0'
				});
			},
			Scrollbar.prototype.init = function () {
				this.sidebarMenuList(),
					this.navbarLeftMenu(),
					this.rightSidebar();
			},
			$.Scrollbar = new Scrollbar, $.Scrollbar.Constructor = Scrollbar;
	}(window.jQuery),
	function ($) {
		const Common = function () {
			let notyf = new Notyf({
				types: [{
					type: 'process',
					className: 'process',
					duration: 0,
					icon: {
						className: 'spinner-border',
						tagName: 'div'
					}
				}, {
					type: 'alert',
					className: 'general',
					icon: false
				}]
			});

			this.ajax = (e, t, i, o, l, n, m = 'POST', a = false) => {
				$.ajax({
					url: e,
					method: m,
					dataType: 'JSON',
					timeout: 1e5,
					contentType: a ? false : 'application/x-www-form-urlencoded; charset=UTF-8',
					processData: a ? false : true,
					headers: {
						'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
					},
					data: t,
					beforeSend: o ? (o instanceof Function ? o : () => {
						$.Common.notyf('process', 0, '處理中，請稍後...');
					}) : null,
					success: (e) => {
						i(e);
					},
					statusCode: {
						302: () => {
							window.location.reload();
						}
					},
					error: (xhr) => {
						n ? n(xhr) : null;

						if (xhr.status === 404) {
							$.Common.notyf('error', $.App.errSec, $.App.errMsg);
						} else if (xhr.status === 500) {
							$.Common.notyf('error', $.App.errSec, '系統異常，請聯繫管理員。');
						} else {
							l && l.find('.apply').length > 0 && l.find('.apply').attr('disabled', !1);

							if (xhr.responseJSON.messages) {
								$.Common.notyf('error', $.App.errSec, xhr.responseJSON.messages.error);
							} else {
								$.Common.notyf('error', $.App.errSec, xhr.responseJSON.messages || '操作異常，請稍後再試。');
							}
						}
					}
				});
			};

			this.notyf = (type, timer, text) => {
				if ((type === 'process') || ((notyf.view.notifications.length > 0) &&
					$(notyf.view.notifications[0].node).hasClass('process'))) {
					notyf.dismissAll();
				}

				notyf.open({
					position: {
						x: 'center',
						y: 'bottom'
					},
					type: type,
					duration: timer,
					ripple: false,
					message: text
				});
			};

			this.swal = Swal.mixin({
				showCancelButton: true,
				showCloseButton: true,
				cancelButtonText: '取消',
				confirmButtonText: '確認',
			});
		};

		Common.prototype.bodyInit = function () {
			$('.theme-light-dark .t-light').on('click', () => {
				$('body').removeClass('menu_dark');
			}), $('.theme-light-dark .t-dark').on('click', () => {
				$('body').addClass('menu_dark');
			}), $('.m_img_btn').on('click', () => {
				$('body').toggleClass('menu_img');
			}), $('.ls-toggle-btn').on('click', () => {
				$('body').toggleClass('ls-toggle-menu');
			}), $('.chat-launcher').on('click', () => {
				$('.chat-launcher').toggleClass('active'), $('.chat-wrapper').toggleClass('is-open pullUp');
			}), $('.form-control').on('focus', () => {
				$(this).parent('.input-group').addClass('input-group-focus');
			}).on('blur', () => {
				$(this).parent('.input-group').removeClass('input-group-focus');
			});
		},
			Common.prototype.screenFull = function () {
				if ($('#supported').text('Supported/allowed: ' + !!screenfull.enabled), !screenfull.enabled) return !1;

				$('#request').on('click', () => {
					screenfull.request($('#container')[0]);
				}), $('#exit').on('click', () => {
					screenfull.exit();
				}), $('[data-provide~="boxfull"]').on('click', () => {
					screenfull.toggle($('.box')[0]);
				}), $('[data-provide~="fullscreen"]').on('click', () => {
					screenfull.toggle($('#container')[0]);
				});

				var b = '[data-provide~="boxfull"]',
					b = '[data-provide~="fullscreen"]';
				$(b).each(() => {
					$(this).data('fullscreen-default-html', $(this).html());
				}), document.addEventListener(screenfull.raw.fullscreenchange, () => {
					screenfull.isFullscreen ? $(b).each(() => {
						$(this).addClass('is-fullscreen');
					}) : $(b).each(() => {
						$(this).removeClass('is-fullscreen');
					});
				}), screenfull.on('change', a), a();

				function a() {
					let a = screenfull.element;

					$('#status').text('Is fullscreen: ' + screenfull.isFullscreen), a && $('#element').text('Element: ' + a.localName + (a.id ? '#' + a.id : '')), screenfull.isFullscreen || ($('#external-iframe').remove(), document.body.style.overflow = 'auto');
				}
			},
			Common.prototype.init = function () {
				this.bodyInit(),
					this.screenFull();
			},
			$.Common = new Common, $.Common.Constructor = Common;
	}(window.jQuery),
	function ($) {
		const CommonForm = function () { };
		CommonForm.prototype.general = function () {
			if ($('[data-toggle="tooltip"]').length > 0) {
				$('[data-toggle="tooltip"]').tooltip();
			}

			$.fn.select2.defaults.set('placeholder', '');
			$.fn.select2.defaults.set('width', '100%');
			$.fn.select2.defaults.set('minimumResultsForSearch', -1);

			if ($('select.select2').length > 0) {
				$('select.select2').select2();
			}
		},
			CommonForm.prototype.init = function () {
				this.general();
			},
			$.CommonForm = new CommonForm, $.CommonForm.Constructor = CommonForm;
	}(window.jQuery),
	function ($) {
		$.Scrollbar.init();
		$.Common.init();
		$.CommonForm.init();
	}(window.jQuery);
