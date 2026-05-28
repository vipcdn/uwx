$(function() {
    $.ajax({
        type: "POST",
        url: "/videos/",
        data: {
            vid: vid,
            val: 1
        },
        success: function(msg) {
            Player(msg)
        }
    });
    $('#topFav').load('/H/' + c + '/right_hot.html');
    $('#my-video').bind('contextmenu', function() {
        return false
    });
    var text = $('#fabulous').find('em').text();
    var fab = getCookie("fab");
    if (fab != "") {
        var fabArr = fab.split(',');
        var id = $('#fabulous').attr('data-id');
        if (fabArr.indexOf(id) > -1) {
            var newtext = text + "已赞";
            $('#fabulous').find('em').text(newtext)
        } else {
            var newtext = text + "赞";
            $('#fabulous').find('em').text(newtext)
        }
    } else {
        var newtext = text + "赞";
        $('#fabulous').find('em').text(newtext)
    }
    var stow = getCookie("stow");
    if (stow != "") {
        var stowArr = stow.split(',');
        var id = $('#collect').attr('data-id');
        if (stowArr.indexOf(id) > -1) {
            var newtext = "已收藏";
            $('#collect').find('em').text(newtext)
        } else {
            var newtext = "收藏";
            $('#collect').find('em').text(newtext)
        }
    } else {
        var newtext = "收藏";
        $('#collect').find('em').text(newtext)
    }
});
$('body').delegate('#fabulous', 'click', function() {
    var num = $(this).find('em').text();
    var _0 = $(this);
    var id = $(this).attr('data-id'),
        table = $(this).attr('class').split(' ')[1].split('-')[0];
    $.ajax({
        url: gwc.api_local,
        type: 'post',
        dataType: 'json',
        data: {
            act: 'giveFabulous',
            id: id,
            num: num
        },
        success: function(msg) {
            if (msg.state === -1) {
                gwc.showPrompt('<i class="fa fa-hand-grab-o"></i> 已取消点赞！');
                var txt = msg.num == 0 ? '赞一个' : '<b>' + msg.num + '</b> 赞';
                $('.' + table + '-fabulous-' + id).removeClass('red').find('em').html(txt).prev().addClass('has')
            } else if (msg.state === 1) {
                gwc.showPrompt('<i class="fa fa-heartbeat"></i> 点赞成功！');
                $('.' + table + '-fabulous-' + id).addClass('red').find('em').html('<b>' + msg.num + '</b>已赞').prev().addClass('has')
            } else {
                gwc.showPrompt(msg.tips)
            }
        },
        error: function(err) {
            console.log(err)
        }
    })
});
$('body').delegate('#collect', 'click', function() {
    var _0 = $(this);
    var id = $(this).attr('data-id'),
        table = $(this).attr('class').split(' ')[1].split('-')[0];
    $.ajax({
        url: gwc.api_local,
        type: 'post',
        dataType: 'json',
        data: {
            act: 'giveCollect',
            id: id,
            table: table
        },
        success: function(msg) {
            if (msg.state === -2) {
                $('.log-btn').trigger('click')
            } else if (msg.state === -1) {
                gwc.showPrompt('<i class="fa fa-slideshare"></i> 已取消收藏！');
                var txt = msg.num == 0 ? '收藏' : '<b>' + msg.num + '</b>收藏';
                $('.' + table + '-collect-' + id).addClass('red').find('em').html('<b>' + '</b>收藏');
            } else if (msg.state === 1) {
                gwc.showPrompt('<i class="fa fa-heartbeat"></i> 收藏成功！');
                $('.' + table + '-collect-' + id).addClass('red').find('em').html('<b>' + '</b>已收藏').prev().addClass('has')
            } else {
                gwc.showPrompt(msg.tips)
            }
        },
        error: function(err) {}
    })
});
$('body').delegate('#download', 'click', function() {
    var _0 = $(this);
    var id = $(this).attr('data-id'),
        table = $(this).attr('class').split(' ')[1].split('-')[0];
    $.ajax({
        url: gwc.api_local,
        type: 'post',
        dataType: 'json',
        data: {
            act: 'download',
            id: id,
            table: table
        },
        success: function(msg) {
            if (msg.message === 'vipOnly') {
                //$('.log-btn').trigger('click')
				 gwc.showPrompt('<i class="fa fa-slideshare"></i> 仅限VIP下载，请登录或升级为VIP用户');
            } else {
                location.href = msg.url;
            }
        },
        error: function(err) {gwc.showPrompt('<i class="fa fa-slideshare"></i> 下载太过频繁,请稍后再试');}
    })
});
$('body').delegate('#profile_update', 'click', function() {
    var oldpassword = $("input[name='oldpassword']").val();
    var newpassword = $("input[name='newpassword']").val();
    var renewpassword = $("input[name='renewpassword']").val();
    if (oldpassword == "" || newpassword == "" || renewpassword == "") {
        gwc.showPrompt('<i class="fa fa-heartbeat"></i> 请填写每一项！');
        return false
    }
    if (newpassword != renewpassword) {
        gwc.showPrompt('<i class="fa fa-heartbeat"></i> 新密码与确认密码不一致！');
        return false
    }
    $.ajax({
        url: gwc.api_local,
        type: 'post',
        dataType: 'json',
        data: {
            act: 'profile_update',
            oldpassword: oldpassword,
            newpassword: newpassword
        },
        success: function(msg) {
            if (msg.state === 1) {
                gwc.showPrompt(msg.tips);
                setTimeout(function() {
                    window.location.href = './'
                }, 2000)
            } else {
                gwc.showPrompt(msg.tips)
            }
        },
        error: function(err) {}
    })
});

function getAddress() {
    var val = $("#route").val();
    $.ajax({
        type: "POST",
        url: "/videos/",
        data: {
            vid: vid,
            val: val
        },
        success: function(msg) {
            var str = msg.replace(/\s+/g, "");
            if (str == 'vipOnly') {
                gwc.showPrompt('<i class="fa fa-slideshare"></i> VIP专线播放更快, 仅VIP用户使用');
                return false
            } else {
                Player(msg)
            }
        }
    })
}

function Player(u) {
    var myPlayer = videojs('my-video');
    myPlayer.src(u);
    myPlayer.ready(function() {
        this.play()
    })
}