$(function () {
	/*******登录********/
	// 忘记密码图片更新
	var userId;
	var timestamp;
	var userInfo;
	var token;
	localStorage.removeItem('token');
	localStorage.removeItem('userInfo');
	function getTimeStamp() {
		timestamp = new Date().getTime();
	}
	$('.code_img').click(function () {
		getCodeImg();
	})
	getCodeImg();

	function getCodeImg() {
		getTimeStamp();
		$('.code_img').attr('src', getUrl() + 'signcode/get/' + timestamp);
	}
	// 登录
	$('.password').keyup(function(event){
		if(event.keyCode == 13){
			login();
		}
	})
	login();
	
	function login() {
		$('.login_btn').off().click(function () {
			var AjaxData = {
				mail: $('.email').val(),
				password: $('.password').val(),
				startRow: 0,
				pageSize: 20
			}
			if ($('.email').val() == '' || $('.password').val() == '') {
				errorMsg('请输入邮箱或密码');
			} else {
				deltaGoAjax('user/loginByAdmin', AjaxData, function (data) {
					if (data.status == 20005) {
						errorMsg('请登录邮箱激活您的账号');
						return;
					} else if (data.status == 0) {
						localStorage.setItem('token', data.data.tokenId);
						localStorage.setItem('userInfo', JSON.stringify(data.data.user));
						window.location.href = 'html/welcome.html';
					} else {
						errorMsg(data.msg);
						return;
					}
				})
			}
		})
	}
})