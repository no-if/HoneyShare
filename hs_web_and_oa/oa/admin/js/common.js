/*********配套*********/
var matching_arr = ['', 'FIT200', 'FIT500', 'FIT1000']; //配套名
var matching_money_arr = [0, 200, 500, 1000]; //配套钱

/*********获取用户信息**********/
var userInfo = JSON.parse(localStorage.getItem('userInfo'));
// var userId = localStorage.getItem('user_id');
// var token = localStorage.getItem('user_id');
/*********刷新用户信息**********/
function reloadUserInfo() {
	deltaGoAjax('user/getUserInfo', {}, getUserBasis);
}

function getUserBasis(data) {
	localStorage.setItem('userInfo', JSON.stringify(data.data));
	userInfo = JSON.parse(localStorage.getItem('userInfo'));
}
/*********刷新用户钱包**********/
function reloadUserWallet() {
	reloadUserInfo();
	setTimeout(function () {
		$('.fit_num', parent.document).text(moneyToFloat(userInfo.coin));
		$('.cp_num', parent.document).text(moneyToFloat(userInfo.cash));
		$('.rp_num', parent.document).text(moneyToFloat(userInfo.register));
		$('.cw_num', parent.document).text(moneyToFloat(userInfo.cashWallet));
	}, 1000)
}

/*********获取url参数*********/
var url = location.search; //获取url中"?"符后的字串  
function GetRequest() {
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
/********ajax********/
function getUrl() {
	 return 'http://192.168.1.135:8082/hsc/';
	// return 'https://api.honeyshare.io:12306/hsc/';

}

function deltaGoAjax(url, data, ok, type) {
	url = getUrl() + url;
	var aType;
	if (type) {
		aType = 'get';
	} else {
		aType = 'post';
		// data.tokenId = localStorage.getItem('token');
	}
	data = (data == '' ? '' : JSON.stringify(data));
	$.ajax({
		type: aType,
		url: url,
		data: data,
		headers: {
			tokenId: localStorage.getItem('token')
		},
		contentType: 'application/json;charset=UTF-8',
		beforeSend: function (xhr) {
			loadingShow();
			// console.log(data.staus);
		},
		success: function (data) {
			if (data.respCode == 100) {
				$('body', parent.document).find('.loading').remove();
				errorMsg('系统异常，请联系客服人员!');
			} else if (data == '-2' || data.respCode == '105') { //用户登录过期
				$('body', parent.document).find('.loading').remove();
				errorMsg('用户登录过期，请重新登录');
				localStorage.removeItem('token');
				setTimeout(function () {
					window.top.location = 'https://www.honeyshare.io/oa/index.html';
				}, 2000)
			}else if(data.status == 1018){
				$('body', parent.document).find('.loading').remove();
				errorMsg('您的账号异地登录，请重新登录');
				localStorage.removeItem('token');
				localStorage.removeItem('userInfo');
				setTimeout(function(){
					window.top.location = 'https://www.honeyshare.io/oa/admin/index.html';
				},3000);
				
			}else if(data.status == 0){
				$('body', parent.document).find('.loading').remove();
				ok(data);
			}else{
				$('body', parent.document).find('.loading').remove();
				errorMsg(data.msg);
			}
		}
	})
}
/*****请求等待菊花图******/
function loadingShow() {
	var str = '<div class="loading">' +
		'<div class="mop-css-7 circleBox">' +
		'<div class="spinner-container container1">' +
		'<div class="circle1"></div>' +
		'<div class="circle2"></div>' +
		'<div class="circle3"></div>' +
		'<div class="circle4"></div>' +
		'</div>' +
		'<div class="spinner-container container2">' +
		'<div class="circle1"></div>' +
		'<div class="circle2"></div>' +
		'<div class="circle3"></div>' +
		'<div class="circle4"></div>' +
		'</div>' +
		'<div class="spinner-container container3">' +
		'<div class="circle1"></div>' +
		'<div class="circle2"></div>' +
		'<div class="circle3"></div>' +
		'<div class="circle4"></div>' +
		'</div>' +
		'</div>' +
		'</div>';
	$('body', parent.document).append(str);
}

/*********请求错误弹框*********/
function errorMsg(msg, btn) {
	// $('body').find('.msgzz').remove();
	if ($('body', parent.document).find('.msgzz').length > 0) {
		return;
	}
	str = '<div class="msgzz">' +
		'<div class="msgBox">' +
		'<div class="title">提示</div>' +
		'<div class="msg">' + msg + '</div>';
	if (btn) {
		str += '<div class="msgBtn">' +
			'<div class="cancel">取消</div>' +
			'<div class="ok">确认</div>' +
			'</div>';
	}
	str += '</div>' +
		'</div>';
	$('body', parent.document).append(str);
	if (!btn) {
		setTimeout(function () {
			$('body', parent.document).find('.msgzz').remove();
		}, 2000)
	}
	// $('body').find('.errorMsg').fadeIn(1000).delay(2000).fadeOut(1000);
}

/**********将金额转为三位数一个，**********/
function moneyToFloat(num) {
	var string = num + '';//将数字转换成字符串形式
	var arr = string.split('.');//分割逗号;
	var num1 = arr[0];
	var num2 = arr[1] ? '.' + arr[1] : '';//若有小数则添加逗号；
	var num3 = num1.replace(/\d(?=(?:\d{3})+\b)/g, '$&,');
	return num3 + num2;
}

/*********随机数**********/
function random() {
	var rannum = Math.ceil(Math.random() * 1000);
	return rannum;
}


/********时间戳改日期*********/
function formDate(num) {
	if (num == '' || num == null) {
		return '';
	}
	var date = new Date(num);
	Y = date.getFullYear() + '年';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
	D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '日 ';
	h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
	m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
	s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
	var ymdh = Y + M + D + h + m + s;
	return ymdh;
}


/************获取时间***********/
function getDate(num) { //获取当天时间传0
	var date = new Date();
	date.setDate(date.getDate() + num);
	Y = date.getFullYear() + '-';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
	// h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
	// m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
	// s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds()); 
	var ymdh = Y + M + D;
	return ymdh;
}
/********分页*********/
function page(data,obj,btnNum){ 
	$('.btm_text').hide();
	$('.pagination').html('');
	if(data.data.total <= 20){
		$('.paging').hide();
	}else{
		$('.paging').show();
		var str = '';
		str += '<li class="starLi">'+
		'<a href="#" aria-label="prev">'+
		'<span aria-hidden="true">&laquo;</span>'+
		'</a>'+
		'</li>';
		// btnNum = (btnNum == 0 ? '0' : (btnNum)/2);
		var lenth = (data.data.total%20 == 0) ? parseInt(data.data.total/20) : parseInt(data.data.total/20+1);
		var minL = 0;
		var maxL = (lenth > 10 ? 10 : lenth);
		btnNum = parseInt(btnNum)
		if(btnNum >= 9 && btnNum <= lenth -4){
			minL = btnNum - 5;
			maxL = btnNum + 5;
		}else if(btnNum >= 9 && btnNum >= lenth -4){
			minL = lenth - 9;
			maxL = lenth;
		}
		for(var i=minL;i<maxL;i++){
			if(i == btnNum - 1){
				str += '<li class="numberLi active" ><a href="#">'+(i+1)+'</a></li>';
			}else{
				str += '<li class="numberLi"><a href="#">'+(i+1)+'</a></li>';
			}
			
		}
		str += '<li class="lastLi">'+
		'<a href="#" aria-label="Next">'+
		'<span aria-hidden="true">&raquo;</span>'+
		'</a>'+
		'</li>';
		str += '<span>'+
				'<span>共</span><span class="page">'+lenth+'</span><span>页</span>'+
			'</span>';
		str += '<span>'+
				'<input type="number" class="gotoPage">'+
				'<a href="#" class="gotoPageBtn" data-page="'+lenth+'">跳转</a>'+
			'</span>';
		obj.append(str);
		return lenth;
	}
}