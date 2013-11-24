/**
 * 一个可以监控网页是否被操作的jQuery插件，如果用户长时间没有操作网页，网页会做出相应提示。
 * 
 * @author August Dong <august_dong@yahoo.com>
 * @date 2013.11.24
 *
 * @example
 * $.jqPageMonitor({
 *     duration: 15 * 1000, //设置15s没有操作网页，则执行回调函数
 *	   step: 2000	//检查间隔，建议不要设置过小
 * }, function() {
 *	   alert('亲，您已经15秒没有操作过该网页了！');
 * }).start();
 *
 * @requires jQuery
 *
 */
;(function($) {

	var curTime = 0,

		timeout = null,

		isPause = false,

		//默认配置
		opt = {
			duration: 10000, //持续时间，默认1000ms
			step: 1000 //定时器时间，默认50ms
		},

		onActive = function() {
			curTime = 0;
		},

		initEvent = function() {
			$(window).bind('mousemove', onActive);
			$(window).bind('mousedown', onActive);
			$(window).bind('keydown', onActive);
			$(window).bind('resize', onActive);
			$(window).bind('scroll', onActive);

		},

		stop = function() {
			pause();
			curTime = 0;
		},

		start = function() {
			stop();
			reStart();
		},

		pause = function() {
			isPause = true;
			clearTimeout(timeout);
		},

		reStart = function() {
			isPause = false;
			timeout = setTimeout(function() {
				if (isPause)
					return;
				if (curTime >= opt.duration) {
					stop();
					opt.callback && opt.callback();
					return;
				}
				curTime += opt.step;
				setTimeout(arguments.callee, opt.step);
			});
		},

		monitor = function() {
			if (arguments[0]) {
				for(key in arguments[0]) {
					opt[key] = arguments[0][key];
				}
			};
			opt.callback = arguments[arguments.length - 1];
			initEvent();
			return monitor;
		};

	//expose
	monitor.start = start;

	$.extend({
		jqPageMonitor: monitor
	});

})(jQuery);