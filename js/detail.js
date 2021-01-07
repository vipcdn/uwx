$(function(){
		$.ajax({
			type:"POST",
			url:"/videos/",			
			data:{vid:vid,val:1},
			success:function(msg){Player(msg);}			
		});
		
	$('#topFav').load('/dh/top/top'+c+'.html');
	$(document).contextmenu(function() {return false;});	
	//判断是否已赞
	var text = $('#fabulous').find('em').text();	
	var fab = getCookie("fab");
	if(fab != ""){
		var fabArr = fab.split(',');
		var id = $('#fabulous').attr('data-id');
		//判断是否在数组中
		if(fabArr.indexOf(id) > -1){
			//console.log("yes");
			var newtext = text+"已赞";
			$('#fabulous').find('em').text(newtext);
		}else{
			var newtext = text+"赞";
			$('#fabulous').find('em').text(newtext);
		}
	}else{
			var newtext = text+"赞";
			$('#fabulous').find('em').text(newtext);
	}
	
	var stow = getCookie("stow");
	if(stow != ""){
		var stowArr = stow.split(',');
		var id = $('#collect').attr('data-id');
		//判断是否在数组中
		if(stowArr.indexOf(id) > -1){
			//console.log("yes");
			var newtext = "已收藏";
			$('#collect').find('em').text(newtext);
		}else{
			var newtext = "收藏";
			$('#collect').find('em').text(newtext);
		}
	}else{
			var newtext = "收藏";
			$('#collect').find('em').text(newtext);
	}

//load detail right top

}); 
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

//修改个人信息
$('body').delegate('#profile_update', 'click', function () {
   var oldpassword =  $("input[name='oldpassword']").val(); 
   var newpassword = $("input[name='newpassword']").val();
   var renewpassword = $("input[name='renewpassword']").val();  
   if(oldpassword ==""||newpassword=="" ||renewpassword==""){
	   gwc.showPrompt('<i class="fa fa-heartbeat"></i> 请填写每一项！');
		return false;
   }
    if(newpassword !=renewpassword){
	   gwc.showPrompt('<i class="fa fa-heartbeat"></i> 新密码与确认密码不一致！');
		return false;
   }
    $.ajax({
        url: gwc.api_local,
        type: 'post',
        dataType: 'json',
        data: {act: 'profile_update', oldpassword: oldpassword, newpassword: newpassword},
        success: function (msg) {
         if (msg.state === 1){gwc.showPrompt(msg.tips);setTimeout(function(){ window.location.href='./'; }, 2000);	 }
		 else{
			 gwc.showPrompt(msg.tips)
		 }
				
        },
        error: function (err) {
           // console.log(err);
        }
    });
});
	function getAddress(){		
		var val = $("#route").val();		
		$.ajax({
			type:"POST",
			url:"/videos/",			
			data:{vid:vid,val:val},
			success:function(msg){
				var str = msg.replace(/\s+/g,"");	
				if(str == 'Login'){$('.log-btn').trigger('click');return false;
				}else{	Player(msg);}
				
			}			
		});
	}
	function Player(u){
		var myPlayer = videojs('my-video');       
		myPlayer.src(u);	
		myPlayer.ready(function(){this.play();});
	}
	