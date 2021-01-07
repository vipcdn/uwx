function iswq() {
    //return true;
    var a = window.navigator.userAgent.toLowerCase();
    if (a.indexOf("micromessenger") > -1 || a.indexOf("qq/") > -1 || a.indexOf("mqqbrowser") > -1) {
        return true;
    } else {
        return false;
    }
}
//声明一些初始数据
var iswq = iswq(), host = location.host, pathname = location.pathname, search = location.search, ids = "", aid = "", sid = "", mid = "", rp0 = "", rp1 = "", backData = '';

//声明是否主站以及本站域名名字、主站域名名字、副站域名名字
var isms = 1, hostname = 'heibaiys', mshostname = 'heibaiys', wxhostname = 'heibaiyy', sitename = '尤物秀';

//浏览器访问控制
if (iswq && !pathname.match(/please/)) {//如果微信QQ平台访问主站
    //if (isms) {//如果访问的主站，跳转到对应的副站url
        //window.location.href = 'http://www.' + wxhostname + '.com' + pathname + search;
        window.location.href = '/please.html';
   //}
} else {//如果其他浏览器访问
    //if (!isms && host.indexOf('dev-') == -1) {//如果访问的副站，跳转到走失页
        //window.location.href = '/lose.html';
        //window.location.href = 'http://www.' + mshostname + '.com' + pathname + search;
    //}
}

//详情页id捕获
if (pathname.indexOf("/details/") > -1) {
    var uri = pathname.split("/details/")[1];
    var idsArr = uri.split("-");
    if (uri.indexOf("-watch-") > -1) {
        if (idsArr.length > 4 && idsArr[4] && !isNaN(idsArr[4])) {
            ids = [idsArr[0],idsArr[1]];
            sid = idsArr[0];
            mid = idsArr[1];
            rp0 = idsArr[3];
            rp1 = idsArr[4];
        } else if (idsArr[3] && !isNaN(idsArr[3])) {
            ids = idsArr[0];
            aid = ids;
            rp0 = idsArr[2];
            rp1 = idsArr[3];
        }
    } else {
        if (idsArr.length > 1 && idsArr[1] && !isNaN(idsArr[1])) {
            ids = [idsArr[0],idsArr[1]];
            sid = idsArr[0];
            mid = idsArr[1];
        } else if (idsArr[0] && !isNaN(idsArr[0])) {
            ids = idsArr[0];
            aid = ids;
        }
    }
}

//console.log(ids,aid,sid,mid,rp0,rp1);

//原生ajax请求
function getAjaxData(attach, fun) {
    if (window.ActiveXObject) {
        var xhr = new ActiveXObject("Microsoft.XMLHTTP")
    } else if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    xhr.open("post", "/common/api_getNewHost.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("order=getNewHost&aid=" + aid + "&sid=" + sid + "&mid=" + mid + attach);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            backData = JSON.parse(xhr.responseText);
            fun && fun(backData);
        }
    }
}

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
            sum += itemArr[i].offsetWidth
        }
        return sum
    }
}


	  
	  
//2017
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
    api_ms: 'http://www.' + mshostname + '.com/common/api.php',
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
    },
    imgUpload: function (_this, fun) {//图片上传函数
        if (typeof FileReader === 'undefined') { // 检查浏览器是否支持H5的FileReader
            alert('抱歉，你的浏览器不支持 FileReader');
            return
        }
        var fileimg = _this[0].files[0]; // 获取要上传的图片对象
        if (fileimg.type !== 'image/png' && fileimg.type !== 'image/jpg' && fileimg.type !== 'image/jpeg' && fileimg.type !== 'image/gif') {
            alert('只允许上传png/jpg/jpeg/gif格式的图片！');
            return;
        } else if (fileimg.size > 5000000) {
            alert('图片大小不能超过' + 5000000 / 1000 + 'kb！');
            return;
        }
        var reader = new FileReader(); // H5 FileReader API处理图片上传
        reader.readAsDataURL(fileimg); // 图片转成base64格式
        reader.onload = function (e) {
            var newImg = _this.parent().parent().find('img');
            newImg.attr('src', e.target.result);
            var bigImgData = e.target.result;
            newImg[0].onload = function () {
                var imgUpCanvas = document.createElement('canvas');
                imgUpCanvas.setAttribute('id', 'imgUpCanvas');
                imgUpCanvas.setAttribute('style', 'display:none');
                var transHeight = 250 / (this.naturalWidth / this.naturalHeight);
                imgUpCanvas.width = 250;
                imgUpCanvas.height = transHeight;
                $('#imgUpCanvas').length > 0 && $('#imgUpCanvas').remove();
                $('body').append(imgUpCanvas);
                var canvas = document.getElementById('imgUpCanvas');
                var context = canvas.getContext('2d');
                context.drawImage(this, 0, 0, 250, transHeight);
                var smallImgData = this.naturalWidth < 250 ? bigImgData : canvas.toDataURL('image/jpeg', 0.8);
                var obj = {bigImgData: bigImgData, smallImgData: smallImgData};
                fun && fun(obj);
            };
        }
    },
    browseRecordDataStorage: function () {//浏览记录数据存储函数
        var playBtn = $('.play-btn.active');
        if (playBtn.length == 0) {
            return;
        }
        var dataId = playBtn.attr('data-id');
        if (dataId.indexOf('-') > -1) {
            var id = '';
            dataId = dataId.split('-');
            var siteid = dataId[0];
            var movieid = dataId[1];
        } else {
            id = dataId;
            siteid = '';
            movieid = '';
        }
        var time = new Date() / 1000;
        var name = $('.movie-txt .subject a').text();
        var href = playBtn.attr('href');
        var dataRp0 = playBtn.attr('data-rp0');
        var dataRp1 = playBtn.attr('data-rp1');
        var title = playBtn.text();
        var data = {id: id, siteid: siteid, movieid: movieid, time: time, name: name, href: href, rp0: dataRp0, rp1: dataRp1, title: title};
        if (localStorage.browseRecord) {
            var arr = JSON.parse(localStorage.browseRecord);
            for (var i = 0; i < arr.length; i++) {//数组去重
                if (arr[i].id == id && arr[i].siteid == siteid && arr[i].movieid == movieid && arr[i].rp0 == dataRp0 && arr[i].rp1 == dataRp1) {
                    arr.splice(i, 1);
                }
            }
            arr.unshift(data);//从数组开头存入数据
            arr.length > 20 && arr.splice(arr.length - 1, arr.length);//如果存储数据超过一定条数则删除最后一条
            localStorage.browseRecord = JSON.stringify(arr);
        } else {
            localStorage.browseRecord = JSON.stringify([data]);
        }
    },
    checkIsHasUrl: function (txt) {
        var reg = /[^\s]+\.[A-Za-z]+/;
        if (reg.test(txt)) {
            return true;
        }
        else {
            return false;
        }
    },
    updateUserLoginState: function (backData) {
        $('.vip-wrap').html('<a href="/user/' + backData.uid + '" data-id="' + backData.uid + '" class="nickname" id="nickname" target="_blank" title="' + backData.nickname + '"><img src="' + backData.avatar + '"></a>');
        if (backData.uid) {
            $('.visits').show();
        }
    }
};
/*==================公共事件 start=====================*/
//防止网站被框
if (window != top) {
    top.location.href = window.location.href;
}
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

//点击列表页顶部的发布和详情页内容右下方的评论按钮，页面滚动到评论框处
$('.put-btn,.comment-btn').click(function () {
    var distance = gwc.winWidth > 768 ? 666 : 0;
    var postPostOffsetTop = $('.post-post').offset().top;
    $('html,body').animate({scrollTop: postPostOffsetTop}, distance);
});

//点击最热按钮
$('.hot-btn').click(function () {
    var distance = gwc.winWidth > 768 ? 666 : 0;
    var top = $('.hot-wrap').offset().top;
    $('html,body').animate({scrollTop: top}, distance);
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

//点赞
$('body').delegate('#fabulous', 'click', function () {	
	//var text = '点赞中...';
    //$(this).addClass('disabled').find('em').text(text);
	var num = $(this).find('em').text();
   //var num = $(this).attr('data-num');	
    var _this = $(this);
    var id = $(this).attr('data-id'),
        table = $(this).attr('class').split(' ')[1].split('-')[0];
    
    $.ajax({
        url: gwc.api_local,
        type: 'post',
        dataType: 'json',
        data: {act: 'giveFabulous', id: id, num: num},
        success: function (msg) {
            //console.log(msg);
           //_this.removeClass('disabled');
            if (msg.state === -1) {//取消点赞
                gwc.showPrompt('<i class="fa fa-hand-grab-o"></i> 已取消点赞！');
                var txt = msg.num == 0 ? '赞一个' : '<b>' + msg.num + '</b> 赞';
                $('.' + table + '-fabulous-' + id).removeClass('red').find('em').html(txt).prev().addClass('has');
            } else if (msg.state === 1) {//点赞
				
                gwc.showPrompt('<i class="fa fa-heartbeat"></i> 点赞成功！');
                $('.' + table + '-fabulous-' + id).addClass('red').find('em').html('<b>' + msg.num + '</b>已赞').prev().addClass('has');
            } else {
                gwc.showPrompt(msg.tips);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
});


//收藏
$('body').delegate('#collect', 'click', function () {
    var _this = $(this);
    var id = $(this).attr('data-id'),
        table = $(this).attr('class').split(' ')[1].split('-')[0];
    //console.log(id,table);
    $.ajax({
        url: gwc.api_local,
        type: 'post',
        dataType: 'json',
        data: {act: 'giveCollect', id: id, table: table},
        success: function (msg) {
            //console.log(msg);
            //_this.removeClass('disabled');
            if (msg.state === -2) {//如果未登录
                $('.log-btn').trigger('click');
            } else if (msg.state === -1) {//取消收藏
                gwc.showPrompt('<i class="fa fa-slideshare"></i> 已取消收藏！');
                var txt = msg.num == 0 ? '收藏' : '<b>' + msg.num + '</b>收藏';
				 $('.' + table + '-collect-' + id).addClass('red').find('em').html('<b>'  + '</b>收藏');
                //$('.' + table + '-collect-' + id).removeClass('red').find('.fa').addClass('has').next().html(txt);
                
            } else if (msg.state === 1) {//收藏			
                gwc.showPrompt('<i class="fa fa-heartbeat"></i> 收藏成功！');               
				 $('.' + table + '-collect-' + id).addClass('red').find('em').html('<b>'  + '</b>已收藏').prev().addClass('has');
                
            }else{
				gwc.showPrompt(msg.tips);    
			}
        },
        error: function (err) {
            //console.log(err);
        }
    });
});
//下载
$('body').delegate('#download', 'click', function () {
    var _this = $(this);
    var id = $(this).attr('data-id'),
        table = $(this).attr('class').split(' ')[1].split('-')[0];
    //console.log(id,table);
    $.ajax({
        url: gwc.api_local,
        type: 'post',
        dataType: 'json',
        data: {act: 'download', id: id, table: table},
        success: function (msg) {
            if (msg.state === -2) {//如果未登录
                $('.log-btn').trigger('click');
			}else{			 
			 location.href = msg.url;			 
			 //window.open(msg.url);
			 //window.location.reload();
			}
        },
        error: function (err) {
           // console.log(err);
        }
    });
});
//列表和详情页发布评论
$('body').delegate('.reply-sbt', 'click', function () {
    var _this = $(this),
        commentList = $(this).parents('.comment-list'),
        aid = commentList.find('.post_id').val(),
        rerepostid = $(this).hasClass('reply-post') ? '' : commentList.find('.repost_id').val(),
        content = $(this).parent().prev().find('.reply-ipt').val();

    if (gwc.checkIsHasUrl(content)) {
        gwc.showPrompt('请勿发表带网址的内容');
        return;
    } else {
        console.log('ok');
    }
    //return;
    _this.attr('disabled', 'disabled').attr('data-txt', _this.val()).val('提交中...');
    $.ajax({
        url: gwc.api_local,
        type: 'post',
        dataType: 'json',
        data: {order: 'putComment', aid: aid, rerepostid: rerepostid, content: content},
        success: function (msg) {
            console.log(msg);
            if (msg.state === 0) {
                gwc.showPrompt(msg.tips);
                _this.removeAttr('disabled').val(_this.attr('data-txt'));
            } else if (msg.state === 1) {
                gwc.showPrompt(msg.tips);
                setTimeout(function () {
                    _this.removeAttr('disabled').val(_this.attr('data-txt'));
                    history.go(0);
                }, 1500);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });

});


//点击回复按钮
$('body').delegate('.reply-btn', 'click', function () {
    $(this).parents('.comment-list').find('.repost_id').val($(this).attr('data-id'));
    if ($(this).attr('data-aid')) {
        $(this).parents('.comment-list').find('.post_id').val($(this).attr('data-aid'));
    }
    if ($('#nickname').length === 0) {
        $('.log-btn').trigger('click');
    } else {
        $(this).parents('.mark-wrap').next().slideToggle().parents('.item').siblings().find('.reply-box').slideUp();
    }
});

//点击清除评论内容
$('.comment-list .clear-txt').click(function () {
    gwc.appendPlugin('pop');
    pop.confirm('确定清除评论框中的内容吗？', function () {
        $('.reply-ipt').val('');
    });
});

//删除评论
$('body').delegate('.delete-reply-btn', 'click', function () {
    gwc.appendPlugin('pop');
    var _this = $(this);
    pop.confirm('确定要删除本贴吗？', function () {
        $.ajax({
            url: gwc.api_local,
            type: 'post',
            dataType: 'json',
            data: {order: 'deleteReply', repostid: _this.attr('data-id'), postuid: _this.attr('data-uid')},
            success: function (msg) {
                gwc.showPrompt(msg.tips);
                if (msg.state === 1) {
                    _this.parents('.item').remove();
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
});

//点击评论列表底部的收起按钮
$('body').delegate('.pack-up', 'click', function () {
    $(this).parents('.content').slideUp(function () {
        $(this).next().fadeIn();
    });
});
//文章详情页点击展开评论按钮
$('body').delegate('.open-down', 'click', function () {
    $(this).parent().hide().prev().slideDown();
});

//列表内容下拉加载更多
$('body').delegate('.load-more a', 'click', function () {
    //提前预存列表盒子高度，以备后续折叠使用
    var list = $(this).parents('.content').find('.lazy-load-list');
    list.attr('data-height') === undefined && list.attr('data-height', list.height());
    if ($('#slideDownLoadMoreModule').length === 0) {
        gwc.appendModule('slideDownLoadMoreModule');
        slideDownLoadMoreModule.loadData($(this));
    } else {
        slideDownLoadMoreModule.loadData($(this));
    }
});


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

//点击展开热榜
$('.open-hot-btn').click(function () {
    var fa = $(this).find('.fa');
    var em = $(this).find('em');
    var hot = $(this).parents('.left-content').next();
    if (fa.hasClass('fa-angle-down')) {
        em.text('收起热播榜');
        fa.removeClass('fa-angle-down').addClass('fa-angle-up');
        hot.show();
    } else {
        em.text('展开热播榜');
        fa.removeClass('fa-angle-up').addClass('fa-angle-down');
        hot.hide();
    }
});


//右侧浮动浏览记录按钮点击事件
$('.history-btn').click(function () {
    if ($('#seeMoreBrowseRecordModule').length === 0) {//如果还没插入
        gwc.appendModule('seeMoreBrowseRecordModule');//执行插入
    } else {//如果已经插入
        seeMoreBrowseRecordModule.getData();//仅执行显示
    }
});




//修正图片路径为主站地址
$('.thumb img, .left-thumb img').each(function () {
    var _src = $(this).attr('_src');
    var src = $(this).attr('src');
    if (_src && _src.indexOf('http') > -1) {
        $(this).attr('_src', _src.replace('nuanmaoer', mshostname));
    }
    if (src && src.indexOf('http') > -1) {
        $(this).attr('src', src.replace('nuanmaoer', mshostname));
    }
});

//移动端点击头部二维码
$('.header-common .search-wrap .wxewm').click(function () {
    $(this).find('.ewmimg').toggleClass('show');
});


//替换脚步联系邮箱
$('.contact-email').text('1633123761@qq.com');




//输出基础信息
(baseData.isdv && $('#nickname').length > 0 && $('#nickname').attr('data-id') == 3) && console.log(baseData);


//点击顶部移动端导航按钮
$('.wap-nav .iconfont').click(function () {
    $('.wap-nav-drop-box').width(gwc.winWidth).toggle();
});

/*==========================================================公共事件 end==================================================================*/

/*==========================================================各页面事件 start===============================================================*/


/**
 * Created by Administrator on 2017/12/31.
 */


//如果是修改资料页
if (gwc.checkPage('.modifyprofile_main')) {	
    
    $('#avatar_ipt').change(function () {
        var uid = parseInt($('.back_homepage').attr('href').split('/')[2]);
        gwc.imgUpload($(this), function (msg) {
            $.ajax({
                url: gwc.api_local,
                type: 'post',
                dataType: 'json',
                data: {
                    order: 'uploadAvatar',
                    uid: uid,
                    imgbig: msg.bigImgData,
                    imgsmall: msg.smallImgData
                },
                success: function (msg) {
                    gwc.showPrompt(msg.tips);
                }
            });
        });
    });
	 
	
	
}

//如果是个人主页
else if (gwc.checkPage('.user_details_main')) {
    //点击全部已读事件
    $('.set_has_read_btn').click(function () {
        $.ajax({
            url: gwc.api_local,
            type: 'post',
            dataType: 'json',
            data: {order: 'setHasRead'},
            success: function (msg) {
                gwc.showPrompt(msg.tips);
                $('.dynamic .item').removeClass('new').addClass('old');
                $('.notice .num').text('');
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
    //我的发布切页
    $('.put .tab-btn li').hover(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.put .list').eq($(this).index()).show().siblings().hide();
    });
}
