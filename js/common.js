//声明一些初始数据
var  host = location.host, pathname = location.pathname, search = location.search, ids = "", aid = "", sid = "", mid = "", rp0 = "", rp1 = "", backData = '';

//声明是否主站以及本站域名名字、主站域名名字、副站域名名字
var isms = 1, hostname = 'uwuxiu', mshostname = 'uwuxiu', wxhostname = 'uwuxiu', sitename = '尤物秀';

//取得基础信息
var targetMeta = document.getElementById('initdata');
if (targetMeta) {
    var baseData = JSON.parse(targetMeta.getAttribute('content'));
    targetMeta.parentNode.removeChild(targetMeta);
    if (window.innerWidth > 768 && ids && baseData.ispass == -1 && location.href.indexOf('edit') == -1) {
        window.location.href = '/404.html';
    }
} else {
    baseData = {isdv: 0};
}

function slideNavAutoPosition(wrapperClass) {
    var wrapper = document.querySelector(wrapperClass);
    if (!wrapper) {
        return;
    }
    var maxWidth = wrapper.offsetWidth;
    var target = wrapper.getElementsByClassName("active")[0];
    var fullWidth = computeFullWidth();
    if (target && fullWidth > maxWidth) {
        var targetOffsetLeft = target.offsetLeft;
        var targetOffsetRight = fullWidth - target.offsetLeft - target.offsetWidth;
        var winMiddleLine = maxWidth / 2;
        if (targetOffsetRight < winMiddleLine) {
            wrapper.style.transform = "translate3d(" + -(fullWidth - maxWidth) + "px,0px,0px)";
        } else {
            if (targetOffsetLeft >= winMiddleLine) {
                var targetWidth = target.offsetWidth;
                var targetMiddleLine = targetOffsetLeft + targetWidth / 2;
                var leftMoveDistance = targetMiddleLine - winMiddleLine;
                wrapper.style.transform = "translate3d(" + -leftMoveDistance + "px,0px,0px)";
            } else {
                wrapper.style.transform = "translate3d(0px,0px,0px)";
            }
        }
    }
    function computeFullWidth() {
        var sum = 0;
        var itemArr = wrapper.getElementsByClassName("swiper-slide");
        for (var i = 0; i < itemArr.length; i++) {
            sum += itemArr[i].offsetWidth;
        }
        return sum;
    }
}
if(typeof vid!=="undefined"){setCookie("vid", vid);}
var token = getCookie("uwx_token");
if(isEmpty(token)){
	$("#header_login").css('display','none');
	$("#header_Notlogin").css('display','block');
}else{	
	$("#header_login").css('display','block'); 
	$("#header_Notlogin").css('display','none'); 
}
//2021
var gwc = {
    locationHref: window.location.href,
    docScrollTop: $(document).scrollTop(),
    oldScrollTop: 0,
    isRefresh: true,
    docHeight: $(document).height(),
    winHeight: $(window).height(),
    winWidth: $(window).width(),
    body: $('body'),
    header: $('.header-common'),
    backTop: $('#back-top'),
    floatBox: $('.float-box'),
    preloader: '<div class="preloader" style="text-align: center;"><img src="/tpl/img/preloader.gif"></div>',
    //api_ms: 'http://www.' + mshostname + '.com/common/api.php',
    api_local: '/ajax.php',
    articleImgOkCount: 0,
    lazyLoadImg: $('.lazy-load-img'),
    mainConAll: $('.main-con.show-all'),
    isRsDetails: $('.rs').length > 0,
    appendModule: function (name) {//插入模块函数
        if ($('#' + name).length === 0) {
            this.body.append('<script type="text/javascript" id="' + name + '" src="/js/module/' + name + '.js"></script>');
        }
    },
    appendPlugin: function (name) {//插入插件函数
        if ($('#' + name).length === 0) {
            this.body.append('<script type="text/javascript" id="' + name + '" src="/tpl/plugin/' + name + '/js/' + name + '.js"></script>');
        }
    },
    modalShow: function (modalContent, modalId) {//模态框显示函数
        if ($('#' + modalId + 'Modal').length === 0) {
            modalContent = modalContent ? modalContent : '';
            this.body.append('<div id="' + modalId + 'Modal" class="gw-modal"><div class="modal-bg"></div><div class="modal-con"><a href="javascript:;" class="close-modal-btn">✕</a>' + modalContent + '</div></div>');
            $('.modal-bg,.close-modal-btn').click(function () {
                gwc.modalHide();
            });
        }
        $('#' + modalId + 'Modal').fadeIn(500).find('.modal-con').addClass('in');
    },
    modalHide: function () {//模态框隐藏函数
        $('.gw-modal').fadeOut(500).find('.modal-con').removeClass('in');
    },
    getDocScrollTop: function () {//获取页面滚动高度
        return $(document).scrollTop();
    },
    checkPage: function (arg) {//检查当前页函数
        return $(arg).length > 0 && true;
    },
    timePack: function (date) {//时间转换为时间戳函数
        date = date.substring(0, 19);
        date = date.replace(/-/g, '/');
        return new Date(date).getTime() / 1000;
    },
    timeTransform: function (time, len) {//时间戳转换为日期函数
        var date = new Date(parseInt(time) * 1000);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + '';
        var s = date.getSeconds() + '';
        M.length <= 2 && (M = '0' + M);
        D.length <= 2 && (D = '0' + D);
        h.length <= 2 && (h = '0' + h);
        m.length <= 1 && (m = '0' + m);
        s.length <= 1 ? (s = ':0' + s) : (s = ':' + s);
        if (len === 3) {
            return Y + M + D;
        } else if (len === 5) {
            return Y + M + D + h + m;
        } else if (len === 2) {
            return Y.slice(2, 5) + M + D;
        } else {
            return Y + M + D + h + m + s;
        }
    },
    computeRandomNumber: function (max, min) {//计算随机数函数
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    showPrompt: function (msg) {
        if ($('#prompt-box').length === 0) {
            var promptBox = '' +
                '<div id="prompt-box">' +
                '<style type="text/css">.prompt-tips { font-size: 14px; min-width: 100px; white-space: nowrap; padding: 0 15px; min-height: 40px; line-height: 40px; text-align: center; background: #c54242; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 5px; color: #fff; box-shadow: 0 0 3px 1px #c54242; z-index: 2147483647; display: none;}</style>' +
                '<div class="prompt-tips" id="prompt-tips">' + msg + '</div>' +
                '</div>';
            this.body.append(promptBox);
            var promptTips = $('#prompt-tips');
            promptTips.fadeIn(500);
            setTimeout(function () {
                promptTips.fadeOut(500);
                setTimeout(function () {
                    $('#prompt-box').remove();
                }, 500);
            }, 1500);
        }
    }
    
   
};
/*==================公共事件 start=====================*/

//页面滚动事件
var u = window.navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var cfrlEle = $('.classification-retrieval');
$(window).scroll(function () {
    if (gwc.winWidth <= 768) {
        slideNavAutoPosition('.nav-list');
        if (cfrlEle.length) {
            slideNavAutoPosition(".channel-nav .swiper-wrapper");
            slideNavAutoPosition('.area-wrap .swiper-wrapper');
            slideNavAutoPosition('.year-wrap .swiper-wrapper');
            slideNavAutoPosition('.motif-wrap .swiper-wrapper');
        }
    }
    gwc.docScrollTop = gwc.getDocScrollTop();
    if (gwc.docScrollTop - gwc.oldScrollTop > 0 && !gwc.isRefresh) { //页面上滚
        if ((isiOS && gwc.docScrollTop >= 100) || !isiOS) {
            gwc.header.addClass('showOnTop');
            gwc.winWidth < 768 && gwc.floatBox.addClass('hideInBottom').removeClass('hideOnTop');
        }
        gwc.oldScrollTop = gwc.docScrollTop;
        gwc.isRefresh = false;
    } else {//页面下滚
        if (gwc.docScrollTop <= 0) {//如果页面到顶
            gwc.header.removeClass('showOnTop');
            //gwc.winWidth < 768 && gwc.floatBox.addClass('hideOnTop');

        } else {
            if (gwc.isRefresh) {//页面刷新，导航条隐藏到顶部
                gwc.header.addClass('showOnTop');
            } else {
                gwc.winWidth < 768 && gwc.floatBox.removeClass('hideInBottom');
                gwc.header.removeClass('showOnTop');
            }
        }

        gwc.isRefresh = false;
        gwc.oldScrollTop = gwc.docScrollTop;
    }

    lazyLoad(gwc.lazyLoadImg);//调用图片懒加载函数
});

//点击返回顶部
gwc.backTop.click(function () {
    var distance = gwc.winWidth > 768 ? 666 : 0;
    $('html,body').animate({scrollTop: 0}, distance);
});

//点击登陆注册按钮
$('body').delegate('.log-btn, .reg-btn', 'click', function () {
    if ($('#logRegModule').length === 0) {
        gwc.appendModule('logRegModule');
    } else {
        gwc.modalShow('', 'logRegModule');
    }
    logRegModule.logRegIn($(this).attr('data-order'));
});

//图片懒加载函数
function lazyLoad(lazyLoadImg) {
    lazyLoadImg = lazyLoadImg ? lazyLoadImg : gwc.lazyLoadImg;
    lazyLoadImg.each(function () {
        if (!$(this).hasClass('show')) {
            var curOffsetTop = $(this).offset().top;
            if (gwc.docScrollTop >= curOffsetTop - gwc.winHeight) {
                $(this).addClass('show').attr('src', computeSrc($(this)));
            }
        }
    });
}
lazyLoad(gwc.lazyLoadImg);//页面加载执行一次懒加载函数

function computeSrc(_this) {
    if (_this.hasClass('gif')) {
        return _this.attr('_src').replace(/.gif/, '.jpg');
    } else {
        return _this.attr('_src');
    }
}

//点击搜索按钮
$('.search-wrap .sbt').click(function () {
    var k = $(this).parent().find('.keywords');
    searchCtrl(k);
});
//点击搜索栏的关闭按钮
$('.search-wrap .close').click(function () {
    $('.search-wrap .drop-box').removeAttr('style');
});
//敲回车搜索
$('.search-wrap .keywords').keydown(function (e) {
    e = window.event || arguments[0];
    var code = e.keyCode;//按键编码
    if (code == 13) {
        searchCtrl($(this));
    }
});
function searchCtrl(k) {
    if (k.val() == '') {
        gwc.showPrompt('请输入关键词');
    } else {
        location.href = '/s/' + $.trim(k.val());
    }
}

//判断屏幕小于768的移动端移除a链接的新窗口打开
if (gwc.winWidth <= 768) {
    $('a').removeAttr('target');
}
//点击顶部移动端导航按钮
$('.wap-nav .iconfont').click(function () {
    $('.wap-nav-drop-box').width(gwc.winWidth).toggle();
});

/*==========================================================公共事件 end==================================================================*/
// 获取指定名称的cookie
	function getCookie(name) {
		var prefix = name + "="
		var start = document.cookie.indexOf(prefix)
	 
		if (start == -1) {
			return null;
		}
	 
		var end = document.cookie.indexOf(";", start + prefix.length)
		if (end == -1) {
			end = document.cookie.length;
		}
	 
		var value = document.cookie.substring(start + prefix.length, end)
		return unescape(value);
	}


//创建cookie
    function setCookie(name, value) {
        var exp = new Date();
        //exp.setTime(exp.getTime() + 3 * 24 * 60 * 60 * 1000); //3天过期
        document.cookie = name + "=" + encodeURIComponent(value) +";path=/";
        return true;
    };	
//
function isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj == ""){
        return true;
    }else{
        return false;
    }
}
/*==========================================================各页面事件 start===============================================================*/

	//返回顶部
// browser window scroll (in pixels) after which the "back to top" link is shown
	var offset = 300,
		//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
		offset_opacity = 1200,
		//duration of the top scrolling animation (in ms)
		scroll_top_duration = 700,
		//grab the "back to top" link
		$back_to_top = $('.cd-top');

	//hide or show the "back to top" link
	$(window).scroll(function(){
		( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
		if( $(this).scrollTop() > offset_opacity ) { 
			$back_to_top.addClass('cd-fade-out');
		}
	});
	//smooth scroll to top
	$back_to_top.on('click', function(event){
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0 ,
		 	}, scroll_top_duration
		);
	});
