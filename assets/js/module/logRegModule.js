/*Created by GaoWei on 2017/12/16.*/
var logRegModule = {
    logRegWrap: '',
    moveDiff: gwc.winWidth > 768 ? 200 : gwc.winWidth / 2,
    boxWidth: gwc.winWidth > 768 ? 800 : gwc.winWidth * 2,
    initCtrl: function () {
        var _this = this;
        gwc.modalShow(_this.modalContent(),'logRegModule');
        //控制播放
        if ($('#play_area').length > 0 && $('#play_area').hasClass('fixedTop') && gwc.winWidth <= 768) {
            $('.close-modal-btn').addClass('bottom');
        } else {
            $('.close-modal-btn').removeClass('bottom');
        }
        _this.logRegWrap = $('.log_reg_wrap');
		
        _this.autoBoxPosition();
        window.onresize = function () {
            _this.autoBoxPosition();
        };

        //点击modal-con隐藏模态框(由于本模块的特殊设计在此需要这个点击事件，其他模态框模块则不尽然)
        $('.modal-con,.modal-bg,.close-modal-btn').click(function () {
            gwc.modalHide();
            $('.modal-con').removeAttr('style');
        }).find('aside').click(function (e) {
           e.stopPropagation();
        });
        //点击登录注册框中的登录框导航按钮事件
        $('.log_reg_wrap .log-reg-nav li').click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            $(this).parent().parent().next().find('.user-input-area .item').eq($(this).index()).show().siblings().hide();
        });
        //点击立即注册按钮事件
        $('.go_now_reg').click(function () {
            _this.logRegToggle('reg');
        });
        //点击现在登录和返回登录按钮事件
        $('.go_now_log,.back_reg').click(function () {
            _this.logRegToggle('login');
        });
		//点击续期按钮事件
        $('.go_now_renew').click(function () {
            _this.logRegToggle('renew');
        });
        //登录检测
        $('#account_log_btn').click(function () {
            if ($('#account_log_username').val() === '') {
                gwc.showPrompt('用户名不能为空');
            } else if ($('#account_log_pwd').val() === '') {
                gwc.showPrompt('密码不能为空');
            } else {
                $.ajax({
                    url: '/user/userAction.php',
                    type: 'post',
                    dataType: 'json',
                    data: {act: 'login',submit: 'login',username: $('#account_log_username').val(), password: $('#account_log_pwd').val()},
                    success: function (msg) {                        
                        if (msg.success) {
                            setTimeout(function () {
                                if (document.referrer && document.referrer.indexOf('admin') > -1) {
                                    window.history.go(-1);  //返回上一页
                                    window.history.back();  //返回上一页
                                } else {
                                    history.go(0);
                                }
                            },1500);
                            gwc.showPrompt(msg.message);
                        } else {
                            gwc.showPrompt(msg.message);
                        }
                    }
                });
            }
        });
		//续费检测
        $('#account_renew_btn').click(function () {
			const renewSubmitBtn = document.getElementById('account_renew_btn');
            if ($('#account_username').val() === '') {
                gwc.showPrompt('用户名不能为空');
            } else if ($('#account_auth').val() === '') {
                gwc.showPrompt('请输入订阅码');
            } else {
				// 禁用按钮，显示充值状态
				renewSubmitBtn.disabled = true;
				renewSubmitBtn.textContent = '充值中...';
				
                $.ajax({
                    url: '/user/userAction.php',
                    type: 'post',
                    dataType: 'json',
                    data: {act: 'renewVIP',submit: 'renew',user_name: $('#account_username').val(), authCode: $('#account_auth').val()},
                    success: function (msg) {
                       //console.log(msg);
                        if (msg.success) {
							setTimeout(function () {
                                window.location.href = '/';
                            },2000);
                           gwc.showPrompt("充值成功！请登录查看");							
							renewSubmitBtn.disabled = false;
							renewSubmitBtn.textContent = '提交';
                        } else {
                            gwc.showPrompt(msg.message);
							
							renewSubmitBtn.disabled = false;
							renewSubmitBtn.textContent = '提交';
                        }
                    }
                });
            }
        });
        //注册检测
        $('#account_reg_btn').click(function () {
            if ($('#account_reg_username').val() === '') {
                gwc.showPrompt('用户名不能为空');
            } else if ($('#account_reg_pwd').val() === '') {
                gwc.showPrompt('密码不能为空');
            }else if ($('#account_reg_pwd').val().length < 6) {
                gwc.showPrompt('密码长度不能少于6位');
            }else if ($('#email').val() === '') {
                gwc.showPrompt('邮箱不能为空');
            //}else if ($('#reg_auth').val() === '') {
                //gwc.showPrompt('请输入注册码');
            } else {
                $.ajax({
                    url: '/user/userAction.php',
                    type: 'post',
                    dataType: 'json',
					data: {act: 'register', submit: 'checkusername', username: $('#account_reg_username').val(), password: $('#account_reg_pwd').val(), email: $('#email').val(), reg_auth: $('#reg_auth').val(),invite_code: $('#invite_code').val(), agree_terms:'1' },
                    success: function (msg) {
                        if (msg.success===false) {
                            gwc.showPrompt(msg.message);
                        } else {
                            setTimeout(function () {
                                 window.location.href = '/user/';
                            },2000);
                            gwc.showPrompt(msg.message);
                        }
                    }
                });
            }
        });
    },
    modalContent: function () {
        var _this = this,
            str = '' +
            '<style type="text/css">' +
                '.user-input-area input {line-height:24px;margin-bottom:0;}' +
            '.modal-con>.close-modal-btn {display: none;}' +
            '.log_reg_wrap { white-space: nowrap; position: relative; transition: transform 0.5s; -webkit-transition: transform 0.5s; -moz-transition: transform 0.5s; height: 350px; width: ' + this.boxWidth + 'px; transform:translate3D(' + this.moveDiff + 'px,0px,0px)}' +
            '.log_reg_wrap.static { transition: transform 0s; -webkit-transition: transform 0s; }' +
            '.log_reg_wrap > aside { background: #fff; border-radius: 5px; height: 100%; width: 45%; margin: 0 2.5%; position: absolute; transition: opacity 0.5s; -webkit-transition: opacity 0.5s; }' +
            '.log_reg_wrap > aside.log { left: 0; }' +			
            '.log_reg_wrap > aside.reg { right: 0; }' +
            '.log_reg_wrap .hd { padding: 10px 30px 0; border-bottom: 1px solid #ddd; position: relative; }' +
            '.log_reg_wrap .log-reg-nav { white-space: nowrap; text-align: center; }' +
            '.log_reg_wrap .log-reg-nav li { display: inline-block; margin: 0 15px; font-size: 16px; line-height: 30px; }' +
            '.log_reg_wrap .log-reg-nav li.active a { color: #c54242; }' +
            '.log_reg_wrap .bd { padding: 15px 30px; }' +
            '.log_reg_wrap .bd .form-group input[type="text"], .log_reg_wrap .bd .form-group input[type="password"] { width: 100%;line-height: 30px; display:block;height:30px;padding-left:5px; }' +
            '.log_reg_wrap .bd .form-group #sms_log_code, .log_reg_wrap .bd .form-group #sms_reg_code { width: 58%; }' +
            '.log_reg_wrap .bd .form-group .get-sms-btn { line-height: 24px; }' +
            '.log_reg_wrap .bd .sbt { width: 100%; line-height: 30px; font-size: 16px;background: #c54242;border: #c54242;margin-top:10px;color: #fff;}' +
			'.log_reg_wrap .bd .btn-green { width: 100%; line-height: 30px; font-size: 16px;background: #006400;border: #c54242;margin-top:20px;color: #fff;}' +
			'.log_reg_wrap .bd .btn-blue { width: 100%; line-height: 30px; font-size: 16px;background: #1874CD;border: #c54242;margin-top:10px;color: #fff;}' +
			'.log_reg_wrap .user-input-area .item { display: none; }' +
            '.log_reg_wrap .user-input-area .item:first-child { display: block; }' +
            '.log_reg_wrap .social-account-log { text-align: center; padding: 15px 0 30px; }' +
            '.log_reg_wrap .social-account-log .title { margin-bottom: 20px; position: relative; }' +
            '.log_reg_wrap .social-account-log .title:before { content: ""; display: block; position: absolute; width: 100%; height: 1px; background: #ddd; top: 50%; left: 0; }' +
            '.log_reg_wrap .social-account-log .title em { background: #fff; position: relative; padding: 0 3px; }' +
            '.log_reg_wrap .social-account-log .item { display: inline-block; margin: 0 10px; display:none;}' +
            '.log_reg_wrap .social-account-log .fa { border-radius: 50%; padding: 5px; width: 30px; height: 30px; line-height: 20px; text-align: center; font-size: 20px; color: #fff; }' +
            '.log_reg_wrap .social-account-log .fa:hover { color: #fff; }' +
            '.log_reg_wrap .social-account-log .fa:hover:before { color: #fff; }' +
            '.log_reg_wrap .social-account-log .fa-weixin { background: #20a839; }' +
            '.log_reg_wrap .social-account-log .fa-qq { background: #2384cc; }' +
            '.log_reg_wrap .social-account-log .fa-weibo { background: #d04341; }' +
            '.log_reg_wrap .social-account-log .tips { margin-top: 20px; }' +
            '.log_reg_wrap .social-account-log .tips .go { color: #c54242; }' +
            '.log_reg_wrap .back_reg { float: left; }' +
            '.log_reg_wrap .back_reg .fa { color: #ccc; font-size: 30px; }' +
            '.log_reg_wrap .form-group {margin-top:15px;}' +
            '.gw-modal .modal-con .close-modal-btn.bottom {top: 463px;left: 50%;right: inherit; padding: 0 10px;transform: translateX(-50%);}' +
            '</style>' +
            '<div class="log_reg_wrap"> ' +
            '<aside class="log"> ' +
            '<div class="hd"> ' +
            '<ul class="log-reg-nav"> ' +
            '<li class="active"><a href="javascript:;">账号登录</a></li><li style="display:none;"><a href="javascript:;">短信登录</a></li> ' +
            '</ul> ' +
            '<a href="javascript:;" class="close-modal-btn">✕</a> ' +
            '</div> ' +
            '<div class="bd"> ' +
            '<div class="user-input-area"> ' +
            '<div class="item account_log_wrap"> ' +
            '<form name="LoginForm"> ' +
            '<p class="form-group"><input type="text" id="account_log_username" class="form-control" placeholder="请输入用户名"></p> ' +
            '<p class="form-group"><input type="password" id="account_log_pwd" class="form-control" placeholder="请输入密码"></p> ' +
            '<p class="form-group"><label><input type="checkbox" class="auto-log" checked="checked" id="account_log_auto_log"> 自动登录 (7天)</label> </p> ' +
            '<button type="button" id="account_log_btn" class="btn btn-primary sbt">登录</button> ' +
            '</form> ' +
            '</div> ' +
            '<div class="item sms_log_wrap"> ' +
            '<form action="" method="post" autocomplete="off"> ' +
            '<p class="form-group"><input type="text" id="sms_log_username" placeholder="请输入手机号"></p> ' +
            '<p class="form-group"><input type="password" id="sms_log_code" placeholder="请输入短信验证码"><a href="javascript:;" class="btn btn-o btn-orange fr get-sms-btn">获取验证码</a></p> ' +
            '<p class="form-group"> <label><input type="checkbox" class="auto-log" checked="checked"> 自动登录 (7天)</label> </p> ' +
            '<button type="button" id="sms_log_btn" class="btn btn-blue sbt">登录</button> ' +
            '</form> ' +
            '</div> ' +
            '</div> ' +
            '<div class="social-account-log"> ' +

            '<div class="content"> ' +
            '<ul class="list"> ' +
            '<li class="item"><a href="javascript:;" class="btn disabled"><i class="fa fa-weixin"></i></a></li><li class="item"><a href="javascript:;" class="btn disabled"><i class="fa fa-qq"></i></a></li><li class="item"><a href="javascript:;" class="btn disabled"><i class="fa fa-weibo"></i></a></li> ' +
            '</ul> ' +
			
            '<p class="tips"><a href="javascript:;" class="go go_now_renew">升级VIP</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em class="txt">还没有账号？</em><a href="javascript:;" class="go go_now_reg">立即注册</a></p> ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '</aside> ' +
			
			'<aside class="renew"> ' +
            '<div class="hd"> ' +
            '<ul class="log-reg-nav"> ' +
            '<li class="active"><a href="javascript:;">升级VIP</a></li>' +
            '</ul> ' +
            '<a href="javascript:;" class="close-modal-btn">✕</a> ' +
            '</div> ' +
            '<div class="bd"> ' +
            '<div class="user-input-area"> ' +
            '<div class="item account_log_wrap"> ' +
            '<form name="LoginForm"> ' +
            '<p class="form-group"><input type="text" id="account_username" class="form-control" placeholder="请输入用户名"></p> ' +
            '<p class="form-group"><input type="text" id="account_auth" maxlength="22" class="form-control" placeholder="请输入订阅码"></p> ' +
           
            '<button type="button" id="account_renew_btn" class="btn btn-blue">提交</button> ' +
            '</form> ' +
            '</div> ' +
           
            '</div> ' +
            '<div class="social-account-log"> ' +

            '<div class="content"> ' +
            '<ul class="list"> ' +
            '<li class="item"><a href="javascript:;" class="btn disabled"><i class="fa fa-weixin"></i></a></li><li class="item"><a href="javascript:;" class="btn disabled"><i class="fa fa-qq"></i></a></li><li class="item"><a href="javascript:;" class="btn disabled"><i class="fa fa-weibo"></i></a></li> ' +
            '</ul> ' +			
            '<p class="tips"><em class="txt">没有订阅码？</em><a href="/about/subscribe.html" target="_blank" class="go ">点击获取</a></p> ' +
			'<p class="tips"><em class="txt">还没有账号？</em><a href="javascript:;" class="go go_now_reg">立即注册</a> </p> ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '</aside> ' +
            '<aside class="reg"> ' +
            '<div class="hd"> ' +
            '<a href="javascript:;" class="back_reg" title="返回登录"><i class="fa fa-angle-left"></i></a> ' +
            '<ul class="log-reg-nav"> ' +
            '<li class="active"><a href="javascript:;">账号注册</a></li><li style="display:none;"><a href="javascript:;">手机号注册</a></li> ' +
            '</ul> ' +
            '<a href="javascript:;" class="close-modal-btn">✕</a> ' +
            '</div> ' +
            '<div class="bd"> ' +
            '<div class="user-input-area"> ' +
            '<div class="item account_reg_wrap"> ' +
            '<form name="RegForm"> ' +
            '<p class="form-group"><input type="text" id="account_reg_username" class="form-control" placeholder="请输入用户名(英文_数字)"></p> ' +
            '<p class="form-group"><input type="password" id="account_reg_pwd" class="form-control" placeholder="请输入密码(不少于8位)"></p> ' +
            '<p class="form-group"><input type="text" id="email" class="form-control" placeholder="请输入邮箱(用于忘记密码找回)"></p> ' +			
			'<p class="form-group"><input type="text" id="invite_code" class="form-control" placeholder="请输入邀请码(没有可留空)"></p> ' +

            '<button type="button" id="account_reg_btn" class="btn btn-green">注册</button> ' +
            '</form> ' +
            '</div> ' +
            '<div class="item sms_reg_wrap"> ' +
            '<form action="" method="post" autocomplete="off"> ' +
            '<p class="form-group"><input type="text" id="sms_reg_username" placeholder="请输入手机号"></p> ' +
            '<p class="form-group"><input type="password" id="sms_reg_code" placeholder="请输入短信验证码"><a href="javascript:;" class="btn btn-o btn-orange fr get-sms-btn">获取验证码</a></p> ' +
            '<p class="form-group"><input type="password" id="sms_reg_pwd" placeholder="请输入登录密码(6-20位)"></p> ' +

            '<button type="button" id="sms_reg_btn" class="btn btn-blue sbt">注册</button> ' +
            '</form> ' +
            '</div> ' +
            '</div> ' +
            '<div class="social-account-log"> ' +

            '<div class="content"> ' +
            
            '<p class="tips"></p> ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '</aside> ' +
            '</div>';
        return str;
    },
    logRegIn: function (order) {
        this.logRegWrap.addClass('static').find('>aside').css('opacity','1');
        if (order === 'reg') {
			
            this.logRegWrap.css('transform','translate3D(' + -this.moveDiff + 'px,0px,0px)').find('.log').hide().next().hide();
			this.logRegWrap.css('transform','translate3D(' + -this.moveDiff + 'px,0px,0px)').find('.renew').hide().next().show();
        }else if(order === 'renew'){
			
			this.logRegWrap.css('transform','translate3D(' + this.moveDiff + 'px,0px,0px)').find('.log').hide().next().show();
			this.logRegWrap.css('transform','translate3D(' + -this.moveDiff + 'px,0px,0px)').find('.renew').hide().next().hide();
		}
		else {
            this.logRegWrap.css('transform','translate3D(' + this.moveDiff + 'px,0px,0px)').find('.log').show().next().hide();
			this.logRegWrap.css('transform','translate3D(' + this.moveDiff + 'px,0px,0px)').find('.renew').hide().next().hide();
			
        }
    },
    logRegToggle: function (order) {
        this.logRegWrap.removeClass('static').find('>aside').show();
        if (order === 'reg') {
			this.logRegWrap.css('transform','translate3D(' + -this.moveDiff + 'px,0px,0px)').find('.renew').css('opacity','0').next().css('opacity','1');
            this.logRegWrap.css('transform','translate3D(' + -this.moveDiff + 'px,0px,0px)').find('.log').css('opacity','0').next().css('opacity','0');
        }else if(order === 'renew'){			
			this.logRegWrap.css('transform','translate3D(' + -this.moveDiff + 'px,0px,0px)').find('.log').css('opacity','0').next().css('opacity','1');
			this.logRegWrap.css('transform','translate3D(' + this.moveDiff + 'px,0px,0px)').find('.renew').css('opacity','1').next().css('opacity','0');
			
		} else {
			
            this.logRegWrap.css('transform','translate3D(' + this.moveDiff + 'px,0px,0px)').find('.log').css('opacity','1').next().css('opacity','0');
			//this.logRegWrap.css('transform','translate3D(' + -this.moveDiff + 'px,0px,0px)').find('.renew').css('opacity','0').next().css('opacity','0');
        }
    },
    autoBoxPosition: function () {
        if (window.innerHeight < this.logRegWrap.height()) {
            $('.modal-con').css('top',0).css('transform','translate(-50%, 0)');
        } else {
            $('.modal-con').css('top','50%').css('transform','translate(-50%, -50%)');
        }
    },
    setCookie: function (_name, val, expires) {
        var d = new Date();
        d.setDate(d.getDate() + expires);
        document.cookie = _name + "=" + val + ";path=/;expires=" + d.toGMTString();
    },
    getCookie: function(_name){
        var cookie = document.cookie;
        var arr = cookie.split("; ");
        for (var i = 0; i < arr.length; i++) {
            var newArr = arr[i].split("=");
            if (newArr[0] == _name) {
                return newArr[1];
            }
        }
    }
};
logRegModule.initCtrl();
